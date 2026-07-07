'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';

export function LightingRig() {
  // Read renderer quality profiles to toggle shadow mapping settings
  const quality = useStore((state) => state.quality);
  const ambientIntensity = useStore((state) => state.ambientIntensity);

  return (
    <group name="lighting-rig">
      {/* 1. Ambient Light - Fills dark gaps with a subtle global illumination floor */}
      <ambientLight intensity={ambientIntensity} />

      {/* 2. Hemisphere Light - Simulates sky/ground cosmic color bounce (Nebula Violet to Space Black) */}
      <hemisphereLight args={['#580bb5', '#020205', 0.15]} />

      {/* 3. Point Light - Central energy emitter located at the Sun core [0, 0, 0] */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2.5}
        distance={200}
        decay={2}
        castShadow={quality === 'high'}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* 4. Directional Light - Secondary directional source to highlight structures details */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.4}
        castShadow={quality === 'high'}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </group>
  );
}
export default LightingRig;
