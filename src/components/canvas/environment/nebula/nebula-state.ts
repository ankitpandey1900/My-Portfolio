// ─────────────────────────────────────────────────────────────────────────────
// Nebula State
// Decoupled Zustand store for the Nebula Engine.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { NEBULA_CONFIG } from './nebula-config';
import { NEBULA_PRESETS } from './nebula-presets';
import type { DeepPartial, NebulaPresetConfig, NebulaPresetId, NebulaState } from './nebula-types';

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

export const useNebulaStore = create<NebulaState>((set) => ({
  currentPresetId: NEBULA_CONFIG.defaultPreset,
  activeConfig: NEBULA_PRESETS[NEBULA_CONFIG.defaultPreset],

  setPreset: (presetId: NebulaPresetId) => {
    const preset = NEBULA_PRESETS[presetId];
    if (preset) {
      set({ currentPresetId: presetId, activeConfig: preset });
    }
  },

  updateConfig: (partialConfig: DeepPartial<NebulaPresetConfig>) => {
    set((state) => ({
      activeConfig: deepMerge(state.activeConfig, partialConfig),
    }));
  },
}));

