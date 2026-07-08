# Gesture API

You can listen for normalized Gestures anywhere in the application.

## Methods

### `registerGesture(type: GestureType, callback: (data) => void)`

Subscribes to a specific gesture (`Tap`, `SwipeUp`, `PinchStart`, etc.). Returns an unsubscription function for React `useEffect` cleanups.

### `enableGestures()` & `disableGestures()`

Globally toggle the recognizer engine. Useful when a full-screen loading animation or cutscene is taking place and all touch inputs should be halted.

### `getCurrentGesture()`

Returns the live state (`touching`, `dragging`, `pinching`, `swiping`, `idle`).

### `cancelGesture()`

Programmatically forces the state into `cancelled`, halting active drags/pinches if the system requires a hard stop.
