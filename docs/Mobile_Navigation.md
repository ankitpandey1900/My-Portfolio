# Mobile Navigation

The gesture system works alongside the `NavigationManager` and `CameraTravelEngine` to seamlessly map touches to user intent.

### Examples

**Orbiting planets**:
`DragMove` events can map directly to a Three.js OrbitController or custom camera pivot.

**Zooming into planets**:
`DoubleTap` or `PinchMove` events can trigger the `CameraTravelEngine` to zoom into the actively selected solar system body.

**Navigating Portfolio Pages**:
When inside a portfolio Section, `SwipeRight` and `SwipeLeft` can be used to navigate back and forth without pressing explicit UI buttons.

### Future Accessibility Implementations

For users requiring reduced motion or large touch targets, `GestureConfig` values like `SWIPE_VELOCITY_THRESHOLD` should be dynamically relaxed depending on system preferences.
