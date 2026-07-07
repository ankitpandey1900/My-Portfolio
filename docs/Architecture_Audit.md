# Architecture Audit

## 1. WebGL & Canvas Layering

- **Status:** ✅ Validated
- **Details:** The `<CanvasProvider>` mounts a single, shared R3F Canvas positioned absolute at `z-0`. DOM overlays (like custom buttons, typography text, slide containers, and dialog modals) are layered above it using absolute z-indexing (`z-10` to `z-50`). This prevents mouse event clashes and unnecessary GPU re-renders.

---

## 2. Dynamic Scene Swapping

- **Status:** ✅ Validated
- **Details:** Scene swapping is managed by updating `currentScene` in our Zustand store. Switch cases inside `<SceneManagerCore>` mount and unmount components dynamically, ensuring inactive scenes do not consume system memory.

---

## 3. Global Store Integration

- **Status:** ✅ Validated
- **Details:** The Zustand store (`src/lib/store.ts`) acts as the single source of truth for the entire application, dividing state into modules for the renderer, camera, preloader, environment, and scenes.
