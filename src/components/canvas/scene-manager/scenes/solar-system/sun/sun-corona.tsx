'use client';

/* eslint-disable react-hooks/immutability */
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { createSunCoronaMaterial } from './sun-material';

interface SunCoronaProps {
  radius: number;
  glowColor: string;
  coronaScale: number;
  coronaOpacity: number;
  coronaSpeed: number;
}

/**
 * SunCorona renders a rotating flat billboard plane.
 * It uses polar noise coordinates in the fragment shader to draw spinning solar flares.
 */
export function SunCorona({
  radius,
  glowColor,
  coronaScale,
  coronaOpacity,
  coronaSpeed,
}: SunCoronaProps) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const isRenderActive = useStore((state) => state.isRenderActive);

  // Lazy-instantiate ShaderMaterial using useMemo
  const material = React.useMemo(() => createSunCoronaMaterial(), []);

  // Sync color and opacity parameter updates outside render in an effect
  React.useEffect(() => {
    if (material.uniforms.uGlowColor) material.uniforms.uGlowColor.value.set(glowColor);
    if (material.uniforms.uCoronaOpacity) material.uniforms.uCoronaOpacity.value = coronaOpacity;
    if (material.uniforms.uCoronaSpeed) material.uniforms.uCoronaSpeed.value = coronaSpeed;
  }, [material, glowColor, coronaOpacity, coronaSpeed]);

  // Handle material resource disposal on unmount
  React.useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  // Update time animations and align billboard mesh to camera position
  useFrame((state) => {
    if (!isRenderActive) return;
    const elapsed = state.clock.getElapsedTime();
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = elapsed;
    }

    if (meshRef.current) {
      // Slow rotation on the billboard disk
      meshRef.current.rotation.z = elapsed * coronaSpeed * 0.15;
      meshRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <mesh ref={meshRef} name="sun-corona-billboard">
      <planeGeometry args={[radius * coronaScale * 2, radius * coronaScale * 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
export default SunCorona;
