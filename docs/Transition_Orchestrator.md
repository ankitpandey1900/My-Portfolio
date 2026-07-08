# Transition Orchestrator

The Transition Orchestrator is a macro-level Queue and State Machine that dictates _when_ transitions happen across the application, preventing race conditions or conflicting animations.

## Architecture

- **`TransitionStore` (Zustand)**: Holds a queue of incoming requests, ordering them by priority.
- **`TransitionQueue`**: Push/Pop logic that guarantees high-priority animations (like `ReturnHome`) preempt lower-priority requests.
- **`TransitionController`**: Starts and finishes transitions, monitoring them with a fallback timeout (preventing infinite hanging).

## Usage

When you need to trigger a major UI/Camera animation, don't just trigger it immediately. Enqueue it.

```typescript
import { TransitionController } from '@/components/transition/transition-controller';

TransitionController.queueTransition('SectionOpening', 'projects', 40);
```
