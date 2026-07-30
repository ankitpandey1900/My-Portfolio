'use client';

/* eslint-disable react-hooks/immutability */
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/lib/store';
import { useSolarSystemSimulation } from '../solar-system-store';
import { SunCorona } from './sun-corona';
import { SunFlares } from './sun-flares';
import { SunGlow } from './sun-glow';
import { SunManager } from './sun-manager';
import { createSunCoreMaterial } from './sun-material';
import { SunProvider, useSun } from './sun-provider';

/**
 * SunContent renders the primary core plasma sphere, dynamic atmospheric halo glow,
 * spinning corona flares, and the central PointLight rig.
 */
export function SunContent() {
  const { config } = useSun();
  const isRenderActive = useStore((state) => state.isRenderActive);
  const quality = useStore((state) => state.quality);

  // Lazy-instantiate ShaderMaterial using useMemo
  const material = React.useMemo(() => createSunCoreMaterial(), []);

  // Sync colors, intensities, and octaves parameters outside render in an effect
  React.useEffect(() => {
    if (material.uniforms.uCoreColor) material.uniforms.uCoreColor.value.set(config.coreColor);
    if (material.uniforms.uGlowColor) material.uniforms.uGlowColor.value.set(config.glowColor);
    if (material.uniforms.uIntensity) material.uniforms.uIntensity.value = config.emissiveIntensity;
    if (material.uniforms.uNoiseOctaves) material.uniforms.uNoiseOctaves.value = config.octaves;
  }, [material, config.coreColor, config.glowColor, config.emissiveIntensity, config.octaves]);

  // Handle material resource disposal on unmount
  React.useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  // Animate core shader uTime uniform
  useFrame(() => {
    if (!isRenderActive) return;
    const { accumulatedTime: elapsed } = useSolarSystemSimulation.getState();
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group name="sun-system-group">
      {/* Dynamic central point light illuminating orbits and planets */}
      <pointLight
        color={config.glowColor}
        intensity={config.emissiveIntensity * 8}
        distance={400}
        decay={1.45}
        castShadow={quality === 'high'}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={0.5}
        shadow-camera-far={320}
        shadow-bias={-0.0004}
        name="sun-core-light"
      />
      <pointLight
        color="#ff9040"
        intensity={config.emissiveIntensity * 2.4}
        distance={180}
        decay={2.4}
        name="sun-fill-light"
      />
      <hemisphereLight args={['#ffd8b0', '#0a1020', 0.18]} name="sun-ambient-rim" />

      {/* Sun Core Plasma Sphere */}
      <mesh name="sun-core-mesh" renderOrder={1}>
        <sphereGeometry args={[config.radius, 96, 96]} />
        <primitive object={material} attach="material" />
      </mesh>

      {config.enableFlares && (
        <SunFlares radius={config.radius} color={config.flareColor ?? config.glowColor} />
      )}

      {/* Sun Atmosphere Scattering Glow */}
      {config.enableGlow && (
        <>
          <SunGlow
            radius={config.radius}
            glowColor={config.glowColor}
            glowScale={config.glowScale}
            glowOpacity={config.glowOpacity}
          />
          <SunGlow
            radius={config.radius}
            glowColor={config.glowColor}
            glowScale={config.glowScale * 1.28}
            glowOpacity={config.glowOpacity * 0.32}
          />
        </>
      )}

      {/* Sun Swirling Corona flares billboard */}
      {config.enableCorona && (
        <SunCorona
          radius={config.radius}
          glowColor={config.glowColor}
          coronaScale={config.coronaScale}
          coronaOpacity={config.coronaOpacity}
          coronaSpeed={config.coronaSpeed}
        />
      )}
    </group>
  );
}

export function Sun() {
  return (
    <SunProvider>
      <SunManager />
      <SunContent />
    </SunProvider>
  );
}
export default Sun;
