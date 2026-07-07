# Asset Naming Conventions

## Purpose

The Naming Conventions document defines rules for naming models, textures, audio, and icon files. Consistent names prevent broken imports and double assets.

---

## 1. General Rules

- **Case:** Always use **lowercase** for filenames.
- **Separators:** Use **dashes** (`-`) to separate words. Do not use spaces, camelCase, or underscores.
- **Extensions:** Always match the correct file format (e.g. `.glb`, `.ktx2`, `.webp`, `.svg`, `.mp3`).

---

## 2. Category Conventions

### 3D Models (`public/assets/models/`)

- **Pattern:** `[category]-[name].glb`
- **Examples:**
  - `planet-earth.glb`
  - `planet-saturn.glb`
  - `ship-probe.glb`
  - `prop-satellite.glb`

### Textures (`public/assets/textures/`)

- **Pattern:** `[category]-[name]-[map-type].ktx2`
- **Examples:**
  - `planet-earth-albedo.ktx2`
  - `planet-earth-normal.ktx2`
  - `planet-earth-roughness.ktx2`
  - `space-stars-emissive.ktx2`

### Audio (`public/assets/audio/`)

- **Pattern:** `[category]-[action].[extension]`
- **Examples:**
  - `music-ambient-loop.webm`
  - `sfx-ui-hover.mp3`
  - `sfx-warp-transition.webm`

### Icons (`public/assets/icons/`)

- **Pattern:** `icon-[name].svg`
- **Examples:**
  - `icon-dashboard.svg`
  - `icon-planet-select.svg`
  - `icon-volume-mute.svg`
