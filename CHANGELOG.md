# Changelog

All notable changes to the **Solar Portfolio** project will be documented in this file.

---

## [Unreleased] - 2026-07-07

### Added

- **Deep Space Environment Engine (Task 6.2)**
  - Built a decoupled, config-driven Environment Engine replacing the old `EnvironmentManager`.
  - **Engine Pattern**: Implemented Types, Config, State (Zustand), Events, Controller, Manager, Provider, and Scene.
  - **Presets**: Centralized configurations for `deep-space`, `nebula-glow`, `solar-flare`, and `dark-space`.
  - **Lighting Control**: Bound ambient lighting, directional sun/star lights, and HDRI Image-Based Lighting to the preset configuration.
  - **Adaptive Quality Hooks**: `EnvironmentManager` subscribes to the global `QualityTier`. Automatically disables volumetric fog and reduces IBL overhead on lower tiers.
  - **Post-Processing**: Integrated tone mapping (`ACESFilmic`) and exposure sync dynamically updating the R3F `WebGLRenderer`.
  - **Store Decoupling**: Extracted environment parameters (`ambientIntensity`, `exposure`, `envPreset`, `toneMapping`) out of the massive global `store.ts` and into an isolated `environment-state.ts` Zustand slice to reduce React re-renders.
  - Documentation updated: `EnvironmentSystem.md`, `LightingArchitecture.md`, `RenderingPipeline.md`.

- **Home Planet — Cinematic Hero Experience (Task 6.1)**
  - Built the complete `HomePlanetProvider` system: Types, Config, State (Zustand), Events, Controller, Manager, Provider.
  - Implemented a 6-phase state machine (`idle → initializing → intro → reveal → ready → dismissed`) orchestrating the cinematic reveal sequence.
  - Built `HomeHero` overlay composing `HeroOverlay` (radial vignette), `HeroContent` (name + title + tagline with staggered CSS entrance), `HeroActions` (config-driven CTAs with hover spring physics), and `HeroStats` (5-stat bar).
  - All content is driven by `home-planet-config.ts` — zero hardcoded text, stats, or links in UI components.
  - "Begin Journey" CTA triggers the phase dismiss sequence and then calls `setCurrentScene('SYSTEM')` to enter the solar system.
  - Fully accessible: `aria-label` on all interactive elements, `role="region"` on the hero section, `aria-live="polite"` on availability badge.
  - `prefers-reduced-motion` compatible via global CSS media query that zeroes all transition durations.
  - Integrated into `scene-root.tsx` via `HomePlanetProvider` wrapper.
  - Documentation: `docs/HomePlanet.md` and `docs/HeroArchitecture.md`.

### Refactored

- **Home Planet Review (Task 6.1 Review)**
  - **`hero-content.tsx`**: Extracted `entranceTransition(delay, duration)` factory function eliminating 3× duplicated transition string. Fixed `isRevealed()` helper to include `'dismissed'` phase so content stays visible during the exit animation.
  - **`hero-actions.tsx`**: Unified two duplicate `<a>` JSX branches into one with a conditional spread. Added `onFocus`/`onBlur` keyboard focus ring (`box-shadow: 0 0 0 2px rgba(255,255,255,0.5)`) fixing a WCAG 2.1 AA violation. Fixed `transitionDelay` hover-lag bug — introduced `entered` boolean flag so the stagger delay only fires once during entrance, leaving hover transitions at a snappy `150ms` thereafter. Upgraded `secondary` CTA variant to equal glass visual weight as primary, improving recruiter resume-download conversion.
  - **`home-hero.tsx`**: Stats bar decoupled from the centered flex column and re-pinned to `position: fixed; bottom` so the identity block remains truly vertically centered regardless of stats height. Section `gap` replaced with `clamp(1.5rem, 3.5vh, 2.5rem)` for viewport-height-aware spacing on landscape mobile. Keyframe string extracted to a stable `const` outside the component to avoid re-creation on every render cycle.
  - **`home-planet-config.ts`**: Reduced phase durations (`400+1200+800ms → 300+800+500ms`). CTAs now appear at ~1.6s instead of 2.4s — retains premium feel while reducing risk of recruiter drop-off.

