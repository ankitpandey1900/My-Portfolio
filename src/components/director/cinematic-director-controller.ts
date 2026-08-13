// ─────────────────────────────────────────────────────────────────────────────
// Cinematic Director Controller
// Public API for triggering and controlling sequences.
// ─────────────────────────────────────────────────────────────────────────────
import { useSequenceStore } from './sequence-state';
import type { SequenceId } from './sequence-types';

export const CinematicDirectorController = {
  /** Enqueues a sequence to be played */
  playSequence: (id: SequenceId) => {
    useSequenceStore.getState().enqueue(id);
  },

  /** Clears the queue and stops any currently running sequence (handled by Manager) */
  cancelSequence: () => {
    useSequenceStore.getState().clearQueue();
    // Emit a global cancel event so the SequenceManager can abort the current timeline
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director:forceCancel'));
    }
  },

  pauseSequence: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director:forcePause'));
    }
  },

  resumeSequence: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director:forceResume'));
    }
  },

  skipSequence: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director:forceSkip'));
    }
  },

  queueSequence: (id: SequenceId) => {
    useSequenceStore.getState().enqueue(id);
  },

  clearQueue: () => {
    useSequenceStore.getState().clearQueue();
  },

  getCurrentSequence: (): SequenceId | null => {
    return useSequenceStore.getState().currentSequenceId;
  },
};

