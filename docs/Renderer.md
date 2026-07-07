# Renderer Configuration Specs

## Purpose

The Renderer document defines the mathematical render properties, color mappings, tone mapping styles, shadow presets, and pixel ratio rules for the **Solar Portfolio** WebGL engine.

## Renderer Settings

- **Color Space:** Set to `gl.outputColorSpace = THREE.SRGBColorSpace` (standard color display pipeline mapping).
- **Tone Mapping:** Configured to `THREE.ACESFilmicToneMapping` to render cinematic, high-contrast highlights (emissive glowing maps, bloom lens filters).
- **Adaptive DPR Limits:** Enforce `dpr={[1, 2]}`. Limits pixel rendering to a maximum of 2 on high-density displays (such as Apple Retina screens), preventing frame-rate drops due to excessive sub-pixel fragment calculations.
- **Antialiasing:** Enable WebGL multisampling antialiasing (`antialias: true`) with sub-pixel coverage matching to ensure orbit lines look smooth.
- **Soft Shadows:** Cast shadows utilizing `THREE.PCFSoftShadowMap` (percentage-closer filtering) to render realistic shadows behind planets.

---

## Performance Thresholds

| Graphics Quality Profile             | Multisampling | Shadow Maps      | Pixel Ratio Target |
| :----------------------------------- | :------------ | :--------------- | :----------------- |
| **High Settings** (Dedicated GPU)    | 4x MSAA       | PCFSoftShadowMap | Dynamic (up to 2)  |
| **Low Settings** (Mobile/Integrated) | Disabled      | Disabled         | Flat 1.0 (Fixed)   |
