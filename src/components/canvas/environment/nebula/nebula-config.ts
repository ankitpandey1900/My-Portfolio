import type { QualityTier } from '@/lib/store';

/**
 * Configuration for a single procedural nebula shell layer.
 */
export interface NebulaLayerConfig {
  /** Unique identifier for the layer. */
  id: string;
  /** Color of the nebula gas (hex string). */
  color: string;
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

/**
 * Nebula configurations categorized by QualityTier.
 */
export const NEBULA_PRESETS: Record<QualityTier, NebulaLayerConfig[]> = {
  ultra: [
    // 1. Background deep violet cloud base
    {
      id: 'background-violet',
      color: '#580bb5',
      radius: 480,
      opacity: 0.45,
      scale: 0.003,
      speed: 0.015,
      octaves: 4,
    },
    // 2. Midground warm solar orange accents
    {
      id: 'midground-orange',
      color: '#ff6a00',
      radius: 465,
      opacity: 0.25,
      scale: 0.005,
      speed: 0.025,
      octaves: 3,
    },
    // 3. Foreground high-detail cyan filaments
    {
      id: 'foreground-teal',
      color: '#00e5e5',
      radius: 450,
      opacity: 0.15,
      scale: 0.008,
      speed: 0.035,
      octaves: 3,
    },
  ],
  high: [
    {
      id: 'background-violet',
      color: '#580bb5',
      radius: 480,
      opacity: 0.4,
      scale: 0.003,
      speed: 0.015,
      octaves: 3,
    },
    {
      id: 'midground-orange',
      color: '#ff6a00',
      radius: 465,
      opacity: 0.2,
      scale: 0.005,
      speed: 0.02,
      octaves: 3,
    },
    {
      id: 'foreground-teal',
      color: '#00e5e5',
      radius: 450,
      opacity: 0.1,
      scale: 0.008,
      speed: 0.03,
      octaves: 2,
    },
  ],
  medium: [
    {
      id: 'background-violet',
      color: '#580bb5',
      radius: 480,
      opacity: 0.35,
      scale: 0.003,
      speed: 0.012,
      octaves: 2,
    },
    {
      id: 'midground-orange',
      color: '#ff6a00',
      radius: 465,
      opacity: 0.15,
      scale: 0.005,
      speed: 0.018,
      octaves: 2,
    },
  ],
  low: [
    {
      id: 'background-violet',
      color: '#580bb5',
      radius: 480,
      opacity: 0.3,
      scale: 0.002,
      speed: 0.008,
      octaves: 1,
    },
  ],
};
