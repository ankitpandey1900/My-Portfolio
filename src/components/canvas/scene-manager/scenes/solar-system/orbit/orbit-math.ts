import * as THREE from 'three';

/**
 * Calculates circular orbit coordinates based on dynamic parameters.
 * Separates physics math calculations from rendering engines.
 */
export function calculateCircularPosition(
  radius: number,
  speed: number,
  elapsed: number,
  startAngle: number = 0.0,
  clockwise: boolean = false,
  inclination: number = 0.0,
  direction: 1 | -1 = 1,
  timeScale: number = 1.0,
  speedMultiplier: number = 1.0,
  eccentricity: number = 0.0
): THREE.Vector3 {
  const directionMultiplier = direction * (clockwise ? -1 : 1);
  const angle = startAngle + elapsed * speed * directionMultiplier * timeScale * speedMultiplier;

  const clampedEccentricity = THREE.MathUtils.clamp(eccentricity, 0, 0.35);
  const orbitalRadius = radius * (1 - clampedEccentricity * Math.cos(angle));

  const x = Math.cos(angle) * orbitalRadius;
  const z = Math.sin(angle) * orbitalRadius;

  const inclinationRad = (inclination * Math.PI) / 180;
  const rotatedX = x;
  const rotatedY = z * Math.sin(inclinationRad);
  const rotatedZ = z * Math.cos(inclinationRad);

  return new THREE.Vector3(rotatedX, rotatedY, rotatedZ);
}
export default calculateCircularPosition;
