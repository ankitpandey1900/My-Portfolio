# Emitter Guide

The Particle System currently supports basic geometry-based math for initial spawning.

## Supported Shapes

- **Point**: Spawns particles exactly at `[0, 0, 0]` with vertical or random velocity.
- **Sphere**: Spawns particles randomly on the surface of a sphere defined by `emissionRadius`. Initial velocity points outward from the origin.
- **Ring**: Spawns particles in a circle on the XZ plane.

## Creating a Preset

To create a new particle effect, open `particle-presets.ts` and add a new entry to the `PARTICLE_PRESETS` record.
You must wrap your config in `createQualityTiers({ ... })` so the manager knows how to scale it for mobile vs desktop.

```typescript
export const PARTICLE_PRESETS = {
  MyCustomEffect: {
    id: 'MyCustomEffect',
    emitters: createQualityTiers({
      id: 'emitter-1',
      shape: 'Point',
      spawnRate: 100, // ...
    }),
  },
};
```
