# Rendering Pipeline

The global rendering pipeline is influenced heavily by the current `Environment Engine` configuration and the global `useAdaptiveQuality` hook.

## Tone Mapping

The `EnvironmentScene` actively intercepts the active R3F WebGLRenderer instance to apply preset-specific tone mapping.

```typescript
React.useEffect(() => {
  gl.toneMappingExposure = post.exposure;
  gl.toneMapping = TONE_MAPPING_MAP[post.toneMapping];
}, [gl, post.exposure, post.toneMapping]);
```

## Anti-Aliasing & Post-Processing

Currently toggled globally via `useStore` (`postProcessingEnabled`).
When scaling from `high` to `medium` quality tier on mobile devices, post-processing is disabled to prevent severe FPS drops.

## Color Space

The portfolio forces `sRGBEncoding` for accurate asset rendering, though ACESFilmic Tone Mapping acts as a secondary curve for cinematic highlights.
