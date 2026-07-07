# Galaxy Scene Specification

## Purpose

The **Galaxy Scene** is the core entrance environment of the application. It represents the top-level celestial system where users begin their journey. It coordinates the global background environment (Starfield, Nebula, and HDRI presets) and maps initial camera targets.

---

## Modular Composition

The Galaxy Scene is composed of five specialized files inside `src/components/canvas/scene-manager/scenes/galaxy/`:

- **`galaxy-scene-config.ts`**: Preserves target configurations (ambient, exposure, preset profiles).
- **`galaxy-scene-settings.ts`**: Preserves structural details (rotation speeds, fog density, color).
- **`galaxy-scene-lifecycle.ts`**: Binds the active scene name to `useSceneLifecycle` callbacks.
- **`galaxy-scene-provider.tsx`**: Provides Context to subcomponents.
- **`galaxy-scene.tsx`**: Combines elements inside `<SceneWrapper name="GALAXY">`.

---

## Subsystem Integration

On active initialization and mount, the scene triggers initial parameters in the Zustand store:

```
                  ┌──────────────────────┐
                  │     GalaxyScene      │
                  └──────────┬───────────┘
                             │ Initializes
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                      Zustand Store                     │
 └──────────────────────────┬─────────────────────────────┘
                            ├─────────────────────────────┐
                            ▼                             ▼
                 ┌──────────────────────┐      ┌──────────────────────┐
                 │  EnvironmentManager  │      │    CameraManager     │
                 │ (Deep Space / Night) │      │ (Cinematic / Galaxy) │
                 └──────────────────────┘      └──────────────────────┘
```

- **Renderer Settings**: Synced to use the ACES Filmic tone mapper with an exposure level of `1.0`.
- **Environment Presets**: Uses Drei's built-in `'night'` map to project low-intensity ambient illumination.
- **Camera preset**: Focuses on the `'galaxy'` view preset (`[0, 60, 120]`), launching a cinematic swooping transition on start.
- **Starfield & Nebula**: Star density is configured to `12,000` points with a nebula opacity multiplier of `0.6`.
