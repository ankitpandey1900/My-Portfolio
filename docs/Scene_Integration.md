# Scene Integration Roadmap

## Purpose

This document details the coordination boundaries and communication pathways between the rendering pipeline, camera controller, space environment managers, and the scene router.

---

## System Integration Map

The R3F master Canvas orchestrates all rendering subsystems in a single component tree:

```
┌────────────────────────────────────────────────────────┐
│                   ExperienceCanvas                     │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Environment │    │    Camera    │    │ SceneRouter  │
│ (Starfield,  │    │ (Controller, │    │ (ManagerCore,│
│   Nebula)    │    │   Manager)   │    │  Lifecycle)  │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Dynamic State Sync Flow

1. **State Routing**: The `SceneManagerCore` listens to Zustand `currentScene` shifts.
2. **Event Dispatching**: During transition starting and ending steps, events are broadcast via the `sceneEventEmitter`:
   - `transition:start` — Fired before rendering switches.
   - `transition:end` — Fired after rendering settles.
3. **Lifecycle Initialization**: The mounted scene component triggers its local `useSceneLifecycle` hook:
   - Sets target exposure and tone mapping profiles.
   - Triggers camera preset coordinate transitions in the store.
4. **Direct WebGL Updating**:
   - `EnvironmentManager` applies exposure / tone mapping properties directly to the WebGL `gl` context.
   - `CameraController` slides camera position towards `targetPosition` using frame-delta factors in `useFrame`.
   - `Starfield` and `NebulaSystem` read quality presets on tier adjustments.

---

## Cleanup & Memory Safety Protocol

When a scene is unmounted from the viewport:

- The `SceneWrapper` hooks into React's unmount lifecycle.
- It executes a recursive search across the unmounted mesh node tree.
- Callbacks invoke `.dispose()` on all child `BufferGeometry` structures, `Material` parameters, and `Texture` uniform maps to free up graphics card VRAM.
