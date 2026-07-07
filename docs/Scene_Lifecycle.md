# Scene Lifecycle Specification

## Purpose

The Scene Lifecycle document defines the stages of a 3D scene's existence, from initialization to destruction, and how they correspond to user actions.

---

## Lifecycle Stages

Every scene component wrapped in the `<SceneWrapper>` automatically progresses through five stages managed by the `useSceneLifecycle` hook:

### 1. Initialize Stage

- **Trigger:** Component mounts in the React virtual DOM tree.
- **Actions:** Instantiates helper math vectors, fetches local configuration parameters, and triggers pre-loader requests.
- **Broadcaster Event:** `[scene-name]:initialize`

### 2. Mount & Activate Stage

- **Trigger:** Selected scene matches the Zustand store's `currentScene` value.
- **Actions:** Connects active cameras, binds mouse-movement listeners, and enables light rigs.
- **Broadcaster Event:** `[scene-name]:mount`

### 3. Resume Stage

- **Trigger:** The scene returns to focus (e.g. closing an overlay details card).
- **Actions:** Resumes planet rotation loops and restarts particle animations.
- **Broadcaster Event:** `[scene-name]:resume`

### 4. Suspend Stage

- **Trigger:** The active scene changes, but the component remains in the virtual tree during transitions.
- **Actions:** Pauses animations, disables lighting shadows, and ignores input controllers.
- **Broadcaster Event:** `[scene-name]:suspend`

### 5. Destroy Stage

- **Trigger:** Component unmounts from the DOM.
- **Actions:** Recursively traverses the scene graph to call `.dispose()` on all geometries and materials, freeing up GPU VRAM.
- **Broadcaster Event:** `[scene-name]:destroy`
