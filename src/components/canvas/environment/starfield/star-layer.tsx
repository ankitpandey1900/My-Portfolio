'use client';

import * as React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateStarLayer } from './star-generator';
import { createStarMaterial } from './star-material';
import type { StarLayerConfig } from './starfield-config';

interface StarLayerProps {
  config: StarLayerConfig;
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
export function StarLayer({ config }: StarLayerProps) {
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

    // Compute bounding sphere for frustum culling
    geo.computeBoundingSphere();

    const mat = createStarMaterial(dpr);

    return { geometry: geo, material: mat };
  }, [config, gl]);

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
