// ─────────────────────────────────────────────────────────────────────────────
// Starfield Events
// Typed pub/sub event bridge using the global sceneEventEmitter.
// ─────────────────────────────────────────────────────────────────────────────
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import type { StarfieldPresetId } from './starfield-types';

/** Events emitted exclusively by the Starfield Engine. */
export type StarfieldEngineEvents = {
  'starfield:presetChanged': { presetId: StarfieldPresetId };
};

export const StarfieldEvents = {
  emit: <K extends keyof StarfieldEngineEvents>(event: K, payload: StarfieldEngineEvents[K]) => {
    sceneEventEmitter.emit(event, payload);
  },
  on: <K extends keyof StarfieldEngineEvents>(
    event: K,
    callback: (payload: StarfieldEngineEvents[K]) => void
  ) => {
    return sceneEventEmitter.on(event, callback as (data?: unknown) => void);
  },
};
