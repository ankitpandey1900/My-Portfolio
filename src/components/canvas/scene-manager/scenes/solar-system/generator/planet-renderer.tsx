'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { useAsyncTextures } from '@/hooks/use-async-textures';
import type { PlanetManifestEntry } from '../planet/planet-manifest';
import { PlanetBuilder } from './planet-builder';
import { getPlanetTextureSet, type PlanetTextureSet } from '../planet/planet-texture-config';

const SEGMENTS: Record<string, number> = {
  ultra: 96,
  high: 72,
  medium: 56,
  low: 36,
};

interface PlanetRendererProps {
  entry: PlanetManifestEntry;
}

function ProceduralPlanetMesh({
  entry,
  meshRef,
  segments,
  quality,
  material,
}: {
  entry: PlanetManifestEntry;
  meshRef: React.RefObject<THREE.Mesh | null>;
  segments: number;
  quality: string;
  material: THREE.Material;
}) {
  const sunDirection = React.useMemo(() => new THREE.Vector3(), []);
  const planetWorld = React.useMemo(() => new THREE.Vector3(), []);

  React.useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    if (!(material instanceof THREE.ShaderMaterial)) return;
    if (!meshRef.current) return;

    meshRef.current.getWorldPosition(planetWorld);
    sunDirection.copy(planetWorld).negate().normalize();
    if (sunDirection.lengthSq() < 0.001) {
      sunDirection.set(0.55, 0.18, 0.82).normalize();
    }
    if (material.uniforms.uSunDirection?.value) {
      material.uniforms.uSunDirection.value.copy(sunDirection);
    }
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = performance.now() * 0.001;
    }
  });

  return (
    <mesh
      ref={meshRef}
      name={`planet-core-mesh-${entry.id}`}
      castShadow={quality === 'high' || quality === 'ultra'}
      receiveShadow={quality === 'high' || quality === 'ultra'}
    >
      <sphereGeometry args={[entry.radius, segments, segments]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function TexturedPlanetReady({
  entry,
  meshRef,
  segments,
  quality,
  textureSet,
  textures,
}: {
  entry: PlanetManifestEntry;
  meshRef: React.RefObject<THREE.Mesh | null>;
  segments: number;
  quality: string;
  textureSet: PlanetTextureSet;
  textures: Array<THREE.Texture | undefined>;
}) {
  const map = textures[0];
  const normalMap = textures[1];
  const specularMap = textures[2];
  const emissiveMap = textures[3];
  const clouds = textures[4];

  if (!map) return null;

  [map, normalMap, specularMap, emissiveMap, clouds].forEach((texture) => {
    if (texture) texture.colorSpace = THREE.SRGBColorSpace;
  });

  const surfaceMaterial = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map,
      normalMap: normalMap ?? null,
      roughnessMap: specularMap ?? null,
      emissiveMap: emissiveMap ?? null,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: textureSet.emissiveIntensity ?? 0.45,
      roughness: textureSet.roughness ?? 0.82,
      metalness: textureSet.metalness ?? 0.02,
    });
  }, [emissiveMap, map, normalMap, specularMap, textureSet.emissiveIntensity, textureSet.metalness, textureSet.roughness]);

  const cloudMaterial = React.useMemo(() => {
    if (!clouds) return null;
    return new THREE.MeshStandardMaterial({
      map: clouds,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    });
  }, [clouds]);

  const cloudRef = React.useRef<THREE.Mesh>(null);

  React.useEffect(
    () => () => {
      surfaceMaterial.dispose();
      cloudMaterial?.dispose();
    },
    [cloudMaterial, surfaceMaterial]
  );

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += entry.rotationSpeed * 0.0015;
    if (cloudRef.current) cloudRef.current.rotation.y += entry.rotationSpeed * 0.0022;
    if (surfaceMaterial.emissiveMap) {
      const t = state.clock.elapsedTime;
      surfaceMaterial.emissiveIntensity =
        (textureSet.emissiveIntensity ?? 0.45) * (0.85 + Math.sin(t * 0.4) * 0.08);
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        name={`planet-core-mesh-${entry.id}`}
        castShadow={quality === 'high' || quality === 'ultra'}
        receiveShadow={quality === 'high' || quality === 'ultra'}
      >
        <sphereGeometry args={[entry.radius, segments, segments]} />
        <primitive object={surfaceMaterial} attach="material" />
      </mesh>
      {cloudMaterial ? (
        <mesh ref={cloudRef} name={`planet-clouds-${entry.id}`} scale={1.012}>
          <sphereGeometry args={[entry.radius, segments, segments]} />
          <primitive object={cloudMaterial} attach="material" />
        </mesh>
      ) : null}
    </>
  );
}

