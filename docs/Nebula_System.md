# Nebula & Deep Space Environment System Spec

## Purpose

The **Nebula System** provides a highly atmospheric, visually compelling deep space background environment. It adds scale and movement to the portfolio backplane without requiring static texture downloads, operating entirely procedurally in GPU space.

---

## Architecture

The system utilizes concentric BackSide sphere shells centered at the Sun origin `[0,0,0]` to form nested layers:

```
┌────────────────────────────────────────────────────────┐
│                   SpaceEnvironment                     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                      NebulaSystem                      │
│   (Orchestrates shells according to quality presets)  │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ NebulaLayer  │    │ NebulaLayer  │    │ NebulaLayer  │
│ (Background) │    │ (Midground)  │    │ (Foreground) │
│ Radius: 480  │    │ Radius: 465  │    │ Radius: 450  │
└──────────────┘    └──────────────┘    └──────────────┘
```

1. **NebulaSystem**: Coordinates layers based on current quality tiers and global intensity values.
2. **NebulaLayer**: Renders a single sphere geometry with a custom `ShaderMaterial`.
3. **createNebulaMaterial**: A GLSL-based ShaderMaterial executing 3D noise patterns.

---

## 3D Simplex Noise & fBm Shader

Traditional 2D texture maps stretch and pinch at the poles of a sphere (polar coordinates singularity).
To resolve this:

- The fragment shader processes the raw **3D local position vector** of each vertex.
- It runs a fast 3D Simplex Noise calculation, layered through **Fractional Brownian Motion (fBm)**:
  ```glsl
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      if (i >= uNoiseOctaves) break;
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  ```
- Adding a time offset `uTime * uSpeed` causes the gas coordinates to translate dynamically, simulating cosmic dust drift over time.

---

## Preset Settings

Quality settings automatically scale based on performance telemetry:

- **Ultra**: 3 layers (Violet, Orange, Teal). Noise fBm loop runs with 4 octaves for high filament detail.
- **High**: 3 layers. 3 octaves base.
- **Medium**: 2 layers (Violet, Orange). 2 octaves.
- **Low**: 1 layer (Violet base). 1 octave (simple background gradient).

---

## Optimization & Memory Controls

- **Resource Disposal**: Sphere geometries and materials are fully disposed on unmount to prevent GPU memory leaks.
- **CPU Throttling**: The per-frame `useFrame` callback checks the store's `isRenderActive` state. When visibility changes (e.g. browser tab hidden), uniform updates are paused.
- **Zero Asset Size**: Since it is generated completely procedurally on the fly, the download footprint is 0 bytes.
