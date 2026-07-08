'use client';

import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { generateStarLayer } from './star-generator';
import { createStarMaterial } from './star-material';
import type { StarLayerConfig } from './starfield-types';

interface StarLayerProps {
  config: StarLayerConfig;
  globalOpacity: number;
  globalSize: number;
  globalTwinkleSpeed: number;
}

/**
 * Renders a single layer of stars using THREE.Points.
 *
 * One StarLayer = one draw call, regardless of star count.
 * Geometry and material are created in useMemo and disposed on unmount.
 *
 * The component is intentionally stateless — it does not subscribe to
 * any Zustand state. The parent Starfield component handles quality
 * tier selection and passes the appropriate config.
 */
export function StarLayer({
  config,
  globalOpacity,
  globalSize,
  globalTwinkleSpeed,
}: StarLayerProps) {
  const isRenderActive = useStore((state) => state.isRenderActive);
  const { gl } = useThree();
  const pointsRef = React.useRef<THREE.Points>(null);

  // Generate geometry data deterministically from the config seed.
  // Only regenerates when the config object reference changes.
  const { geometry, material } = React.useMemo(() => {
    const data = generateStarLayer(config);
    const dpr = gl.getPixelRatio();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(data.sizes, 1));
    geo.setAttribute('aBrightness', new THREE.Float32BufferAttribute(data.brightnesses, 1));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(data.colors, 3));
    geo.setAttribute('aPhaseOffset', new THREE.Float32BufferAttribute(data.phaseOffsets, 1));

    // Compute bounding sphere for frustum culling
    geo.computeBoundingSphere();

    const mat = createStarMaterial(dpr);

    return { geometry: geo, material: mat };
  }, [config.count, config.seed, config.radiusInner, config.radiusOuter, gl]);

  // Imperative uniform syncing to bypass WebGL recompilations
  React.useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    if (material.uniforms.uOpacity) material.uniforms.uOpacity.value = globalOpacity;
    if (material.uniforms.uSizeMultiplier) material.uniforms.uSizeMultiplier.value = globalSize;
    if (material.uniforms.uTwinkleSpeed) material.uniforms.uTwinkleSpeed.value = globalTwinkleSpeed;
    /* eslint-enable react-hooks/immutability */
  }, [material, globalOpacity, globalSize, globalTwinkleSpeed]);

  // Animate twinkling via useFrame if not suspended
  useFrame((state) => {
    if (!isRenderActive) return;

    const elapsed = state.clock.getElapsedTime();
    if (material.uniforms.uTime) {
      // eslint-disable-next-line react-hooks/immutability
      material.uniforms.uTime.value = elapsed;
    }
  });

  // Dispose GPU resources on unmount
  React.useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      name={`star-layer-${config.id}`}
      frustumCulled={false}
    />
  );
}
export default StarLayer;
