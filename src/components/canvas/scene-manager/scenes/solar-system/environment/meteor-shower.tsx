'use client';

import { useFrame } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';

const METEOR_COUNT = 22;

interface MeteorData {
  angle: number;
  speed: number;
  radius: number;
  height: number;
  phase: number;
}

function createMeteors(count: number): MeteorData[] {
  const meteors: MeteorData[] = [];
  for (let i = 0; i < count; i += 1) {
    meteors.push({
      angle: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.55,
      radius: 55 + Math.random() * 45,
      height: (Math.random() - 0.5) * 18,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return meteors;
}

export function MeteorShower() {
  const groupRef = React.useRef<THREE.Group>(null);
  const meteors = React.useMemo(() => createMeteors(METEOR_COUNT), []);

  const geometry = React.useMemo(() => new THREE.BufferGeometry(), []);
  const material = React.useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#f0d5a8',
        size: 0.22,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    []
  );

  const positions = React.useMemo(() => new Float32Array(METEOR_COUNT * 3), []);

  React.useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    for (let i = 0; i < METEOR_COUNT; i += 1) {
      const meteor = meteors[i]!;
      const progress = (elapsed * meteor.speed + meteor.phase) % (Math.PI * 2);
      const headRadius = meteor.radius - progress * 8;

      const offset = i * 3;
      positions[offset] = Math.cos(meteor.angle) * headRadius;
      positions[offset + 1] = meteor.height;
      positions[offset + 2] = Math.sin(meteor.angle) * headRadius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const positionAttr = geometry.getAttribute('position');
    if (positionAttr) positionAttr.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.004;
    }
  });

  return (
    <group ref={groupRef} name="meteor-shower">
      <points geometry={geometry} material={material} />
    </group>
  );
}

export default MeteorShower;
