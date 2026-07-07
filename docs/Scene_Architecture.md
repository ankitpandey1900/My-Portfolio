# Scene Architecture Specs

## Purpose

The Scene Architecture document defines guidelines for creating modular, self-contained 3D scenes.

---

## 1. Modularity Principles

Every scene must be developed as an isolated component under `src/components/canvas/scene-manager/scenes/`:

- **Zero Cross-Talk:** Scenes must not import or depend on other scene components.
- **Store Communication:** Communicate with other scenes and components solely through the Zustand store or the `sceneEventEmitter` pub/sub broadcaster.
- **Self-Contained assets:** Declare all geometries, light rigs, and custom shaders within the scene wrapper.

---

## 2. Layout Structure Template

Every new scene component must follow this structure:

```tsx
'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { SceneWrapper } from './scene-wrapper';

export function CustomCosmicScene() {
  const quality = useStore((state) => state.quality);

  return (
    <SceneWrapper
      name="CUSTOM"
      onInitialize={() => console.log('Custom Scene: Init')}
      onMount={() => console.log('Custom Scene: Mounted')}
      onSuspend={() => console.log('Custom Scene: Suspended')}
      onDestroy={() => console.log('Custom Scene: Destroyed')}
    >
      {/* 1. Scene Lights Rig */}
      <directionalLight position={[2, 5, 2]} intensity={0.5} />

      {/* 2. Scene Geometries and meshes */}
      <mesh name="custom-target-mesh">
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00e5e5" />
      </mesh>

      {/* 3. Scene Particles and visual effects */}
      <group name="custom-particles" />
    </SceneWrapper>
  );
}
export default CustomCosmicScene;
```
