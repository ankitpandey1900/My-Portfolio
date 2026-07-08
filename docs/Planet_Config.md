# Planet Configuration Specification

## Purpose

The **Planet Configuration** governs physical dimensions, color profiles, textures paths, target camera offsets, and redirection attributes.

---

## Configuration Parameter Schemas

All properties are structured inside the `PlanetConfig` type:

- **`id`**: Unique string identifier (e.g. `'jupiter'`). Used to query maps.
- **`name` & `displayName`**: Localized text strings.
- **`radius`**: Visual size multiplier mapping physical mesh scale bounds.
- **`orbitRadius` & `orbitSpeed`**: Directs orbital path sweeps calculations.
- **`rotationSpeed` & `tilt`**: Sets local axial rotations and angles.
- **`colorPalette`**: Gradient array strings used to colorize core surfaces or glow shaders.
- **`texture`, `normalMap`, `roughnessMap`**: Local public paths mapping assets.
- **`emissive` & `emissiveIntensity`**: Ambient light glow properties.
- **`cameraDistance` & `cameraTarget`**: Sets camera focus coordinates on zoom transitions.
- **`portfolioSection`**: Redirect section identifier mapping visitor paths.
- **`theme`**: Preset theme configurations.
- **`qualityPreset`**: Preset profiles.
- **`futureMetadata`**: Key-value metadata mappings.
