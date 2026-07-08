# Performance Guide: Particle System

## Rules for Emitters

1. **Never allocate memory in useFrame.**
   Do not use `new THREE.Vector3()` or `new THREE.Color()` inside the `useFrame` loop of a `ParticleEmitter`. Always perform raw math directly using `let` variables and dump the numbers straight into `pool.spawn()`.

2. **Keep Max Particles Reasonable.**
   The shader calculates positions for _all_ allocated particles every frame. Keep the active max particles under 100,000 for mobile compatibility.

3. **Use Shader Noise Sparingly.**
   The 3D Simplex noise function is heavy. It runs for every living particle. If you are targeting Mobile Quality Tiers, consider stripping out the noise function in the fragment shader or capping the count strictly.

4. **Batch Updates.**
   The `ParticlePool` groups all spawn calls into a single contiguous block (except when wrapping around the ring buffer). Never interleave random updates across the pool arrays manually.
