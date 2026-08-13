'use client';

import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

/**
 * Applies camera FOV from the global store to the Three.js perspective camera.
 */
export function CameraFovController() {
  const { camera } = useThree();
  const cameraFov = useStore((state) => state.cameraFov);

  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera && camera.fov !== cameraFov) {
      // Three.js cameras are intentionally mutated in the render loop.
      // eslint-disable-next-line react-hooks/immutability -- R3F camera refs are mutable objects
      camera.fov = cameraFov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default CameraFovController;

