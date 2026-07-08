# Particle Architecture

The Particle System implements a classic Object Pool with InstancedMesh rendering.

## 1. Pool Pre-allocation

When the `ParticleManager` detects the current preset, it counts the total `maxParticles` of all emitters in the preset. It creates a `ParticlePool` with arrays exactly large enough to hold all potential particles.

## 2. Head Cursor

The `ParticlePool` maintains a `head` index. When `spawn()` is called, it overwrites the data at the `head` index, and increments `head`. If `head` reaches the end of the arrays, it wraps around to `0`.
This guarantees that no new arrays are created on the fly.

## 3. Dirty Ranges

Instead of uploading the entire `Float32Array` buffer to the GPU every frame, the `ParticlePool` tracks `dirtyStart` and `dirtyEnd`. In `useFrame`, `ParticleRenderer` limits the WebGL `bufferSubData` call to only the range that was actually modified.

## 4. Emitter Components

Emitters are headless React components that take a `ParticleEmitterConfig` and a reference to the `ParticlePool`. They accumulate `spawnRate * delta` each frame and run a tight `for` loop to generate new starting parameters.
