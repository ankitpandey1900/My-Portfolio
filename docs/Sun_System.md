# Sun System Specification

## Purpose

The **Sun System** serves as the central visual focus of the Solar System viewport. Configured dynamically, it renders a high-performance procedural plasma core, Fresnel atmospheric scattering outer glow, and billboard corona flares without loading heavy dynamic texture maps.

---

## Component Layers

The Sun is rendered as a nested group of concentric shell geometry components:

```
            ┌──────────────────────────────────┐
            │            Sun Mesh              │
            │  (Core Sphere: uTime Noise)      │
            └────────────────┬─────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  pointLight  │        │   SunGlow    │        │  SunCorona   │
│ (Core Light  │        │ (Atmosphere: │        │ (Billboard:  │
│  CastShadow) │        │ Fresnel glow)│        │ polar flares)│
└──────────────┘        └──────────────┘        └──────────────┘
```

- **Point Light**: Positioned at the center of the system to serve as the master physical light rig casting shadows onto future orbiting planets.
- **Sun Core**: A sphere of radius `4.5` rendering moving plasma loops using fractional Brownian motion.
- **Sun Glow**: A concentric shell (scale factor `1.25` of radius) rendering Fresnel atmosphere scattering glows.
- **Sun Corona**: A flat plane billboard (scale factor `1.45` of radius) facing the camera and slowly spinning, rendering rotating polar noise flares.

---

## Shader Configurations

1. **Plasma Core Shader**:
   - Computes multi-layered 3D Simplex noise octaves inside the fragment shader based on elapsed time `uTime`.
   - Maps noise heights to color gradients, creating moving white-hot gold highlights over deep orange-red valleys.
2. **Fresnel scattering Glow**:
   - Calculates the angle between the surface normal direction and camera view direction:
     $$\text{Intensity} = \text{pow}(1.0 - \text{dot}(\text{normal}, \text{viewDir}), 4.5)$$
   - Uses additive blending to project a seamless golden atmosphere halo surrounding the Star geometry edges.
3. **Swirling Corona disk**:
   - Maps polar angles and radius distances to polar noise coordinates:
     $$\text{Angle} = \text{atan}(y, x)$$
   - Swirls polar noise filaments dynamically to simulate giant plasma arcs.
