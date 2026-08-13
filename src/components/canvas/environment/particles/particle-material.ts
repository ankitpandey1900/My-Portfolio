import * as THREE from 'three';

const vertexShader = /* glsl */ `
  attribute vec3 aInstancePositionStart;
  attribute vec3 aVelocity;
  attribute vec3 aAcceleration;
  attribute vec3 aColorStart;
  attribute vec3 aColorEnd;
  attribute float aSize;
  attribute vec2 aRotationParams; // [startRotation, rotationSpeed]
  attribute vec2 aTimeParams;     // [startTime, lifetime]
  attribute vec2 aOpacityParams;  // [opacityStart, opacityEnd]

  uniform float uTime;
  uniform float uDprScale;

  varying vec3 vColor;
  varying float vOpacity;
  varying vec2 vUv;

  // Simplex 3D Noise for organic drift
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float startTime = aTimeParams.x;
    float lifetime = aTimeParams.y;
    
    // Determine age of particle
    float age = uTime - startTime;
    
    // If not born yet or already dead, render out of view
    if (age < 0.0 || age > lifetime) {
      gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
      vOpacity = 0.0;
      return;
    }

    // Normalized life [0.0 -> 1.0]
    float lifeRatio = age / lifetime;
    
    // Calculate simulated position
    vec3 currentPos = aInstancePositionStart + (aVelocity * age) + (0.5 * aAcceleration * age * age);
    
    // Add organic noise drift (amplitude peaks in middle of life)
    float noiseOffset = snoise(vec3(currentPos.x * 0.5, currentPos.y * 0.5, uTime * 0.2));
    currentPos += vec3(noiseOffset, noiseOffset * 0.5, noiseOffset * 0.2) * sin(lifeRatio * 3.14159) * 2.0;

    // Billboarding (face camera)
    // Extract camera right and up vectors from modelViewMatrix
    vec3 cameraRight = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
    vec3 cameraUp = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);
    
    // Calculate rotation
    float currentRotation = aRotationParams.x + (aRotationParams.y * age);
    float c = cos(currentRotation);
    float s = sin(currentRotation);
    
    // Rotate quad vertices
    vec3 rotatedPos = vec3(
      position.x * c - position.y * s,
      position.x * s + position.y * c,
      0.0
    );
    
    // Scale quad
    rotatedPos *= aSize;
    
    // Apply billboarding relative to world position
    vec3 finalWorldPos = currentPos + (cameraRight * rotatedPos.x) + (cameraUp * rotatedPos.y);

    vec4 mvPosition = viewMatrix * vec4(finalWorldPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Output varyings
    vColor = mix(aColorStart, aColorEnd, lifeRatio);
    
    // Smooth fade in/out curve
    float fade = smoothstep(0.0, 0.1, lifeRatio) * (1.0 - smoothstep(0.7, 1.0, lifeRatio));
    vOpacity = mix(aOpacityParams.x, aOpacityParams.y, lifeRatio) * fade;
    
    vUv = uv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vOpacity;
  varying vec2 vUv;

  void main() {
    // Radial soft particle falloff
    float dist = length(vUv - vec2(0.5));
    if (dist > 0.5) discard;

    float intensity = exp(-10.0 * dist * dist);
    
    // Core glow boost
    float core = smoothstep(0.5, 0.0, dist);
    intensity = mix(intensity, 1.0, core * 0.5);

    gl_FragColor = vec4(vColor * intensity, intensity * vOpacity);
  }
`;

export function createParticleMaterial(dprScale: number = 1): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uDprScale: { value: dprScale },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });
}

