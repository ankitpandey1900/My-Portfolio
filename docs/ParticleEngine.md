# Particle Engine

The Particle System follows the Engine Pattern, providing a dynamic, scalable, GPU-driven particle architecture for the interactive space environment.

## Architecture

The system is decoupled into:

- **ParticleState**: Localized Zustand store holding the `activeConfig`.
- **ParticleController**: Pure functions to alter state and switch presets.
- **ParticleManager**: Component that syncs `QualityTier`, determines max pool sizes, and mounts the renderer and emitters.
- **ParticlePool**: CPU-side ring buffer manager that exposes `spawn()` functionality. Avoids per-frame allocations.
- **ParticleEmitter**: Headless React components that evaluate shape equations and inject raw spawn data into the `ParticlePool` via `useFrame`.
- **ParticleRenderer**: React-Three-Fiber composition loop for the `InstancedMesh`. Syncs the ring buffer to the GPU via batched `updateRange` updates.

## GPU Instancing Strategy

Unlike a standard particle system, the Particle Engine uses a custom fragment/vertex shader.
The CPU only determines the _start_ state of a particle (position, velocity, acceleration, startTime, lifetime). The GPU calculates the exact position and opacity on the fly based on `uTime`.

This guarantees 60 FPS rendering of up to 100,000 active particles across multiple emitters, without overwhelming the CPU's garbage collector.
