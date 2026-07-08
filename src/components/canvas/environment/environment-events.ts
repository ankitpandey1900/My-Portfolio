// ─────────────────────────────────────────────────────────────────────────────
// Environment Events
// Typed event bridge for the Environment Engine.
// ─────────────────────────────────────────────────────────────────────────────
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import type { EnvironmentPresetId } from './environment-types';

export type EnvironmentEventName = 'environment:presetChanged' | 'environment:qualityChanged';

export interface EnvironmentEventPayload {
  presetId?: EnvironmentPresetId;
  qualityTier?: string;
  timestamp: number;
}

export const EnvironmentEvents = {
  emit: (event: EnvironmentEventName, payload?: Partial<EnvironmentEventPayload>) => {
    sceneEventEmitter.emit(event, { timestamp: Date.now(), ...payload });
  },

  on: (
    event: EnvironmentEventName,
    callback: (payload: EnvironmentEventPayload) => void
  ): (() => void) => {
    const handler = (data?: unknown) => callback(data as EnvironmentEventPayload);
    sceneEventEmitter.on(event, handler);
    return () => sceneEventEmitter.off(event, handler);
  },
};
