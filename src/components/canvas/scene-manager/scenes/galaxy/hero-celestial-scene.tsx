'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createHeroMarsAtmosphereMaterial,
  createMarsMaterial,
  createMoonMaterial,
} from '../solar-system/planet/planet-materials';
import { createSunCoreMaterial, createSunGlowMaterial } from '../solar-system/sun/sun-material';
import { useStore } from '@/lib/store';

export function HeroCelestialScene() {
  const isRenderActive = useStore((state) => state.isRenderActive);
  const planetRef = React.useRef<THREE.Group>(null);
  const moonRef = React.useRef<THREE.Mesh>(null);
  const planetMeshRef = React.useRef<THREE.Mesh>(null);
  const sunMeshRef = React.useRef<THREE.Mesh>(null);

  const planetMaterial = React.useMemo(() => createMarsMaterial({ hero: true }), []);
  const moonMaterial = React.useMemo(() => createMoonMaterial(), []);
  const atmosphereMaterial = React.useMemo(() => createHeroMarsAtmosphereMaterial(), []);
  const sunCoreMaterial = React.useMemo(() => createSunCoreMaterial(), []);
  const sunGlowMaterial = React.useMemo(() => createSunGlowMaterial(), []);
  const sunOuterGlowMaterial = React.useMemo(() => {
    const mat = createSunGlowMaterial();
    if (mat.uniforms.uGlowOpacity) mat.uniforms.uGlowOpacity.value = 0.18;
    return mat;
  }, []);

  const sunDirection = React.useMemo(() => new THREE.Vector3(-0.65, 0.28, -0.55).normalize(), []);
  const worldPos = React.useMemo(() => new THREE.Vector3(), []);

  React.useEffect(() => {
    return () => {
      planetMaterial.dispose();
      moonMaterial.dispose();
      atmosphereMaterial.dispose();
      sunCoreMaterial.dispose();
      sunGlowMaterial.dispose();
      sunOuterGlowMaterial.dispose();
    };
  }, [
    planetMaterial,
    moonMaterial,
    atmosphereMaterial,
    sunCoreMaterial,
    sunGlowMaterial,
    sunOuterGlowMaterial,
  ]);

  useFrame((state, delta) => {
    if (!isRenderActive) return;

    const t = state.clock.elapsedTime;
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.012;

    if (planetMaterial.uniforms.uTime) planetMaterial.uniforms.uTime.value = t;
    if (sunCoreMaterial.uniforms.uTime) sunCoreMaterial.uniforms.uTime.value = t;

    if (planetMeshRef.current) {
      planetMeshRef.current.getWorldPosition(worldPos);
      sunDirection.set(-worldPos.x, 10, -worldPos.z).normalize();
      if (planetMaterial.uniforms.uSunDirection?.value) {
        planetMaterial.uniforms.uSunDirection.value.copy(sunDirection);
      }
      if (atmosphereMaterial.uniforms.uSunDirection?.value) {
        atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
      }
    }

    if (moonRef.current) {
      moonRef.current.rotation.y -= delta * 0.022;
      moonRef.current.getWorldPosition(worldPos);
      sunDirection.set(-worldPos.x, 10, -worldPos.z).normalize();
      if (moonMaterial.uniforms.uSunDirection?.value) {
        moonMaterial.uniforms.uSunDirection.value.copy(sunDirection);
      }
    }

    if (sunMeshRef.current) {
      sunMeshRef.current.getWorldPosition(worldPos);
      sunDirection.set(-worldPos.x, 10, -worldPos.z).normalize();
    }
  });

  return (
    <group name="cinematic-hero-celestial" position={[21, -0.5, -11]} rotation={[0.05, -0.42, 0.02]}>
      <pointLight
        name="hero-sun-backlight"
        position={[-22, 11, -15]}
        color="#ffb850"
        intensity={1100}
        distance={180}
        decay={2}
      />
      <directionalLight name="hero-rim-light" position={[-20, 9, -13]} color="#ffe8c8" intensity={4.2} />
      <pointLight name="hero-space-fill" position={[30, 16, 26]} color="#587a96" intensity={16} distance={110} decay={2} />
      <pointLight name="hero-mars-fill" position={[14, 4, 8]} color="#ff9040" intensity={45} distance={80} decay={2} />

      <group name="hero-sun" position={[-22, 6, -17]}>
        <mesh ref={sunMeshRef} name="hero-sun-core">
          <sphereGeometry args={[3.4, 80, 80]} />
          <primitive object={sunCoreMaterial} attach="material" />
        </mesh>
        <mesh name="hero-sun-glow-inner" scale={1.12}>
          <sphereGeometry args={[3.4, 48, 48]} />
          <primitive object={sunGlowMaterial} attach="material" />
        </mesh>
        <mesh name="hero-sun-glow-outer" scale={1.38}>
          <sphereGeometry args={[3.4, 32, 32]} />
          <primitive object={sunOuterGlowMaterial} attach="material" />
        </mesh>
      </group>

      <group ref={planetRef} name="hero-mars-scale-planet">
        <mesh ref={planetMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[20, 128, 128]} />
          <primitive object={planetMaterial} attach="material" />
        </mesh>
        <mesh scale={1.04}>
          <sphereGeometry args={[20, 96, 96]} />
          <primitive object={atmosphereMaterial} attach="material" />
        </mesh>
      </group>

      <mesh ref={moonRef} name="hero-moon" position={[22, -1.5, 11]} castShadow receiveShadow>
        <sphereGeometry args={[1.75, 72, 72]} />
        <primitive object={moonMaterial} attach="material" />
      </mesh>
    </group>
  );
}

