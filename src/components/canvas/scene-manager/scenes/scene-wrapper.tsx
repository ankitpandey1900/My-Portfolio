'use client';

import * as React from 'react';
import * as THREE from 'three';

interface SceneWrapperProps {
  name: string;
  children: React.ReactNode;
  onDestroy?: () => void;
}

/**
 * Texture map keys that may be attached to a MeshStandardMaterial.
 */
const TEXTURE_KEYS = [
  'map',
  'normalMap',
  'emissiveMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'envMap',
  'lightMap',
  'alphaMap',
  'displacementMap',
  'bumpMap',
] as const;

function disposeTextures(material: THREE.Material) {
  for (const key of TEXTURE_KEYS) {
    const texture = (material as unknown as Record<string, unknown>)[key];
    if (texture instanceof THREE.Texture) {
      texture.dispose();
    }
  }
}

function disposeMaterial(material: THREE.Material) {
  disposeTextures(material);
  material.dispose();
}

function disposeSceneGroup(group: THREE.Group) {
  group.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }

      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(node.material);
        }
      }
    }
  });
}

/**
 * SceneWrapper provides GPU disposal on unmount.
 * Lifecycle hooks (initialize/mount/suspend) live in scene managers only.
 */
export function SceneWrapper({ name, children, onDestroy }: SceneWrapperProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const onDestroyRef = React.useRef(onDestroy);

  React.useEffect(() => {
    onDestroyRef.current = onDestroy;
  });

  React.useEffect(() => {
    return () => {
      onDestroyRef.current?.();
      if (groupRef.current) {
        disposeSceneGroup(groupRef.current);
      }
    };
  }, []);

  return (
    <group ref={groupRef} name={`scene-${name}`}>
      {children}
    </group>
  );
}

export default SceneWrapper;

