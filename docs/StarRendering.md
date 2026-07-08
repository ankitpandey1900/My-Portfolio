# Star Rendering Pipeline

The Starfield Engine uses an instanced array rendering pipeline. It does NOT create a separate geometry or mesh per star.

## Instanced Arrays (BufferGeometry)

Each layer (`background`, `midfield`, `foreground`) creates exactly ONE `THREE.Points` object.

All stars in that layer are packed into typed `Float32Arrays`:

- `positions`: 3 floats (XYZ)
- `colors`: 3 floats (RGB)
- `sizes`: 1 float
- `brightnesses`: 1 float
- `phaseOffsets`: 1 float

This means 30,000 stars require exactly **3 draw calls** (one for each depth layer).

## Dynamic Shader Updates

As seen in the Nebula Engine, the Starfield Engine does not recreate geometries or recompile WebGL programs when switching visual presets or toggling density modifiers.

Global parameters are passed to `StarLayer` and mapped directly into the material's `uniforms` inside a `useEffect`.

```tsx
React.useEffect(() => {
  material.uniforms.uOpacity.value = globalOpacity;
  material.uniforms.uSizeMultiplier.value = globalSize;
  material.uniforms.uTwinkleSpeed.value = globalTwinkleSpeed;
}, [globalOpacity, globalSize, globalTwinkleSpeed]);
```

This guarantees 60 FPS transitions without stuttering.
