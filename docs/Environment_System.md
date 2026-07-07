# Space Environment System Specification

## Purpose

The **Space Environment System** manages dynamic ambient starlight, image-based lighting (IBL) presets, exposure levels, and color tone mapping configurations inside the WebGL viewport. It ensures all 3D surface meshes (planets, satellites) reflect accurate cosmic illumination.

---

## Architecture

The system integrates with the R3F Canvas context via a central coordinator:

```
┌────────────────────────────────────────────────────────┐
│                   CanvasProvider (gl)                  │
└──────────────────────────┬─────────────────────────────┘
                           │ Sets toneMapping & exposure
                           ▼
┌────────────────────────────────────────────────────────┐
│                   EnvironmentManager                   │
│   (Subscribes to store settings and wraps Environment) │
└──────────────────────────┬─────────────────────────────┘
                           │ Configures IBL Preset
                           ▼
┌────────────────────────────────────────────────────────┐
│             @react-three/drei <Environment>            │
│   (Loads skybox environment maps: night/sunset/city)   │
└────────────────────────────────────────────────────────┘
```

1. **Zustand store**: Preserves exposure values, environmental light intensities, and selected presets.
2. **EnvironmentManager**: A client R3F component in `src/components/canvas/environment/environment-manager.tsx`. It synchronizes changes to the active WebGL renderer `gl` instance properties.
3. **CanvasProvider**: Sets up initial tone mapping algorithms during startup.

---

## Environment Presets

Different presets simulate varying atmospheric conditions in deep space:

- **Deep Space (`'deep-space'`)**: Maps to Drei's `'night'` environment preset. Produces cool, low-intensity ambient light that models deep space far from stars.
- **Nebula Glow (`'nebula-glow'`)**: Maps to Drei's `'sunset'` environment preset. Simulates warm, violet-pink-orange diffuse illumination bouncing from nearby nebulas.
- **Solar Flare (`'solar-flare'`)**: Maps to Drei's `'city'` environment preset. Simulates intense, high-contrast white light near a central star.

---

## Tone Mapping & Exposure

To render high-dynamic-range lighting correctly without visual washing, the WebGL renderer translates HDR values using **ACES Filmic** tone mapping:

```typescript
const TONE_MAPPING_MAP = {
  ACESFilmic: THREE.ACESFilmicToneMapping,
  Cineon: THREE.CineonToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  None: THREE.NoToneMapping,
};
```

Adjustments to `exposure` dynamically multiply output pixel brightness values without altering raw mesh shader calculations, preserving color accuracy.
