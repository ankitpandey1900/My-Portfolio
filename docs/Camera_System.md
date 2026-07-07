# Camera System Architecture

## Purpose

The Camera System document defines the viewport focal targets, travel paths, zoom boundaries, and interpolation timing parameters.

## Perspective Camera

- **Base FOV:** Set to `45` degrees (cinematic viewing angle).
- **Near Clip Plane:** `0.1` units.
- **Far Clip Plane:** `1000` units (prevents background skybox clipping).

---

## Centralized Interpolation

Camera position coordinates are handled outside the React rendering loop using global vectors.

- The `CameraController` reads target vectors from Zustand (`targetPosition` and `targetLookAt`).
- Position interpolation is calculated inside the R3F rendering loop:
  `camera.position.lerp(targetVector, lerpFactor)`
- This allows camera travel to run smoothly alongside orbit rotations without stuttering.

---

## Dynamic Focus Targets

- **Warp Travel:** When a visitor clicks a planet card, the camera transitions along a curved Bezier spline toward the planet mesh center.
- **Focal Locking:** Once warping is complete, the camera's focus point tracks the active planet coordinates as it moves along its orbital path.

---

## Spawn Lifecycle

During initial portal mount, a cinematic spawn animation is executed:

1. The camera is placed at a distant coordinate vector `[0, 120, 280]`.
2. Upon active mounting, `CameraManager` triggers a smooth translation sweep towards the default `'galaxy'` preset coordinates (`[0, 60, 120]`).
3. This creates a swooping visual introduction that pulls the user into the deep space environment.

---

## Responsive Viewport Scaling

To support vertical screen layouts (mobiles and tablets), the `CameraManager` dynamically tracks the viewport aspect ratio:

- If aspect ratio is $< 1.0$, the target FOV is incremented by $+10$ degrees.
- This creates a wider viewing angle to prevent stardust or orbital tracks from clipping past screen margins on vertical layouts.
