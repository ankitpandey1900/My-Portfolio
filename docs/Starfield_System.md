# Infinite Starfield System Specification

## Purpose

The **Infinite Starfield System** provides a highly optimized, visually immersive space background that establishes scale, depth, and a sense of physical space for the user. It is built as a reusable, modular foundation that scales dynamically across device classes.

---

## Architecture

The system consists of the following components:

```
┌────────────────────────────────────────────────────────┐
│                   SpaceEnvironment                     │
│    (Composes environmental components like Skybox)      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                       Starfield                        │
│   (Selects presets based on Zustand qualityTier)       │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  StarLayer   │    │  StarLayer   │    │  StarLayer   │
│ (Background) │    │ (Midfield)   │    │ (Foreground) │
└──────────────┘    └──────────────┘    └──────────────┘
```

1. **SpaceEnvironment**: Top-level composition component in `src/components/canvas/environment/space-environment.tsx`.
2. **Starfield**: The master orchestrator in `src/components/canvas/environment/starfield/starfield.tsx`. It reads the `qualityTier` from the store and maps layer configurations.
3. **StarLayer**: Component in `src/components/canvas/environment/starfield/star-layer.tsx` responsible for rendering a specific population segment as a single `THREE.Points` entity.

---

## Configuration & Layers

Instead of hardcoding star counts and positions, configurations are loaded dynamically via configuration objects defined in `starfield-config.ts`.

Stars are separated into three distinct populations to create depth and parallax:

- **Background Layer**: 400 to 500 units radius. Tiny, dim stars that form a dense star density backing.
- **Midfield Layer**: 200 to 400 units radius. Medium scale and average brightness stars that fill the local visual volume.
- **Foreground Layer**: 80 to 200 units radius. Large, bright stars. Sparse distribution.

---

## Resource Lifecycle

- **Unmounting/Re-rendering**: When the quality tier is updated, React keys (e.g., `${qualityTier}-${layerConfig.id}`) ensure that the old layers are unmounted.
- **Memory Release**: On unmount, the geometry and material resources are fully disposed via `geometry.dispose()` and `material.dispose()` inside a `useEffect` cleanup hook.
