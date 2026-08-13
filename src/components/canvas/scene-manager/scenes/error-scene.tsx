'use client';

import { useFrame } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';
import { SceneWrapper } from './scene-wrapper';

function GlitchOrb() {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.3;
    const pulse = 0.85 + Math.sin(t * 4) * 0.08;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 2]} />
      <meshStandardMaterial color="#8a4a4a" emissive="#3a1010" emissiveIntensity={0.4} wireframe />
    </mesh>
  );
}

export function ErrorScene() {
  return (
    <SceneWrapper name="ERROR">
      <ambientLight intensity={0.15} />
      <pointLight color="#d8873a" intensity={0.8} position={[2, 2, 2]} />
      <GlitchOrb />
    </SceneWrapper>
  );
}

export default ErrorScene;

