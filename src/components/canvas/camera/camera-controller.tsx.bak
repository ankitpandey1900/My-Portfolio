/* eslint-disable react-hooks/immutability */
'use client';

import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

export function CameraController() {
  const { camera } = useThree();

  // Read target camera vectors from global state store
  const targetPos = useStore((state) => state.targetPosition);
  const targetLook = useStore((state) => state.targetLookAt);
  const isWarping = useStore((state) => state.isWarping);
  const cameraFov = useStore((state) => state.cameraFov);

  // Initialize reference vectors to prevent GC allocations inside useFrame loop
  const positionVector = React.useRef(new THREE.Vector3());
  const lookAtVector = React.useRef(new THREE.Vector3());

  // Dynamically update camera Field of View (FOV) when it changes
  React.useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cameraFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, cameraFov]);

  useFrame((_, delta) => {
    // Synchronize vector coordinates
    positionVector.current.set(targetPos[0], targetPos[1], targetPos[2]);
    lookAtVector.current.set(targetLook[0], targetLook[1], targetLook[2]);

    // Choose interpolation speed profile depending on warp active states
    const lerpFactor = isWarping ? 8 * delta : 3 * delta;

    // Smoothly interpolate camera position vector
    camera.position.lerp(positionVector.current, Math.min(lerpFactor, 1));

    // Smoothly direct camera focal point vector
    camera.lookAt(lookAtVector.current);
  });

  return null;
}
export default CameraController;
