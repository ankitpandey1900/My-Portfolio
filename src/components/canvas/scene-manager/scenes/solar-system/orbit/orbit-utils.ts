import * as THREE from 'three';

/**
 * Pre-allocates coordinate vertices representing a tilted orbit path ring.
 * Avoids on-the-fly heap allocations during render loops.
 */
export function generateOrbitLinePoints(
  radius: number,
  inclination: number = 0.0,
  segments: number = 128
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const inclinationRad = (inclination * Math.PI) / 180;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Apply tilt around X axis
    const rotatedX = x;
    const rotatedY = z * Math.sin(inclinationRad);
    const rotatedZ = z * Math.cos(inclinationRad);

    points.push(new THREE.Vector3(rotatedX, rotatedY, rotatedZ));
  }

  return points;
}
export default generateOrbitLinePoints;

