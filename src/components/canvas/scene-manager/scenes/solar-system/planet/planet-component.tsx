'use client';

/* eslint-disable react-hooks/immutability */
import * as React from 'react';
import { Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DraggableObject } from '@/components/canvas/interaction/draggable-object';
import { useStore } from '@/lib/store';
import { PlanetRenderer } from '../generator/planet-renderer';
import { PlanetInteraction } from '../interaction/planet-interaction';
import { useSolarSystem } from '../solar-system-provider';
import { useSolarSystemSimulation } from '../solar-system-store';
import { MoonOrbit } from './moon-orbit';
import { PlanetManager } from './planet-manager';
import type { PlanetManifestEntry } from './planet-manifest';
import { usePlanet } from './planet-provider';
import { degToRad } from './planet-utilities';

function createAtmosphereMaterial(color: string, opacity: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity * 2.5 },
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vViewDirection = normalize(cameraPosition - worldPosition.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform vec3 uSunDirection;
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      varying vec3 vWorldPosition;
      
      void main() {
        vec3 n = normalize(vNormal);
        vec3 viewDir = normalize(vViewDirection);
        vec3 sunDir = normalize(uSunDirection);
        
        // Soft, deep fresnel glow
        float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.5);
        
        // Intense sun rim light
        float sunEdge = pow(max(dot(n, sunDir), 0.0), 1.2) * 1.5;
        float darkSide = smoothstep(-0.2, 0.5, dot(n, sunDir)); // fade out on dark side
        
        float alpha = clamp((fresnel + sunEdge) * uOpacity * darkSide, 0.0, 0.8);
        
        // Add a core brightness to the rim
        vec3 finalColor = mix(uColor, vec3(1.0), fresnel * 0.5);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  });
}

