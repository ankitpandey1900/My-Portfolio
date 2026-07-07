# State Management Architecture

## Purpose

The State Management document defines the separation of concerns, data flow rules, and Zustand state layouts.

---

## 1. Separation of Concerns

To keep the application highly organized, states are separated into distinct modules:

- **Global App State:** Tracks global states like `isLoading`, preloader progress percentages, and mute settings.
- **Renderer State:** Quality profile toggles ('low', 'high'), target Device Pixel Ratios (DPR), and post-processing flags.
- **Camera State:** Camera coordinates vectors (`targetPosition`, `targetLookAt`) and warp transit toggles.
- **Scene Routing State:** Tracks the active scene (`currentScene`), back navigation arrays, and transition targets.
- **Audio State:** Mute settings and volume slider values.

---

## 2. Dynamic Update Flows

```
  DOM UI Interaction (Clicks)
               │
               ▼
┌──────────────────────────────┐      React Render
│      Zustand Store           │ ─────────────────> DOM Overlays updates
│  (Centralized State Source)  │
└──────────────┬───────────────┘
               │
               │ useFrame updates
               ▼
┌──────────────────────────────┐
│      WebGL R3F Canvas        │
│   (Reads vectors directly)   │
└──────────────────────────────┘
```

## 3. Zustand Performance Guidelines

To prevent unnecessary component re-renders:

- **Selective Subscriptions:** Components must subscribe only to the specific state properties they need, avoiding selecting the entire store:
  `const currentScene = useStore((state) => state.currentScene);`
- **Vector Updates:** Update coordinate vectors directly inside the R3F `useFrame` render loop rather than through React state updates. This maintains a smooth frame rate during camera movements.
