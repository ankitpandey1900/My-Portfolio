import { sceneEventEmitter } from '../canvas/scene-manager/events/scene-event-emitter';

export type LandingEventName =
  | 'LandingStarted'
  | 'LandingCompleted'
  | 'LandingCancelled'
  | 'LandingFailed'
  | 'ReadyForSection'
  | 'ReturnStarted';

export interface LandingPayload {
  planetId?: string | undefined;
  sectionId?: string | undefined;
  timestamp: number;
}

export const LandingEvents = {
  emit: (event: LandingEventName, payload: LandingPayload) => {
    sceneEventEmitter.emit(`landing:${event}`, payload);
  },
  on: (event: LandingEventName, callback: (data: LandingPayload) => void) => {
    return sceneEventEmitter.on(`landing:${event}`, (data) => callback(data as LandingPayload));
  },
};