function createRingMaterial(
  color: string,
  innerRadius: number,
  outerRadius: number
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uInner: { value: innerRadius },
      uOuter: { value: outerRadius },
      uTime: { value: 0 },
      uSunDirection: { value: new THREE.Vector3(0.55, 0.18, 0.82).normalize() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLocalPosition;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      void main() {
        vLocalPosition = position;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uInner;
      uniform float uOuter;
      uniform float uTime;
      uniform vec3 uSunDirection;
      
      varying vec3 vLocalPosition;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      
      float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }
      
      float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
        float res = mix(
          mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
          mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
      }

      void main() {
        float dist = length(vLocalPosition.xy);
        if (dist < uInner || dist > uOuter) discard;
        
        float t = (dist - uInner) / (uOuter - uInner);
        
        // Fine procedural rings
        float n1 = noise(vec2(t * 250.0, 0.0));
        float n2 = noise(vec2(t * 800.0, 0.0));
        float n3 = noise(vec2(t * 50.0, 0.0));
        
        // Realistic gaps (Cassini division, Encke gap, etc.)
        float cassini = smoothstep(0.60, 0.62, t) * (1.0 - smoothstep(0.66, 0.68, t));
        float encke = smoothstep(0.85, 0.86, t) * (1.0 - smoothstep(0.87, 0.88, t));
        float innerGap = smoothstep(0.15, 0.16, t) * (1.0 - smoothstep(0.18, 0.19, t));
        
        float totalGap = max(cassini * 0.95, max(encke * 0.8, innerGap * 0.6));
        
        // Density calculation
        float density = (n1 * 0.4 + n2 * 0.2 + n3 * 0.4);
        density = smoothstep(0.2, 0.8, density); // increase contrast
        density *= (1.0 - totalGap);
        
        // Smooth edges
        float edge = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.95, 1.0, t));
        density *= edge;
        
        if (density < 0.01) discard;
        
        // Lighting
        vec3 n = normalize(vNormal);
        // Rings are flat, so they catch light based on the sun's angle to the plane
        // We use absolute dot product because the ring is DoubleSide
        float ndl = max(abs(dot(n, normalize(uSunDirection))), 0.1); 
        
        vec3 baseColor = mix(uColor * 0.7, uColor * 1.3, n1); // vary color by band
        vec3 lit = baseColor * (ndl * 0.8 + 0.2); // diffuse
        
        // Add a bit of rim scatter or translucency
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float scatter = pow(max(dot(viewDir, normalize(uSunDirection)), 0.0), 4.0) * 0.5;
        lit += baseColor * scatter * density;
        
        gl_FragColor = vec4(lit, density * 0.7);
      }
    `,
  });
}

function Atmosphere({ config }: { config: PlanetManifestEntry }) {
  const material = React.useMemo(
    () =>
      createAtmosphereMaterial(
        config.atmosphere.color ?? '#b9d6df',
        (config.atmosphere.glowOpacity ?? 0.22) * (config.atmosphere.density ?? 0.3) * 0.35
      ),
    [config.atmosphere.color, config.atmosphere.density, config.atmosphere.glowOpacity]
  );

  const sunDirection = React.useMemo(() => new THREE.Vector3(), []);
  const meshRef = React.useRef<THREE.Mesh>(null);
  const worldPos = React.useMemo(() => new THREE.Vector3(), []);

  React.useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.getWorldPosition(worldPos);
    sunDirection.copy(worldPos).negate().normalize();
    if (sunDirection.lengthSq() < 0.001) {
      sunDirection.set(0.55, 0.18, 0.82).normalize();
    }
    if (material.uniforms.uSunDirection?.value) {
      material.uniforms.uSunDirection.value.copy(sunDirection);
    }
  });

  if (!config.atmosphere.hasAtmosphere) return null;

  return (
    <mesh ref={meshRef} scale={1.018} name={`planet-atmosphere-${config.id}`}>
      <sphereGeometry args={[config.radius, 48, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function PlanetRing({ config }: { config: PlanetManifestEntry }) {
  const inner = config.ring.innerRadius ?? config.radius * 1.32;
  const outer = config.ring.outerRadius ?? config.radius * 1.95;

  const material = React.useMemo(
    () => createRingMaterial(config.ring.color ?? '#c6a269', inner, outer),
    [config.ring.color, inner, outer]
  );

  const sunDirection = React.useMemo(() => new THREE.Vector3(), []);
  const meshRef = React.useRef<THREE.Mesh>(null);
  const worldPos = React.useMemo(() => new THREE.Vector3(), []);

  React.useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.getWorldPosition(worldPos);
    sunDirection.copy(worldPos).negate().normalize();
    if (sunDirection.lengthSq() < 0.001) {
      sunDirection.set(0.55, 0.18, 0.82).normalize();
    }
    if (material.uniforms.uSunDirection?.value) {
      material.uniforms.uSunDirection.value.copy(sunDirection);
    }
  });

  if (!config.ring.hasRing) return null;

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2.35, 0, 0]} name={`planet-ring-${config.id}`} castShadow receiveShadow>
      <ringGeometry args={[inner, outer, 256]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function VenusCloudShell({ radius }: { radius: number }) {
  const material = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec3 vNormal;
          void main() {
            float rim = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.8);
            float alpha = clamp(rim * 0.28, 0.0, 0.32);
            gl_FragColor = vec4(0.92, 0.78, 0.48, alpha);
          }
        `,
      }),
    []
  );

  React.useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    const simState = useSolarSystemSimulation.getState();
    if (material.uniforms.uTime) material.uniforms.uTime.value = simState.accumulatedTime;
  });

  return (
    <mesh scale={1.08} name="venus-cloud-shell">
      <sphereGeometry args={[radius, 48, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function MoonSystem({ config, timeScale }: { config: PlanetManifestEntry; timeScale: number }) {
  if (config.moons.length === 0) return null;

  return (
    <group name={`planet-moons-${config.id}`}>
      {config.moons.map((moon) => (
        <Suspense key={moon.id} fallback={null}>
          <MoonOrbit moon={moon} timeScale={timeScale} />
        </Suspense>
      ))}
    </group>
  );
}

export function PlanetComponent() {
  const { config } = usePlanet();
  const isRenderActive = useStore((state) => state.isRenderActive);

  const coreRef = React.useRef<THREE.Mesh>(null);

  let timeScale = 1.0;
  try {
    const solarSystem = useSolarSystem();
    timeScale = solarSystem.config.timeScale;
  } catch {
    // Fallback if rendered outside SolarSystemProvider context
  }

  React.useEffect(() => {
    if (coreRef.current) {
      coreRef.current.rotation.x = degToRad(config.tilt);
    }
  }, [config.tilt]);

  useFrame((_, delta) => {
    if (!isRenderActive) return;

    if (coreRef.current) {
      const simState = useSolarSystemSimulation.getState();
      coreRef.current.rotation.y += config.rotationSpeed * delta * timeScale * simState.timeScale;
    }
  });

  return (
    <group name={`planet-system-${config.id}`}>
      <PlanetManager />
      <PlanetInteraction planetId={config.id}>
        <DraggableObject>
          <group name={`planet-visual-${config.id}`}>
            <Suspense fallback={null}>
              <PlanetRenderer ref={coreRef} entry={config as PlanetManifestEntry} />
            </Suspense>
            <Atmosphere config={config as PlanetManifestEntry} />
            {config.id === 'venus-about' ? <VenusCloudShell radius={config.radius} /> : null}
            <PlanetRing config={config as PlanetManifestEntry} />
            <MoonSystem config={config as PlanetManifestEntry} timeScale={timeScale} />
          </group>
        </DraggableObject>
      </PlanetInteraction>
    </group>
  );
}
export default PlanetComponent;

