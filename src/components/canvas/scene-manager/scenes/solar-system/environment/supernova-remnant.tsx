'use client';

import { useFrame } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';

export function SupernovaRemnant() {
  const coreRef = React.useRef<THREE.Mesh>(null);
  const haloRef = React.useRef<THREE.Mesh>(null);
  const ringRef = React.useRef<THREE.Mesh>(null);

  const coreMaterial = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffd2a1',
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const haloMaterial = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff8a4a',
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    []
  );

  const ringMaterial = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#c96a3a',
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  React.useEffect(() => {
    return () => {
      coreMaterial.dispose();
      haloMaterial.dispose();
      ringMaterial.dispose();
    };
  }, [coreMaterial, haloMaterial, ringMaterial]);

  useFrame((state) => {
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 0.55) * 0.15;

    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse);
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1.05 + Math.sin(state.clock.elapsedTime * 0.35) * 0.08);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.0015;
      ringRef.current.rotation.x = 0.65;
    }
  });

  return (
    <group name="supernova-remnant" position={[-78, 22, -96]}>
      <pointLight color="#ffb07a" intensity={120} distance={180} decay={2} />
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>
      <mesh ref={haloRef} scale={2.8}>
        <sphereGeometry args={[2.4, 24, 24]} />
        <primitive object={haloMaterial} attach="material" />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[4.5, 8.5, 64]} />
        <primitive object={ringMaterial} attach="material" />
      </mesh>
    </group>
  );
}

export default SupernovaRemnant;

