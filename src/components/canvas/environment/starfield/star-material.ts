import * as THREE from 'three';

/**
 * Vertex shader for star points.
 *
 * Reads per-vertex attributes for size and brightness, applies distance
 * attenuation so stars appear smaller when far from the camera, and
 * scales point size by device pixel ratio for consistent appearance
 * across DPR settings.
 */
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  attribute vec3 aColor;
  attribute float aPhaseOffset;

  uniform float uDprScale;
  uniform float uTime;
  uniform float uSizeMultiplier;
  uniform float uTwinkleSpeed;
  uniform float uDistanceScale;

  varying float vBrightness;
  varying vec3 vColor;

  void main() {
    // Twinkling effect: Sine wave modulated by time, speed, and offset
    float twinkle = sin(uTime * uTwinkleSpeed + aPhaseOffset) * 0.5 + 0.5;
    // Map twinkle to [0.3, 1.0] to prevent stars from completely disappearing
    float twinkleMod = mix(0.3, 1.0, twinkle);

    vBrightness = aBrightness * twinkleMod;
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Distance attenuation: stars shrink with distance from camera
    float distanceFactor = uDistanceScale / (-mvPosition.z);

    gl_PointSize = aSize * distanceFactor * uDprScale * uSizeMultiplier;

    // Clamp minimum size so distant stars remain visible as single pixels
    gl_PointSize = max(gl_PointSize, 0.5);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

/**
 * Fragment shader for star points.
 *
 * Renders soft circular points with radial falloff (no hard edges).
 * Uses a Gaussian-like falloff function for a natural star appearance.
 * The brightness attribute modulates the final alpha.
 */
const fragmentShader = /* glsl */ `
  uniform float uOpacity;

  varying float vBrightness;
  varying vec3 vColor;

  void main() {
    // Calculate distance from center of point sprite (gl_PointCoord is 0–1)
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Discard pixels outside the circular boundary
    if (dist > 0.5) discard;

    // Soft radial falloff — Gaussian-like profile for natural star glow
    float intensity = exp(-8.0 * dist * dist);

    // Core brightness boost — makes center brighter than edges
    float core = smoothstep(0.5, 0.0, dist);
    intensity = mix(intensity, 1.0, core * 0.3);

    gl_FragColor = vec4(vColor * intensity, intensity * vBrightness * uOpacity);
  }
`;

/**
 * Creates a custom ShaderMaterial for rendering star points.
 *
 * Features:
 * - Additive blending for realistic star glow (stars brighten when overlapping)
 * - Depth write disabled (stars are background, never occlude scene objects)
 * - Depth test enabled (scene objects correctly occlude stars)
 * - uTime uniform for future twinkling animation support
 * - uDprScale uniform for consistent sizing across DPR settings
 */
export function createStarMaterial(dprScale: number = 1): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1.0 },
      uDprScale: { value: dprScale },
      uSizeMultiplier: { value: 1.0 },
      uTwinkleSpeed: { value: 1.0 },
      uDistanceScale: { value: 300.0 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });
}
