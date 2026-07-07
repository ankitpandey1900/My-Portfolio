# Lighting Profiles Specification

## Purpose

The **Lighting Profiles** define the specific directional, point, ambient, and hemisphere light parameters used to illuminate 3D coordinates.

---

## 3D Lighting Rig Specs

Our space lighting is constructed using four distinct light sources in `src/components/canvas/lights/lighting-rig.tsx`:

1. **Ambient Light**: Configured dynamically using Zustand's `ambientIntensity`. Fills dark gaps with a low-intensity global illumination baseline.
2. **Hemisphere Light**: Bounces colors between a sky tone (`#580bb5` - Nebula Violet) and ground tone (`#020205` - Space Black) with an intensity of `0.15`. Simulates cosmic dust bounce light.
3. **Central Point Light**: Located at `[0, 0, 0]` (Sun core origin) with an intensity of `2.5` and a decay factor of `2.0`. Simulates the central star emitter.
4. **Secondary Directional Light**: Positioned at `[10, 20, 10]` with an intensity of `0.4` to highlight mesh edges and surface details.

---

## Adaptive Quality Mappings

Lighting profiles change dynamically based on the performance tier to save GPU calculations:

| Tier             | Shadow Maps                     | Shadow Map Resolution              | Shadows Bias                     |
| :--------------- | :------------------------------ | :--------------------------------- | :------------------------------- |
| **High / Ultra** | Enabled (`castShadow = true`)   | Point: 2048x2048<br>Dir: 1024x1024 | `-0.0001` (prevents visual acne) |
| **Low / Medium** | Disabled (`castShadow = false`) | N/A                                | N/A                              |

By disabling shadow map computations on low-end integrated graphics card setups, frame rate bottlenecks are resolved with minimal impact on ambient visual illumination.
