import * as THREE from 'three';

/**
 * Math utility to generate cinematic splines and curves between camera coordinates.
 * Architecture-only (prepares quadratic arcs and linear lookat paths).
 */
export class CameraPathGenerator {
  /**
   * Generates a curved path interpolator function using Quadratic Bezier curves.
   * Future expansion: CatmullRomCurve3 for multi-point cinematic sweeps.
   */
  static generateCurve(start: THREE.Vector3, end: THREE.Vector3, controlPoint?: THREE.Vector3) {
    // Default to an upward arc if no control point is provided
    const cp =
      controlPoint ||
      start
        .clone()
        .lerp(end, 0.5)
        .add(new THREE.Vector3(0, Math.abs(start.distanceTo(end) * 0.2), 0));

    const curve = new THREE.QuadraticBezierCurve3(start, cp, end);

    return (t: number) => curve.getPoint(t);
  }

  /**
   * Generates a linear interpolation for the camera's lookAt vector to smoothly pan the lens.
   */
  static generateLookAtPath(startLook: THREE.Vector3, endLook: THREE.Vector3) {
    return (t: number) => {
      return startLook.clone().lerp(endLook, t);
    };
  }
}
