// ─────────────────────────────────────────────────────────────────────────────
// Nebula Types
// Strictly typed boundaries for the Procedural Nebula Engine (Task 6.3).
// ─────────────────────────────────────────────────────────────────────────────

import type { QualityTier } from '@/lib/store';

/** Identifiers for registered nebula presets. */
export type NebulaPresetId =
  'deep-space' | 'blue-nebula' | 'purple-nebula' | 'golden-nebula' | 'minimal-space';

/** Configuration for a single procedural nebula shell layer. */
export interface NebulaLayerConfig {
  /** Unique identifier for the layer. */
  id: string;
  /** Primary color of the nebula gas (hex string). */
  primaryColor: string;
  /** Secondary color of the nebula gas for gradient blending (hex string). */
  secondaryColor: string;
  /** Radius of the sphere shell. Must be nested (e.g. 450 to 480). */
  radius: number;
  /** Opacity scaling factor (0 to 1). */
  opacity: number;
  /** Base scale of the noise space. Higher means smaller, more frequent clouds. */
  scale: number;
  /** Drift animation speed factor. */
  speed: number;
  /** Level of detail of the fractional Brownian motion (octaves). */
  octaves: number;
}

/** Configuration for a specific nebula preset. */
export interface NebulaPresetConfig {
  /** Unique identifier for the preset. */
  id: NebulaPresetId;
  /** Base density modifier for the entire system */
  density: number;
  /** Base opacity modifier for the entire system */
  opacity: number;
  /** Speed multiplier for all layers */
  speedBase: number;
  /** Scale multiplier for all layers */
  scaleBase: number;
  /** Color brightness (post-processing future proofing or shader side) */
  brightness: number;
  /** Color contrast */
  contrast: number;
  /** Color saturation */
  saturation: number;
  /** Configured layers scaled by quality tier */
  layers: Record<QualityTier, NebulaLayerConfig[]>;
}

/** State for the Nebula Engine store. */
export interface NebulaState {
  currentPresetId: NebulaPresetId;
  activeConfig: NebulaPresetConfig;
  setPreset: (presetId: NebulaPresetId) => void;
  updateConfig: (partialConfig: DeepPartial<NebulaPresetConfig>) => void;
}

/** Utility type for partial deep updates to config. */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

