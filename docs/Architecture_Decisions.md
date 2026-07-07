# Architecture Decisions — Task 2.1

## Purpose

Records architectural decisions made during Task 2.1 (Space Rendering Strategy) with rationale.

---

## ADR-001: Ref-Based Lifecycle Callbacks

**Context:** The `useSceneLifecycle` hook originally included callback functions (`onInitialize`, `onMount`, etc.) in its `useEffect` dependency arrays. Since scene components pass inline arrow functions, new function references are created every render, causing the effects to re-fire continuously.

**Decision:** Store callbacks in `useRef` containers. Sync refs in a no-deps `useEffect` (compliant with React 19 strict mode). The lifecycle effects depend only on stable values (`name`, `isActive`).

**Consequences:** Callbacks are always up-to-date when effects fire, but the initial callback used during the very first render is the one passed at mount time. This is acceptable because lifecycle callbacks are not expected to change behavior between renders.

---

## ADR-002: Canvas Integration via Dynamic Import

**Context:** The R3F Canvas requires browser-only APIs (WebGL, `window`, `document`). Next.js server-side rendering would crash when attempting to instantiate WebGL contexts.

**Decision:** The `ExperienceCanvas` component is loaded via `next/dynamic` with `ssr: false` in `page.tsx`. The debug panel (Leva) is also dynamically imported to exclude it from production bundles.

**Consequences:** The initial HTML payload is lightweight (no 3D code). The canvas mounts only on the client after hydration.

---

## ADR-003: Adaptive Quality via Event-Driven Architecture

**Context:** Different devices have vastly different GPU capabilities. Hardcoding quality settings forces mobile users into poor performance or desktop users into degraded visuals.

**Decision:** Implemented a two-hook system:

1. `useRenderMonitor` samples FPS inside `useFrame` and publishes `performance:degraded` / `performance:recovered` events.
2. `useAdaptiveQuality` subscribes to these events and adjusts quality tiers with a 10-second recovery cooldown to prevent oscillation.

**Consequences:** Quality adapts automatically to the user's hardware. The event-driven approach keeps the hooks decoupled — the monitor doesn't know about quality tiers, and the quality hook doesn't know about FPS sampling.

---

## ADR-004: Texture Disposal in Scene Cleanup

**Context:** The original `SceneWrapper` disposed geometries and materials but not textures. Textures (diffuse, normal, emissive, roughness, metalness, AO, environment maps) are typically the largest GPU memory consumers.

**Decision:** Added comprehensive texture disposal that iterates 11 texture map keys on each material and calls `.dispose()` on each.

**Consequences:** GPU memory is fully reclaimed when navigating between scenes, preventing VRAM leaks on extended usage.

---

## ADR-005: Scene History Cap

**Context:** `setCurrentScene` appended to `sceneHistory` without any limit. After extended navigation, this array would grow unbounded.

**Decision:** Capped `sceneHistory` at 50 entries using `slice(-MAX_SCENE_HISTORY)`.

**Consequences:** Memory usage stays bounded. Back-navigation is preserved for the last 50 transitions, which is more than sufficient for normal usage.
