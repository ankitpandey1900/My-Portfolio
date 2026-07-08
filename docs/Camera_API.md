# Camera Travel API

To interact with the Camera Travel Engine, import `useCameraTravelStore` and dispatch requests.

## Queue Travel

```typescript
import { useCameraTravelStore } from '@/components/canvas/camera/travel/camera-travel-state';

// Fire a cinematic travel to a planet
useCameraTravelStore.getState().queueTravel({
  targetId: 'earth',
  durationMs: 3000,
  easing: 'ease-in-out',
  onComplete: () => console.log('Arrived at Earth'),
});

// Fire a return-to-overview
useCameraTravelStore.getState().queueTravel({
  targetId: null,
  targetPosition: [0, 60, 120],
  targetLookAt: [0, 0, 0],
  durationMs: 2500,
});
```

## Supported Easing Profiles

- `'linear'`: Standard robotic speed.
- `'ease-in-out'`: Cinematic smooth start and deceleration.
- `'custom'`: Reserved for spline-driven speed mapping.

## State Subscriptions

UI Overlays can subscribe to travel states natively:

```typescript
const isTravelling = useCameraTravelStore((state) => state.state === 'travelling');
const progress = useCameraTravelStore((state) => state.progress);

// Use `progress` to drive loading bars or warp speed tunnel effects
```
