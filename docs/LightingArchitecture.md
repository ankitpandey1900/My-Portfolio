# Lighting Architecture & Setup (Environment System)

The Environment Engine strictly controls the lighting of the 3D scene, ensuring the universe looks cinematic and high-end across all presets.

## Lighting Layers

The `EnvironmentScene` manages three primary lighting tiers:

### 1. Image-Based Lighting (IBL)

- **Role**: Provides highly realistic reflection environments (HDRI) for metallic and glass objects (e.g. spaceships, glass visors).
- **Implementation**: Uses `@react-three/drei`'s `<Environment>` component.
- **Config**: Driven by `EnvironmentPresetConfig.background.dreiPreset`. Values include `night` for deep space and `sunset` for nebula glow.

### 2. Global Illumination (Ambient)

- **Role**: Prevents pure-black shadows by providing a base cosmic color floor.
- **Implementation**: `THREE.AmbientLight`
- **Config**: Bound to `EnvironmentPresetConfig.lighting.ambientColor` and `ambientIntensity`.

### 3. Primary Directional (Sun/Star)

- **Role**: The main light source acting as the central star or sun. Provides strong highlights and cast shadows.
- **Implementation**: `THREE.DirectionalLight` (Positioned at `[10, 20, 10]`, looking at `[0, 0, 0]`).
- **Config**: Bound to `EnvironmentPresetConfig.lighting.directionalColor` and `directionalIntensity`.
- **Optimization**: Casts 1024x1024 shadows for crisp but performant edges.

## Post-Processing (Tone Mapping & Exposure)

The Environment Engine intercepts the root WebGLRenderer (`gl`) every time a preset changes.

```typescript
React.useEffect(() => {
  gl.toneMappingExposure = post.exposure;
  gl.toneMapping = TONE_MAPPING_MAP[post.toneMapping];
}, [gl, post.exposure, post.toneMapping]);
```

We default to **ACESFilmicToneMapping** for a cinematic, highly-contrasted film look that prevents colors from blowing out to pure white.

## Fog

Atmospheric depth is handled using `THREE.Fog` directly injected into the active scene:

```typescript
scene.fog = new THREE.Fog(fogColor, fog.near, fog.far);
```

**Adaptive Quality**: On "Medium" and "Low" quality tiers, fog is bypassed entirely to reduce the fragment shader overhead on mobile GPUs.
