# Planet Factory Specification

## Purpose

The **Planet Factory** acts as the dynamic instantiator spawning localized planets. It wraps spawned elements inside isolated state contexts (`PlanetProvider`), allowing mesh elements to receive focused inputs without mutating parent components.

---

## Architecture Flow

```
              ┌─────────────────┐
              │ PlanetGenerator │ (Loops manifest items)
              └────────┬────────┘
                       │ Spawns
                       ▼
              ┌─────────────────┐
              │  PlanetFactory  │ (Spawns planet by ID)
              └────────┬────────┘
                       │ Injects
                       ▼
              ┌─────────────────┐
              │ PlanetProvider  │ (Exposes context configs)
              └────────┬────────┘
                       │ Renders
                       ▼
              ┌─────────────────┐
              │ PlanetComponent │ (Calculates self-rotation)
              └────────┬────────┘
                       │ Mounts
                       ▼
              ┌─────────────────┐
              │ PlanetRenderer  │ (Renders physical mesh geometry)
              └─────────────────┘
```

---

## Visual Presentation Separation

1. **Dynamic Provider**: Injects context configs and monitors pointer interactions (focused, clicked).
2. **Component Calculations**: Updates rotation ticks inside frame loops.
3. **Renderer Composers**: Draws physical spheres, normal coordinates bump overlays, and disposes GPU resources on unmount.
