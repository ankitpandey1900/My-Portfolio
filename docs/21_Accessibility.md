# 21_Accessibility

## Purpose

The Accessibility (a11y) document defines the patterns, focus behaviors, keyboard mappings, screen-reader fallbacks, and layout rules for the **Solar Portfolio**. It ensures the website remains accessible to users with visual, auditory, motor, or cognitive impairments.

## Goals

1. **WCAG Compliance:** Satisfy WCAG 2.1 AA design targets.
2. **Keyboard Navigation Support:** Enable full website navigation using only the keyboard.
3. **Screen Reader Support:** Maintain screen-reader accessible alternatives for all interactive 3D elements.
4. **Motion Control:** Respect browser reduced-motion preferences to prevent discomfort for visitors with vestibular disorders.

## Architecture

The accessibility architecture uses a **Parallel Access Layer**. Alongside the 3D WebGL canvas, the DOM maintains a fully accessible semantic outline. Screen readers and keyboard navigation are directed to this DOM layer, bypassing the 3D canvas entirely.

```
                  ┌───────────────────────────────────────────────┐
                  │                 Visitor Input                 │
                  └───────────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│        Standard Pointer User      │           │    Keyboard / Screen Reader User  │
│  - Hover planet coordinates       │           │  - Keyboard Tab focus events      │
│  - Click & Drag orbital views      │           │  - WAI-ARIA layout markers        │
│  - High fidelity post effects     │           │  - Prefers-Reduced-Motion active  │
└───────────────────────────────────┘           └───────────────────────────────────┘
```

## Decisions

### 1. Keyboard Control Scheme

Visitors can navigate the entire portfolio without using a mouse. Tab keys move focus sequentially through interactive elements in the HUD:

- **Focus Order:** Navigation Header -> Quick-Warp Dropdown -> Planet Cards -> Info Panel Elements -> Audio Console -> Contact Form Fields.
- **Focus Indicators:** Focused elements display a high-contrast teal ring (`outline: 2px solid var(--hud-teal); outline-offset: 4px;`).
- **Active Controls:**
  - `Enter` / `Space`: Activate warp to selected planet node or click button.
  - `Escape`: Close any open information overlay panel, returning focus to the source planet node.

### 2. Motion Accessibility (Vestibular Support)

- The site listens for the browser preference `prefers-reduced-motion: reduce`.
- When detected, the Zustand store updates `reducedMotion = true`.
- **Behavior overrides:**
  - Deep space camera pans are disabled.
  - Planet orbital and axial spin rotations are paused.
  - Transitions are simplified to static, instant opacity fades.

### 3. Screen Reader Integrations

- Interactive canvas elements include corresponding description labels. The main canvas element uses:
  `<canvas role="img" aria-label="Interactive 3D model of the solar system. Use the navigation menu or keys 1 to 7 to warp between planets."></canvas>`
- Dynamic stats (such as telemetry coords) are wrapped in live regions (`aria-live="polite"`), notifying screen readers when values update.

## Tradeoffs

- **Free 3D Navigation vs. Linear Access Paths:** Navigating a 3D canvas with a keyboard is complex and often confusing. _Decision:_ Keyboard focus bypasses the WebGL canvas, moving instead through the structured links of the HUD navigation menu, keeping the experience simple and accessible.

## Future Expansion

- **Voice-Activated Commands:** Add basic voice control inputs (e.g. "go to projects," "contact") for visitors with motor impairments.

## Risks

- **Focus Trap Bugs:** If modal overlays fail to lock focus, keyboard users can accidentally interact with background elements. _Mitigation:_ We use Radix UI primitives for dialogs and modals, which handle focus traps and escape key events automatically.

## Acceptance Criteria

- The portfolio can be navigated using only the Tab, Enter, Space, and Escape keys.
- Text and interactive components maintain a minimum contrast ratio of 4.5:1 against their backgrounds.
- Activating reduced motion settings successfully pauses all 3D rotations and travel animations.

## Engineering Notes

- **Global Reduced Motion Hook (`src/hooks/use-reduced-motion.ts` outline):**

```ts
import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function useReducedMotion() {
  const setReducedMotion = useStore((state) => state.setReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChanges = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChanges);
    return () => mediaQuery.removeEventListener('change', handleChanges);
  }, [setReducedMotion]);
}
```

- **Visual Focus Rule:** Avoid using CSS declarations that remove focus styles (`outline: none`) without replacing them with accessible alternatives.