- **Mobile Navigation & Gesture System (Task 4.7)**
  - Developed a high-performance `GestureRecognizer` translating raw Pointer events into typed semantic gestures (`SwipeLeft`, `PinchStart`, `LongPress`).
  - Added global decoupling via passive DOM listeners in `GestureManager`, preserving native scrolling framerates on low-end mobile devices.
  - Exported `GestureController` API to easily register/unregister callbacks and programmatically disable gesture detection during cutscenes.
  - Incorporated a HUD via `GestureDebug` for visualizing real-time touch counts and gesture payloads.
  - **Refactor (Review 4.7)**: Hardened programmatic cancellation (`cancelGesture()` and `disableGestures()`) by tearing down the internal PointerMap and clearing latent long-press timeouts. Ensured precise garbage collection of passive event listeners in `GestureManager`.
- **Transition & Animation Orchestrator (Task 4.6)**
  - Developed `TransitionStore` and `TransitionQueue` capable of sorting animation intents globally by priority.
  - Implemented `TransitionController` to intercept, queue, cancel, and timeout macroscopic transitions (`PlanetLanding`, `SectionOpening`).
  - Added real-time diagnostics via `<TransitionDebug />` HUD.
  - Wrote explicit typed events across `TransitionEvents` to prepare for uncoupled GSAP and Framer Motion integration.
  - **Refactor (Review 4.6)**: Repaired a component unmount memory leak by explicitly tearing down hanging timeouts in `TransitionManager`. Drastically reduced code duplication by consolidating `complete`, `cancel`, and `fail` events into a private generic resolver pattern inside `TransitionController`.
- **Section Loader System (Task 4.5)**
  - Architected `SectionLoaderStore` to manage dynamic chunk loading states (`resolving`, `loading`, `loaded`) for future UI lazy-loading.
  - Implemented `SectionRegistry` laying the groundwork for mapping static section IDs to `React.lazy` imports.
  - Built `SectionLoaderManager` to intercept `SectionOpened` navigation events, seamlessly bridging intent-to-load with asynchronous network fetching.
  - Provided real-time diagnostic HUD via `<SectionLoaderDebug />`.
  - **Refactor (Review 4.5)**: Fixed a potential prototype chain vulnerability by replacing the `in` operator with `hasOwnProperty` inside `SectionResolver`. Hardened `SectionLoaderController` against race conditions by preventing duplicate fetches during the `'resolving'` state.
- **Planet Landing Experience System (Task 4.4)**
  - Implemented `LandingStore` to buffer state (`preparing`, `landing`, `arrived`, `openingSection`) between camera travel and UI engagement.
  - Built `LandingController` exposing APIs (`startLanding`, `completeLanding`, `cancelLanding`) to orchestrate programmatic timing delays (simulated landing sequences).
  - Developed `LandingEvents` allowing disparate systems to hook into landing cues without tightly coupling components.
  - Refactored `NavigationController` to defer `navigateToSection()` execution to the new `LandingManager` orchestrator.
  - Provided real-time diagnostic HUD via `<LandingDebug />` component.
  - **Refactor (Review 4.4)**: Fixed a potential race condition in `LandingController` by clearing active timeouts and explicitly blocking duplicate state triggers.
- **Navigation State Manager (Task 4.3)**
  - Implemented high-level `NavigationStore` state machine (`idle`, `planetSelected`, `travelling`, `focused`, `viewingSection`, `returning`).
  - Created `NavigationController` as the central orchestrator to synchronize UI state with the Camera Travel Engine.
  - Implemented `NavigationEvents` for decoupled signaling across disparate Canvas and DOM trees.
  - Authored `navigation-config.ts` defining planet-to-section maps, readying the codebase for deep routing.
  - Added `<NavigationDebug />` DOM overlay for visualizing real-time master state.
  - Cleaned up loose interaction listeners inside the Camera Travel Engine, formalizing all requests through `NavigationController.selectPlanet()`.
  - **Refactor (Review 4.3)**: Audited Navigation layer for circular dependencies (none found). Removed dead code (`NavigationIntent` interface) from type definitions.
