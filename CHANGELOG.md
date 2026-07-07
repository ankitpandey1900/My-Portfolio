# Changelog

All notable changes to the **Solar Portfolio** project will be documented in this file.

---

## [Unreleased] - 2026-07-07

### Added

- **Engine Optimization (Task 2.7)**
  - Refactored `CameraManager` Zustand state selector to slice only primitive viewport aspect values, preventing reduntant component re-renders during resize events.
  - Implemented pre-allocated `Float32Array` circular buffers inside `useRenderMonitor` to sample FPS telemetry without generating garbage collector overhead inside the frame loop.
  - Avoided function closure allocations during frame time rolling averages calculations by substituting array method reductions with high-performance `for` loops.
- **Galaxy Scene Integration (Task 2.6)**
  - Composed modular Galaxy Scene directory structure (`galaxy-scene.tsx`, `galaxy-scene-provider.tsx`, `galaxy-scene-lifecycle.ts`, `galaxy-scene-settings.ts`, and `galaxy-scene-config.ts`).
  - Switched the default scene on start from `LOADING` to `GALAXY` inside the Zustand store.
  - Linked Galaxy scene lifecycle hook to trigger environment properties (exposure, presets, density) matching design specifications on mount.
  - Registered the newly composed scene components inside `SceneManagerCore` router.
- **Camera System (Task 2.5)**
  - Configurable presets mapping focal parameters and positions (`galaxy`, `system`, `planet`, `cockpit` configurations in `camera-presets.ts`).
  - Implemented dynamic `CameraManager` coordinating transitions, constraints, and initial cinematic spawn animations.
  - Linked viewport aspect monitoring to adjust active camera FOV on vertical mobile screen ratios (responsive camera zoom scaling).
  - Integrated copy-coordinates and preset switches to Leva panel for developer coordinate planning in dev environment.
  - Expanded Zustand state to encompass `cameraMode`, `cameraPreset`, and `cameraFov` values with setters.
- **Space Environment System (Task 2.4)**
  - Configurable presets mapping users to Drei's built-in HDRI environment illumination maps (`deep-space` -> `night`, `nebula-glow` -> `sunset`, `solar-flare` -> `city`).
  - Integrated dynamic exposure controls and custom tone mapping selections directly affecting the active canvas `gl` properties.
  - Connected Leva debug controls in development mode to toggle parameters (exposure, mapping types, preset environments).
  - Extended Zustand store to house exposure, environmentIntensity, envPreset, toneMapping, and showHDRIBackground states.
- **Nebula & Deep Space Environment System (Task 2.3)**
  - Procedural nested concentric sphere shell layers (`ultra`, `high`, `medium`, `low` configurations in `nebula-config.ts`).
  - Custom R3F nebula ShaderMaterial implementing GPU-driven 3D Simplex noise and fractional Brownian motion (fBm) in GLSL.
  - Time-based noise coordinate translation (cosmic drift) respecting loop active state controls.
  - Linked global opacity mapping dynamically with Zustand's `nebulaIntensity` parameters.
  - Clean resource release using explicit geometry and material disposal on layer unmount.
- **Infinite Starfield System (Task 2.2)**
  - Configurable preset layers (`ultra`, `high`, `medium`, `low` presets in `starfield-config.ts`).
  - Seeded random coordinate generation (`SeededRandom` class with Mulberry32 in `star-generator.ts`).
  - Marsaglia sphere-point picking distribution algorithm for polar alignment protection.
  - Blackbody Kelvin-to-RGB color distribution using polynomial color approximations.
  - Custom R3F star shader material supporting screen-size scaling, circular rendering, and distance attenuation.
  - Automatic VRAM geometry and material disposal on layer unmount.
- **Dynamic Render Pipeline (Task 2.1)**
  - Composed client wrapper `<SceneRoot />` and `<ExperienceCanvas />` to resolve SSR issues in Next.js 16.
  - Custom performance monitoring hook `useRenderMonitor` tracking active FPS, draw calls, and vertex telemetry.
  - Automatic quality tier degradation engine `useAdaptiveQuality` to lower DPR and disable heavy post-processing under poor performance.
  - Render lifecycle state coordinator `useRenderLifecycle` listening to visibility changes and pausing loops.
  - Debounced resize handler `useResizeHandler` updating viewport dimensions on aspect shifts.

### Fixed

- Fixed critical React hook loop in `useSceneLifecycle` by storing parent callbacks in local `useRef` buffers.
- Fixed GPU memory leaks in `SceneWrapper` by traversing and disposing texture references (`map`, `normalMap`, etc.) alongside mesh geometries.
- Fixed unlimited `sceneHistory` growth by capping maximum records to 50 index references.
