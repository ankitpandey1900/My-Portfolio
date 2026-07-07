# 3D Architecture

## Purpose

The 3D Architecture document defines the rendering workflow, context separation, and coordinate system rules for the **Solar Portfolio**'s WebGL space universe.

## Goals

1. **Unified Viewport:** Run the entire application within a single WebGLRenderer canvas to prevent duplicate GPU allocations.
2. **Context Integrity:** Map camera travel paths and coordinates dynamically using a centralized Zustand store.
3. **Responsive Scaling:** Scale 3D positions logarithmically to keep planet paths visible across all window aspect ratios.

## Architecture

The WebGL interface uses a **layered canvas layout**. The R3F Canvas sits on absolute bottom (`z-0`) while standard HUD controls, slide panels, and overlay modals are layered above using absolute z-indexing (`z-10` to `z-50`).

```
┌──────────────────────────────────────────────────────────┐
│                      DOM HUD Overlays                    │
│                 (z-index: 10 to z-index: 50)             │
└────────────────────────────┬─────────────────────────────┘
                             │ Overlaid visually
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 React Three Fiber Canvas                 │
│                      (z-index: 0)                        │
│                                                          │
│   Camera     Lighting     Skybox     Assets      Debug   │
│   Control      Rigs      Environ.   Prefetch     Stats   │
└──────────────────────────────────────────────────────────┘
```

## Coordinate System

- **Sun Core Position:** Located at coordinate origin `[0, 0, 0]`.
- **Standard Scale Unit:** $1$ WebGL unit matches $1$ arbitrary planetary scale unit. Planet orbits are mapped logarithmically to keep celestial nodes within the camera clip range (near: `0.1`, far: `1000`).
