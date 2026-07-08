'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useStore } from '@/lib/store';
import { OrbitController } from './orbit-controller';
import { OrbitManager } from './orbit-manager';
import { useOrbit } from './orbit-provider';
import { generateOrbitLinePoints } from './orbit-utils';

interface OrbitComponentProps {
  children: React.ReactNode;
}

function OrbitPath() {
  const { config } = useOrbit();
  const quality = useStore((state) => state.quality);

  const points = React.useMemo(
    () => generateOrbitLinePoints(config.radius, config.inclination, quality === 'low' ? 96 : 160),
    [config.inclination, config.radius, quality]
  );

  if (!config.visible) return null;

  return (
    <Line
      points={points}
      color="#ffffff"
      transparent
      opacity={0.12}
      lineWidth={1.5}
      dashed={true}
      dashScale={Math.max(10, config.radius * 2)}
      dashSize={1}
      gapSize={1}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      name={`orbit-path-${config.id}`}
    />
  );
}

/**
 * OrbitComponent composes motion, optional path ring, and child positioning.
 */
export function OrbitComponent({ children }: OrbitComponentProps) {
  const { config } = useOrbit();

  return (
    <group name={`orbit-system-group-${config.id}`}>
      <OrbitManager />
      <OrbitPath />
      <OrbitController>{children}</OrbitController>
    </group>
  );
}
export default OrbitComponent;
