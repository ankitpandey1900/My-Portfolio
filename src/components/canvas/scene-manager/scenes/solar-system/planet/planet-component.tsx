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
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uInner: { value: innerRadius },
      uOuter: { value: outerRadius },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLocalPosition;
      void main() {
        vLocalPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uInner;
      uniform float uOuter;
      uniform float uTime;
      varying vec3 vLocalPosition;
      
      // Pseudo-random noise function
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
        
        // Procedural high-detail multi-band rings
        float n1 = noise(vec2(t * 150.0, 0.0));
        float n2 = noise(vec2(t * 300.0, 0.0));
        float n3 = noise(vec2(t * 50.0, 0.0));
        
        // Deep gaps
        float gap1 = smoothstep(0.48, 0.5, t) * (1.0 - smoothstep(0.5, 0.54, t));
        float gap2 = smoothstep(0.72, 0.74, t) * (1.0 - smoothstep(0.74, 0.78, t));
        float gap3 = smoothstep(0.2, 0.22, t) * (1.0 - smoothstep(0.22, 0.25, t));
        
        float totalGap = max(gap1, max(gap2, gap3));
        
        // Combine noise frequencies for rich texture
        float density = (n1 * 0.5 + n2 * 0.3 + n3 * 0.8) * (1.0 - totalGap * 1.5);
        
        // Smooth inner and outer edges
        float edge = smoothstep(0.0, 0.02, t) * (1.0 - smoothstep(0.95, 1.0, t));
        density *= edge;
        
        if (density < 0.02) discard;
        
        // Add a slight bloom/glow to the rings
        vec3 finalColor = uColor * (0.5 + density * 1.5);
        gl_FragColor = vec4(finalColor, density * 0.85);
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

  React.useEffect(() => () => material.dispose(), [material]);

  if (!config.ring.hasRing) return null;

  return (
    <mesh rotation={[Math.PI / 2.35, 0, 0]} name={`planet-ring-${config.id}`}>
      <ringGeometry args={[inner, outer, 128]} />
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
