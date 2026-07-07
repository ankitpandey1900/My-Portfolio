# Solar Portfolio Repository Foundation

This repository establishes the production-ready engineering foundation for the **Solar Portfolio** web application, a flagship interactive space exploration experience and professional portfolio.

---

## Tech Stack

- **Framework:** Next.js (App Router, dynamic layouts)
- **Frontend Library:** React (Functional component models, Hooks lifecycle)
- **Language:** TypeScript (Strict compiler rules)
- **Styling:** Tailwind CSS (v4 with PostCSS compile pipeline)
- **Formatting & Linting:** ESLint & Prettier configs

---

## Architecture Overview

The application follows a **decoupled Split-Pane Layout** designed to keep 3D calculations separate from standard DOM rendering cycles:

- **The Celestial Layer (3D Canvas):** Controlled via React Three Fiber (R3F) and Three.js inside `src/components/canvas/`. (To be configured in a later milestone).
- **The Tactical Layer (2D HUD Overlay):** HTML overlays structured under `src/components/hud/` and `src/features/` managing forms, details grid overlays, and telemetry navigation.
- **Bridge State Store:** Unified, lightweight global updates driven by Zustand (`src/lib/store.ts`) allowing 3D objects and 2D panels to interact without triggering unnecessary React DOM layouts.

---

## Folder Structure

```
portfolio/
├── app/                      # Next.js App Router Routes & Layouts
├── src/                      # Source Code root
│   ├── components/           # Shared Global UI components
│   │   ├── canvas/           # R3F WebGL Components (Sun, Planets, Orbits, Stars)
│   │   ├── hud/              # 2D Interface overlays (HUD, panels, navigation)
│   │   └── ui/               # Custom styled basic primitives (copy-paste shadcn style)
│   ├── features/             # Domain-specific logic groupings
│   │   ├── analytics/        # Telemetry, visitor tracking schemas, widgets
│   │   ├── contact/          # Forms, Resend mail actions, validation models
│   │   ├── projects/         # Project grids, filtering logic, tech tags
│   │   └── services/         # Dynamic pricing estimator, quote request logic
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Library Initializations & Helpers (db, utils, env config)
│   ├── providers/            # React Context custom providers
│   ├── services/             # Core network/API fetch abstractions
│   ├── constants/            # Global styling or visual configurations
│   ├── types/                # Shared TypeScript models
│   ├── styles/               # CSS Design tokens and entrypoint stylesheets
│   └── assets/               # Local images/vectors bundled during compile
├── public/                   # Static assets served from root URL path
│   ├── models/               # Compressed 3D GLB/GLTF geometry models
│   ├── textures/             # Compressed KTX2/PNG map layouts
│   └── audio/                # Loopable soundscapes
├── tests/                    # Testing Foundation (unit & e2e shells)
│   ├── unit/                 # Unit tests (Vitest)
│   └── e2e/                  # End-to-End browser tests (Playwright)
└── docs/                     # Project architectural design logs
```

---

## Local Setup & Development Workflow

### 1. Pre-requisites

- **Node.js:** v20.x (LTS) or higher
- **NPM:** v10.x or higher

### 2. Getting Started

1. Clone the repository and navigate to the project directory:
   ```bash
   cd portfolio
   ```
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Copy environment template to local variables:

   ```bash
   cp .env.example .env.local
   ```

   _(Note: Populate `.env.local` with placeholder values or real tokens for live testing)_

4. Launch the local development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## Code Quality & Engineering Tools

We enforce strict automated formatting, linting, type safety, and commit standards across all check-ins:

- **Husky:** Manages local Git hooks (pre-commit checks and commit-msg verification).
- **lint-staged:** Limits ESLint and Prettier runs strictly to files currently staged for commit, maximizing hook performance.
- **Commitlint:** Rejects commit messages that do not conform to Conventional Commits standards.
- **Prettier Import Sorting:** Formats and groups import blocks logically (React/Next first, followed by third-party packages, absolute paths, and relative paths) using `@ianvs/prettier-plugin-sort-imports`.

---

## Branch Strategy & Contribution Flow

### 1. Branch Strategy

Our repository uses a trunk-based branching workflow:

- **`main` / `master`:** Represents production releases. Only merged from verified pull requests.
- **`develop`:** Represents active development integration. Pre-production staging.
- **`feature/*` / `bugfix/*` / `refactor/*` / `docs/*`:** Developer topic branches branched off `develop`.

### 2. Contribution Steps

1. Create a topic branch off `develop`:
   ```bash
   git checkout -b feature/canvas-planet-rings
   ```
2. Make your edits conforming to the coding guidelines inside `docs/24_AGENTS.md`.
3. Staging and committing triggers Git hooks:
   - **Pre-commit hook:** Runs TypeScript checks (`npm run typecheck`) globally, followed by `lint-staged` which formats and lints only changed files.
   - **Commit-msg hook:** Lints your commit message format.
4. Push your branch and open a Pull Request targeting `develop`.
5. The GitHub Actions CI workflow runs automatically, verifying types, formatting, lint rules, and production bundle builds before review.

---

## Commit Conventions

Commit messages must follow the **Conventional Commits** standard:

```
<type>(<optional scope>): <short description>
```

Approved Types:

- `feat`: A new feature entry.
- `fix`: A code bug fix.
- `docs`: Documentation updates.
- `style`: Styling layout edits (white-space, formatting, semicolons).
- `refactor`: Structural code reorganization without behavior shifts.
- `perf`: Execution performance improvements.
- `test`: Adding or correcting tests.
- `build`: Changes to build systems, npm packages, or dependencies.
- `ci`: Continuous integration pipeline adjustments.
- `chore`: Minor tasks, release tags, or auxiliary tool updates.
- `revert`: Reverts a previous commit.

Example:
`feat(canvas): add spline camera travels navigation`

---

## Package Scripts

- `npm run dev` - Boots local dev server on port `3000` with Turbopack compilation.
- `npm run build` - Generates optimized production build with standalone target.
- `npm run start` - Launches production standalone server.
- `npm run lint` - Runs strict ESLint inspection.
- `npm run lint:fix` - Runs ESLint inspection and automatically fixes repairable issues.
- `npm run format` - Standardizes all files formatting using Prettier edits.
- `npm run format:check` - Verifies that all files conform to formatting standards.
- `npm run typecheck` - Compiles TypeScript definitions to assert type-safety.
- `npm run clean` - Cleans build output directories (`.next`, `out`, `build`).
- `npm run prepare` - Prepares Git hooks configuration during package installs.
- `npm run verify` - Executes typecheck, formatting, lint, and build checks in a unified pipeline.
