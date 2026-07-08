// ─────────────────────────────────────────────────────────────────────────────
// Starfield State
// localized Zustand store for the starfield engine configuration.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { STARFIELD_CONFIG } from './starfield-config';
import { STARFIELD_PRESETS } from './starfield-presets';
import type { DeepPartial, StarfieldState } from './starfield-types';

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Deep merge helper for config updates */
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

export const useStarfieldStore = create<StarfieldState>((set) => {
  const initialPreset = STARFIELD_CONFIG.defaultPreset;
  const initialConfig = STARFIELD_PRESETS[initialPreset] || STARFIELD_CONFIG.fallbackPreset;

  return {
    currentPresetId: initialPreset,
    activeConfig: JSON.parse(JSON.stringify(initialConfig)), // Deep clone to prevent mutating presets

    setPreset: (presetId) => {
      const presetConfig = STARFIELD_PRESETS[presetId];
      if (!presetConfig) {
        console.warn(`[StarfieldState] Preset ${presetId} not found, falling back.`);
        return;
      }
      set({
        currentPresetId: presetId,
        activeConfig: JSON.parse(JSON.stringify(presetConfig)),
      });
    },

    updateConfig: (partialConfig) => {
      set((state) => ({
        activeConfig: deepMerge(state.activeConfig, partialConfig),
      }));
    },
  };
});
