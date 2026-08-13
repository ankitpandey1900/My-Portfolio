'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { useSolarSystem } from '../solar-system-provider';
import { useSolarSystemSimulation } from '../solar-system-store';
import { calculateCircularPosition } from './orbit-math';
import { useOrbit } from './orbit-provider';

interface OrbitControllerProps {
  children: React.ReactNode;
}

/**
 * OrbitController wraps dynamic translations:
 * It calculates the next orbital coordinates inside useFrame and moves
 * children groups to update positions on the Canvas.
 */
export function OrbitController({ children }: OrbitControllerProps) {
  const { config, state } = useOrbit();
  const isRenderActive = useStore((state) => state.isRenderActive);

  const groupRef = React.useRef<THREE.Group>(null);

  // Extract speed multipliers from parent Solar System context safely
  let timeScale = 1.0;
  let orbitMultiplier = 1.0;
  try {
    const solarSystem = useSolarSystem();
    timeScale = solarSystem.config.timeScale;
    orbitMultiplier = solarSystem.config.orbitSpeedMultiplier;
  } catch {
    // Fallback if rendered outside SolarSystemProvider context
  }

  // Position updates loop executed on every frame
  useFrame(() => {
    if (!isRenderActive || state === 'paused' || state === 'stopped') return;

    const simState = useSolarSystemSimulation.getState();
    const elapsed = simState.accumulatedTime;

    if (groupRef.current) {
      // Calculate coordinates dynamically on the CPU and copy to Three group mesh
      const pos = calculateCircularPosition(
        config.radius,
        config.speed,
        elapsed,
        config.startAngle,
        config.clockwise,
        config.inclination,
        config.direction,
        timeScale,
        orbitMultiplier,
        config.eccentricity
      );
      groupRef.current.position.copy(pos);
    }
  });

  return (
    <group ref={groupRef} name={`orbit-controlled-${config.id}`}>
      {children}
    </group>
  );
}
export default OrbitController;

