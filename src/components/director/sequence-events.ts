// ─────────────────────────────────────────────────────────────────────────────
// Sequence Events
// Typed event bus for the Cinematic Director.
// ─────────────────────────────────────────────────────────────────────────────
import { sceneEventEmitter } from '../canvas/scene-manager/events/scene-event-emitter';
import type { SequenceId } from './sequence-types';

export type SequenceEventName =
  | 'SequenceStarted'
  | 'SequencePaused'
  | 'SequenceResumed'
  | 'SequenceCompleted'
  | 'SequenceCancelled'
  | 'SequenceSkipped'
  | 'SequenceFailed'
  | 'TimelineAdvanced';

export interface SequencePayload {
  sequenceId: SequenceId;
  timestamp: number;
}

export interface TimelineAdvancedPayload extends SequencePayload {
  actionType: string;
  actionId?: string;
}

export const SequenceEvents = {
  emit: (event: SequenceEventName, payload: SequencePayload | TimelineAdvancedPayload) => {
    sceneEventEmitter.emit(`director:${event}`, payload);
  },
  on: <T = SequencePayload>(event: SequenceEventName, callback: (data: T) => void) => {
    return sceneEventEmitter.on(`director:${event}`, (data) => callback(data as T));
  },
};

