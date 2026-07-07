# Engine Performance Guide

## Performance Budget & Targets

To ensure fluid, cinematic transitions and zero input lag, we target the following parameters:

- **Desktop / Laptop**: Consistent **60 FPS** (Frame time $\le 16.67$ms)
- **Tablet / Mobile**: Dynamic adaptive quality scaling to maintain **45–60 FPS**
- **VRAM limit**: $< 50$MB for environment textures and geometries (current footprint $\le 2$MB)
- **Draw Calls limit**: $\le 10$ draw calls for the background environment (current: 3 for Starfield, 3 for Nebula)

---

## 1. Zero-Allocation Render Loop (useFrame)

JavaScript garbage collection runs periodically, causing brief freezes (stuttering). To avoid this inside the high-frequency `useFrame` callback loop:

- **No vector creation**: Never construct objects (e.g. `new THREE.Vector3()` or `new THREE.Color()`) inside the frame loop. Instantiate them once using React `useRef` buffers and modify their values in-place via `.set()`.
- **Pre-allocated arrays**: FPS monitoring calculations use pre-allocated static typed arrays (`Float32Array` circular buffers) instead of pushing new entries to standard arrays, eliminating dynamic memory reallocations.

---

## 2. Selective Zustand Selectors

Subscribing to the entire Zustand store forces React components to re-render whenever _any_ unrelated state property updates.

- **Good practice**: Select only the exact primitive slice required:
  ```typescript
  const aspect = useStore((state) => state.viewport.aspect);
  ```
- **Bad practice**: Destructuring the state object directly:
  ```typescript
  const { width, height, aspect } = useStore((state) => state.viewport);
  ```

---

## 3. GPU VRAM Release Strategy

Three.js does not automatically release GPU-side memory when meshes are unmounted from the DOM.

- We wrap all scenes in the `<SceneWrapper>` component.
- On unmount, the wrapper recursively traverses the scene graph, freeing geometries, materials, and textures:
  ```typescript
  geometry.dispose();
  material.dispose();
  texture.dispose();
  ```
