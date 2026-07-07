# Post-Processing Pipeline Specs

## Purpose

The Post-Processing document defines the visual filter pipeline, GPU passes, and graphics profiling rules.

## Composer Configuration

We use `@react-three/postprocessing`'s `<EffectComposer>` to run GPU rendering passes:

- **Multisampling:** Configured to `0` inside the composer. Antialiasing is handled by Next.js/Three.js default canvas settings to prevent redundant processing.
- **Normal Pass:** Disabled (`disableNormalPass`) to save memory buffer updates.

---

## Filter Chain Registry

### 1. Bloom

- **Purpose:** Simulates intense light emission (Sun core glow, lights).
- **Values:** `luminanceThreshold: 0.8`, `luminanceSmoothing: 0.05`

### 2. Depth of Field (DoF)

- **Purpose:** Simulates physical camera lens focusing, blurring far-away or close background objects.

### 3. Chromatic Aberration

- **Purpose:** Simulates lens refraction color splitting at screen edges.

### 4. Vignette

- **Purpose:** Shades screen corners to focus attention on the central space scene.

### 5. Noise

- **Purpose:** Adds a subtle digital grain overlay that matches the HUD dashboard texture.

---

## Quality Presets

- **High Graphics:** The full post-processing pipeline is enabled.
- **Low Graphics / Mobile:** Post-processing is completely disabled (`EffectComposer` is not mounted), saving battery and keeping performance high.
