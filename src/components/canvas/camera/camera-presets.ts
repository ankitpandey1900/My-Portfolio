import type { CameraPresetType } from '@/lib/store';

export interface CameraPreset {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

export const CAMERA_PRESETS: Record<CameraPresetType, CameraPreset> = {
  galaxy: {
    position: [0, 16, 68],
    lookAt: [24, -3, -12],
    fov: 34,
  },
  system: {
    position: [-30, 45, 120],
    lookAt: [0, 0, 0],
    fov: 35,
  },
  planet: {
    position: [0, 4, 14],
    lookAt: [0, 0, 0],
    fov: 28, // Telephoto cinematic feel
  },
  cockpit: {
    position: [0, 1.2, 3.5],
    lookAt: [0, 0, 0],
    fov: 50,
  },
};

export const CAMERA_CONSTRAINTS = {
  minDistance: 4,
  maxDistance: 400,
  minFov: 25,
  maxFov: 75,
} as const;

