// ─────────────────────────────────────────────────────────────────────────────
// Sequence Timeline Engine
// The async execution brain that processes Sequence Actions without React renders.
// ─────────────────────────────────────────────────────────────────────────────
import { SEQUENCE_CONFIG } from './sequence-config';
import { SequenceEvents } from './sequence-events';
import { useSequenceStore } from './sequence-state';
import type { SequenceAction, SequenceDefinition } from './sequence-types';

export class SequenceTimeline {
  private definition: SequenceDefinition;
  private abortController: AbortController;
  private isPaused: boolean = false;
  private pausePromise: Promise<void> | null = null;
  private pauseResolver: (() => void) | null = null;

  constructor(definition: SequenceDefinition) {
    this.definition = definition;
    this.abortController = new AbortController();
  }

  /**
   * Begins execution of the timeline.
   */
  public async play(): Promise<void> {
    const { id, steps } = this.definition;

    useSequenceStore.getState().setStatus('Running');
    useSequenceStore.getState().setCurrentSequence(id);
    SequenceEvents.emit('SequenceStarted', { sequenceId: id, timestamp: Date.now() });

    try {
      for (const step of steps) {
        await this.checkPause();
        if (this.abortController.signal.aborted) throw new Error('Cancelled');

        await this.executeAction(step);
      }

      // Completion
      if (!this.abortController.signal.aborted) {
        useSequenceStore.getState().setStatus('Completed');
        SequenceEvents.emit('SequenceCompleted', { sequenceId: id, timestamp: Date.now() });
      }
    } catch (err: unknown) {
      if ((err as Error).message === 'Cancelled') {
        useSequenceStore.getState().setStatus('Cancelled');
        SequenceEvents.emit('SequenceCancelled', { sequenceId: id, timestamp: Date.now() });
      } else {
        useSequenceStore.getState().setStatus('Failed');
        SequenceEvents.emit('SequenceFailed', { sequenceId: id, timestamp: Date.now() });
        console.error(`[Director] Sequence ${id} failed:`, err);
      }
    }
  }

  public pause(): void {
    if (this.isPaused) return;
    this.isPaused = true;
    this.pausePromise = new Promise((resolve) => {
      this.pauseResolver = resolve;
    });
    useSequenceStore.getState().setStatus('Paused');
    SequenceEvents.emit('SequencePaused', {
      sequenceId: this.definition.id,
      timestamp: Date.now(),
    });
  }

  public resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    if (this.pauseResolver) {
      this.pauseResolver();
      this.pauseResolver = null;
      this.pausePromise = null;
    }
    useSequenceStore.getState().setStatus('Running');
    SequenceEvents.emit('SequenceResumed', {
      sequenceId: this.definition.id,
      timestamp: Date.now(),
    });
  }

  public cancel(): void {
    this.abortController.abort();
  }

  public skip(): void {
    // For a skip, we abort the current sequence and mark it as Skipped
    this.abortController.abort();
    useSequenceStore.getState().setStatus('Completed');
    SequenceEvents.emit('SequenceSkipped', {
      sequenceId: this.definition.id,
      timestamp: Date.now(),
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Action Executors
  // ─────────────────────────────────────────────────────────────────────────────

  private async executeAction(action: SequenceAction): Promise<void> {
    if (SEQUENCE_CONFIG.debugTimeline) {
      // console.log(`[Director] Executing: ${action.type}`, action.id || '');
    }

    SequenceEvents.emit('TimelineAdvanced', {
      sequenceId: this.definition.id,
      actionType: action.type,
      actionId: action.id,
      timestamp: Date.now(),
    });

    switch (action.type) {
      case 'delay':
        await this.executeDelay(action.durationMs);
        break;
      case 'call':
        await action.fn({ signal: this.abortController.signal });
        break;
      case 'emitEvent':
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(action.eventName, { detail: action.payload }));
        }
        break;
      case 'parallel':
        await Promise.all(action.actions.map((a) => this.executeAction(a)));
        break;
      case 'sequential':
        for (const a of action.actions) {
          await this.checkPause();
          if (this.abortController.signal.aborted) break;
          await this.executeAction(a);
        }
        break;
      case 'conditional':
        if (action.condition()) {
          if (action.onTrue) await this.executeAction(action.onTrue);
        } else {
          if (action.onFalse) await this.executeAction(action.onFalse);
        }
        break;
    }
  }

  private async executeDelay(ms: number): Promise<void> {
    if (SEQUENCE_CONFIG.fastForwardMode) return;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.abortController.signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);

      const onAbort = () => {
        clearTimeout(timeoutId);
        reject(new Error('Cancelled'));
      };

      this.abortController.signal.addEventListener('abort', onAbort);
    });
  }

  private async checkPause(): Promise<void> {
    if (this.isPaused && this.pausePromise) {
      await this.pausePromise;
    }
  }
}

