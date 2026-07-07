# Scene Manager Folder Structure Explanation

## Purpose

The Folder Explanation document defines the directory structure and file organization rules for the Scene Management system under `src/components/canvas/scene-manager/`.

---

## Directory Map

- **`scenes/`**
  - **Contents:** Declarative scene components (LoadingScene, GalaxyScene, SolarSystemScene, PlanetScene, ErrorScene) and the `<SceneWrapper>` layout container.

- **`transitions/`**
  - **Contents:** Transition effect controllers (Fade screens, camera path controllers).

- **`routing/`**
  - **Contents:** Navigation logic, deep-linking tools, and URL sync hooks.

- **`state/`**
  - **Contents:** Helpers and selectors for Zustand scene routing states.

- **`events/`**
  - **Contents:** The centralized pub/sub broadcaster (`sceneEventEmitter.ts`).

- **`controllers/`**
  - **Contents:** Logic for coordinate checks and focus locks.

- **`lifecycle/`**
  - **Contents:** Custom React lifecycle hooks (`useSceneLifecycle.ts`).

- **`history/`**
  - **Contents:** Logic and cache stacks for back/forward navigation.

- **`debug/`**
  - **Contents:** Telemetry log overlays and Leva diagnostic tools.
