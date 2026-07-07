# 10_Animation_System

## Purpose

The Animation System document defines the mechanical rules, mathematical curves, timing metrics, and rendering configurations for all motion across the **Solar Portfolio**. It details how 3D camera travel transitions, orbital mechanics, particle systems, and DOM overlays coordinate to maintain a cohesive physical universe.

## Goals

1. **Fluid Navigation:** Eliminate motion stutter to maintain a locked 60 FPS update rate during camera travels.
2. **Atmospheric Weight:** Use natural physics-based easing curves to mimic real gravitational accelerations.
3. **Responsive Visual Cues:** Provide instant, crisp visual feedback for hover, focus, and select interactions.

## Architecture

The system uses a two-tiered animation execution model. High-performance camera path interpolation and vector transitions are handled outside React by the GSAP core scheduler. DOM-based animations (like panel sliders and HUD alerts) are handled declaratively in the React render cycle using Framer Motion.

```
                         ┌───────────────────────────────────────────────┐
                         │               Zustand Navigator               │
                         │             (Active Location State)           │
                         └───────────────────────┬───────────────────────┘
                                                 │
                         ┌───────────────────────┴───────────────────────┐
                         ▼                                               ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│        GSAP Camera Engine         │           │       Framer Motion DOM           │
│  - Cubic Bezier curve paths       │           │  - HUD Layout Transitions         │
│  - Direct Three.js vector writes   │           │  - 2D overlay slide / fade hooks  │
└───────────────────────────────────┘           └───────────────────────────────────┘
```

## Decisions

### 1. Camera Travel Mechanics

When a user selects a planet, the camera travels along a custom curved Bezier path.

- **Travel Path Formula:** Standard 3D cubic Bezier curves defined by a start point, end point, and two control points.
  $$\mathbf{B}(t) = (1-t)^3\mathbf{P}_0 + 3(1-t)^2t\mathbf{P}_1 + 3(1-t)t^2\mathbf{P}_2 + t^3\mathbf{P}_3, \quad t \in [0,1]$$
- **Control Points Selection:** To simulate gravity assists, the control points ($\mathbf{P}_1, \mathbf{P}_2$) are calculated by offsetting vectors from the Sun at `[0, 0, 0]`, creating a curve that dips toward the Sun before zooming into the destination planet.
- **Camera Easing Curve:** **`power3.inOut`** (GSAP preset) - Starts slowly, accelerates during deep space travel, and decelerates smoothly as it slides into orbit.
- **Duration:** Standard travel is set to **1.6 seconds** (configurable in HUD settings).

### 2. Celestial Object Animations

- **Planet Spin:** Constant, uniform rotation on the Y-axis.
  $$\theta_{t} = \theta_{0} + \omega \cdot \Delta t$$
  Where rotational velocity ($\omega$) is scaled per planet to represent relative astronomical speeds without boring the user.
- **Orbital Path Tracking:** Planets follow mathematical circular orbits around the Sun. Orbit lines are rendered using a custom dashboard shader with a slow-moving dash array to indicate orbit direction.

### 3. DOM HUD Overlays (Framer Motion)

- **Panel Slide-in:** Right-hand panels slide in from the right edge.
  - **Timing:** `duration: 0.4`, `ease: [0.16, 1, 0.3, 1]` (custom ultra-smooth deceleration curve).
- **Alert Flash:** HUD warning messages blink once on reveal using an opacity scale from `0` to `1` over 150ms.

## Tradeoffs

- **Physics Precision vs. UX Layouts:** Real planet distances are too vast for a single screen, and real speeds are too slow. _Decision:_ We use a stylized logarithmic scale for distances, and scale rotational speeds up to make the motion visible.
- **Camera Collision vs. Simple Pans:** Moving the camera along straight lines can clip it through planets or the Sun. _Decision:_ Camera control points are dynamically adjusted depending on the current and target coordinates to keep the viewport clear of any intermediate planets.

## Future Expansion

- **Dynamic Space Particle Trails:** Add warp trails (lines stretching along the motion vector) behind space dust particles during camera warp transitions.

## Risks

- **Motion Sickness (Vestibular Disorders):** Fast camera moves can cause discomfort for some users. _Mitigation:_ Listen for CSS preference `prefers-reduced-motion`. When active, disable all 3D camera travel animations and transition UI panels instantly.

## Acceptance Criteria

- Camera travel execution maintains a minimum frame rate of 55 FPS during transit.
- Selecting a planet locks the camera target vector coordinates to the planet mesh center, keeping the viewport tracking the planet as it rotates.
- Hover animations on interactive HUD nodes do not loop or stack when the cursor triggers multiple rapid mouseover events.

## Engineering Notes

- **GSAP R3F Hook Template (`src/hooks/use-camera-warp.ts` outline):**

```ts
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

export function useCameraWarp() {
  const { camera } = useThree();

  const warpTo = (targetPos: THREE.Vector3, lookAt: THREE.Vector3) => {
    // Generate curved path control points
    const controlPoint = new THREE.Vector3()
      .addVectors(camera.position, targetPos)
      .multiplyScalar(0.5);
    controlPoint.y += 10; // Elevate path apex

    // Animate position
    gsap.to(camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.6,
      ease: 'power3.inOut',
    });

    // Animate focal target vector
    // (Controlled in R3F useFrame via reference vector)
  };

  return { warpTo };
}
```
