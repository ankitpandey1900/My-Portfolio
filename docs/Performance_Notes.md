# Starfield Performance Notes

## Purpose

This document records details regarding optimization strategies, GPU impact, and frame rate validation tests for the Infinite Starfield System.

---

## Instancing vs. Point Sprites

While rendering thousands of individual meshes creates severe vertex overhead and draw call inflation, using `THREE.Points` maps all points to a single geometry wrapper.

- **Draw Call Efficiency**: The entire background is rendered with a total of **3 draw calls** (one per StarLayer).
- **Vertex Footprint**: Each star requires only a single coordinate vector. Point sizing is computed in the GPU vertex shader rather than on the CPU.

---

## Shader Optimization Techniques

1. **Distance Attenuation**:Sizing adjustments are made via a simple inverse depth computation in the vertex shader:
   ```glsl
   float distanceFactor = 300.0 / (-mvPosition.z);
   gl_PointSize = aSize * distanceFactor * uDprScale;
   ```
2. **Soft Point Circular Masks**: Using `gl_PointCoord` coordinates inside the fragment shader allows us to mask points into soft-edged spheres procedurally. This avoids binding and sampling heavy 2D PNG textures:
   ```glsl
   vec2 center = gl_PointCoord - vec2(0.5);
   float dist = length(center);
   if (dist > 0.5) discard;
   float intensity = exp(-8.0 * dist * dist);
   ```
3. **No Depth Writing**: Since stars act as the background layer, `depthWrite` is disabled. This prevents read/write cycles on the depth buffer, saving GPU bandwidth.

---

## Memory Footprint

- **Vertex Data**: Memory is managed via flat `Float32Array` attributes. For 25,000 stars (Ultra settings), the total geometry size is less than **1MB of VRAM**.
- **Garbage Collection**: Re-generation occurs only on quality preset swaps. During runtime, zero memory allocations are made in the frame loop.
