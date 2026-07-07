# Design Tokens Specifications

## 1. Color Variables

- **Space Black:** `#030305` — Deep space background.
- **Nebula Violet:** `#580bb5` — Atmospheric dust cloud maps.
- **Deep Space Blue:** `#0f1e3d` — Container edges, inactive selectors.
- **Solar Orange:** `#ff6a00` — Sun emission glow, warning indicators.
- **HUD Teal:** `#00e5e5` — Telemetry active states, buttons, focus borders.

---

## 2. Spacing Scale

We follow standard 4px/8px grid parameters:

- `xs` / `1` — `4px`
- `sm` / `2` — `8px`
- `md` / `4` — `16px`
- `lg` / `6` — `24px`
- `xl` / `8` — `32px`

---

## 3. Glassmorphism Specs

HUD dashboards panels share standard glass specifications:

- **Background:** `rgba(3, 3, 5, 0.4)` (Low opacity backdrop)
- **Backdrop Blur:** `blur(12px) saturate(180%)`
- **Border:** `1px solid rgba(0, 229, 229, 0.15)`
- **Hover State:** `border-color: rgba(0, 229, 229, 0.4)` with inline shadow glow.

---

## 4. Shadows & Glows

- `shadow-surface` — `0 2px 8px rgba(0, 0, 0, 0.5)`
- `shadow-floating` — `0 8px 32px rgba(0, 0, 0, 0.6)`
- `shadow-dialog` — `0 16px 48px rgba(0, 0, 0, 0.8)`
- `shadow-glow-teal` — `0 0 8px rgba(0, 229, 229, 0.2)`

---

## 5. Z-Index Stack layers

- `z-index: 50` — Dropdowns, tooltip overlays, notification logs.
- `z-index: 40` — Slide-over detailed panels, dialog modals.
- `z-index: 30` — Telemetry bars, HUD headers.
- `z-index: 0` — WebGL Canvas viewport.
