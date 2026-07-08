# Nebula Architecture & Shaders

The Procedural Nebula relies on a highly optimized, custom `ShaderMaterial` designed for performance across all devices.

## Shader Logic

We use Ashima Arts' open-source implementation of 3D Simplex Noise (`snoise`).

### Fractional Brownian Motion (fBm)

To create detailed gas filaments, we stack multiple noise "octaves".

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

### Color Gradients

Instead of applying a single solid color, we pass `uColor1` (Primary) and `uColor2` (Secondary).
We blend these based on the `gasDensity` mapping, yielding realistic visual depth where the "core" of the cloud burns brightly, and the edges fade to dark secondary colors.

```glsl
vec3 blendedColor = mix(uColor2, uColor1, smoothstep(0.0, 0.8, gasDensity));
vec3 finalColor = blendedColor * gasDensity;
```

## Adaptive Performance

To guarantee 60FPS on mobile, we automatically scale down rendering fidelity via `NebulaManager`:

1. **Ultra:** 3 Layers, 4 Octaves each
2. **High:** 3 Layers, 3 Octaves each
3. **Medium:** 2 Layers, 2 Octaves each
4. **Low:** 1 Layer, 1 Octave
