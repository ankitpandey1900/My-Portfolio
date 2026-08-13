import * as THREE from 'three';

// 3D Simplex Noise definition for seamless spherical rendering
const simplexNoiseGlsl = /* glsl */ `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - D.yyy;      // x3 = x0 - 1. + 3.0 * C.xxx

    // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }
`;

const coreVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vLocalPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreFragmentShader = /* glsl */ `
  uniform vec3 uCoreColor;
  uniform vec3 uGlowColor;
  uniform float uTime;
  uniform int uNoiseOctaves;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vLocalPosition;

  ${simplexNoiseGlsl}

  // Fractional Brownian Motion (fBm) to generate turbulence layers
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      if (i >= uNoiseOctaves) break;
      value += amplitude * snoise(p * frequency);
      frequency *= 2.2;
      amplitude *= 0.45;
    }
    return value;
  }

  void main() {
    vec3 noiseCoords = (vLocalPosition * 0.52) + vec3(uTime * 0.12, uTime * 0.07, uTime * 0.05);
    float granulation = fbm(noiseCoords);
    float cells = fbm(noiseCoords * 2.8 + vec3(uTime * 0.08));
    float plasmaValue = smoothstep(-0.2, 0.5, granulation);

    vec3 color = mix(uCoreColor, uGlowColor, plasmaValue);
    color = mix(color, uGlowColor * 1.15, smoothstep(0.45, 0.75, cells) * 0.22);

    vec3 brightColor = vec3(1.0, 0.96, 0.88) * uIntensity;
    color = mix(color, brightColor, smoothstep(0.55, 0.85, granulation) * 0.18);

    float limb = pow(max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 0.55);
    color *= mix(0.78, 1.0, limb);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const glowVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const glowFragmentShader = /* glsl */ `
  uniform vec3 uGlowColor;
  uniform float uGlowOpacity;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    // Normal direction vs View direction dot product (Fresnel scattering effect)
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    float intensity = dot(normal, viewDir);

    // Inverse dot product to map glow at geometry edges (scattering glow falloff)
    intensity = pow(1.0 - intensity, 2.4);
    gl_FragColor = vec4(uGlowColor * intensity * 1.25, intensity * uGlowOpacity);
  }
`;

const coronaVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vLocalPosition;

  void main() {
    vUv = uv;
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coronaFragmentShader = /* glsl */ `
  uniform vec3 uGlowColor;
  uniform float uTime;
  uniform float uCoronaOpacity;
  uniform float uCoronaSpeed;

  varying vec2 vUv;
  varying vec3 vLocalPosition;

  ${simplexNoiseGlsl}

  void main() {
    // Calculate polar coordinates centered on the billboard plane
    vec2 centerCoords = vUv - vec2(0.5);
    float dist = length(centerCoords);

    // Discard pixels past outer corona boundary
    if (dist > 0.5) discard;

    // Convert to angle [0, 2PI]
    float angle = atan(centerCoords.y, centerCoords.x);

    // Coordinates mapping to swirling corona noise (wispy filaments)
    vec3 noiseCoords = vec3(cos(angle) * 1.8, sin(angle) * 1.8, dist * 2.8 - uTime * uCoronaSpeed);
    float noiseVal = snoise(noiseCoords);

    // Radial falloff: wispy filaments fade out at edges
    float edgeFalloff = smoothstep(0.5, 0.1, dist);
    float coreFalloff = smoothstep(0.08, 0.28, dist);

    float intensity = smoothstep(-0.25, 0.35, noiseVal) * edgeFalloff * coreFalloff;

    gl_FragColor = vec4(uGlowColor * intensity * 1.15, intensity * uCoronaOpacity);
  }
`;

export function createSunCoreMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: coreVertexShader,
    fragmentShader: coreFragmentShader,
    uniforms: {
      uCoreColor: { value: new THREE.Color('#ff5500') },
      uGlowColor: { value: new THREE.Color('#ffcc33') },
      uTime: { value: 0 },
      uNoiseOctaves: { value: 4 },
      uIntensity: { value: 2.2 },
    },
    transparent: false,
    depthWrite: true,
  });
}

export function createSunGlowMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    uniforms: {
      uGlowColor: { value: new THREE.Color('#ffaa00') },
      uGlowOpacity: { value: 0.7 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide, // Render on back side slightly scaled up
  });
}

export function createSunCoronaMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: coronaVertexShader,
    fragmentShader: coronaFragmentShader,
    uniforms: {
      uGlowColor: { value: new THREE.Color('#ffaa00') },
      uTime: { value: 0 },
      uCoronaOpacity: { value: 0.45 },
      uCoronaSpeed: { value: 0.05 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

