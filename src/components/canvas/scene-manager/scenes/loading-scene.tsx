'use client';

import { useFrame } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';
import { SceneWrapper } from './scene-wrapper';

function OrbitalLoader() {
  const ringRef = React.useRef<THREE.Mesh>(null);
  const dotRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
    }
    if (dotRef.current) {
      dotRef.current.position.set(Math.cos(t * 1.2) * 3.2, Math.sin(t * 0.8) * 0.4, Math.sin(t * 1.2) * 3.2);
    }
  });

  return (
    <group name="loading-orbital-loader">
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.2, 0.015, 16, 128]} />
        <meshBasicMaterial color="#d8a24a" transparent opacity={0.35} />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#f0e9dc" />
      </mesh>
      <pointLight color="#d8a24a" intensity={0.6} distance={12} />
    </group>
  );
}

export function LoadingScene() {
  return (
    <SceneWrapper name="LOADING">
      <OrbitalLoader />
    </SceneWrapper>
  );
}

export default LoadingScene;
