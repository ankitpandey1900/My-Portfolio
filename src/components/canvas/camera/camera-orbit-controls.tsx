'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { PlanetRegistry } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-registry';
import { DEFAULT_SOLAR_CONFIG } from '@/components/canvas/scene-manager/scenes/solar-system/solar-system-config';
import { CameraTargetResolver } from './travel/camera-target-resolver';
import { useCameraTravelStore } from './travel/camera-travel-state';

/**
 * Manual orbit controls — full 360° when exploring a focused planet.
 */
export function CameraOrbitControls() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const currentPlanetId = useNavigationStore((s) => s.currentPlanetId);
  const travelState = useCameraTravelStore((s) => s.state);
  const { controls } = useThree() as { controls: OrbitControlsImpl | null };

  const targetRef = React.useRef(new THREE.Vector3(0, 0, 0));
  const planetTargetRef = React.useRef(new THREE.Vector3(0, 0, 0));
  const originRef = React.useRef(new THREE.Vector3(0, 0, 0));

  const inSystem = heroPhase === 'dismissed' || heroPhase === 'idle';
  const travelling = travelState === 'preparing' || travelState === 'travelling';
  const inSection = navState === 'viewingSection';
  const exploringPlanet = navState === 'focused' && Boolean(currentPlanetId);
  const enabled = inSystem && !travelling && !inSection;

  const focusedPlanet = exploringPlanet ? PlanetRegistry.get(currentPlanetId!) : null;
  const minDistance = exploringPlanet
    ? Math.max((focusedPlanet?.radius ?? 1) * 1.65, 2.5)
    : 6;
  const maxDistance = exploringPlanet ? Math.max((focusedPlanet?.cameraDistance ?? 8) * 2.4, 48) : 220;

  const previousPlanetPosRef = React.useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!controls || !enabled) {
      // Reset tracking state if disabled
      previousPlanetPosRef.current.set(0, 0, 0);
      return;
    }

    if (exploringPlanet && currentPlanetId) {
      const planetPos = CameraTargetResolver.resolvePlanetPosition(
        currentPlanetId,
        state.clock.getElapsedTime(),
        DEFAULT_SOLAR_CONFIG.timeScale,
        DEFAULT_SOLAR_CONFIG.orbitSpeedMultiplier
      );
      
      // If we already have a previous position, calculate how much the planet moved
      if (previousPlanetPosRef.current.lengthSq() > 0) {
        const delta = new THREE.Vector3().subVectors(planetPos, previousPlanetPosRef.current);
        
        // Move both the controls target and the camera itself by the delta 
        // to stay locked onto the moving planet without fighting manual panning.
        controls.target.add(delta);
        state.camera.position.add(delta);
      }
      
      previousPlanetPosRef.current.copy(planetPos);
    } else {
      // Not exploring a planet, reset the tracking ref
      previousPlanetPosRef.current.set(0, 0, 0);
    }

    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.maxPolarAngle = Math.PI; // Full 360 exploration
    controls.minPolarAngle = 0.01; // Avoid exact gimbal lock at 0
    controls.update();
  });

  return (
    <OrbitControls
      makeDefault
      enabled={enabled}
      enablePan
      enableZoom
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={exploringPlanet ? 0.72 : 0.55}
      zoomSpeed={0.85}
      panSpeed={0.65}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={Math.PI} // Full 360 exploration
      minPolarAngle={0.01}
      target={[0, 0, 0]}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}

export default CameraOrbitControls;
