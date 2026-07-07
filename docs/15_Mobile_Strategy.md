# 15_Mobile_Strategy

## Purpose

The Mobile Strategy document defines the interaction patterns, performance modifications, layout styles, and touch control inputs for mobile visitor profiles. It ensures the space navigation narrative remains clear on small screens.

## Goals

1. **Optimize for Touch Navigation:** Replace precision mouse interactions with intuitive mobile tap/swipe controls.
2. **Resource Management:** Reduce CPU, GPU, and battery consumption on mobile devices.
3. **Responsive UI Outlines:** Deliver mobile-friendly HUD overlays and clean layouts.

## Architecture

The mobile architecture uses a **Hybrid Canvas/Slide-over** structure. While desktop layouts display HUD overlays alongside the 3D scene, mobile interfaces slide panels up from the bottom of the screen to cover the viewport, reducing background rendering overhead.

```
+───────────────────────────+
| [ Telemetry HUD Header ]  |
+───────────────────────────+
|                           |
|       3D Viewport         |
|      (Logarithmic)        |
|                           |
+───────────────────────────+
| <   Next Planet (Earth) > | <- Touch Swipe Carousel Bar
+───────────────────────────+
| [  Details Slide-Up  ] ^  |
+───────────────────────────+
```

## Decisions

### 1. Touch Interaction Model

- **Swipe-Carousel Navigation:** Standard desktop drag-to-orbit controls are disabled on mobile. Instead, visitors navigate between planets using a bottom swipe-carousel bar (or simple left/right overlay arrows). Swiping warps the camera to the next planet, keeping the experience simple and intuitive.
- **Locked Pinch-to-Zoom:** Users cannot zoom in or out freely on mobile. Zoom depths are locked to preset orbit levels to prevent camera clipping and disorientation.
- **Touch Targets:** All interactive HUD elements (buttons, links, form inputs) are designed with a minimum touch area of **`48x48px`** and spaced to prevent accidental clicks.

### 2. Rendering Profile (Mobile)

When a mobile device is detected (via user-agent check or CSS media query), the WebGL engine adapts its quality profile:

- **Textures:** Limit planet texture resolutions to a maximum of **1024px** (diffuse and normals).
- **Starfields:** Particle counts are cut by 60% (e.g. from 5,000 down to 2,000).
- **Lighting:** Disable real-time shadows. Light sources are simplified to a single directional vector with no ambient occlusion computations.
- **Post-Processing:** Bloom, chromatic aberration, and noise filters are disabled, preserving battery life and performance.

## Tradeoffs

- **Immersive Freedom vs. Touch Usability:** Letting mobile users orbit and fly freely around planets in 3D often leads to camera orientation bugs. _Decision:_ We trade free-flight controls for a structured linear/carousel tour model, ensuring visitors can access the content easily.
- **Canvas Fallback vs. 3D Optimization:** We chose to optimize the WebGL canvas rather than switching to a flat 2D fallback. This preserves the core space navigation experience for mobile visitors while adjusting quality settings to keep it performant.

## Future Expansion

- **Device Gyroscope Integration:** Allow mobile users to tilt their phones to look around the space scene slightly, adding a clean, interactive depth effect without complex controls.

## Risks

- **Thermal Throttling:** Prolonged 3D rendering can overheat mobile devices and drain battery. _Mitigation:_ The 3D canvas rendering loop is paused whenever an information panel slides open and covers the screen, keeping the device cool.

## Acceptance Criteria

- Buttons and inputs meet standard touch target size guidelines (48px minimum height/width).
- The website runs smoothly at a stable 30+ FPS on mid-range mobile devices (e.g., iPhone X / Samsung Galaxy S10).
- Bottom slide-up panels handle long scrollable content without locking up touch gestures.

## Engineering Notes

- **React Hook to Detect Mobile Profiles (`src/hooks/use-mobile.ts` outline):**

```ts
import { useEffect, useState } from 'react';

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, [breakpoint]);

  return isMobile;
}
```

- **CSS Touch Target Styling:** Use tailwind utility spacing class mappings (`p-3`, `min-h-[48px]`, `min-w-[48px]`) to ensure buttons are touch-friendly.
