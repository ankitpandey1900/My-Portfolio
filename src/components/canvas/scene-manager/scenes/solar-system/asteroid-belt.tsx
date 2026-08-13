'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/lib/store';

const ASTEROID_COUNT = 15000;
const INNER_RADIUS = 26;
const OUTER_RADIUS = 31;
const HEIGHT_VARIANCE = 1.2;

export function AsteroidBelt() {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const isRenderActive = useStore((s) => s.isRenderActive);
  
  React.useEffect(() => {
    if (!meshRef.current) return;
    
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      // Randomize position in a torus shape
      const angle = Math.random() * Math.PI * 2;
      
      // Bias towards the center of the belt for more realistic density
      const u = Math.random() + Math.random();
      const r = u > 1 ? 2 - u : u;
      const radius = INNER_RADIUS + r * (OUTER_RADIUS - INNER_RADIUS);
      
      // Bell curve distribution for height to make the belt dense in the middle
      const height = (Math.random() - 0.5) * (Math.random() - 0.5) * 4 * HEIGHT_VARIANCE;
      
      dummy.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      
      // Randomize rotation
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Randomize scale
      const scale = 0.3 + Math.random() * 1.5;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Randomize color slightly (grey-brown tones)
      const cr = 0.3 + Math.random() * 0.2;
      const cg = 0.25 + Math.random() * 0.15;
      const cb = 0.2 + Math.random() * 0.15;
      color.setRGB(cr, cg, cb);
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, []);

  useFrame((_, delta) => {
    if (!isRenderActive || !meshRef.current) return;
    // Slow, ominous global rotation of the entire belt
    meshRef.current.rotation.y += delta * 0.015;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ASTEROID_COUNT]} name="asteroid-belt">
      <dodecahedronGeometry args={[0.035, 0]} />
      <meshStandardMaterial roughness={0.9} metalness={0.1} />
    </instancedMesh>
  );
}

