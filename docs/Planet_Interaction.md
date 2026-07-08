# Planet Interaction Engine

The Planet Interaction Engine is a centralized, event-driven subsystem responsible for mapping raw inputs (pointer, touch, keyboard) into semantic interactions for celestial bodies. It decouples the visual geometries (meshes) from state management, yielding high-performance and predictable UI states.

## Architecture

1. **Interaction Manager (`interaction-manager.tsx`)**
   A headless component that handles centralized event routing. It subscribes to global scene events (from `InteractionEvents`) and maintains local interaction states (hovered/selected) without causing unnecessary DOM or Canvas re-renders.

2. **Interaction Controller (`interaction-controller.ts`)**
   Contains logic for translating raw device inputs (e.g., `onPointerOver`, `onPointerDown`) into semantic intents like `PlanetHover`, `PlanetClick`, or `PlanetDoubleClick`. It applies double-click thresholds and handles pointer lock semantics.

3. **Interaction State (`interaction-state.ts`)**
   A minimal Zustand store that maintains fast, synchronous state mapping for the canvas tree, allowing visual materials to subscribe instantly to `hoveredPlanetId` and `selectedPlanetId`.

4. **Planet Interaction Wrapper (`planet-interaction.tsx`)**
   A generic React component (`<PlanetInteraction>`) that wraps any celestial mesh. It automatically connects the mesh to the controller, applying accessibility tags and binding visual APIs for hover and scale effects.

## State Machine

The interaction engine maps planets into discrete semantic states:

- `idle`: Default state, un-targeted.
- `hovered`: The pointer or focus is currently on the planet.
- `focused`: Driven by external UI logic or keyboard tabbing.
- `selected`: Clicked, set as the Active Planet.
- `disabled`: Ignoring pointer events temporarily.
- `hidden`: Excluded from the scene.
- `locked`: Visually visible but cannot be clicked (Future feature).

## Visual API

The `PlanetInteraction` wrapper acts as the proxy for triggering visual animations. Support is scaffolded for:

- Scale animations (React Spring)
- Emissive glow pulses
- Post-processing Outlines and Highlights
- Custom cursor cursors via DOM overlays
- Interactive sound hook integration

_(Note: Actual visual transitions and camera flying are reserved for future tasks; the architecture natively supports them via bound refs.)_
