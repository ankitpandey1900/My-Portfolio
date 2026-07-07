# Debug System Specification

## Purpose

The Debug System document defines the diagnostic instrumentation tools and panels used during development.

---

## 1. Development Diagnostics HUD

In development mode (`process.env.NODE_ENV === 'development'`), a telemetry overlay is displayed:

- **Scene Indicator:** Shows the active scene name (e.g. `LOADING`, `GALAXY`, `SYSTEM`).
- **FPS & Frame Timings:** Monitored using Drei's `<Stats />` overlay.
- **Asset Diagnostics:** Displays the count of loaded textures, geometries, and models in system memory.
- **Transition Log:** Prints transition events (`transition:start`, `transition:end`) directly to the developer console.

---

## 2. Leva Control Tweaks

We use Leva to expose runtime controls for the 3D scene, allowing developers to test settings on the fly:

- **Scene Selector:** Swap the active scene manually without using the UI navigation.
- **Ambient Lighting controls:** Adjust ambient and hemisphere lighting intensities to test shadow behaviors.
- **Post-Processing Toggles:** Turn Bloom, Vignette, and Chromatic Aberration effects on or off.

---

## 3. Production Exclusion

To prevent bundle size issues and keep performance high:

- Leva and Stats panels are completely unmounted in production.
- Debug console logs are disabled.
