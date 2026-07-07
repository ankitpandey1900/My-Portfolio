# 09_Design_System

## Purpose

The Design System document defines the visual standards, UI tokens, color palettes, and interactive components for the **Solar Portfolio**. It establishes a cohesive design language that blends NASA realism with high-fidelity Sci-Fi aesthetics.

## Goals

1. **Visual Excellence:** Create a premium user experience that feels polished and technically impressive.
2. **Consistent UI/UX:** Standardize spatial design details, border radii, active states, and layout grids.
3. **Optimized Contrast:** Meet WCAG accessibility guidelines in a dark sci-fi color scheme.

## Architecture

The system is built on **CSS Custom Properties (Design Tokens)** implemented inside standard Tailwind utility styles. This allows the HUD layout and custom WebGL shaders to share identical color inputs.

```
                  ┌───────────────────────────────────────────────┐
                  │                 Design Tokens                 │
                  │        (globals.css Variables Configuration)  │
                  └───────────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│        HUD Styling (2D DOM)       │           │      Shader Uniforms (3D WebGL)   │
│  - Tailwind utility styles        │           │  - Sun Emission glowing maps      │
│  - Radix primitive glass panels   │           │  - Orbit paths stroke colors      │
│  - Framer Motion interaction states│           │  - Space particles light feeds    │
└───────────────────────────────────┘           └───────────────────────────────────┘
```

## Decisions

### 1. Color Palette (Space Theme)

We avoid flat primary colors, opting instead for deep space base tones accented by soft celestial gradients.

- **Space Black (Background):** `hsl(240, 15%, 2%)` | `#030305`
- **Nebula Violet (Base Accent):** `hsl(265, 80%, 40%)` | `#580bb5` (For soft glows and cosmic dust effects)
- **Deep Space Blue (Core Border):** `hsl(220, 60%, 15%)` | `#0f1e3d` (For orbit lines, default text wrappers)
- **Solar Orange (Dynamic Accent):** `hsl(25, 100%, 50%)` | `#ff6a00` (Used for Sun details, critical CTAs, active indicators)
- **HUD Teal (Data Overlay):** `hsl(180, 100%, 45%)` | `#00e5e5` (Used for active telemetry, data charts, button hover states)

### 2. Glassmorphism Panels

HUD overlays are styled to mimic spacecraft heads-up displays, blending glass textures with digital scanlines.

- **Panel Background:** `hsla(240, 15%, 5%, 0.4)` (Low opacity to keep WebGL stars visible beneath)
- **Backdrop Blur:** `backdrop-filter: blur(16px) saturate(180%)`
- **HUD Borders:** `1px solid hsla(180, 100%, 45%, 0.15)` (Teal outline at low opacity)
- **Panel Shadow:** `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(0, 229, 229, 0.05)`

### 3. Typography

- **Primary Sans-Serif:** **Outfit** (Google Fonts) - Clean, rounded geometry that feels futuristic yet readable. Used for titles and headings.
- **Secondary UI Interface:** **Inter** (Google Fonts) - Neutral, high-legibility sans-serif for body copy, paragraphs, and forms.
- **Telemetry & Data Display:** **JetBrains Mono** - Monospace font for coordinates, statistics, dynamic counters, and code blocks.

## Tradeoffs

- **Atmospheric Contrast vs. Neon Overload:** Sci-Fi interfaces often default to bright neon green or cyan text. This can strain the eyes and feel cluttered. _Decision:_ We use muted whites (`#e2e8f0`) and greys (`#94a3b8`) for all paragraph and body copy, reserving bright HUD Teal and Solar Orange strictly for accents and actions.
- **Blurred Background Performance:** Backdrop-filters can cause performance bottlenecks in older mobile browsers. _Decision:_ On mobile devices, backdrop filters are disabled (`backdrop-filter: none`) via CSS media queries, switching panels to a clean solid dark theme.

## Future Expansion

- **Dynamic HUD Color Schemes:** Allow visitors to customize the interface theme (e.g. switching the accent from Solar Orange to Deep Space Blue) by dynamically updating root HSL variables.

## Risks

- **Text Contrast:** Small font sizes on semi-transparent panels can fail contrast tests. _Mitigation:_ Ensure font weight on HUD overlays is never lower than 400, and use a dark background fallback wrapper behind transparent panels.

## Acceptance Criteria

- Color contrasts satisfy WCAG AA standards (minimum contrast ratio of 4.5:1 for body copy).
- Buttons and inputs feature clear transition states (hover, focus, disabled) mapped to 200ms durations.
- Border glows and glass blur properties degrade gracefully on unsupported browsers without breaking layout readability.

## Engineering Notes

- **Core Tailwind Theme Extensions (`tailwind.config.js` snippet):**

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        space: {
          black: 'var(--space-black)',
          violet: 'var(--space-violet)',
          blue: 'var(--space-blue)',
        },
        solar: {
          orange: 'var(--solar-orange)',
        },
        hud: {
          teal: 'var(--hud-teal)',
        },
      },
      fontFamily: {
        title: ['var(--font-outfit)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
};
```
