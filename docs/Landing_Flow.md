# Landing Flow Orchestration

This document outlines the strict chronological sequence of events spanning three discrete sub-systems.

## 1. Interaction (User clicks a planet)

- `InteractionEvents` emits `PlanetClick`.
- `NavigationManager` intercepts it, calling `NavigationController.selectPlanet('mars')`.

## 2. Camera Travel

- `NavigationController` tells `CameraTravelStore` to `queueTravel`.
- The `CameraTravelController` interpolates the camera along a bezier spline.
- When progress hits `1.0`, it calls `onComplete`.
- `NavigationController` receives `onComplete` and emits `TravelCompleted`.

## 3. Landing Sequence (The Bridge)

- `LandingManager` intercepts `TravelCompleted`.
- Calls `LandingController.startLanding()`. State is now `landing`.
- (Future Animation: Particles play for 1.5s).
- `setTimeout` completes. Calls `LandingController.completeLanding()`.
- `LandingController` emits `ReadyForSection` and tells `NavigationController.navigateToSection('projects')`.

## 4. UI Section

- `NavigationController` updates `NavigationStore.currentSectionId`.
- The React DOM tree (Portfolio UI) reacts to the state change and mounts the Section Overlay.
