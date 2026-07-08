# Sun Configuration Specification

## Purpose

The **Sun Configuration** document preserves preset attributes, visual properties, and developer panel bounds. All parameters are dynamic, avoiding hardcoded constants in the rendering loop.

---

## Preset Settings Matrix

Quality presets are mapped to the global `qualityTier` of the Cosmic engine:

| Property               |   Ultra   |   High    |  Medium   |    Low    |
| :--------------------- | :-------: | :-------: | :-------: | :-------: |
| **Radius**             |   `4.5`   |   `4.5`   |   `4.5`   |   `4.5`   |
| **Emissive Intensity** |   `2.0`   |   `1.5`   |   `1.2`   |   `0.8`   |
| **Core Color**         | `#ff5500` | `#ff5500` | `#ff5500` | `#ff5500` |
| **Glow Color**         | `#ffaa00` | `#ffaa00` | `#ffaa00` | `#ffaa00` |
| **Glow Scale**         |  `1.25`   |  `1.25`   |  `1.22`   |  `1.20`   |
| **Glow Opacity**       |  `0.80`   |  `0.75`   |  `0.60`   |  `0.40`   |
| **Corona Scale**       |  `1.45`   |  `1.45`   |  `1.40`   |  `1.35`   |
| **Corona Opacity**     |  `0.55`   |  `0.45`   |  `0.00`   |  `0.00`   |
| **Corona Speed**       |  `0.06`   |  `0.04`   |  `0.00`   |  `0.00`   |
| **Noise Octaves**      |    `4`    |    `3`    |    `2`    |    `1`    |
| **Enable Glow**        |  `true`   |  `true`   |  `true`   |  `true`   |
| **Enable Corona**      |  `true`   |  `true`   |  `false`  |  `false`  |

---

## Developer Debug Panel (Leva)

In development mode, Leva panel controls allow real-time parameter tuning:

- **Radius (`radius`)**: Limits: `2.0` to `8.0` (step: `0.1`).
- **Core Color (`coreColor`)**: Dynamic hex color picker mapping deep core valleys.
- **Glow Color (`glowColor`)**: Color picker mapping glow outline filaments.
- **Emissive Intensity (`emissiveIntensity`)**: Limits: `0.1` to `4.0` (step: `0.1`).
- **Glow Scale (`glowScale`)**: Limits: `1.0` to `1.5`.
- **Glow Opacity (`glowOpacity`)**: Limits: `0.0` to `1.0`.
- **Corona Scale (`coronaScale`)**: Limits: `1.0` to `2.0`.
- **Corona Opacity (`coronaOpacity`)**: Limits: `0.0` to `1.0`.
- **Corona Speed (`coronaSpeed`)**: Limits: `0.0` to `0.2`.
- **Octaves (`octaves`)**: Limits: `1` to `4` (controls GPU noise iterations).
