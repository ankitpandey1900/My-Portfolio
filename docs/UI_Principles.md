# UI Principles

Visual guidelines governing layout, alignments, margins, and safe spaces across the portfolio.

---

## 1. Grid & Containers

- **Max Width:** HUD interfaces are capped at a maximum width of `80rem` (1280px) to prevent layout stretching on ultra-wide screens.
- **Layout Grid:** Standard 12-column layout grid system.
- **Marginal Padding:** Core viewport borders are configured with `24px` margins on desktop, reducing to `16px` on mobile screens.

---

## 2. HUD Positioning Principles

- **Header Telemetry Bar:** Positioned at the top of the viewport. Holds the site status logs, quick warp selector, and active page title.
- **Control Footers:** Audio controls are nested bottom-left. System coordinates and telemetry indicators sit bottom-right.
- **Safe Area margins:** Ensure HUD components do not clip into round notch displays or mobile gesture bars using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` overrides.

---

## 3. Accessible Layout Constants

- **Text Contrast:** Ensure all typography nodes meet WCAG contrast limits (4.5:1 ratio).
- **Focus States:** Every interactive button and form element must display a focus indicator when highlighted via keyboard tab triggers.
- **Touch Targets:** Tap buttons must occupy at least `48x48px` of spacing.
