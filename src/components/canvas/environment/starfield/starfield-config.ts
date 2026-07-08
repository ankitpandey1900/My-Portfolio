// ─────────────────────────────────────────────────────────────────────────────
// Starfield Config
// Default bounds and configurations for the Starfield Engine.
// ─────────────────────────────────────────────────────────────────────────────
import { STARFIELD_PRESETS } from './starfield-presets';
import type { StarfieldPresetId } from './starfield-types';


export const STARFIELD_CONFIG = {
  defaultPreset: 'realistic' as StarfieldPresetId,

  // Failsafe configuration in case a preset is malformed
  fallbackPreset: STARFIELD_PRESETS['sparse'],

  // Hard bounds to prevent visual bugs or shader crashes
  bounds: {
    minOpacity: 0,
    maxOpacity: 1,
    minDensity: 0.1,
    maxDensity: 3.0,
    minSize: 0.1,
    maxSize: 5.0,
    minTwinkleSpeed: 0.0,
    maxTwinkleSpeed: 10.0,
  },
};
