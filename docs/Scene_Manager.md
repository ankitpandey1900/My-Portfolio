# Scene Manager Specification

## Purpose

The Scene Manager document defines the core architecture for loading, rendering, and unloading 3D virtual spaces (Loading, Galaxy, Solar System, Planet Close-up, Error Screen).

---

## Central Coordinator

All 3D components render within a single master `<Canvas>` view. The `<SceneManagerCore>` component acts as the coordinator, determining which scene component is currently active:

- **Active Rendering:** Switch cases inside the manager render only the active scene component.
- **Asset Cleanup:** Inactive scenes are completely unmounted, preventing hidden objects from consuming CPU and GPU resources.
- **Transition Broadcaster:** Coordinates scene changes by dispatching starting and ending events via the `sceneEventEmitter`.

---

## Core Operations

```
   Select Scene (Zustand)
             │
             ▼
┌─────────────────────────┐      Unmount     ┌─────────────────────────┐
│     Previous Scene      │ ───────────────> │  Recursive VRAM Cleanup │
│   (Transition: Start)   │                  │   (Dispose Geometries)  │
└─────────────────────────┘                  └─────────────────────────┘
             │
             │ Load Node Components
             ▼
┌─────────────────────────┐
│       New Scene         │
│    (Transition: End)    │
└─────────────────────────┘
```

- **Memory Release:** Unmounting a scene runs a recursive search inside the `<SceneWrapper>` unmount hook, calling `.dispose()` on all geometries and materials to free up GPU memory.
