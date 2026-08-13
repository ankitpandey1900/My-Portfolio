'use client';

import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { useCameraTravelStore } from './travel/camera-travel-state';

type OrbitControlsInternal = OrbitControlsImpl & {
  _sphericalDelta?: THREE.Spherical;
};

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

function normalizeKey(event: KeyboardEvent): string {
  if (event.key === 'Shift') return 'shift';
  return event.key.toLowerCase();
}

const MOVEMENT_KEYS = new Set([
  'w',
  'a',
  's',
  'd',
  'q',
  'e',
  '=',
  '+',
  '-',
  '_',
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
]);

/**
 * WASD keyboard flight — runs after OrbitControls and syncs spherical state.
 */
export function CameraKeyboardControls() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const travelState = useCameraTravelStore((s) => s.state);

  const keysRef = React.useRef<Set<string>>(new Set());
  const sphericalRef = React.useRef(new THREE.Spherical());
  const offsetRef = React.useRef(new THREE.Vector3());
  const { controls } = useThree() as { controls: OrbitControlsImpl | null };

  const inSystem = heroPhase === 'dismissed' || heroPhase === 'idle';
  const travelling = travelState === 'preparing' || travelState === 'travelling';
  const inSection = navState === 'viewingSection';
  const enabled = inSystem && !travelling && !inSection;

  React.useEffect(() => {
    if (!enabled) {
      keysRef.current.clear();
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isFormField(event.target)) return;
      const key = normalizeKey(event);
      if (!MOVEMENT_KEYS.has(key) && key !== 'shift') return;
      event.preventDefault();
      keysRef.current.add(key);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(normalizeKey(event));
    };

    const onBlur = () => keysRef.current.clear();

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', onBlur);
      keysRef.current.clear();
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled || !controls) return;

    const keys = keysRef.current;
    if (keys.size === 0) return;

    const orbit = controls as OrbitControlsInternal;
    const fast = keys.has('shift');
    const rotateSpeed = (fast ? 2.4 : 1.4) * delta;
    const panSpeed = (fast ? 24 : 14) * delta;
    const zoomFactor = fast ? 0.968 : 0.982;

    orbit.enableDamping = false;
    orbit._sphericalDelta?.set(0, 0, 0);

    const camera = orbit.object;
    const target = orbit.target;
    const offset = offsetRef.current;
    const spherical = sphericalRef.current;

    offset.copy(camera.position).sub(target);
    spherical.setFromVector3(offset);

    if (keys.has('a') || keys.has('arrowleft')) spherical.theta += rotateSpeed;
    if (keys.has('d') || keys.has('arrowright')) spherical.theta -= rotateSpeed;
    if (keys.has('w') || keys.has('arrowup')) {
      spherical.phi = Math.max(orbit.minPolarAngle + 0.01, spherical.phi - rotateSpeed);
    }
    if (keys.has('s') || keys.has('arrowdown')) {
      spherical.phi = Math.min(orbit.maxPolarAngle - 0.01, spherical.phi + rotateSpeed);
    }

    if (keys.has('q')) target.y += panSpeed;
    if (keys.has('e')) target.y -= panSpeed;

    if (keys.has('=') || keys.has('+')) {
      spherical.radius = Math.max(orbit.minDistance, spherical.radius * zoomFactor);
    }
    if (keys.has('-') || keys.has('_')) {
      spherical.radius = Math.min(orbit.maxDistance, spherical.radius / zoomFactor);
    }

    offset.setFromSpherical(spherical);
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
    orbit.update();
  }, 1);

  useFrame(() => {
    if (!enabled || !controls) return;
    if (keysRef.current.size === 0) {
      controls.enableDamping = true;
    }
  }, 2);

  return null;
}

export default CameraKeyboardControls;

