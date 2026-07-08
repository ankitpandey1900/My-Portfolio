'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

function useMetalMaterial(color: string, roughness: number, metalness: number) {
  return React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
      }),
    [color, metalness, roughness]
  );
}

function EngineStrut({
  angle,
  length,
  radius,
  material,
}: {
  angle: number;
  length: number;
  radius: number;
  material: THREE.MeshStandardMaterial;
}) {
  return (
    <mesh
      position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
      rotation={[0, 0, angle + Math.PI / 2]}
      material={material}
    >
      <boxGeometry args={[0.11, length, 0.11]} />
    </mesh>
  );
}

export function HeroEngineScene() {
  const isRenderActive = useStore((state) => state.isRenderActive);
  const groupRef = React.useRef<THREE.Group>(null);
  const glowRef = React.useRef<THREE.Mesh>(null);

  const shellMetal = useMetalMaterial('#9da3ab', 0.26, 0.92);
  const frameMetal = useMetalMaterial('#5c636d', 0.34, 0.88);
  const pipeMetal = useMetalMaterial('#787f88', 0.22, 0.9);

  React.useEffect(() => {
    return () => {
      shellMetal.dispose();
      frameMetal.dispose();
      pipeMetal.dispose();
    };
  }, [frameMetal, pipeMetal, shellMetal]);

  useFrame((state, delta) => {
    if (!isRenderActive) return;
    const t = state.clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.035;
    if (glowRef.current) {
      const pulse = 0.92 + Math.sin(t * 2.4) * 0.08;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} name="hero-engine-assembly" position={[26, -4.5, -14]} rotation={[0.08, -0.48, 0.02]}>
      <directionalLight position={[-14, 18, 22]} intensity={4.2} color="#fff4e8" />
      <directionalLight position={[10, 6, 16]} intensity={1.1} color="#c8d0d8" />
      <pointLight position={[0, 0, 5.5]} color="#ff9040" intensity={140} distance={55} decay={2} />

      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={shellMetal}>
          <cylinderGeometry args={[4.1, 4.1, 6.2, 64, 1, true]} />
        </mesh>

        <mesh position={[0, 0, 3.4]} material={frameMetal}>
          <cylinderGeometry args={[4.1, 5.8, 3.1, 64, 1, true]} />
        </mesh>

        {[-2.1, -0.4, 1.3, 2.8].map((z) => (
          <mesh key={z} position={[0, 0, z]} material={pipeMetal}>
            <torusGeometry args={[4.35, 0.14, 12, 72]} />
          </mesh>
        ))}

        {Array.from({ length: 10 }, (_, index) => (
          <EngineStrut
            key={`strut-${index}`}
            angle={(index / 10) * Math.PI * 2}
            length={6.4}
            radius={4.55}
            material={frameMetal}
          />
        ))}

        {Array.from({ length: 6 }, (_, index) => {
          const angle = (index / 6) * Math.PI * 2 + 0.2;
          return (
            <mesh
              key={`pipe-${index}`}
              position={[Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 1.2]}
              rotation={[0, 0, angle]}
              material={pipeMetal}
            >
              <cylinderGeometry args={[0.18, 0.18, 4.8, 16]} />
            </mesh>
          );
        })}
      </group>

      <mesh ref={glowRef} position={[0, 0, 5.2]} rotation={[0, 0, 0]}>
        <circleGeometry args={[3.4, 64]} />
        <meshBasicMaterial color="#ff7722" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 5.05]}>
        <circleGeometry args={[2.15, 64]} />
        <meshBasicMaterial color="#ffd0a0" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 4.85]}>
        <circleGeometry args={[1.05, 48]} />
        <meshBasicMaterial color="#fff8ee" toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 4.6]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.55, 0.08, 12, 72]} />
        <meshStandardMaterial color="#b8bcc4" metalness={0.95} roughness={0.18} />
      </mesh>
    </group>
  );
}

export default HeroEngineScene;
