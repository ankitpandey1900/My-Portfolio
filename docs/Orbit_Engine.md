# Orbit Engine Specification

## Purpose

The **Orbit Engine** is a reusable framework designed to manage and render orbital motion parameters. It abstracts circular/elliptical math operations, coordinates visible line paths rendering, and translates children positions on the R3F Canvas.

---

## Modularity & Components

The engine is structured under `src/components/canvas/scene-manager/scenes/solar-system/orbit/`:

- **`orbit-types.ts`**: Static interfaces for config, states, events, and lifecycle parameters.
- **`orbit-config.ts`**: Preserves fallback configurations.
- **`orbit-math.ts`**: Pure functional math calculating coordinates vectors.
- **`orbit-utils.ts`**: Pre-allocates lines points coordinates.
- **`orbit-state.ts`**: Context schemas.
- **`orbit-provider.tsx`**: Local Context Provider isolating state updates.
- **`orbit-registry.ts`**: Maps catalog storing registered orbits.
- **`orbit-manager.tsx`**: Triggers start, pause, and resume events.
- **`orbit-controller.tsx`**: Translates coordinates inside the `useFrame` loop.
- **`orbit-component.tsx`**: Visual orbit ring path loops composer.

---

## Architectural Interaction Map

```
             ┌─────────────────┐
             │  OrbitRegistry  │ (Indexes orbit paths definitions)
             └────────┬────────┘
                      │ Look up config
                      ▼
             ┌─────────────────┐
             │  OrbitProvider  │ (Context holds settings & states)
             └────────┬────────┘
                      ├────────────────────────┐
                      ▼                        ▼
             ┌─────────────────┐      ┌─────────────────┐
             │ OrbitComponent  │      │  OrbitManager   │
             │   (Line Loops)  │      │ (Event Emitter) │
             └────────┬────────┘      └─────────────────┘
                      │ Controls
                      ▼
             ┌─────────────────┐
             │ OrbitController │ (Translates children groups)
             └─────────────────┘
```

---

## Event Architecture

The engine publishes dynamic notifications during runs:

- **`orbit:started`**: Broadcast when an orbit registers and begins looping.
- **`orbit:paused`**: Broadcast when mechanical motion is paused.
- **`orbit:resumed`**: Broadcast when motion returns to running.
- **`orbit:disposed`**: Broadcast when unmounting loops.
