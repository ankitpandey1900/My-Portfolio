# Design System Specs

## Philosophy

The Solar Portfolio visual style blends **NASA Realism** with **Apple's premium simplicity**, creating a dashboard that looks like real spaceship telemetry instrumentation. It is characterized by clean, dark backgrounds, high-legibility sans-serif and monospace text, and thin glow accents.

- **Space Realism over Cyberpunk:** Avoid aggressive neon colors. We project precision and analytical intelligence through HSL tailored dark greys, deep space blues, and soft orange and teal indicators.
- **Responsive telemetry HUD:** Layer panels above the WebGL viewport using absolute coordinates, clean borders, and backdrop-blur panels to keep the starfield visible.

---

## Semantic Color Scale

| Token Name   | Theme Role                           | Default (Dark)                   |
| :----------- | :----------------------------------- | :------------------------------- |
| `background` | Primary page body background         | `oklch(0.08 0.01 240)` (#030305) |
| `foreground` | Core paragraph/title copy text       | `oklch(0.93 0.01 240)` (#f8fafc) |
| `card`       | Standard details grids background    | `oklch(0.11 0.01 240)` (#0a0c14) |
| `primary`    | Highlight buttons / Focus borders    | `oklch(0.85 0.18 190)` (#00e5e5) |
| `secondary`  | Secondary panels / Active buttons    | `oklch(0.16 0.04 240)` (#0f1e3d) |
| `accent`     | Suns emission / Critical CTAs        | `oklch(0.72 0.25 25)` (#ff6a00)  |
| `border`     | Divider rules / Container boundaries | `rgba(0, 229, 229, 0.15)`        |

---

## Typography Scale

We leverage the following Google Fonts:

- **Outfit (Titles):** Large titles, planet labels, and dashboard panel headers.
- **Inter (UI Body):** Standard forms text, descriptions, details copy, and list items.
- **JetBrains Mono (Telemetry):** System coords indicators, graphs values, contribution metrics, and code formats.

---

## Future Extensibility

While Version 1 is Dark Theme only, all spacing, typography, and color tokens are mapped to root CSS variables (`var(--...)`), allowing light mode or alternative color themes to be loaded instantly via a simple parent CSS class swap.
