import * as THREE from 'three';

/**
 * GLSL code containing a fast, GPU-friendly 3D Simplex Noise algorithm.
 * Based on Ashima Arts / Stefan Gustavson implementation.
 *
 * Coordinates are passed directly from the local position vectors,
 * avoiding any UV coordinate stretching or polar pinching.
 */
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
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
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

const vertexShader = /* glsl */ `
  varying vec3 vLocalPosition;

  void main() {
    vLocalPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;
  uniform float uScale;
  uniform float uTime;
  uniform float uSpeed;
  uniform int uNoiseOctaves;

  varying vec3 vLocalPosition;

  ${simplexNoiseGlsl}

  // Fractional Brownian Motion (fBm) to layer Simplex Noise octaves
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 4; i++) {
      if (i >= uNoiseOctaves) break;
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Add dynamic time drift vector to the coordinates
    vec3 drift = vec3(uTime * uSpeed, uTime * uSpeed * 0.5, uTime * uSpeed * 0.3);
    vec3 sampleCoords = (vLocalPosition * uScale) + drift;

    // Get fBm noise in range [-0.5, 0.5] approximate
    float n = fbm(sampleCoords);

    // Rescale noise to [0, 1] range for thresholding
    float gasDensity = smoothstep(-0.25, 0.45, n);

    // Apply color gradient based on density
    vec3 blendedColor = mix(uColor2, uColor1, smoothstep(0.0, 0.8, gasDensity));
    vec3 finalColor = blendedColor * gasDensity;

    // Output transparent alpha values corresponding directly to density maps
    gl_FragColor = vec4(finalColor, gasDensity * uOpacity);
  }
`;

/**
 * Creates custom ShaderMaterial mapping 3D noise values to spherical shells.
 */
export function createNebulaMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor1: { value: new THREE.Color('#580bb5') },
      uColor2: { value: new THREE.Color('#2b0559') },
      uOpacity: { value: 1.0 },
      uScale: { value: 0.003 },
      uTime: { value: 0 },
      uSpeed: { value: 0.01 },
      uNoiseOctaves: { value: 3 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide, // Render inside the sphere shell
  });
}

