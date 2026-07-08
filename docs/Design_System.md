# Design System Specification

## Overview

This document serves as the absolute source of truth for the interactive portfolio's design system. It merges the extreme precision of Apple and Linear with the scientific grandeur of NASA and _Interstellar_. The system is engineered to be **Premium, Minimal, Scientific, Elegant, Interactive, and Future-ready**.

**Anti-Patterns (Strictly Prohibited):** Cyberpunk, Gaming Dashboards, RGB Neon.

---

## 1. Grid System & Layout

The grid prioritizes the 3D WebGL canvas. UI is pushed to the margins to maximize the viewport.

- **Mobile (< 768px):** 4 columns, `16px` margins, `16px` gutters.
- **Tablet (768px - 1024px):** 8 columns, `32px` margins, `24px` gutters.
- **Laptop (1025px - 1440px):** 12 columns, `64px` margins, `32px` gutters.
- **Desktop (1441px - 1920px):** 12 columns, `120px` margins, `32px` gutters, Max-width container: `1440px`.
- **Ultra-wide (> 1920px):** Max-width unlocks, UI anchors to the left/right thirds, center remains 100% transparent for the 3D scene.

---

## 2. Spacing System

Built on a strict **8px baseline scale**, with a 4px sub-scale for micro-adjustments.

- **Base Variables:**
  - `sp-1`: 4px (micro adjustments, icon spacing)
  - `sp-2`: 8px (inner button padding)
  - `sp-3`: 12px (form input padding)
  - `sp-4`: 16px (standard component padding)
  - `sp-6`: 24px (card padding)
  - `sp-8`: 32px (section gaps)
  - `sp-12`: 48px (major component gaps)
  - `sp-24`: 96px (section spacing, scroll breathers)
- **Safe Areas:** Adhere to `env(safe-area-inset-*)` on mobile to prevent UI from overlapping notches/home indicators.

---

## 3. Typography

**Primary Font:** `Inter` (sans-serif)
**Data/Mono Font:** `Geist Mono` or `Roboto Mono`

- **Display (Hero):** ~4.5rem (scales via clamp), Light (300). Tracking: `-0.03em`. Line-height: `1.1`.
- **Heading 1:** `3rem`, Medium (500). Tracking: `-0.02em`. Line-height: `1.2`.
- **Heading 2:** `2.25rem`, Medium (500). Tracking: `-0.01em`. Line-height: `1.2`.
- **Heading 3:** `1.5rem`, Regular (400). Tracking: `0em`. Line-height: `1.3`.
- **Body:** `1.125rem`, Regular (400). Tracking: `0em`. Line-height: `1.7` (airy and legible).
- **Small:** `0.875rem`, Regular (400). Tracking: `0.01em`. Line-height: `1.5`.
- **Caption:** `0.75rem`, Medium (500). Tracking: `0.02em`. Uppercase.
- **Mono / Code:** `0.875rem`, Regular (400). Tracking: `0.05em`. Line-height: `1.5`.

---

## 4. Color Tokens (Deep Space Theme)

Colors rely heavily on opacity and alpha channels over a pitch-black background.

- **Backgrounds:**
  - `bg-void`: `#030305` (Deepest space background)
  - `bg-glass`: `rgba(15, 15, 20, 0.4)` (For blurred panels)
  - `bg-inset`: `rgba(255, 255, 255, 0.03)` (For inputs and sunken areas)
- **Text:**
  - `text-primary`: `#F2F4F8` (Off-white)
  - `text-muted`: `#8A8D98` (Slate grey)
- **Semantic (Muted, Scientific tones):**
  - `color-accent`: `#FFFFFF`
  - `color-success`: `#4CAF50` (Muted emerald)
  - `color-warning`: `#FFB74D` (Muted amber)
  - `color-danger`: `#E57373` (Muted crimson)
- **Borders & Lines:**
  - `border-glass`: `rgba(255, 255, 255, 0.08)`
  - `border-focus`: `rgba(255, 255, 255, 0.4)`
- **Opacity Tokens:**
  - `opacity-disabled`: `0.4`
  - `opacity-glass`: `0.05`
  - `opacity-glass-hover`: `0.1`

---

## 4.5 Z-Index System (Critical for 3D Overlays)

To prevent the WebGL canvas from swallowing UI elements, z-indexes must strictly adhere to this scale:

- `z-canvas`: `0` (The WebGL context)
- `z-base`: `10` (Standard overlay UI, Navigation)
- `z-dropdown`: `40` (Dropdowns, tooltips)
- `z-modal`: `50` (Dialogs, full-screen overlays)
- `z-toast`: `100` (Notifications, critical alerts)

---

## 5. Elevation & Depth

Elevation is achieved through light and blur, not heavy drop shadows.

- **Elevation 0 (Base):** Flat on the void.
- **Elevation 1 (Cards):** `backdrop-filter: blur(12px)`, `box-shadow: 0 4px 24px rgba(0,0,0,0.4)`.
- **Elevation 2 (Modals/Dialogs):** `backdrop-filter: blur(24px)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.6)`.
- **Hover/Focus Glow:** A subtle, expansive `box-shadow: 0 0 16px rgba(255,255,255,0.1)`.

---

## 6. Border Radius

Corners are sleek but not sharp.

