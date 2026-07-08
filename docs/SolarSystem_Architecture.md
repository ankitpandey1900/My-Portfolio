# Solar System Architecture Specification

## Purpose

The **Solar System Architecture** establishes a modular, decoupled, configuration-driven blueprint for rendering the solar system viewport. It governs celestial body registration, orbital time-scaling, and resource lifecycle management.

---

## Modularity & Components

The system is divided into seven decoupled modules inside `src/components/canvas/scene-manager/scenes/solar-system/`:

- **`solar-system-types.ts`**: Clean static types for atmospheres, moons, planet registries, and speed parameters.
- **`solar-system-config.ts`**: Preset time scales and accessibility multipliers.
- **`solar-system-registry.ts`**: Dynamic storage registry tracking registered items.
- **`solar-system-state.ts`**: State parameters mapping targeting and transition states.
- **`solar-system-provider.tsx`**: Local context provider distributing states down child elements.
- **`solar-system-manager.tsx`**: High-level manager binding system presets to `useSceneLifecycle` triggers.
- **`solar-system-scene.tsx`**: Unified entry wrapper rendering scene items.

---

## State and Configuration Controls

To support dynamic interactions, the context preserves active properties:

- **Time Scale (`timeScale`)**: Adjusts relative orbital movement speeds globally.
- **Orbit Speed Multiplier (`orbitSpeedMultiplier`)**: Allows users to speed up or slow down celestial loops dynamically.
- **Accessibility Mode (`accessibilityMode`)**: Syncs with state controls. It dials down velocities to allow clean screen reader announcements on focus.
- **Theme presets**: Configures visual presentation modes (Realistic, Cinematic, Minimalist).

---

## Performance Targets

The registry is built to support scale optimizations:

- **Lazy Loading**: Planet meshes, textures, and details are loaded dynamically on demand when the scene matches system focuses, avoiding loading memory up-front.
- **Level of Detail (LOD)**: Automatically swaps out high-resolution models for simple bounding geometries when the camera moves far away.
- **Frustum Culling**: Coordinates default Three.js bounding calculations so only visible planets trigger render overhead.
- **VRAM Cleanups**: Unmounting calls recursion disposes on all geometries, textures, and materials.
