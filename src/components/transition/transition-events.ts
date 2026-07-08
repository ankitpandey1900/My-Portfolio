import { sceneEventEmitter } from '../canvas/scene-manager/events/scene-event-emitter';
import type { TransitionId } from './transition-types';

export type TransitionEventName =
  | 'TransitionStarted'
  | 'TransitionCompleted'
  | 'TransitionCancelled'
  | 'TransitionFailed'
  | 'QueueUpdated'
  | 'TransitionTimeout';

export interface TransitionPayload {
  transitionId: TransitionId;
  targetId?: string | undefined;
  uid: string;
  timestamp: number;
  reason?: string | undefined;
}

export interface QueuePayload {
  queueLength: number;
  timestamp: number;
}

export const TransitionEvents = {
  emit: (event: TransitionEventName, payload: TransitionPayload | QueuePayload) => {
    sceneEventEmitter.emit(`transition:${event}`, payload);
  },
  on: <T = TransitionPayload>(event: TransitionEventName, callback: (data: T) => void) => {
    return sceneEventEmitter.on(`transition:${event}`, (data) => callback(data as T));
  },
};
