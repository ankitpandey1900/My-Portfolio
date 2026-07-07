import type { CameraPresetType } from '@/lib/store';

/**
 * Configuration schema for a camera viewport preset.
 */
export interface CameraPreset {
  /** Target coordinates in local 3D world space. */
  position: [number, number, number];
  /** Focal coordinates where the camera is directed. */
  lookAt: [number, number, number];
  /** Field of View (FOV) in degrees. */
  fov: number;
}

/**
 * Interactive viewport presets for the deep-space simulation.
 */
export const CAMERA_PRESETS: Record<CameraPresetType, CameraPreset> = {
  galaxy: {
    position: [0, 60, 120],
    lookAt: [0, 0, 0],
    fov: 45,
  },
  system: {
    position: [0, 25, 55],
    lookAt: [0, 0, 0],
    fov: 45,
  },
  planet: {
    position: [0, 6, 15],
    lookAt: [0, 0, 0],
    fov: 35,
  },
  cockpit: {
    position: [0, 1.2, 3.5],
    lookAt: [0, 0, 0],
    fov: 65,
  },
};

/**
 * Hard clip limits for future interactive controls.
 */
export const CAMERA_CONSTRAINTS = {
  minDistance: 4,
  maxDistance: 400,
  minFov: 25,
  maxFov: 75,
} as const;
