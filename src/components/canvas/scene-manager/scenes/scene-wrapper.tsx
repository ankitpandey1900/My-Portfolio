'use client';

import * as React from 'react';
import * as THREE from 'three';
import { SceneLifecycleOptions, useSceneLifecycle } from '../lifecycle/use-scene-lifecycle';

interface SceneWrapperProps extends SceneLifecycleOptions {
  children: React.ReactNode;
}

/**
 * Texture map keys that may be attached to a MeshStandardMaterial.
 * Each of these can hold a GPU-resident texture that must be disposed.
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

/** Dispose all GPU-resident textures attached to a material. */
function disposeTextures(material: THREE.Material) {
  for (const key of TEXTURE_KEYS) {
    const texture = (material as unknown as Record<string, unknown>)[key];
    if (texture instanceof THREE.Texture) {
      texture.dispose();
    }
  }
}

/** Dispose a single material and its textures. */
function disposeMaterial(material: THREE.Material) {
  disposeTextures(material);
  material.dispose();
}

/**
 * Recursively dispose all GPU resources (geometries, materials, textures)
 * within a scene group. Call on unmount to prevent VRAM leaks.
 */
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

export function SceneWrapper({ children, ...lifecycleProps }: SceneWrapperProps) {
  const groupRef = React.useRef<THREE.Group>(null);

  useSceneLifecycle({
    ...lifecycleProps,
    onDestroy: () => {
      // Invoke consumer's custom cleanup first
      lifecycleProps.onDestroy?.();

      // Perform deep traversal GPU memory release
      if (groupRef.current) {
        disposeSceneGroup(groupRef.current);
      }
    },
  });

  return (
    <group ref={groupRef} name={`scene-${lifecycleProps.name}`}>
      {children}
    </group>
  );
}
export default SceneWrapper;
