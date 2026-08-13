'use client';

import { useFrame } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';

const ASTEROID_COUNT = 220;

function createAsteroidPositions(count: number, innerRadius: number, outerRadius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return positions;
}

export function AsteroidBelt() {
  const pointsRef = React.useRef<THREE.Points>(null);
  const positions = React.useMemo(() => createAsteroidPositions(ASTEROID_COUNT, 44, 54), []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.022;
    }
  });

  return (
    <points ref={pointsRef} name="asteroid-belt">
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a39482"
        size={0.07}
        transparent
        opacity={0.62}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default AsteroidBelt;

