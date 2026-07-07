# Renderer Lifecycle

## Purpose

Defines how the rendering engine responds to browser events (tab visibility, resize, modal overlays) and how components should integrate with these lifecycle states.

---

## Visibility Pausing

When the user switches browser tabs, the R3F render loop continues executing but renders to an invisible canvas, wasting GPU cycles and battery.

**Hook:** `useRenderLifecycle` (DOM-level, runs outside Canvas)

**Behavior:**

- Listens for `document.visibilitychange` events.
- Sets `isRenderActive = false` in the Zustand store when the tab is hidden.
- Sets `isRenderActive = true` when the tab becomes visible again.

**Consumer pattern:**

```ts
const isRenderActive = useStore((s) => s.isRenderActive);
useFrame((_, delta) => {
  if (!isRenderActive) return;
  // expensive per-frame logic
});
```

---

## Resize Handling

**Hook:** `useResizeHandler` (DOM-level, runs outside Canvas)

**Behavior:**

- Debounces resize events via `requestAnimationFrame` (fires at most once per frame).
- Updates `viewport.width`, `viewport.height`, and `viewport.aspect` in the Zustand store.
- R3F's internal canvas resize is handled automatically by the `<Canvas>` component.

**Use cases:**

- Adjusting orbit radii based on screen aspect ratio.
- Repositioning HUD elements relative to viewport edges.
- Adapting particle counts for mobile screens.

---

## VRAM Cleanup Protocol

When a scene unmounts (via `SceneManagerCore` switching), the `SceneWrapper` component runs a recursive traversal that disposes:

1. **Geometries** — `geometry.dispose()`
2. **Materials** — `material.dispose()`
3. **Textures** — All texture maps attached to materials: `map`, `normalMap`, `emissiveMap`, `roughnessMap`, `metalnessMap`, `aoMap`, `envMap`, `lightMap`, `alphaMap`, `displacementMap`, `bumpMap`.

This prevents GPU memory leaks when navigating between detailed 3D scenes.
