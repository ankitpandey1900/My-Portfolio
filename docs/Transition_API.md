# Transition API

## Core Methods

### `queueTransition(id: TransitionId, targetId?: string, priorityOverride?: number)`

Pushes a request onto the queue. If it's highest priority and the engine is idle, it runs immediately.

### `startTransition(id: TransitionId, targetId?: string, forceUid?: string)`

_Internal Use Usually_. Bypasses the queue and instantly fires.

### `completeTransition(uid?: string)`

Flags the current active transition as finished and begins processing the next item in the queue.

### `cancelTransition(uid?: string)`

Flags the current transition as aborted.

### `clearQueue()`

Wipes all pending transition requests.