- **Camera Travel Engine (Task 4.2)**
  - Created strongly typed `TravelState` and `TravelRequest` in `camera-travel-types.ts`.
  - Implemented stateless Zustand state machine `useCameraTravelStore` supporting queueing, cancellation, and progress tracking.
  - Developed `CameraTargetResolver` math utility capable of estimating future planetary orbital positions.
  - Implemented `CameraPathGenerator` utilizing `QuadraticBezierCurve3` to generate arc splines that fly around (not through) the solar core.
  - Created `CameraAnimator` holding normalized time stepping logic and easing functions (`easeInOutCubic`, `easeOutExpo`).
  - Implemented core `CameraTravelController` R3F loop interpolating vector positions across spline paths.
  - Implemented `CameraTravelManager` headless listener syncing intent requests from global state and `InteractionEvents`.
  - Refactored `experience-canvas.tsx` to seamlessly drop in `CameraTravelProvider` and deprecate basic linear controllers.
  - Wrote architecture documentation `Camera_Travel.md`, `Travel_State.md`, and `Camera_API.md`.
  - **Refactor (Review 4.2)**: Resolved critical React rendering leak by removing hook subscriptions in `CameraTravelController`, isolating 60 FPS state mutations purely to the `useFrame` transient loop.
- **Planet Interaction Engine (Task 4.1)**
  - Created strongly-typed `InteractionEvents` wrapping the global scene emitter.
  - Implemented state tracking through `interaction-state.ts` (hovered, selected, disabled).
  - Centralized interaction mapping via `InteractionManager` allowing mesh decoupling.
  - Implemented `useInteractionController` interpreting raw pointer events into accessible inputs (Clicks, Double Clicks, Hovers).
  - Implemented reusable `PlanetInteraction` wrapper to mount mesh visual API bindings.
  - Wrote architecture documentation `Planet_Interaction.md` and `Interaction_Events.md`.
  - **Refactor (Review 4.1)**: Removed manual DOM cursor mutations, replacing brittleness with pure API preparation.
  - **Refactor (Review 4.1)**: Replaced `onPointerDown` click estimations with R3F native `onClick` and `onDoubleClick` implementations, fixing drag collisions.
  - **Refactor (Review 4.1)**: Removed dead/broken `off` method in `InteractionEvents` strictly enforcing closure-based cleanup.
- **Orbit Engine (Task 3.4)**
  - Created type interfaces for OrbitState, OrbitLifecycleStage, OrbitConfig, and OrbitEvents in `orbit-types.ts`.
  - Implemented dynamic Context Provider `<OrbitProvider />` and hook `useOrbit` to distribute local state.
  - Developed functional math calculation methods `calculateCircularPosition` in `orbit-math.ts` and `generateOrbitLinePoints` in `orbit-utils.ts`.
  - Implemented `<OrbitComponent />` rendering visible line loop paths and wrapping controller nodes.
  - Implemented `OrbitController` translating child groups coordinates inside useFrame loops.
  - Implemented `OrbitManager` handling notifications and lifecycle events.
  - Created `OrbitRegistry` class cataloging orbital configurations.
- **Planet Engine (Task 3.3)**
  - Created type interfaces for PlanetState, PlanetLifecycleStage, PlanetConfig, and PlanetEvents in `planet-types.ts`.
  - Implemented dynamic Context Provider `<PlanetProvider />` and hook `usePlanet` to distribute local state.
  - Implemented `PlanetManager` coordinates hover actions, focus selection, and event broadcasts.
  - Implemented `<PlanetComponent />` rendering sphere geometries, materials, and performing useFrame translations.
  - Created `PlanetRegistry` class to dynamically map planet setups.
  - Implemented `<PlanetFactory />` to fetch registry definitions and dynamically mount planet mesh layouts.
  - Developed mathematical helpers `calculateOrbitPosition` and `degToRad` inside `planet-utilities.ts`.
