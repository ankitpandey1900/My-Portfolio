// ─────────────────────────────────────────────────────────────────────────────
// Nebula Events
// Typed pub/sub event bridge using the global sceneEventEmitter.
// ─────────────────────────────────────────────────────────────────────────────
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import type { NebulaPresetId } from './nebula-types';

/** Events emitted exclusively by the Nebula Engine. */
export type NebulaEngineEvents = {
  'nebula:presetChanged': { presetId: NebulaPresetId };
  'nebula:qualityChanged': { qualityTier: string };
};

export const NebulaEvents = {
  emit: <K extends keyof NebulaEngineEvents>(event: K, payload: NebulaEngineEvents[K]) => {
    sceneEventEmitter.emit(event, payload);
  },
  on: <K extends keyof NebulaEngineEvents>(
    event: K,
    callback: (payload: NebulaEngineEvents[K]) => void
  ) => {
    return sceneEventEmitter.on(event, callback as (data?: unknown) => void);
  },
};