function TexturedPlanetMesh({
  entry,
  meshRef,
  segments,
  quality,
  textureSet,
}: {
  entry: PlanetManifestEntry;
  meshRef: React.RefObject<THREE.Mesh | null>;
  segments: number;
  quality: string;
  textureSet: PlanetTextureSet;
}) {
  const texturePaths = React.useMemo(
    () =>
      [
        textureSet.map,
        textureSet.normalMap,
        textureSet.specularMap,
        textureSet.emissiveMap,
        textureSet.clouds,
      ].filter((path): path is string => Boolean(path)),
    [textureSet]
  );

  const loaded = useAsyncTextures(texturePaths);
  if (!loaded?.[0]) {
    const material = PlanetBuilder.buildMaterial(entry);
    return (
      <ProceduralPlanetMesh
        entry={entry}
        meshRef={meshRef}
        segments={segments}
        quality={quality}
        material={material}
      />
    );
  }

  const textureByPath = new Map<string, THREE.Texture>();
  texturePaths.forEach((path, index) => {
    const texture = loaded[index];
    if (texture) textureByPath.set(path, texture);
  });

  const textures: Array<THREE.Texture | undefined> = [
    textureByPath.get(textureSet.map),
    textureSet.normalMap ? textureByPath.get(textureSet.normalMap) : undefined,
    textureSet.specularMap ? textureByPath.get(textureSet.specularMap) : undefined,
    textureSet.emissiveMap ? textureByPath.get(textureSet.emissiveMap) : undefined,
    textureSet.clouds ? textureByPath.get(textureSet.clouds) : undefined,
  ];

  return (
    <TexturedPlanetReady
      entry={entry}
      meshRef={meshRef}
      segments={segments}
      quality={quality}
      textureSet={textureSet}
      textures={textures}
    />
  );
}

function PlanetRendererInner(
  { entry }: PlanetRendererProps,
  ref: React.ForwardedRef<THREE.Mesh>
) {
  const qualityTier = useStore((state) => state.qualityTier);
  const quality = useStore((state) => state.quality);
  const meshRef = React.useRef<THREE.Mesh>(null);
  React.useImperativeHandle(ref, () => meshRef.current as THREE.Mesh);

  const segments = SEGMENTS[entry.qualityPreset] ?? SEGMENTS[qualityTier] ?? 48;
  const textureSet = getPlanetTextureSet(entry.id);
  const material = React.useMemo(
    () => (textureSet ? null : PlanetBuilder.buildMaterial(entry)),
    [entry, textureSet]
  );

  if (textureSet) {
    return (
      <Suspense fallback={null}>
        <TexturedPlanetMesh
          entry={entry}
          meshRef={meshRef}
          segments={segments}
          quality={quality}
          textureSet={textureSet}
        />
      </Suspense>
    );
  }

  if (!material) return null;

  return (
    <ProceduralPlanetMesh
      entry={entry}
      meshRef={meshRef}
      segments={segments}
      quality={quality}
      material={material}
    />
  );
}

export const PlanetRenderer = React.forwardRef(PlanetRendererInner);
PlanetRenderer.displayName = 'PlanetRenderer';
export default PlanetRenderer;

