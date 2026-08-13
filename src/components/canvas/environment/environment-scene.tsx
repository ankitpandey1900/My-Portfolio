/* eslint-disable react-hooks/immutability */
'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Environment Scene
// The rendering component for lighting, fog, and HDRI background.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEnvironmentStore } from './environment-state';
import type { ToneMappingType } from './environment-types';

const TONE_MAPPING_MAP: Record<ToneMappingType, THREE.ToneMapping> = {
  ACESFilmic: THREE.ACESFilmicToneMapping,
  Cineon: THREE.CineonToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  None: THREE.NoToneMapping,
};

export function EnvironmentScene() {
  const { gl, scene } = useThree();
  const activeConfig = useEnvironmentStore((state) => state.activeConfig);
  const { background, lighting, post, fog } = activeConfig;

  // Optimize: Re-use THREE.Color objects instead of new allocations per frame
  const fogColor = React.useMemo(() => new THREE.Color(fog.color), [fog.color]);
  const bgColor = React.useMemo(
    () => (background.color ? new THREE.Color(background.color) : null),
    [background.color]
  );

  // Apply Renderer post-processing settings (exposure, tone mapping)
  React.useEffect(() => {
    gl.toneMappingExposure = post.exposure;
    gl.toneMapping = TONE_MAPPING_MAP[post.toneMapping];
  }, [gl, post.exposure, post.toneMapping]);

  // Apply Fog and Background color imperatively to the scene
  React.useEffect(() => {
    if (fog.enabled) {
      if (!scene.fog) {
        scene.fog = new THREE.Fog(fogColor, fog.near, fog.far);
      } else {
        scene.fog.color = fogColor;
        (scene.fog as THREE.Fog).near = fog.near;
        (scene.fog as THREE.Fog).far = fog.far;
      }
    } else {
      scene.fog = null;
    }

    if (background.mode === 'color' && bgColor) {
      scene.background = bgColor;
    } else if (background.mode === 'transparent') {
      scene.background = null;
    }
    // HDRI background handled by Drei <Environment> below
  }, [scene, fog.enabled, fog.near, fog.far, fogColor, background.mode, bgColor]);

  return (
    <group name="environment-scene">
      {/* Global Illumination */}
      <ambientLight intensity={lighting.ambientIntensity} color={lighting.ambientColor} />

      {/* Primary Directional Light (Sun/Star) */}
      <directionalLight
        intensity={lighting.directionalIntensity}
        color={lighting.directionalColor}
        position={[10, 20, 10]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Image Based Lighting & HDRI Background */}
      {background.dreiPreset && (
        <Environment
          preset={background.dreiPreset}
          background={background.mode === 'hdri'}
          blur={background.mode === 'hdri' ? 0.8 : 0}
          environmentIntensity={lighting.environmentIntensity}
        />
      )}
    </group>
  );
}

