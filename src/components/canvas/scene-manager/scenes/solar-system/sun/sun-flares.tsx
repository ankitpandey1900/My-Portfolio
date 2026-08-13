'use client';

/* eslint-disable react-hooks/immutability */
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarSystemSimulation } from '../solar-system-store';

const FLARE_COUNT = 14;

function createFlareGeometry(radius: number): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < FLARE_COUNT; i += 1) {
    const theta = (i / FLARE_COUNT) * Math.PI * 2 + 0.2;
    const phi = 0.35 + (i % 5) * 0.12;
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );

    const tip = dir.clone().multiplyScalar(radius * (1.55 + (i % 3) * 0.12));
    const baseA = dir.clone().multiplyScalar(radius * 1.02);
    const tangent = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(radius * 0.08);
    const baseB = baseA.clone().add(tangent);
    const baseC = baseA.clone().sub(tangent);

    const base = vertices.length / 3;
    vertices.push(tip.x, tip.y, tip.z, baseB.x, baseB.y, baseB.z, baseC.x, baseC.y, baseC.z);
    indices.push(base, base + 1, base + 2);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

interface SunFlaresProps {
  radius: number;
  color: string;
}

export function SunFlares({ radius, color }: SunFlaresProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const geometry = React.useMemo(() => createFlareGeometry(radius), [radius]);
  const material = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  React.useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(() => {
    if (!groupRef.current) return;
    const { accumulatedTime: t } = useSolarSystemSimulation.getState();
    groupRef.current.rotation.y = t * 0.04;
    groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.05;
    material.opacity = 0.32 + Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef} name="sun-flares">
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

export default SunFlares;

