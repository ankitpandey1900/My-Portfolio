# Interaction Events Dictionary

The Interaction Engine broadcasts and subscribes to events using the global `sceneEventEmitter`. This document outlines the event signatures used within the Solar System module.

## Supported Events

Events are prefixed with `interaction:` globally, but are handled via the `InteractionEvents` helper module which provides end-to-end type safety.

### `PlanetHover`

Fired when a pointer (mouse/touch) enters the bounding geometry of a planet mesh.

- **Payload**: `{ planetId: string, timestamp: number }`

### `PlanetLeave`

Fired when a pointer exits the bounding geometry.

- **Payload**: `{ planetId: string, timestamp: number }`

### `PlanetClick`

Fired upon a full `pointerdown` and `pointerup` lifecycle within a single planet, bypassing the double-click threshold.

- **Payload**: `{ planetId: string, timestamp: number }`

### `PlanetDoubleClick`

Fired if two consecutive clicks occur within `INTERACTION_CONFIG.doubleClickThresholdMs` (default 300ms).

- **Payload**: `{ planetId: string, timestamp: number }`

### `PlanetFocus`

Triggered via accessibility controls (keyboard navigation mapping) or programmatic scene transitions.

- **Payload**: `{ planetId: string, timestamp: number }`

### `PlanetBlur`

Triggered when focus moves away.

- **Payload**: `{ planetId: string, timestamp: number }`

## Future Events

- `FutureLongPress`
- `FutureContextMenu`

## Event Subscription Model

Components needing to react to interactions (e.g. sound engines, UI overlays) should subscribe via the `InteractionEvents.on()` helper:

```ts
import { InteractionEvents } from '../interaction/interaction-events';

useEffect(() => {
  const unsubscribe = InteractionEvents.on('PlanetClick', (payload) => {
    console.log(`Planet ${payload.planetId} clicked at ${payload.timestamp}`);
  });
  return unsubscribe;
}, []);
```
