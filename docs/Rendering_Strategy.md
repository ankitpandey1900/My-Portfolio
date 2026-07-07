# Rendering Strategy

## Purpose

Defines the rendering pipeline architecture that every future space scene uses. This document covers Canvas composition, frame loop responsibilities, and the hook-based monitoring system.

---

## Canvas Composition

The rendering stack is composed in a single client component, `ExperienceCanvas`, which serves as the integration point between Next.js and the 3D engine:

```
ExperienceCanvas (client component, dynamically imported with ssr: false)
├── useRenderLifecycle()     — Pauses render when tab is hidden
├── useResizeHandler()       — Tracks viewport dimensions
│
└── CanvasProvider            — Single R3F Canvas (z-0)
    └── AssetLoaderManager    — Suspense boundary for async assets
        ├── SpaceSkybox       — Background star field
        ├── LightingRig       — Ambient, hemisphere, point, directional lights
        ├── CameraController  — Smooth camera interpolation in useFrame
        ├── SceneManagerCore  — Switches active scene based on Zustand state
        ├── EffectsPipeline   — Post-processing (bloom, vignette, noise)
        ├── RenderPipeline    — useRenderMonitor + useAdaptiveQuality
        └── DebugPanel        — Leva controls (dev only, dynamic import)
```

---

## Frame Loop Architecture

The R3F `useFrame` hook is the heartbeat of the rendering engine. Different systems operate at different priorities within the same loop:

| System           | Priority    | Responsibility                                     |
| :--------------- | :---------- | :------------------------------------------------- |
| CameraController | Default     | Interpolates camera position toward target vectors |
| RenderMonitor    | Default     | Samples frame delta times for FPS calculation      |
| Scene Components | Default     | Run scene-specific animations (orbits, particles)  |
| EffectsPipeline  | After scene | Applies post-processing passes                     |

All `useFrame` callbacks should check `isRenderActive` before performing expensive calculations to avoid wasting GPU cycles when the tab is hidden.

---

## Render Invalidation Strategy

R3F runs in continuous rendering mode (`frameloop="always"` by default). This is correct for our use case because:

- Orbital animations run continuously
- Star fields rotate slowly
- Camera interpolation needs smooth updates

In the future, individual scenes that are static (e.g. a planet detail panel) could switch to `frameloop="demand"` to save battery on mobile.

---

## Visibility Management

The `useRenderLifecycle` hook listens for `document.visibilitychange` events and sets `isRenderActive` to `false` when the tab is hidden. Scene components should respect this flag:

```ts
const isRenderActive = useStore((s) => s.isRenderActive);
useFrame((_, delta) => {
  if (!isRenderActive) return;
  // expensive calculations...
});
```
