# Home Planet System

The **Home Planet** is the cinematic opening experience of the portfolio. It is represented by the Sun — the gravitational center of the solar system.

## What it does

On application load, the Home Planet system presents a full-screen HTML overlay sitting above the 3D WebGL canvas. It introduces the visitor to the portfolio owner through:

1. A cinematic vignette that eases in over the 3D solar environment.
2. A staggered text reveal (availability badge → name → title → tagline).
3. CTA buttons (Begin Journey, Download Resume, Hire Me) that appear last.
4. A bottom stats bar (Years, Projects, Technologies, Contributions, Hackathons).

## Phase State Machine

The experience advances through a strict, timed sequence:

```
idle → initializing → intro → reveal → ready → dismissed
```

- **idle**: Component not yet mounted.
- **initializing**: Overlay fades in, 3D canvas is already visible behind.
- **intro**: Vignette fully opaque, text elements preparing.
- **reveal**: Text elements animate in via staggered CSS transitions.
- **ready**: All CTAs active and interactive.
- **dismissed**: User clicked "Begin Journey"; overlay fades out, scene switches to `SYSTEM`.

## Architecture

| Layer      | File                        | Role                     |
| ---------- | --------------------------- | ------------------------ |
| Types      | `home-planet-types.ts`      | All TypeScript types     |
| Config     | `home-planet-config.ts`     | All content, stats, CTAs |
| State      | `home-planet-state.ts`      | Zustand store            |
| Events     | `home-planet-events.ts`     | sceneEventEmitter bridge |
| Controller | `home-planet-controller.ts` | Phase logic              |
| Manager    | `home-planet-manager.tsx`   | Headless lifecycle       |
| Provider   | `home-planet-provider.tsx`  | Context wrapper          |
| Hero       | `ui/home-hero.tsx`          | Root overlay             |
| Content    | `ui/hero-content.tsx`       | Name + title + tagline   |
| Actions    | `ui/hero-actions.tsx`       | CTA buttons              |
| Stats      | `ui/hero-stats.tsx`         | Quick stats bar          |
| Overlay    | `ui/hero-overlay.tsx`       | Radial vignette          |

## Configuration

All content lives in `home-planet-config.ts`. No text, no links, no stats are hardcoded in UI components.

## Accessibility

- `role="region"` with `aria-label` on the hero section.
- `aria-live="polite"` on availability badge.
- `aria-label` on all interactive elements.
- `prefers-reduced-motion` disables all CSS transitions via global media query.
- Keyboard: `Tab` navigates CTAs, `Enter` activates them.
