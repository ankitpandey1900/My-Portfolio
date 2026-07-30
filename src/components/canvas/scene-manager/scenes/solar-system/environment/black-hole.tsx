'use client';

/* eslint-disable react-hooks/immutability */
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { useSolarSystemSimulation } from '../solar-system-store';

const DISK_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAGMENT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;
    float angle = atan(centered.y, centered.x);

    float inner = smoothstep(0.18, 0.32, dist);
    float outer = 1.0 - smoothstep(0.88, 1.0, dist);
    float ring = inner * outer;

    float swirl = noise(vec2(angle * 3.0 + uTime * 0.35, dist * 8.0 - uTime * 0.6));
    vec3 hot = mix(vec3(1.0, 0.55, 0.12), vec3(1.0, 0.92, 0.72), swirl);
    vec3 cool = vec3(0.85, 0.35, 0.08);
    vec3 color = mix(cool, hot, pow(swirl, 0.6));

    float doppler = 0.75 + sin(angle * 2.0 + uTime * 0.2) * 0.25;
    float alpha = ring * (0.55 + swirl * 0.35) * doppler;

    gl_FragColor = vec4(color * 1.4, alpha);
  }
`;

const RING_FRAGMENT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;
    float angle = atan(centered.y, centered.x);

    float band = smoothstep(0.92, 0.98, dist) * (1.0 - smoothstep(0.98, 1.0, dist));
    float shimmer = 0.75 + sin(angle * 12.0 + uTime * 1.8) * 0.25;
    vec3 color = mix(vec3(1.0, 0.82, 0.55), vec3(1.0, 0.96, 0.88), shimmer);

    gl_FragColor = vec4(color * 1.6, band * shimmer);
  }
`;

const LENS_FRAGMENT = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(vViewDirection);
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.2);
    float pulse = 0.85 + sin(uTime * 0.4) * 0.15;

    float ring = smoothstep(0.85, 0.98, fresnel) * (1.0 - smoothstep(0.98, 1.0, fresnel));
    vec3 warm = vec3(1.0, 0.72, 0.35);
    vec3 hot = vec3(1.0, 0.95, 0.82);
    vec3 color = mix(warm, hot, ring);

    float alpha = fresnel * ring * pulse * 0.25;
    gl_FragColor = vec4(color, alpha);
  }
`;

const LENS_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

export function BlackHole() {
  const diskRef = React.useRef<THREE.Mesh>(null);
  const diskInnerRef = React.useRef<THREE.Mesh>(null);
  const photonRef = React.useRef<THREE.Mesh>(null);
  const lensRef = React.useRef<THREE.Mesh>(null);
  const warpRef = React.useRef<THREE.Mesh>(null);

  const diskMaterial = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DISK_VERTEX,
        fragmentShader: DISK_FRAGMENT,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const innerDiskMaterial = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DISK_VERTEX,
        fragmentShader: DISK_FRAGMENT,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const ringMaterial = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DISK_VERTEX,
        fragmentShader: RING_FRAGMENT,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const lensMaterial = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: LENS_VERTEX,
        fragmentShader: LENS_FRAGMENT,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  React.useEffect(() => {
    return () => {
      diskMaterial.dispose();
      innerDiskMaterial.dispose();
      ringMaterial.dispose();
      lensMaterial.dispose();
    };
  }, [diskMaterial, innerDiskMaterial, ringMaterial, lensMaterial]);

  useFrame(() => {
    const isRenderActive = useStore.getState().isRenderActive;
    if (!isRenderActive) return;

    const t = useSolarSystemSimulation.getState().accumulatedTime;

    if (diskMaterial.uniforms.uTime) diskMaterial.uniforms.uTime.value = t;
    if (innerDiskMaterial.uniforms.uTime) innerDiskMaterial.uniforms.uTime.value = t * 1.35;
    if (ringMaterial.uniforms.uTime) ringMaterial.uniforms.uTime.value = t;
    if (lensMaterial.uniforms.uTime) lensMaterial.uniforms.uTime.value = t;
    if (diskRef.current) diskRef.current.rotation.z = t * 0.08;
    if (diskInnerRef.current) diskInnerRef.current.rotation.z = -t * 0.14;
    if (photonRef.current) photonRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.02);
    if (warpRef.current) warpRef.current.rotation.z = t * 0.015;
  });

  return (
    <group name="black-hole" position={[-82, -8, -58]} rotation={[0.35, -0.55, 0.12]}>
      <pointLight color="#ff9838" intensity={65} distance={160} decay={2} />

      <mesh name="black-hole-core">
        <sphereGeometry args={[2.85, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <mesh scale={1.02}>
        <sphereGeometry args={[2.85, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <mesh ref={lensRef} scale={2.9}>
        <sphereGeometry args={[2.85, 64, 64]} />
        <primitive object={lensMaterial} attach="material" />
      </mesh>

      <mesh ref={warpRef} rotation={[Math.PI / 2.12, 0, 0]}>
        <ringGeometry args={[14, 22, 128]} />
        <meshBasicMaterial
          color="#ffcc88"
          transparent
          opacity={0.04}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={photonRef} rotation={[Math.PI / 2.15, 0, 0]}>
        <ringGeometry args={[3.02, 3.42, 128]} />
        <primitive object={ringMaterial} attach="material" />
      </mesh>

      <mesh ref={diskInnerRef} rotation={[Math.PI / 2.04, 0.15, 0]}>
        <ringGeometry args={[3.5, 6.5, 128]} />
        <primitive object={innerDiskMaterial} attach="material" />
      </mesh>

      <mesh ref={diskRef} rotation={[Math.PI / 2.08, 0, 0]}>
        <ringGeometry args={[6.5, 12, 128]} />
        <primitive object={diskMaterial} attach="material" />
      </mesh>
    </group>
  );
}

export default BlackHole;
