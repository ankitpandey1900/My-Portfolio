# Gesture System

The Gesture System normalizes complex touch, pointer, and multi-touch interactions across any mobile, tablet, or touch-screen device into simple, strongly typed, actionable events (like `SwipeLeft` or `PinchStart`).

## Architecture

- **`GestureRecognizer`**: Pure calculation logic converting delta (distance/time) into swipes, deadzones into drags, and Pythagorean calculations into pinches.
- **`GestureManager`**: React-bound global listener utilizing passive DOM listeners to prevent scroll-blocking and ensure 60FPS mobile performance.
- **`GestureStore` (Zustand)**: Primarily an audit trail and state reflection (e.g. tracking how many active pointers exist), disconnected from the main render cycle unless requested.

## High-Performance Principles

The system strictly avoids `setState` inside `requestAnimationFrame` or generic pointer moves unless an explicit threshold is broken (e.g., breaking `GESTURE_CONFIG.DRAG_DEADZONE_PX`).

For absolute maximum performance, the recognizer listens to the `document.documentElement` natively using `passive: true`.
