'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { createNebulaMaterial } from './nebula-material';
import type { NebulaLayerConfig } from './nebula-types';

interface NebulaLayerProps {
  config: NebulaLayerConfig;
  globalOpacity: number;
  globalDensity: number;
  globalSpeed: number;
  globalScale: number;
}

/**
 * NebulaLayer renders a single concentric sphere shell.
 * It animates the noise drift inside the frame loop using uTime.
 */
export function NebulaLayer({
  config,
  globalOpacity,
  globalDensity,
  globalSpeed,
  globalScale,
}: NebulaLayerProps) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const isRenderActive = useStore((state) => state.isRenderActive);

  // Memoize geometry and custom material based ONLY on structural requirements (radius)
  const { geometry, material } = React.useMemo(() => {
    // 32 x 32 segments is sufficient for a simple spherical shell mapping coordinates
    const geo = new THREE.SphereGeometry(config.radius, 32, 32);
    const mat = createNebulaMaterial();
    return { geometry: geo, material: mat };
  }, [config.radius]);

  // Sync dynamic configuration to shader uniforms
  React.useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    if (material.uniforms.uColor1) material.uniforms.uColor1.value.set(config.primaryColor);
    if (material.uniforms.uColor2) material.uniforms.uColor2.value.set(config.secondaryColor);
    if (material.uniforms.uScale) material.uniforms.uScale.value = config.scale * globalScale;
    if (material.uniforms.uSpeed) material.uniforms.uSpeed.value = config.speed * globalSpeed;
    if (material.uniforms.uNoiseOctaves) material.uniforms.uNoiseOctaves.value = config.octaves;
    /* eslint-enable react-hooks/immutability */
  }, [
    material,
    config.primaryColor,
    config.secondaryColor,
    config.scale,
    config.speed,
    config.octaves,
    globalScale,
    globalSpeed,
  ]);

  // Sync dynamic opacity from store/debug states
  React.useEffect(() => {
    if (material.uniforms.uOpacity) {
      // eslint-disable-next-line react-hooks/immutability
      material.uniforms.uOpacity.value = config.opacity * globalOpacity * globalDensity;
    }
  }, [material, config.opacity, globalOpacity, globalDensity]);

  // Dispose GPU resources on unmount
  React.useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Animate noise translation via time ticks in useFrame
  useFrame((state) => {
    if (!isRenderActive) return;
    const elapsed = state.clock.elapsedTime;
    if (material.uniforms.uTime) {
      // eslint-disable-next-line react-hooks/immutability
      material.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      name={`nebula-layer-${config.id}`}
    />
  );
}
export default NebulaLayer;

