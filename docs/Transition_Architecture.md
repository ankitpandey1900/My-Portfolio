# Transition System Architecture

## Purpose

The Transition System document defines transition profiles, post-processing animation cues, and audio crossfades.

---

## 1. Transition Profiles

- **Fade Profile:** Renders a clean 2D HTML/CSS black screen overlay over the canvas, swapping scene components in the background before fading out.
- **Camera Fly Profile:** Smoothly moves the camera position toward the target planet mesh center using Bezier curve calculations.
- **Warp Speed Profile:** Zooms the camera close to the target mesh, turning star particles into streaks (warp lines) and enabling post-processing motion blurs.

---

## 2. Transition Timings

| Transition Profile | Duration | Easing Curve                    | Canvas Shader Trigger  |
| :----------------- | :------- | :------------------------------ | :--------------------- |
| **Fade Screen**    | `800ms`  | `cubic-bezier(0.25, 1, 0.5, 1)` | Fade layer alpha       |
| **Camera Fly**     | `1500ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Camera focus vectors   |
| **Warp Speed**     | `2000ms` | `cubic-bezier(0.25, 1, 0.5, 1)` | Warp star streak alpha |

---

## 3. Audio Crossfading

During scene transitions, ambient background music tracks crossfade to match the new scene:

- When a transition starts, the current audio node fades to zero volume over `500ms`.
- The new scene's audio node loads silently and fades up to its default volume over `500ms` once the transition is complete.
- Uses the Web Audio API's `linearRampToValueAtTime()` for smooth, stutter-free volume fades.
