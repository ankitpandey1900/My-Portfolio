// ─────────────────────────────────────────────────────────────────────────────
// Environment Config
// Default configurations and bounds for the Environment Engine.
// ─────────────────────────────────────────────────────────────────────────────
import { ENVIRONMENT_PRESETS } from './environment-presets';
import type { EnvironmentPresetId } from './environment-types';

export const ENVIRONMENT_CONFIG = {
  defaultPreset: 'deep-space' as EnvironmentPresetId,
  transitionDurationMs: 1500, // Smooth transition time when changing presets

  // Failsafe configuration in case a preset is malformed
  fallbackPreset: ENVIRONMENT_PRESETS['deep-space'],

  // Quality scaling bounds (driven by global QualityTier)
  qualityBounds: {
    ultra: {
      fogEnabled: true,
      iblResolution: 1024,
    },
    high: {
      fogEnabled: true,
      iblResolution: 512,
    },
    medium: {
      fogEnabled: false,
      iblResolution: 256,
    },
    low: {
      fogEnabled: false,
      iblResolution: 128,
    },
  },
};
