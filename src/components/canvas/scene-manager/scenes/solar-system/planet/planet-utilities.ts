import * as THREE from 'three';
import { calculateCircularPosition } from '../orbit/orbit-math';
import type { OrbitConfig } from '../orbit/orbit-types';
import type { PlanetManifestEntry } from './planet-manifest';

/** Legacy scale — planet-generator now distributes start angles evenly. */
export const ORBIT_START_ANGLE_SCALE = 0.45;

export function resolveOrbitStartAngle(order: number, total = 8): number {
  return ((order - 1) / total) * Math.PI * 2 + 0.55;
}

export function resolveOrbitInclination(order: number): number {
  return ((order - 1) % 5 - 2) * 1.35;
}

export function resolveOrbitEccentricity(order: number): number {
  return order % 3 === 0 ? 0.07 : 0.035;
}

export function buildPlanetOrbitConfig(entry: PlanetManifestEntry, total: number): OrbitConfig {
  return {
    id: `orbit-${entry.id}`,
    parentId: 'sun',
    radius: entry.orbitRadius,
    speed: entry.orbitSpeed,
    direction: entry.order % 2 === 0 ? 1 : -1,
    inclination: resolveOrbitInclination(entry.order),
    eccentricity: resolveOrbitEccentricity(entry.order),
    startAngle: resolveOrbitStartAngle(entry.order, total),
    clockwise: entry.order % 4 === 0,
    paused: false,
    visible: true,
    qualityPreset: entry.qualityPreset,
    debugEnabled: false,
  };
}

/**
 * Computes the circular orbit x, z coordinates based on elapsed time ticks.
 * @deprecated Prefer resolvePlanetWorldPosition for camera + visual parity.
 */
export function calculateOrbitPosition(
  orbitRadius: number,
  orbitSpeed: number,
  time: number,
  timeScale: number = 1.0,
  speedMultiplier: number = 1.0
): THREE.Vector3 {
  const angle = time * orbitSpeed * timeScale * speedMultiplier;
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  return new THREE.Vector3(x, 0, z);
}

/**
 * Resolves a planet's world position using the same orbit math as OrbitController.
 */
export function resolvePlanetWorldPosition(
  entry: Pick<PlanetManifestEntry, 'orbitRadius' | 'orbitSpeed' | 'order' | 'tilt'>,
  elapsedSeconds: number,
  timeScale = 1.0,
  orbitMultiplier = 1.0
): THREE.Vector3 {
  const direction = entry.order % 2 === 0 ? 1 : -1;
  return calculateCircularPosition(
    entry.orbitRadius,
    entry.orbitSpeed,
    elapsedSeconds,
    resolveOrbitStartAngle(entry.order),
    entry.order % 4 === 0,
    resolveOrbitInclination(entry.order),
    direction as 1 | -1,
    timeScale,
    orbitMultiplier,
    resolveOrbitEccentricity(entry.order)
  );
}

/**
 * Converts degree coordinates into radians.
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
