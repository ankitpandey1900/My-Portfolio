import type { QualityTier } from '@/lib/store';

/**
 * Configuration for a single layer of stars within the starfield.
 * Each layer produces one THREE.Points object = one draw call.
 */
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
  /** Minimum and maximum brightness (0–1). Maps to alpha in the shader. */
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

/**
 * Complete starfield preset containing all layer configurations.
 */
export interface StarfieldPreset {
  /** Human-readable name for debug display. */
  name: string;
  /** Total star count across all layers (computed for telemetry). */
  totalStars: number;
  /** Individual layer configurations. */
  layers: StarLayerConfig[];
}

/**
 * Quality-tier-specific starfield presets.
 *
 * Layer populations:
 * - Background: Faint, tiny, distant. Creates depth and density.
 * - Midfield: Medium brightness and size. Fills the visual field.
 * - Foreground: Bright, larger stars. Sparse but eye-catching.
 *
 * All seeds are fixed to ensure identical star positions across sessions.
 */
export const STARFIELD_PRESETS: Record<QualityTier, StarfieldPreset> = {
  ultra: {
    name: 'Ultra',
    totalStars: 25000,
    layers: [
      {
        id: 'background',
        count: 15000,
        radiusInner: 400,
        radiusOuter: 500,
        sizeRange: [0.3, 0.8],
        brightnessRange: [0.1, 0.4],
        colorTemperatureRange: [4000, 9000],
        seed: 42,
      },
      {
        id: 'midfield',
        count: 8000,
        radiusInner: 200,
        radiusOuter: 400,
        sizeRange: [0.6, 1.5],
        brightnessRange: [0.3, 0.7],
        colorTemperatureRange: [3500, 12000],
        seed: 137,
      },
      {
        id: 'foreground',
        count: 2000,
        radiusInner: 80,
        radiusOuter: 200,
        sizeRange: [1.0, 3.0],
        brightnessRange: [0.5, 1.0],
        colorTemperatureRange: [3000, 15000],
        seed: 256,
      },
    ],
  },
  high: {
    name: 'High',
    totalStars: 18000,
    layers: [
      {
        id: 'background',
        count: 10000,
        radiusInner: 400,
        radiusOuter: 500,
        sizeRange: [0.3, 0.8],
        brightnessRange: [0.1, 0.4],
        colorTemperatureRange: [4000, 9000],
        seed: 42,
      },
      {
        id: 'midfield',
        count: 6000,
        radiusInner: 200,
        radiusOuter: 400,
        sizeRange: [0.6, 1.5],
        brightnessRange: [0.3, 0.7],
        colorTemperatureRange: [3500, 12000],
        seed: 137,
      },
      {
        id: 'foreground',
        count: 2000,
        radiusInner: 80,
        radiusOuter: 200,
        sizeRange: [1.0, 3.0],
        brightnessRange: [0.5, 1.0],
        colorTemperatureRange: [3000, 15000],
        seed: 256,
      },
    ],
  },
  medium: {
    name: 'Medium',
    totalStars: 8000,
    layers: [
      {
        id: 'background',
        count: 5000,
        radiusInner: 400,
        radiusOuter: 500,
        sizeRange: [0.4, 0.9],
        brightnessRange: [0.15, 0.45],
        colorTemperatureRange: [4500, 8500],
        seed: 42,
      },
      {
        id: 'midfield',
        count: 2500,
        radiusInner: 200,
        radiusOuter: 400,
        sizeRange: [0.7, 1.6],
        brightnessRange: [0.35, 0.75],
        colorTemperatureRange: [4000, 11000],
        seed: 137,
      },
      {
        id: 'foreground',
        count: 500,
        radiusInner: 80,
        radiusOuter: 200,
        sizeRange: [1.2, 3.0],
        brightnessRange: [0.5, 1.0],
        colorTemperatureRange: [3500, 13000],
        seed: 256,
      },
    ],
  },
  low: {
    name: 'Low',
    totalStars: 3000,
    layers: [
      {
        id: 'background',
        count: 2000,
        radiusInner: 400,
        radiusOuter: 500,
        sizeRange: [0.5, 1.0],
        brightnessRange: [0.2, 0.5],
        colorTemperatureRange: [5000, 8000],
        seed: 42,
      },
      {
        id: 'midfield',
        count: 800,
        radiusInner: 200,
        radiusOuter: 400,
        sizeRange: [0.8, 1.8],
        brightnessRange: [0.4, 0.8],
        colorTemperatureRange: [4500, 10000],
        seed: 137,
      },
      {
        id: 'foreground',
        count: 200,
        radiusInner: 80,
        radiusOuter: 200,
        sizeRange: [1.5, 3.5],
        brightnessRange: [0.6, 1.0],
        colorTemperatureRange: [4000, 12000],
        seed: 256,
      },
    ],
  },
};
