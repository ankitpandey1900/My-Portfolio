'use client';

import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../camera-presets';
import { PlanetRegistry } from '../../scene-manager/scenes/solar-system/planet/planet-registry';
import { DEFAULT_SOLAR_CONFIG } from '../../scene-manager/scenes/solar-system/solar-system-config';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { CameraAnimator } from './camera-animator';
import { CameraPathGenerator } from './camera-path-generator';
import { CameraTargetResolver } from './camera-target-resolver';
import { useCameraTravelStore } from './camera-travel-state';

/**
 * CameraTravelController
 * Frame-independent path traversal with focused-orbit tracking after arrival.
 */
export function CameraTravelController() {
  const { camera } = useThree();

  const activePathRef = React.useRef<{
    posFn: (t: number) => THREE.Vector3;
    lookFn: (t: number) => THREE.Vector3;
    startTime: number;
    duration: number;
    easing: (t: number) => number;
    baseFov: number;
    isLongDistance: boolean;
  } | null>(null);

  const focusedTargetIdRef = React.useRef<string | null>(null);

  useFrame((state) => {
    const store = useCameraTravelStore.getState();

    if (store.state === 'preparing' && store.currentRequest) {
      let endPos: THREE.Vector3;
      let endLook: THREE.Vector3;

      const durationSec = (store.currentRequest.durationMs || 3200) / 1000;

      if (store.currentRequest.targetId) {
        const planetEntry = PlanetRegistry.get(store.currentRequest.targetId);
        const planetRadius = planetEntry?.radius ?? 2;
        const planetPos = CameraTargetResolver.resolvePlanetPosition(
          store.currentRequest.targetId,
          state.clock.getElapsedTime() + durationSec * 0.85
        );
        endPos = CameraTargetResolver.resolveViewingPosition(
          planetPos,
          planetRadius,
          planetEntry?.cameraDistance
            ? planetEntry.cameraDistance * (store.currentRequest.cameraDistanceScale ?? 1)
            : undefined
        );
        // Base look target is the planet
        endLook = planetPos.clone();
        
        // UI Framing Offset: 
        // Calculate the 'right' vector relative to the camera's final viewing angle.
        // We shift the camera's focus slightly to the right so the planet naturally sits 
        // on the left side of the screen, leaving perfect room for the UI panel on desktop.
        const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
        if (isDesktop) {
          const viewDir = planetPos.clone().sub(endPos).normalize();
          const rightDir = viewDir.cross(new THREE.Vector3(0, 1, 0)).normalize();
          // Scale offset by planet radius so large planets get more breathing room
          endLook.add(rightDir.multiplyScalar(planetRadius * 1.25));
        }
        
        focusedTargetIdRef.current = store.currentRequest.targetId;
      } else {
        endPos = new THREE.Vector3(
          ...(store.currentRequest.targetPosition || CAMERA_PRESETS.galaxy.position)
        );
        endLook = new THREE.Vector3(
          ...(store.currentRequest.targetLookAt || CAMERA_PRESETS.galaxy.lookAt)
        );
        focusedTargetIdRef.current = null;
      }

      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.add(camera.position);

      activePathRef.current = {
        posFn: CameraPathGenerator.generateCurve(camera.position.clone(), endPos),
        lookFn: CameraPathGenerator.generateLookAtPath(currentLookAt, endLook),
        startTime: state.clock.getElapsedTime(),
        duration: durationSec,
        easing: CameraAnimator.getEasingFunction(store.currentRequest.easing),
        baseFov: (camera as THREE.PerspectiveCamera).fov || 45,
        isLongDistance: camera.position.distanceTo(endPos) > 25,
      };

      store.setState('travelling');
    }

    if (store.state === 'travelling' && activePathRef.current) {
      const elapsed = state.clock.getElapsedTime() - activePathRef.current.startTime;
      const progress = CameraAnimator.calculateProgress(
        elapsed * 1000,
        activePathRef.current.duration * 1000
      );

      const easedProgress = activePathRef.current.easing(progress);
      const nextPos = activePathRef.current.posFn(easedProgress);
      const nextLook = activePathRef.current.lookFn(easedProgress);

      camera.position.copy(nextPos);
      camera.lookAt(nextLook);
      
      // Apply Warp Speed FOV stretching
      if (activePathRef.current.isLongDistance) {
        const warpAmount = Math.sin(progress * Math.PI) * 45; // stretches up to +45 degrees
        const perspCamera = camera as THREE.PerspectiveCamera;
        if (perspCamera.fov !== undefined) {
          perspCamera.fov = activePathRef.current.baseFov + warpAmount;
          perspCamera.updateProjectionMatrix();
        }
      }

      store.setProgress(progress);

      if (progress >= 1.0) {
        store.setState('idle');
        
        // Restore FOV to normal
        if (activePathRef.current.isLongDistance) {
          const perspCamera = camera as THREE.PerspectiveCamera;
          if (perspCamera.fov !== undefined) {
            perspCamera.fov = activePathRef.current.baseFov;
            perspCamera.updateProjectionMatrix();
          }
        }
        
        // Sync the OrbitControls target so it doesn't snap back when re-enabled
        if (state.controls) {
          (state.controls as any).target.copy(nextLook);
        }

        store.currentRequest?.onComplete?.();
      }
    }

    if (store.state === 'idle' && focusedTargetIdRef.current) {
      const navState = useNavigationStore.getState().state;
      if (navState !== 'viewingSection') {
        focusedTargetIdRef.current = null;
      }
    }

    if (store.state === 'idle' && focusedTargetIdRef.current) {
      const navState = useNavigationStore.getState().state;
      if (navState !== 'viewingSection') return;

      const planetEntry = PlanetRegistry.get(focusedTargetIdRef.current);
      if (planetEntry) {
        const elapsed = state.clock.getElapsedTime();
        const planetPos = CameraTargetResolver.resolvePlanetPosition(
          focusedTargetIdRef.current,
          elapsed,
          DEFAULT_SOLAR_CONFIG.timeScale,
          DEFAULT_SOLAR_CONFIG.orbitSpeedMultiplier
        );
        const viewPos = CameraTargetResolver.resolveViewingPosition(
          planetPos,
          planetEntry.radius,
          planetEntry.cameraDistance
            ? planetEntry.cameraDistance * (store.currentRequest?.cameraDistanceScale ?? 1)
            : undefined
        );

        camera.position.lerp(viewPos, 0.06);
        camera.lookAt(planetPos);
      }
    }
  });

  return null;
}
