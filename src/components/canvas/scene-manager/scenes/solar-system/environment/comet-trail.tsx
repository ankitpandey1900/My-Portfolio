'use client';

import { useFrame } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';

const COMET_COUNT = 3;

interface CometSpec {
  orbitRadius: number;
  speed: number;
  height: number;
  phase: number;
  tailLength: number;
  color: string;
}

const COMETS: CometSpec[] = [
  { orbitRadius: 68, speed: 0.11, height: 2.5, phase: 0.2, tailLength: 2.8, color: '#d8a24a' },
  { orbitRadius: 74, speed: 0.08, height: -3.2, phase: 2.1, tailLength: 3.4, color: '#9fb9c7' },
  { orbitRadius: 58, speed: 0.14, height: 4.8, phase: 4.2, tailLength: 2.2, color: '#e8c18b' },
];

function Comet({ spec }: { spec: CometSpec }) {
  const groupRef = React.useRef<THREE.Group>(null);
  const coreRef = React.useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime() * spec.speed + spec.phase;
    if (!groupRef.current) return;

    groupRef.current.position.set(
      Math.cos(t) * spec.orbitRadius,
      spec.height + Math.sin(t * 2.2) * 1.2,
      Math.sin(t) * spec.orbitRadius
    );
    groupRef.current.rotation.y = -t + Math.PI / 2;

    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[-spec.tailLength * 0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.07, spec.tailLength, 8]} />
        <meshBasicMaterial color={spec.color} transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

export function CometTrail() {
  return (
    <group name="comet-trail-system">
      {COMETS.map((spec, index) => (
        <Comet key={`comet-${index}`} spec={spec} />
      ))}
    </group>
  );
}

export default CometTrail;