- **Sun System (Task 3.2)**
  - Created type interfaces for SunPresetConfig in `sun-types.ts` and config presets (Ultra, High, Medium, Low) in `sun-config.ts`.
  - Implemented custom GLSL ShaderMaterials in `sun-material.ts` for Core plasma, atmospheric Glow, and wispy Corona.
  - Implemented `<SunGlow />` and `<SunCorona />` R3F components with automatic unmount resource disposal.
  - Composed the main `<Sun />` component, which registers a central PointLight and updates Core plasma time loops.
  - Integrated Leva debug controls in development mode to adjust colors, intensities, scales, and octaves in real-time.
  - Rendered the composed Star inside the Solar System scene layout (`solar-system-scene.tsx`).
- **Solar System Architecture (Task 3.1)**
  - Created type interfaces for AtmosphereConfig, MoonRegistryEntry, PlanetRegistryEntry, and SolarSystemConfig in `solar-system-types.ts`.
  - Implemented dynamic Context Provider `<SolarSystemProvider />` and hook `useSolarSystem` to distribute states locally.
  - Implemented pre-allocated `SolarSystemRegistry` handling map lookups and clearing methods.
  - Created `SolarSystemManager` binding store viewport configurations to `'SYSTEM'` lifecycle events.
  - Replaced the old static placeholder scene with composed modular components (`solar-system-scene.tsx`).
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

## [0.1.0] - In Progress

### Sprint 6.6: Cinematic Director

- **Architecture Review:** Evaluated Sprint 6.6 implementation. Fixed `CallAction` signature to correctly pass down the `AbortSignal` for async promise cancellation.
- **Optimization:** Removed over-engineered wrapper layers (deleted `CinematicDirectorManager`) and simplified the provider tree.
- Built a completely headless orchestration engine to coordinate the Camera, Environment, UI, and Transitions without React render bottlenecks.
- Designed the `SequenceTimeline`, an asynchronous execution engine supporting parallel, sequential, conditional, and delayed action primitives.
- Built the `IntroSequence` choreography utilizing the strict Engine Pattern (Provider, Manager, Controller).
- Added `AbortController` support for instantly cancelling or skipping deeply nested async timelines.

### Sprint 6.5: Solar Particle System

- Built a reusable, massive-scale Particle Engine utilizing GPU Instanced Rendering and Object Pooling.
- Implemented `ParticlePool` CPU ring buffer, bypassing garbage collection and per-frame memory allocation.
- Implemented `particle-material.ts` ShaderMaterial for GPU simulation of velocity, acceleration, lifetime, and organic simplex noise drift.
- Created `SolarEnergy` and `SpaceDust` presets.
- Completed Engine Pattern separation (`ParticleManager`, `ParticleController`, `ParticleProvider`).

### Sprint 6.4: Cinematic Starfield Engine

- **Architecture Review:** Conducted a deep review of Sprint 6.4. Removed redundant `StarfieldManager` component and fixed dead code paths.
- **Parallax System:** Implemented native deep-space parallax by binding `parallaxStrength` to the Starfield group scale.
- **Shader Optimization:** Abstracted hardcoded distance attenuation into a `uDistanceScale` uniform in the `star-material.ts` shader.
- Upgraded the Starfield to the strict Engine Pattern architecture (`StarfieldController`, `StarfieldProvider`, `StarfieldState`).

### Sprint 6.3: Procedural Nebula System Review & Refactor

- **Performance Optimization**: Refactored `NebulaLayer` to prevent material and geometry recreation when switching presets. Moved uniform mappings to a `useEffect` to bypass WebGL shader recompilation, eliminating stutter during transitions.

### Sprint 6.3: Procedural Nebula System

- Designed the `Nebula Engine` applying the decoupled architecture pattern.
- Separated state (`NebulaState`), configuration (`NebulaConfig`), and rendering logic (`NebulaRenderer`).
- Upgraded the 3D Simplex GLSL Fragment Shader to support dual-color blending (`uColor1`, `uColor2`).
- Removed `nebulaIntensity` from global store, delegating entirely to `NebulaController`.
- Created 5 new presets (`deep-space`, `blue-nebula`, `purple-nebula`, `golden-nebula`, `minimal-space`).
- Refactored `DebugPanel` and `use-adaptive-quality.ts` to sync seamlessly with the new controller.

### Sprint 6.2: Environment System Review & Refactor

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
