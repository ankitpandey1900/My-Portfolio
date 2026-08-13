'use client';

import * as React from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '@/lib/store';
import { CAMERA_PRESETS } from './camera-presets';

/**
 * CameraManager handles the orchestration of camera state:
 * 1. Synchronizes selected presets (galaxy, system, planet, cockpit) to target vectors.
 * 2. Triggers an initial cinematic spawn transition on mount.
 * 3. Handles responsive scaling (adjusts FOV based on screen aspect ratio).
 */
export function CameraManager() {
  const { camera } = useThree();

  const cameraPreset = useStore((state) => state.cameraPreset);
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const setCameraFov = useStore((state) => state.setCameraFov);
  const setCameraMode = useStore((state) => state.setCameraMode);
  const aspect = useStore((state) => state.viewport.aspect);

  // 1. Initial Cinematic Spawn
  React.useEffect(() => {
    // Set a far-away starting point for the spawn animation
    camera.position.set(0, 120, 280);
    camera.lookAt(0, 0, 0);

    // Transition to default preset target coordinates shortly after mounting
    const timer = setTimeout(() => {
      const presetConfig = CAMERA_PRESETS.galaxy;
      setCameraTarget(presetConfig.position, presetConfig.lookAt);
      setCameraFov(presetConfig.fov);
      setCameraMode('cinematic');
    }, 100);

    return () => clearTimeout(timer);
  }, [camera, setCameraTarget, setCameraFov, setCameraMode]);

  // 2. Synchronize preset changes
  React.useEffect(() => {
    const presetConfig = CAMERA_PRESETS[cameraPreset];
    if (presetConfig) {
      setCameraTarget(presetConfig.position, presetConfig.lookAt);
      setCameraFov(presetConfig.fov);
    }
  }, [cameraPreset, setCameraTarget, setCameraFov]);

  // 3. Responsive scaling for vertical viewports (mobiles/tablets)
  React.useEffect(() => {
    if (aspect < 1.0) {
      // Scale up FOV to give a wider viewing angle on narrow vertical viewports
      const defaultFov = CAMERA_PRESETS[cameraPreset].fov;
      setCameraFov(defaultFov + 10);
    } else {
      // Revert to default preset FOV on landscape screens
      setCameraFov(CAMERA_PRESETS[cameraPreset].fov);
    }
  }, [aspect, cameraPreset, setCameraFov]);

  return null;
}
export default CameraManager;

