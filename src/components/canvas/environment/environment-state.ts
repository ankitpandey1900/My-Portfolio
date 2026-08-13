// ─────────────────────────────────────────────────────────────────────────────
// Environment State
// Decoupled Zustand store for the Environment Engine.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { ENVIRONMENT_CONFIG } from './environment-config';
import { ENVIRONMENT_PRESETS } from './environment-presets';
import type {
  DeepPartial,
  EnvironmentPresetConfig,
  EnvironmentPresetId,
  EnvironmentState,
} from './environment-types';

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

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  currentPresetId: ENVIRONMENT_CONFIG.defaultPreset,
  activeConfig: ENVIRONMENT_PRESETS[ENVIRONMENT_CONFIG.defaultPreset],

  setPreset: (presetId: EnvironmentPresetId) => {
    const preset = ENVIRONMENT_PRESETS[presetId];
    if (preset) {
      set({ currentPresetId: presetId, activeConfig: preset });
    }
  },

  updateConfig: (partialConfig: DeepPartial<EnvironmentPresetConfig>) => {
    set((state) => ({
      activeConfig: deepMerge(state.activeConfig, partialConfig),
    }));
  },
}));

