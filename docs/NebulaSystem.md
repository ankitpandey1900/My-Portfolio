# Procedural Nebula System

The Nebula System is a strict implementation of the Engine Pattern, generating procedural 3D Simplex Noise clouds that envelope the solar system.

## Core Concepts

Unlike a static background or standard cubemap, the Nebula Engine renders actual 3D sphere shells. It utilizes a custom GLSL fragment shader that calculates Fractional Brownian Motion (fBm) using 3D Simplex Noise mapped to local positions.

This approach ensures:

1. Complete procedural uniqueness without texture downloads
2. Zero "polar pinching" or stretching common with UV-mapped noise
3. Real-time dynamic adjustments to density, opacity, and speed

## The Engine Pattern

The system is decoupled into specific layers:

- **NebulaState** (Zustand store): Manages the `activeConfig` containing color palettes and bounds.
- **NebulaController**: Pure functions for modifying the active configuration and switching presets.
- **NebulaManager**: A headless hook syncing global quality settings to the nebula.
- **NebulaRenderer**: The react-three-fiber scene graph that spawns `NebulaLayer` instances.
- **NebulaLayer**: Binds the configuration parameters directly to GPU shader uniforms.

## Global Overrides

The global scale multiplier allows you to easily scale the nebula out across a large scene. Modifying `globalDensity` in `activeConfig` instantly scales the opacity of the gas clouds for all nested layers.
