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
    position: [-20, 32, 98],
    lookAt: [0, 0, 0],
    fov: 40,
  },
  planet: {
    position: [0, 4, 14],
    lookAt: [0, 0, 0],
    fov: 30,
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
