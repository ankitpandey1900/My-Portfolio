import { sceneEventEmitter } from '../canvas/scene-manager/events/scene-event-emitter';

export type NavigationEventName =
  | 'PlanetSelected'
  | 'TravelStarted'
  | 'TravelCompleted'
  | 'SectionOpened'
  | 'SectionClosed'
  | 'ReturnHome'
  | 'NavigationReset'
  | 'FutureRouteChanged';

export interface NavigationPayload {
  planetId?: string;
  sectionId?: string;
  openSection?: boolean;
  timestamp: number;
}

export const NavigationEvents = {
  emit: (event: NavigationEventName, payload: NavigationPayload) => {
    sceneEventEmitter.emit(`navigation:${event}`, payload);
  },
  on: (event: NavigationEventName, callback: (data: NavigationPayload) => void) => {
    return sceneEventEmitter.on(`navigation:${event}`, (data) =>
      callback(data as NavigationPayload)
    );
  },
};

