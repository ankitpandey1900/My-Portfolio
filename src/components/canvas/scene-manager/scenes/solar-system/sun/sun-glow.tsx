'use client';

/* eslint-disable react-hooks/immutability */
import * as React from 'react';
import { createSunGlowMaterial } from './sun-material';

interface SunGlowProps {
  radius: number;
  glowColor: string;
  glowScale: number;
  glowOpacity: number;
}

/**
 * SunGlow renders a slightly scaled-up concentric sphere shell.
 * It uses a Fresnel-scattering atmospheric shader to draw a soft gold halo.
 */
export function SunGlow({ radius, glowColor, glowScale, glowOpacity }: SunGlowProps) {
  // Use React.useMemo to lazy-instantiate the custom ShaderMaterial once
  const material = React.useMemo(() => createSunGlowMaterial(), []);

  // Sync color and opacity parameter updates outside render in an effect
  React.useEffect(() => {
    if (material.uniforms.uGlowColor) material.uniforms.uGlowColor.value.set(glowColor);
    if (material.uniforms.uGlowOpacity) material.uniforms.uGlowOpacity.value = glowOpacity;
  }, [material, glowColor, glowOpacity]);

  // Handle material resource disposal on unmount
  React.useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh name="sun-glow-shell">
      <sphereGeometry args={[radius * glowScale, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
export default SunGlow;
