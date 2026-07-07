# Performance System Specs

## Purpose

The Performance System document defines optimization workflows, including level of detail (LOD) swapping, frustum culling, and texture compression.

## Performance Tuning Settings

### 1. Level of Detail (LOD)

Planet meshes utilize R3F `<detailed>` nodes.

- **Far Range (Overview):** Low-poly meshes (under 500 vertices) are rendered.
- **Near Range (Close orbit):** Swaps to high-poly meshes (up to 8,000 vertices) with normal maps to show fine details.

### 2. Camera Frustum Culling

R3F frustum culling is enabled on all stars and orbital paths, pausing render calculations for assets outside the camera's viewport.

### 3. Texture Compression (KTX2 / Basis)

All planet textures are compressed to `.ktx2` format. This allows GPUs to read compressed textures directly, saving memory and preventing frame drops.

### 4. Adaptive DPR (Device Pixel Ratio)

- **High Quality Profile:** Max DPR of `2.0` (High DPI / Apple Retina display support).
- **Low Quality Profile:** Max DPR capped at `1.0` (reduces fragment rendering overhead on older laptops and mobile devices).
- **FPS Throttler:** Pauses R3F render loops when the browser tab is hidden or when a HUD details modal covers the screen.
