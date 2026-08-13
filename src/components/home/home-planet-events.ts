// ─────────────────────────────────────────────────────────────────────────────
// Home Planet Events
// Typed bridge between the Home Planet system and the global sceneEventEmitter.
// ─────────────────────────────────────────────────────────────────────────────
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import type { HomePlanetPhase } from './home-planet-types';

export type HomePlanetEventName =
  | 'home:phaseChanged'
  | 'home:journeyStarted'
  | 'home:resumeDownloaded'
  | 'home:heroMounted'
  | 'home:heroDismissed';

export interface HomePlanetEventPayload {
  phase?: HomePlanetPhase;
  timestamp: number;
}

export const HomePlanetEvents = {
  emit: (event: HomePlanetEventName, payload?: Partial<HomePlanetEventPayload>) => {
    sceneEventEmitter.emit(event, { timestamp: Date.now(), ...payload });
  },

  on: (
    event: HomePlanetEventName,
    callback: (payload: HomePlanetEventPayload) => void
  ): (() => void) => {
    const handler = (data?: unknown) => callback(data as HomePlanetEventPayload);
    sceneEventEmitter.on(event, handler);
    return () => sceneEventEmitter.off(event, handler);
  },
};

