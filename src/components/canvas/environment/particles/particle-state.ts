// ─────────────────────────────────────────────────────────────────────────────
// Particle State
// Localized Zustand store for the active particle preset.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { PARTICLE_CONFIG } from './particle-config';
import { PARTICLE_PRESETS } from './particle-presets';
import type { DeepPartial, ParticleState } from './particle-types';

/* eslint-disable @typescript-eslint/no-explicit-any */
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const isObject = (obj: unknown) => obj && typeof obj === 'object';
  if (!isObject(target) || !isObject(source)) {
    return source as unknown as T;
  }

  const output: any = { ...target };
  Object.keys(source || {}).forEach((key) => {
    if (isObject((source as any)[key])) {
      if (!(key in (target as any))) {
        Object.assign(output, { [key]: (source as any)[key] });
      } else {
        output[key] = deepMerge((target as any)[key], (source as any)[key]);
      }
    } else {
      Object.assign(output, { [key]: (source as any)[key] });
    }
  });
  return output as T;
}

export const useParticleStore = create<ParticleState>((set) => {
  const initialPreset = PARTICLE_CONFIG.defaultPreset;
  const initialConfig = PARTICLE_PRESETS[initialPreset] || PARTICLE_CONFIG.fallbackPreset;

  return {
    currentPresetId: initialPreset,
    activeConfig: JSON.parse(JSON.stringify(initialConfig)),

    setPreset: (presetId) => {
      const presetConfig = PARTICLE_PRESETS[presetId];
      if (presetConfig) {
        set({
          currentPresetId: presetId,
          activeConfig: JSON.parse(JSON.stringify(presetConfig)),
        });
      }
    },

    updateConfig: (partialConfig) => {
      set((state) => ({
        activeConfig: deepMerge(state.activeConfig, partialConfig),
      }));
    },
  };
});
