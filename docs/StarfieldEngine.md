# Cinematic Starfield Engine

The Starfield System follows the Engine Pattern, providing a dynamic, scalable background architecture for the interactive space environment.

## Architecture

The system is decoupled into:

- **StarfieldState**: Localized Zustand store holding the `activeConfig`.
- **StarfieldController**: Pure functions to alter state and switch presets.
- **StarfieldManager**: Headless component to sync the global `QualityTier` limits.
- **StarfieldRenderer**: React-Three-Fiber composition loop for the layer meshes.
- **StarLayer**: An individual rendering call for a spherical shell of points.

## Twinkling & Animation

Unlike a standard particle system, the Starfield Engine uses a custom fragment shader that computes `Fractional Brownian Motion` style sinusoidal patterns.

Each star is assigned a `aPhaseOffset` in its `BufferGeometry`. During the `useFrame` render loop, the global `uTime` uniform is passed to the shader, which calculates the blink speed asynchronously per star on the GPU.

This ensures zero CPU overhead for animation, even when scaling to millions of stars.
