import * as THREE from 'three';

const SURFACE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function hashGlsl(): string {
  return /* glsl */ `
    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    }
    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
        f.z
      );
    }
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.05;
        amplitude *= 0.48;
      }
      return value;
    }
    float craterMask(vec3 p, float scale) {
      float n = fbm(p * scale);
      float pits = fbm(p * scale * 2.4 + 4.2);
      return smoothstep(0.52, 0.68, n) * (0.82 + pits * 0.28);
    }
  `;
}

function lightingGlsl(): string {
  return /* glsl */ `
    vec3 applyLighting(vec3 albedo, vec3 n, vec3 sunDir, vec3 viewDir, float roughness, float specStrength) {
      float ndl = dot(n, sunDir);
      float diffuse = max(ndl, 0.0);
      float terminator = smoothstep(-0.08, 0.22, ndl);
      vec3 halfDir = normalize(sunDir + viewDir);
      float spec = pow(max(dot(n, halfDir), 0.0), mix(12.0, 72.0, 1.0 - roughness));
      spec *= specStrength * (1.0 - roughness);
      float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.5) * 0.08;
      vec3 lit = albedo * (diffuse * 0.92 + 0.035) * terminator;
      lit += vec3(spec + fresnel);
      return lit;
    }
  `;
}

export function createEarthMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
      uTime: { value: 0 },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float landNoise = fbm(p * 3.2 + vec3(0.0, uTime * 0.008, 0.0));
        float cloudNoise = fbm(p * 5.5 + vec3(uTime * 0.012, 0.0, 0.0));
        float continent = smoothstep(0.4, 0.58, landNoise);

        vec3 ocean = vec3(0.04, 0.14, 0.26);
        vec3 land = vec3(0.1, 0.26, 0.16);
        vec3 desert = vec3(0.34, 0.26, 0.12);
        vec3 albedo = mix(ocean, mix(land, desert, smoothstep(0.52, 0.72, landNoise)), continent);
        albedo = mix(albedo, vec3(0.92, 0.94, 0.96), smoothstep(0.56, 0.78, cloudNoise) * 0.38);

        float ndl = dot(n, sunDir);
        float night = smoothstep(0.05, -0.12, ndl);
        float cityMask = fbm(p * 8.0) * continent;
        vec3 cityLights = vec3(1.0, 0.78, 0.38) * pow(cityMask, 2.2) * 1.8;
        float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
        vec3 atmosphere = vec3(0.42, 0.68, 0.95) * rim * 0.9;

        vec3 lit = albedo * (max(ndl, 0.0) * 0.92 + 0.04);
        lit += cityLights * night;
        lit += atmosphere;
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createMoonMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float craterField = craterMask(p, 9.0);
        float maria = fbm(p * 3.5);
        vec3 regolith = mix(vec3(0.44, 0.42, 0.4), vec3(0.26, 0.25, 0.24), maria);
        regolith *= craterField;

        float ndl = dot(n, sunDir);
        float diffuse = smoothstep(-0.02, 0.95, ndl);
        float night = smoothstep(0.0, -0.2, ndl);
        vec3 earthshine = vec3(0.08, 0.12, 0.18) * night * 0.35;
        float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.5);
        vec3 atmosphere = vec3(0.65, 0.78, 0.92) * rim * 0.16;

        vec3 lit = regolith * (diffuse * 0.95 + 0.02) + earthshine + atmosphere;
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createMarsMaterial(options: { hero?: boolean } = {}): THREE.ShaderMaterial {
  const hero = options.hero ?? false;
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
      uTime: { value: 0 },
      uDetail: { value: hero ? 1.35 : 1.0 },
      uRimBoost: { value: hero ? 0.14 : 0.08 },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      uniform float uTime;
      uniform float uDetail;
      uniform float uRimBoost;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}
      ${lightingGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);
        float lat = p.y;

        float terrain = fbm(p * (4.2 * uDetail) + vec3(uTime * 0.004, 0.0, 0.0));
        float canyons = fbm(p * vec3(1.2, 8.0, 1.2) * uDetail);
        float canyonMask = smoothstep(0.58, 0.72, canyons) * smoothstep(0.15, 0.0, abs(p.x + p.z * 0.35));

        vec3 rustHigh = vec3(0.72, 0.34, 0.18);
        vec3 rustLow = vec3(0.48, 0.2, 0.1);
        vec3 basalt = vec3(0.18, 0.1, 0.08);
        vec3 dust = vec3(0.82, 0.48, 0.28);

        vec3 albedo = mix(rustLow, rustHigh, terrain);
        albedo = mix(albedo, basalt, canyonMask * 0.65);
        albedo = mix(albedo, dust, smoothstep(0.62, 0.82, fbm(p * 7.0)) * 0.18);
        albedo *= 0.88 + craterMask(p, 6.5 * uDetail) * 0.18;

        float polar = smoothstep(0.72, 0.9, abs(lat));
        vec3 ice = vec3(0.92, 0.95, 0.98);
        albedo = mix(albedo, ice, polar * 0.88);

        vec3 lit = applyLighting(albedo, n, sunDir, viewDir, 0.82, 0.12);
        float dustHaze = pow(1.0 - max(dot(n, sunDir), 0.0), 2.0) * 0.08;
        lit += dust * dustHaze;

        float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.2);
        lit += vec3(0.95, 0.55, 0.32) * rim * uRimBoost;

        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createMercuryMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}
      ${lightingGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float craterField = craterMask(p, 11.0);
        float plains = fbm(p * 4.5);
        vec3 albedo = mix(vec3(0.42, 0.38, 0.34), vec3(0.28, 0.26, 0.24), plains);
        albedo *= craterField;

        vec3 lit = applyLighting(albedo, n, sunDir, viewDir, 0.95, 0.04);
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createVenusMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
      uTime: { value: 0 },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float swirl = fbm(p * 2.8 + vec3(uTime * 0.018, uTime * 0.012, 0.0));
        float streaks = fbm(p * vec3(0.8, 6.0, 0.8) + vec3(uTime * 0.008, 0.0, 0.0));
        vec3 gold = vec3(0.82, 0.62, 0.34);
        vec3 cream = vec3(0.95, 0.82, 0.58);
        vec3 albedo = mix(gold, cream, swirl);
        albedo = mix(albedo, vec3(0.72, 0.48, 0.28), streaks * 0.35);

        float ndl = max(dot(n, sunDir), 0.0);
        float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.8);
        vec3 lit = albedo * (ndl * 0.78 + 0.12);
        lit += cream * rim * 0.35;
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createPlutoMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
      uEmissiveIntensity: { value: 0.14 },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      uniform float uEmissiveIntensity;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}
      ${lightingGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float heart = smoothstep(0.35, 0.0, length(p.xz - vec2(0.25, 0.15)));
        float ice = fbm(p * 5.0);
        vec3 albedo = mix(vec3(0.42, 0.4, 0.38), vec3(0.78, 0.72, 0.66), ice);
        albedo = mix(albedo, vec3(0.88, 0.82, 0.74), heart * 0.55);

        vec3 lit = applyLighting(albedo, n, sunDir, viewDir, 0.9, 0.06);
        float night = smoothstep(0.05, -0.1, dot(n, sunDir));
        lit += vec3(0.85, 0.65, 0.38) * uEmissiveIntensity * night;
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createGasGiantMaterial(
  bands: [string, string, string],
  stormColor?: string
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
      uColorA: { value: new THREE.Color(bands[0]) },
      uColorB: { value: new THREE.Color(bands[1]) },
      uColorC: { value: new THREE.Color(bands[2]) },
      uStorm: { value: new THREE.Color(stormColor ?? bands[2]) },
      uTime: { value: 0 },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform vec3 uStorm;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float lat = p.y;
        float turbulence = fbm(p * 2.2 + vec3(uTime * 0.015, 0.0, 0.0));
        float bandMix = sin(lat * 16.0 + turbulence * 3.2 + uTime * 0.025) * 0.5 + 0.5;
        vec3 albedo = mix(uColorA, uColorB, bandMix);
        albedo = mix(albedo, uColorC, pow(abs(lat), 1.6) * 0.38);
        albedo = mix(albedo, uStorm, smoothstep(0.18, 0.0, length(p.xz - vec2(0.32, 0.08))) * 0.5);

        float ndl = max(dot(n, sunDir), 0.0);
        float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
        vec3 lit = albedo * (ndl * 0.88 + 0.08);
        lit += albedo * rim * 0.12;
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createIceGiantMaterial(
  deep: string,
  mid: string,
  highlight: string
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
      uDeep: { value: new THREE.Color(deep) },
      uMid: { value: new THREE.Color(mid) },
      uHighlight: { value: new THREE.Color(highlight) },
      uTime: { value: 0 },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      uniform vec3 uDeep;
      uniform vec3 uMid;
      uniform vec3 uHighlight;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float lat = p.y;
        float bandMix = sin(lat * 12.0 + fbm(p * 3.0) * 2.0 + uTime * 0.012) * 0.5 + 0.5;
        vec3 albedo = mix(uDeep, uMid, bandMix);
        albedo = mix(albedo, uHighlight, pow(abs(lat), 2.0) * 0.28);

        float storm = smoothstep(0.22, 0.0, length(p.xz - vec2(-0.2, 0.35)));
        albedo = mix(albedo, vec3(0.95, 0.98, 1.0), storm * 0.35);

        float ndl = max(dot(n, sunDir), 0.0);
        float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.8);
        vec3 lit = albedo * (ndl * 0.85 + 0.1);
        lit += vec3(0.55, 0.72, 0.92) * rim * 0.22;
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createRockyPlanetMaterial(
  colorA: string,
  colorB: string,
  emissive = '#000000',
  emissiveIntensity = 0
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uEmissive: { value: new THREE.Color(emissive) },
      uEmissiveIntensity: { value: emissiveIntensity },
    },
    vertexShader: SURFACE_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDirection;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uEmissive;
      uniform float uEmissiveIntensity;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;
      ${hashGlsl()}
      ${lightingGlsl()}

      void main() {
        vec3 n = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(vViewDirection);
        vec3 p = normalize(vWorldPosition);

        float surface = fbm(p * 5.0);
        vec3 albedo = mix(uColorA, uColorB, surface);
        albedo *= 0.86 + craterMask(p, 7.0) * 0.2;

        vec3 lit = applyLighting(albedo, n, sunDir, viewDir, 0.9, 0.06);
        float night = smoothstep(0.05, -0.1, dot(n, sunDir));
        lit += uEmissive * uEmissiveIntensity * night;
        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createHeroMarsAtmosphereMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    uniforms: {
      uColor: { value: new THREE.Color('#6ec8e8') },
      uDustColor: { value: new THREE.Color('#e89060') },
      uSunDirection: { value: new THREE.Vector3(-0.65, 0.28, -0.55).normalize() },
      uIntensity: { value: 0.85 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDirection = normalize(cameraPosition - worldPosition.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uDustColor;
      uniform vec3 uSunDirection;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 viewDir = normalize(vViewDirection);
        vec3 sunDir = normalize(uSunDirection);
        float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.8);
        float sunEdge = pow(max(dot(n, sunDir), 0.0), 0.42) * 0.48;
        vec3 color = mix(uColor, uDustColor, sunEdge * 0.35);
        float alpha = clamp((fresnel * 0.8 + sunEdge) * uIntensity, 0.0, 0.68);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

export function isShaderPlanetMaterial(
  material: THREE.Material
): material is THREE.ShaderMaterial {
  return material instanceof THREE.ShaderMaterial && 'uSunDirection' in material.uniforms;
}

