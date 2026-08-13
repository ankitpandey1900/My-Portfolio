'use client';

import { useFrame } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { PlanetRenderer } from './solar-system/generator/planet-renderer';
import { PlanetRegistry } from './solar-system/planet/planet-registry';
import { SceneWrapper } from './scene-wrapper';

function FocusedPlanet() {
  const activePlanetId = useStore((state) => state.activePlanet);
  const config = activePlanetId ? PlanetRegistry.get(activePlanetId) : null;
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && config) {
      meshRef.current.rotation.y += config.rotationSpeed * delta * 0.5;
    }
  });

  if (!config) return null;

  return (
    <group name="planet-surface-focus">
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 2, 5]} intensity={1.2} />
      <pointLight position={[-3, -1, -2]} intensity={0.4} color="#d8a24a" />
      <PlanetRenderer ref={meshRef} entry={config} />
    </group>
  );
}

export function PlanetScene() {
  return (
    <SceneWrapper name="PLANET">
      <FocusedPlanet />
    </SceneWrapper>
  );
}

export default PlanetScene;

