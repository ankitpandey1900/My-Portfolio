# 11_UI_Component_System

## Purpose

The UI Component System defines the layout blueprints, behaviors, and construction guidelines for all two-dimensional interface elements. It details the HUD components overlaying the 3D canvas and explains how they integrate with Radix primitives and shadcn/ui.

## Goals

1. **Thematic Consistency:** Ensure all buttons, forms, and cards look like integrated spaceship dashboard instrumentation.
2. **Accessible Form Handling:** Implement validation indicators and clean error structures for quote forms.
3. **High Performant HUD:** Prevent DOM layouts from forcing WebGL thread stalls.

## Architecture

The UI is built as a set of decoupled React components, layered above the R3F Canvas using CSS absolute positioning and z-indexing.

```
┌──────────────────────────────────────────────────────────┐
│                      z-index: 50                         │
│     Dropdown lists, Dialog overlays, Notification toasts  │
└──────────────────────────────────────────────────────────┘
                            │
┌──────────────────────────────────────────────────────────┐
│                      z-index: 40                         │
│  Slide-out detail panels, Quote calculators, calendars   │
└──────────────────────────────────────────────────────────┘
                            │
┌──────────────────────────────────────────────────────────┐
│                      z-index: 30                         │
│  Global HUD borders, header trackers, mute indicators    │
└──────────────────────────────────────────────────────────┘
                            │
┌──────────────────────────────────────────────────────────┐
│                      z-index: 0                          │
│          React Three Fiber 3D Canvas Viewport            │
└──────────────────────────────────────────────────────────┘
```

## Decisions

### 1. Custom UI Registry

- **HUD Telemetry Bar:** Sticky header containing site title, system coordinate indicators, connection latency, and quick-search command bar.
- **Audio Controller:** Persistent bottom-left widget with audio waveform animations, track selection, and a mute toggle button.
- **Planet Detail Panel:** Slide-in right panel displaying title details (e.g. "Planet Earth: Featured Projects"), filter tags, and items grid.
- **Quote Calculator:** Interactive form containing pricing cards for SaaS, AI setup, and automation.
- **Command Console (Search / Warp):** Spotlight-style command modal (`Cmd+K` / `Ctrl+K`) built using Radix Command primitive to jump to any page.

### 2. Styling Rules

- **Borders:** Thin lines with translucent gradients matching HUD Teal.
- **Shadows:** Cyan/Teal glow rings (`box-shadow: 0 0 8px hsla(180, 100%, 45%, 0.2)`).
- **Inputs:** Dark transparent backgrounds with border highlights that glow on focus.

## Tradeoffs

- **Copy-Paste Components vs. Centralized Packages:** Using shadcn/ui copies component files into `components/ui/` instead of locking them in node modules. _Decision:_ This is highly beneficial because it allows us to directly inject custom glassmorphism styles and border glowing animations into the default shadcn configurations without dealing with complex overriding wrappers.
- **Inline CSS vs. Tailwind utility configurations:** Inline styles are fast, but Tailwind class names keep the code clean. _Decision:_ Standard utility classes are defined in `globals.css` (e.g. `@apply glass-panel glow-border`) to keep individual component files readable.

## Future Expansion

- **Dynamic Widget Configuration:** Allow users to drag and reposition HUD panels, saving their custom dashboard layouts in local storage.

## Risks

- **Z-Index Layering Bugs:** Open 3D canvas events (like orbit controls) can bleed through and trigger clicks on background DOM nodes. _Mitigation:_ Apply `pointer-events: none` to the main HUD container wrapper, and explicitly apply `pointer-events: auto` to interactive buttons and overlay panels.

## Acceptance Criteria

- Form elements support standard keyboard selection (Tab, Arrow keys, Enter/Space activation).
- Interactive UI controls feature visual active/focus rings satisfying WCAG focus indicators.
- Overlays slide open smoothly without causing FPS drops in the background 3D canvas.

## Engineering Notes

- **Standard Glass Panel Template Component (`src/components/ui/glass-panel.tsx` outline):**

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'teal' | 'orange' | 'violet';
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, glowColor = 'teal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-space-black/40 p-6 backdrop-blur-md transition-all duration-300',
          {
            'border-hud-teal/20 shadow-[0_0_15px_rgba(0,229,229,0.05)] hover:border-hud-teal/40':
              glowColor === 'teal',
            'border-solar-orange/20 shadow-[0_0_15px_rgba(255,106,0,0.05)] hover:border-solar-orange/40':
              glowColor === 'orange',
            'border-space-violet/20 shadow-[0_0_15px_rgba(107,0,255,0.05)] hover:border-space-violet/40':
              glowColor === 'violet',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = 'GlassPanel';
```
