'use client';

/* eslint-disable react-hooks/immutability */
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAsyncTextures } from '@/hooks/use-async-textures';
import { PlanetBuilder } from '../generator/planet-builder';
import { useSolarSystemSimulation } from '../solar-system-store';
import type { MoonManifest } from './planet-manifest';
import { MOON_TEXTURE } from './planet-texture-config';

interface MoonOrbitProps {
  moon: MoonManifest;
  timeScale?: number;
}

function TexturedMoonReady({
  moon,
  timeScale,
  groupRef,
  meshRef,
  moonMap,
}: {
  moon: MoonManifest;
  timeScale: number;
  groupRef: React.RefObject<THREE.Group | null>;
  meshRef: React.RefObject<THREE.Mesh | null>;
  moonMap: THREE.Texture;
}) {
  moonMap.colorSpace = THREE.SRGBColorSpace;

  const material = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: moonMap,
        roughness: 0.96,
        metalness: 0.01,
      }),
    [moonMap]
  );

  React.useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    if (!groupRef.current) return;
    const simState = useSolarSystemSimulation.getState();
    const elapsed = simState.accumulatedTime * timeScale;
    const angle = elapsed * moon.orbitSpeed + moon.id.length * 0.35;
    const wobble = Math.sin(elapsed * moon.orbitSpeed * 2.4) * moon.orbitRadius * 0.04;
    groupRef.current.position.set(
      Math.cos(angle) * moon.orbitRadius,
      wobble,
      Math.sin(angle) * moon.orbitRadius
    );
    if (meshRef.current) meshRef.current.rotation.y += 0.012 * simState.timeScale;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[moon.radius, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function TexturedMoon({
  moon,
  timeScale,
  groupRef,
  meshRef,
}: {
  moon: MoonManifest;
  timeScale: number;
  groupRef: React.RefObject<THREE.Group | null>;
  meshRef: React.RefObject<THREE.Mesh | null>;
}) {
  const loaded = useAsyncTextures([MOON_TEXTURE]);
  const moonMap = loaded?.[0] ?? null;

  if (!moonMap) {
    return (
      <ProceduralMoon moon={moon} timeScale={timeScale} groupRef={groupRef} meshRef={meshRef} />
    );
  }

  return (
    <TexturedMoonReady
      moon={moon}
      timeScale={timeScale}
      groupRef={groupRef}
      meshRef={meshRef}
      moonMap={moonMap}
    />
  );
}

function ProceduralMoon({
  moon,
  timeScale,
  groupRef,
  meshRef,
}: {
  moon: MoonManifest;
  timeScale: number;
  groupRef: React.RefObject<THREE.Group | null>;
  meshRef: React.RefObject<THREE.Mesh | null>;
}) {
  const material = React.useMemo(() => PlanetBuilder.buildMoonMaterial(), []);

  React.useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    if (!groupRef.current) return;
    const simState = useSolarSystemSimulation.getState();
    const elapsed = simState.accumulatedTime * timeScale;
    const angle = elapsed * moon.orbitSpeed + moon.id.length * 0.35;
    const wobble = Math.sin(elapsed * moon.orbitSpeed * 2.4) * moon.orbitRadius * 0.04;
    groupRef.current.position.set(
      Math.cos(angle) * moon.orbitRadius,
      wobble,
      Math.sin(angle) * moon.orbitRadius
    );
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.012 * simState.timeScale;
    const sunDir = meshRef.current.getWorldPosition(new THREE.Vector3()).negate().normalize();
    if (material.uniforms.uSunDirection?.value) {
      material.uniforms.uSunDirection.value.copy(sunDir);
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[moon.radius, 28, 28]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function MoonOrbit({ moon, timeScale = 1 }: MoonOrbitProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const meshRef = React.useRef<THREE.Mesh>(null);
  const useTexture = moon.id === 'luna' || moon.name.toLowerCase() === 'luna';

  return (
    <group ref={groupRef} name={`moon-orbit-${moon.id}`}>
      {useTexture ? (
        <TexturedMoon moon={moon} timeScale={timeScale} groupRef={groupRef} meshRef={meshRef} />
      ) : (
        <ProceduralMoon moon={moon} timeScale={timeScale} groupRef={groupRef} meshRef={meshRef} />
      )}
    </group>
  );
}

