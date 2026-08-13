// ─────────────────────────────────────────────────────────────────────────────
// Nebula Config
// Default bounds and configurations for the Nebula Engine.
// ─────────────────────────────────────────────────────────────────────────────
import { NEBULA_PRESETS } from './nebula-presets';
import type { NebulaPresetId } from './nebula-types';

export const NEBULA_CONFIG = {
  defaultPreset: 'minimal-space' as NebulaPresetId,
  transitionDurationMs: 2000, // Smooth transition time when changing presets

  // Failsafe configuration in case a preset is malformed
  fallbackPreset: NEBULA_PRESETS['minimal-space'],

  // Hard bounds to prevent visual bugs or shader crashes
  bounds: {
    minOpacity: 0,
    maxOpacity: 1,
    minDensity: 0.1,
    maxDensity: 3.0,
    minSpeed: 0,
    maxSpeed: 5.0,
  },
};

