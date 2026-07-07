'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import type { NebulaLayerConfig } from './nebula-config';
import { createNebulaMaterial } from './nebula-material';

interface NebulaLayerProps {
  config: NebulaLayerConfig;
  globalIntensity: number;
}

/**
 * NebulaLayer renders a single concentric sphere shell.
 * It animates the noise drift inside the frame loop using uTime.
 */
export function NebulaLayer({ config, globalIntensity }: NebulaLayerProps) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const isRenderActive = useStore((state) => state.isRenderActive);

  // Memoize geometry and custom material
  const { geometry, material } = React.useMemo(() => {
    // 32 x 32 segments is sufficient for a simple spherical shell mapping coordinates
    const geo = new THREE.SphereGeometry(config.radius, 32, 32);
    const mat = createNebulaMaterial();

    // Map configuration values to shader uniforms
    if (mat.uniforms.uColor) mat.uniforms.uColor.value.set(config.color);
    if (mat.uniforms.uScale) mat.uniforms.uScale.value = config.scale;
    if (mat.uniforms.uSpeed) mat.uniforms.uSpeed.value = config.speed;
    if (mat.uniforms.uNoiseOctaves) mat.uniforms.uNoiseOctaves.value = config.octaves;

    return { geometry: geo, material: mat };
  }, [config]);

  // Sync dynamic opacity from store/debug states
  React.useEffect(() => {
    if (material.uniforms.uOpacity) {
      // eslint-disable-next-line react-hooks/immutability
      material.uniforms.uOpacity.value = config.opacity * globalIntensity;
    }
  }, [material, config.opacity, globalIntensity]);

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
    const elapsed = state.clock.getElapsedTime();
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
