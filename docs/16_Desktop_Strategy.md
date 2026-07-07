# 16_Desktop_Strategy

## Purpose

The Desktop Strategy document defines the high-fidelity rendering profiles, mouse/keyboard input schemas, custom cursor mechanics, and layout configurations optimized for desktop visitor profiles.

## Goals

1. **Maximize Visual Quality:** Deliver a cinematic experience using high-resolution assets, advanced lighting, and post-processing effects.
2. **Precision Navigation:** Provide responsive mouse controls and keyboard shortcuts to navigate the space scene.
3. **Advanced HUD Layouts:** Leverage wider screens to display multi-column panels and dashboards alongside the 3D canvas.

## Architecture

The desktop architecture utilizes a **Split-Pane Viewport**. The 3D Space Canvas fills the background, while the HUD controls are placed around the screen edges. Information panels slide in from the right, taking up 40% of the screen width and keeping the interactive planet visible on the left.

```
+───────────────────────────────────────────────────────────+
| [ Telemetry HUD Header ]                                  |
+───────────────────────────┬───────────────────────────────+
|                           | [ Planet Details Panel ]      |
|                           |                               |
|       3D Viewport         | - Title & Stats (Inter)       |
|      (Fully Orbitable)    |                               |
|                           | - Grid details (Projects)     |
|                           |                               |
|                           | - Call to Action (CTA)        |
+───────────────────────────┴───────────────────────────────+
| [ Ambient Audio Console ]               [ Quick Warp Deck]|
+───────────────────────────────────────────────────────────+
```

## Decisions

### 1. Control Mappings

- **Mouse Navigation:** Visitors can click and drag on the background space scene to rotate the camera around the active planet. Scrolling the mouse wheel zooms the camera within safe min/max limits.
- **Keyboard Hotkeys:**
  - `1` to `7` keys: Quick warp directly to corresponding planets.
  - `Space`: Toggle orbital rotation pause.
  - `Esc`: Close any open HUD panel and zoom back to orbit.
  - `Cmd/Ctrl + K`: Open the Command Console input finder.
- **Interactive Custom Cursor:** The default mouse pointer is replaced with a custom CSS/DOM cursor designed as a telemetry targeting reticle. It expands on hover states and displays local coordinate positions.

### 2. High-Fidelity Rendering Settings

When a desktop environment is detected, the WebGL engine configures its maximum performance settings:

- **Textures:** Use high-resolution **2K/4K** planet textures and normal maps.
- **Shadow Maps:** Enable soft shadow mapping (`THREE.PCFSoftShadowMap`) on the Sun, casting dynamic shadows behind planets.
- **Starfields:** Render a dense particle field of 10,000 stars with variable sizes and twinkling behaviors.
- **Post-Processing (R3F Postprocessing):** Enable Bloom, Lens Flare, Chromatic Aberration, and a subtle CRT scanline overlay.

## Tradeoffs

- **Visual Quality vs. GPU Load:** Rendering dynamic shadows and post-processing filters on older laptops can cause frame rate drops. _Decision:_ Add a **"Graphic Quality"** toggle (High / Low) in the HUD settings. The default state is set dynamically by assessing the user's hardware profile on initial load.
- **Custom Cursor vs. Input Delay:** DOM-based custom cursors can feel laggy due to browser update cycles. _Decision:_ We animate the custom cursor using CSS transform properties inside a requestAnimationFrame loop, ensuring it tracks mouse movements smoothly.

## Future Expansion

- **Multi-Monitor Layouts:** Adapt HUD panels dynamically on wider screens (like 21:9 monitors) to keep the central 3D space scene clear.

## Risks

- **WebGL Browser Crashes:** Intensive rendering can crash the browser tab if GPU memory runs low. _Mitigation:_ Automatically disable post-processing filters if the framerate falls below 20 FPS, ensuring the site remains usable.

## Acceptance Criteria

- The website runs at a stable 60 FPS on recommended hardware (e.g. M1 Mac or mid-range Intel i5 desktop).
- Keyboard navigation hotkeys trigger warp transitions correctly.
- The custom cursor tracks mouse movements smoothly with no visible lag.

## Engineering Notes

- **GSAP Custom Cursor Implementation Blueprint (`src/components/hud/custom-cursor.tsx` outline):**

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hud-teal/60 mix-blend-difference"
    />
  );
}
```

- **Performance Check Utility:** Query `gl.getParameter(gl.RENDERER)` to detect mobile or low-end integrated graphics, switching the graphics profile automatically.