- **Small (`rad-sm`):** `4px` (Tags, Code blocks)
- **Medium (`rad-md`):** `8px` (Inputs, Buttons)
- **Large (`rad-lg`):** `16px` (Cards, Panels)
- **Extra Large (`rad-xl`):** `24px` (Modals)
- **Pill (`rad-pill`):** `9999px` (Badges, Floating Orbs)

---

## 7. Motion & Animation Tokens

Animation must be fluid, deliberate, and deeply eased. Never snappy or linear.

- **Durations:**
  - `t-fast`: `150ms` (Hover states, button active states)
  - `t-medium`: `300ms` (Panel fades, simple transitions)
  - `t-slow`: `800ms` (Modal entrances, complex UI choreography)
  - `t-hero`: `2500ms` (Planet travel, camera interpolation)
- **Stagger Delays (For cascading lists):**
  - `stagger-fast`: `50ms`
  - `stagger-slow`: `100ms`
- **Easings:**
  - `ease-standard`: `cubic-bezier(0.4, 0.0, 0.2, 1)`
  - `ease-out-expo`: `cubic-bezier(0.19, 1, 0.22, 1)` (Used for grand entrances)
  - `ease-in-out-expo`: `cubic-bezier(1, 0, 0, 1)` (Used for camera flights)

---

## 8. Component Specifications

- **Buttons:** Minimal padding (`12px 24px`), `border-radius: 8px`. Background is `rgba(255,255,255,0.05)`. Hover scales to `1.02x` and increases background opacity to `0.1`.
- **Cards / Panels:** High glass blur, `1px` inner translucent white border. No solid backgrounds.
- **Forms & Inputs:** Inset background `rgba(255,255,255,0.03)`. `8px` radius. Focus states apply a crisp `border-focus` and a delicate white halo.
- **Tooltips:** Sleek, pill-shaped (`rad-pill`). `12px` padding, 12px font size. Appears with a `t-fast` fade up (Y-axis translate).
- **Toast/Badges:** Pill-shaped, floating, using the semantic color palette.

---

## 9. Planet UI Components (3D HUD)

- **Planet Label:** Floating HTML element pinned to 3D coordinates. Consists of a 1px white line connecting the planet center to the label text. Font is `Geist Mono`, uppercase.
- **Travel Indicator:** A minimalist circular progress SVG that wraps around the cursor during the 2.5s travel sequence.
- **Landing Overlay:** A subtle vignette and noise overlay that fades in upon planetary landing to transition the user from "Space" to "Atmosphere".

---

## 10. Icons

- **Style:** Stroke-based, geometric, minimalist (e.g., Lucide or Phosphor Icons).
- **Weight:** 1.5px stroke width. Consistent universally.
- **Size:** 16px (small), 20px (standard), 24px (large).
- **Color:** `text-muted` by default, transitions to `text-primary` on hover/active.

---

## 11. Responsive Rules

- **Desktop (Default):** Floating glass panels overlaying the 3D scene.
- **Tablet:** Panels consume more width; touch targets increase to 44px minimum.
- **Mobile:** The 3D scene is heavily cropped. Glass panels convert to full-width, bottom-sheet overlays that slide up over the canvas to maximize reading space.
- **Touch Interaction:** Hover states are bypassed; interaction relies entirely on tap-to-focus and swipe-to-dismiss.

---

## 12. Accessibility Standards

- **Contrast:** Text over glass panels must maintain WCAG AA contrast (4.5:1). Darken the panel's background opacity automatically if the 3D camera is facing the sun.
- **Color Blindness (Error States):** Never rely purely on `color-danger` (red) to communicate an error. Forms and alerts must always pair semantic colors with distinct iconography (e.g., an 'X' icon or an alert triangle) and descriptive text labels.
- **Keyboard Navigation:** Every interactive element must possess a visibly distinct focus ring (`box-shadow: 0 0 0 2px rgba(255,255,255,0.6)`).
- **Reduced Motion:** If `prefers-reduced-motion` is detected, convert `t-hero` camera travels to instant cuts, and disable background star particle movement.
- **Touch Targets:** No interactive element will be smaller than `44x44px` on mobile screens.

---

## 13. Performance Budgets

- **Animation:** DOM animations strictly utilize `transform` and `opacity`. Banned properties: `box-shadow` or `backdrop-filter` animation, and `width/height` tweening.
- **DOM Budget:** Keep node counts exceptionally low. UI should unmount rather than hide via `display: none` when off-screen.
- **Canvas Budget:** Maintain 60 FPS.
  - Degrade gracefully: If FPS drops below 45, disable Depth of Field (DOF), disable Bloom, and remove CSS `backdrop-filter` on UI elements.

---

## 14. Naming Conventions

- **Design Tokens:** Follow functional naming, not literal (e.g., `text-primary`, NOT `text-white`).
- **CSS Variables:** Prefix with `space-` (e.g., `--space-bg-void`, `--space-ease-expo`).
- **Components:** PascalCase (e.g., `PlanetCard`, `NavigationOrb`).

---

## 15. Future Expansion

- **Themes:** While the default is Deep Space, the design system is tokenized to allow a future "Day/Light" theme representing a planet's surface under full atmosphere (e.g., white backgrounds, dark grey text).
- **Localization:** Text containers are designed to flex. Hardcoded widths are banned to allow for languages like German which have high character counts.
