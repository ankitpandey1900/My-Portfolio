# Navigation State Manager

The Navigation State Manager acts as the global orchestrator of the portfolio. It bridges the gap between the headless Camera Travel Engine, the Planet Interaction Engine, and the UI layout layers.

## Responsibilities

- Intercepts 3D clicks from `InteractionEvents`.
- Enforces navigation validation (e.g., blocking navigation while travelling).
- Manages strict synchronous flows across different sub-systems.
- Provides a headless interface that allows UI overlays to trigger 3D events (e.g. clicking a 'Go Home' HTML button routes through this manager).

## Architecture

1. **`NavigationManager`**: The React component bridging the `sceneEventEmitter` into the `NavigationController`.
2. **`NavigationController`**: Pure logic handler orchestrating multiple stores simultaneously (e.g., calling `cameraStore.queueTravel()` and `navStore.setState()`).
3. **`NavigationStore`**: Zustand state holding the application's overall active state (`currentPlanetId`, `currentSectionId`).

By decoupling navigation from the Camera controller, we avoid circular dependencies when the UI later interacts with the canvas.
