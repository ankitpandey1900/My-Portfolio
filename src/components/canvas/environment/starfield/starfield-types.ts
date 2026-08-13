// ─────────────────────────────────────────────────────────────────────────────
// Starfield Types
// Strictly typed boundaries for the Starfield Engine.
// ─────────────────────────────────────────────────────────────────────────────

import type { QualityTier } from '@/lib/store';

/** Identifiers for registered starfield presets. */
export type StarfieldPresetId = 'ultra-dense' | 'realistic' | 'sparse' | 'deep-space' | 'minimal';

/** Configuration for a single layer of stars within the starfield. */
export interface StarLayerConfig {
  /** Unique identifier for the layer (used in scene graph naming). */
  id: string;
  /** Number of stars in this layer. */
  count: number;
  /** Inner radius of the spherical shell where stars are placed. */
  radiusInner: number;
  /** Outer radius of the spherical shell where stars are placed. */
  radiusOuter: number;
  /** Minimum and maximum point size in world units. */
  sizeRange: [min: number, max: number];
  /** Minimum and maximum brightness (0-1). Maps to alpha in the shader. */
  brightnessRange: [min: number, max: number];
  /**
   * Color temperature range in Kelvin.
   * Lower values (3000K) produce warm orange/red stars.
   * Higher values (10000K+) produce cool blue/white stars.
   */
  colorTemperatureRange: [min: number, max: number];
  /** PRNG seed for deterministic generation. */
  seed: number;
}

/** Configuration for a specific starfield preset. */
export interface StarfieldPresetConfig {
  /** Unique identifier for the preset. */
  id: StarfieldPresetId;
  /** Base density multiplier for the star count */
  densityBase: number;
  /** Base size multiplier for all stars */
  sizeBase: number;
  /** Base opacity modifier */
  opacityBase: number;
  /** Twinkle speed multiplier */
  twinkleSpeedBase: number;
  /** Camera parallax strength */
  parallaxStrength: number;
  /** Configured layers scaled by quality tier */
  layers: Record<QualityTier, StarLayerConfig[]>;
}

/** State for the Starfield Engine store. */
export interface StarfieldState {
  currentPresetId: StarfieldPresetId;
  activeConfig: StarfieldPresetConfig;
  setPreset: (presetId: StarfieldPresetId) => void;
  updateConfig: (partialConfig: DeepPartial<StarfieldPresetConfig>) => void;
}

/** Utility type for partial deep updates to config. */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

