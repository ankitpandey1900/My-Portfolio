# Cinematic Director

The **Cinematic Director** is a headless orchestration engine responsible for coordinating the entire Portfolio Experience. It ensures that the Camera, Environment, Transitions, and UI all synchronize perfectly without causing React render bottlenecks.

## Core Concepts

- **No Rendering**: The Director does not render any visual components. It solely dispatches events and commands to other Controllers (e.g., `EnvironmentController`, `CameraController`).
- **Async Timeline**: Sequences are executed via the `SequenceTimeline` engine, which uses Promises to manage delays and parallel actions. This completely bypasses the React `useFrame` or render cycle, resulting in massive performance gains.
- **Config Driven**: Every cinematic moment (like the `IntroSequence`) is defined as a static JSON-like tree of `SequenceAction` primitives in the `SequenceRegistry`.

## Usage

To trigger a sequence from anywhere in the app:

```typescript
import { CinematicDirectorController } from '@/components/director';

// Plays immediately if Idle, otherwise queues
CinematicDirectorController.playSequence('IntroSequence');
```
