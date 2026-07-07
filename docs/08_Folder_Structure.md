# 08_Folder_Structure

## Purpose

The Folder Structure document defines the official codebase organization rules for the **Solar Portfolio**. It establishes a clean layout that separates Next.js routes, UI components, R3F WebGL elements, database integrations, and static assets.

## Goals

1. **Logical Separation of Concerns:** Keep standard 2D web assets decoupled from complex 3D WebGL render groups.
2. **Feature Modularization:** Group related code (components, services, hooks, utilities) by feature domain.
3. **Prevent Code Bloat:** Establish clear guidelines on where shared utilities, constants, and styles belong.

## Architecture

The workspace follows the **Next.js App Router structure with localized feature domains**.

```
portfolio/
├── app/                      # Next.js App Router Routes & Layouts
├── src/                      # Source Code root
│   ├── components/           # Shared Global UI components
│   │   ├── canvas/           # R3F WebGL Components (Sun, Planets, Orbits, Stars)
│   │   ├── hud/              # 2D Interface overlays (HUD, panels, navigation)
│   │   └── ui/               # shadcn/ui custom styled basic primitives
│   ├── features/             # Domain-specific logic groupings
│   │   ├── analytics/        # Telemetry, visitor tracking schemas, widgets
│   │   ├── contact/          # Forms, Resend mail actions, validation models
│   │   ├── projects/         # Project grids, filtering logic, tech tags
│   │   └── services/         # Dynamic pricing estimator, quote request logic
│   ├── hooks/                # Custom React Hooks
│   │   ├── use-audio.ts      # Spatial Web Audio controls hook
│   │   ├── use-orbit.ts      # Custom camera rotation hooks
│   │   └── use-window.ts     # Viewport dimensions listener
│   ├── lib/                  # Library Initializations & Helpers
│   │   ├── db.ts             # Supabase client wrapper
│   │   ├── utils.ts          # Tailwind merge & general utility tools
│   │   └── store.ts          # Zustand global states container
│   ├── styles/               # CSS Design tokens and entrypoint stylesheets
│   │   └── globals.css       # Core Design System overrides
│   └── types/                # Shared TypeScript models
│       └── index.ts          # Global interface schemas
├── public/                   # Static assets served from root URL path
│   ├── models/               # Compressed 3D GLB/GLTF geometry models
│   ├── textures/             # Compressed KTX2/PNG map layouts
│   └── audio/                # Loopable soundscapes
└── docs/                     # Project architectural design logs
```

## Decisions

- **Decouple Canvas from HUD:** All R3F elements belong strictly under `src/components/canvas/`. React components that render normal HTML overlays belong under `src/components/hud/`. This separation keeps our files focused and prevents imports from getting tangled.
- **Feature-Folder Design:** Core operations like "Contact Portal" and "Visitor Analytics" are isolated inside `src/features/`. This keeps components, database actions, and validation models localized.

## Tradeoffs

- **Deep Nesting vs. Flat Source Directories:** Feature-folder architectures add directory nesting, but they make scaling clean. When adding a "Blog" feature later, we simply drop a `src/features/blog/` directory into the project without touching the rest of the codebase.
- **Separation of 3D Assets:** Placing all models and textures in `/public` is required for Three.js loader resolutions, but it bypasses Next.js bundling step. _Mitigation:_ We use manual compression tools (Draco, KTX2) on raw assets before putting them in the `/public` directory.

## Future Expansion

- **Module Path Aliases:** Leverage TypeScript compiler path maps to allow importing files cleanly without long relative paths:
  - `@/canvas/*` -> `src/components/canvas/*`
  - `@/hud/*` -> `src/components/hud/*`
  - `@/features/*` -> `src/features/*`
  - `@/lib/*` -> `src/lib/*`

## Risks

- **Name Collisions:** Developers might create duplicate utility functions in different feature folders. _Mitigation:_ Enforce strict code-reviews. Any helper function reused in more than two features must be moved up to `src/lib/utils.ts`.

## Acceptance Criteria

- No direct, uncompressed heavy models are stored in the git repository (use Git LFS or external CDN links if assets exceed 10MB).
- Features are isolated; no file in `src/features/analytics/` can import logic from `src/features/contact/`.
- Path mapping configuration (`tsconfig.json`) resolves all imports correctly.

## Engineering Notes

- **File Naming Rules:**
  - React Component files: PascalCase (e.g. `PlanetConsole.tsx`).
  - Hooks files: camelCase prefixed with "use" (e.g. `useSpaceControl.ts`).
  - General helper files: camelCase (e.g. `formatBytes.ts`).
  - CSS files: lowercase dash-separated (e.g. `theme-tokens.css`).
