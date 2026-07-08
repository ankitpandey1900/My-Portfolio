# Planet Engine Specification

## Purpose

The **Planet Engine** is a reusable framework designed to instantiate and control every future planetary body (Mercury, Venus, Earth, Mars, etc.). It abstracts visual meshes, orbits, rotations, interactive mouse hover/focus listeners, and unmount cleanups into a decoupled, configuration-driven model.

---

## Modularity & Components

The engine is structured under `src/components/canvas/scene-manager/scenes/solar-system/planet/`:

- **`planet-types.ts`**: Holds static typing schemas for configs, states, and event listeners.
- **`planet-config.ts`**: Fallback configurations when registry lookups fail.
- **`planet-utilities.ts`**: Math helpers (orbit positions, axial tilt radian transformations).
- **`planet-state.ts`**: Context shapes mapping idle/focused/selected interaction levels.
- **`planet-provider.tsx`**: Local Context provider isolating parameters within target namespaces.
- **`planet-manager.tsx`**: Coordinates hover selectors and focus bindings.
- **`planet-component.tsx`**: High-performance R3F component rendering geometries and materials.
- **`planet-registry.ts`**: Directory catalog indexing configuration blocks.
- **`planet-factory.tsx`**: Instantiator composite lookup helper.

---

## Architectural Interaction Map

```
             ┌─────────────────┐
             │  PlanetRegistry │ (Holds static planet definitions)
             └────────┬────────┘
                      │ Look up config
                      ▼
             ┌─────────────────┐
             │  PlanetFactory  │ (Spawns a planet by ID)
             └────────┬────────┘
                      │ Instantiates
                      ▼
             ┌─────────────────┐
             │  PlanetProvider │ (Context distributes parameters)
             └────────┬────────┘
                      ├────────────────────────┐
                      ▼                        ▼
             ┌─────────────────┐      ┌─────────────────┐
             │  PlanetComponent│      │  PlanetManager  │
             │   (3D Meshes)   │      │ (Event Handler) │
             └─────────────────┘      └─────────────────┘
```

---

## Event Architecture

Interaction states are synchronized across the portfolio using the `sceneEventEmitter`:

- **`planet:loaded`**: Broadcast on mount.
- **`planet:hovered`**: Broadcast on mouse hover enter or leave.
- **`planet:clicked`**: Broadcast when a user clicks a planet mesh.
- **`planet:focused`**: Broadcast when a planet becomes the focused scene element.
- **`planet:blurred`**: Broadcast when a planet loses focus.
- **`planet:disposed`**: Broadcast on unmount.
