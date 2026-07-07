# 23_Coding_Standards

## Purpose

The Coding Standards document defines the formatting guidelines, TypeScript conventions, react patterns, linting structures, and repository commit rules for the **Solar Portfolio**. It establishes coding patterns to maintain a clean, readable, and consistent codebase.

## Goals

1. **Codebase Uniformity:** Enforce identical styling and layout patterns across all files.
2. **Type Safety:** Eliminate compiler workarounds and enforce strict type definitions.
3. **Optimized Hooks:** Limit unnecessary re-renders in React and WebGL files.

## Architecture

Coding standards are enforced using automated configurations integrated into the workspace editor and CI pipeline:

```
                  ┌───────────────────────────────────────────────┐
                  │                 Developer IDE                 │
                  └───────────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│        ESLint Engine Checks       │           │      Prettier Code Formatting     │
│  - Banned standard JS shortcuts   │           │  - 2 space indents                │
│  - No any-type usage overrides    │           │  - Single quotes config           │
│  - Enforce explicit return types  │           │  - Print width set to 100         │
└───────────────────────────────────┘           └───────────────────────────────────┘
```

## Decisions

### 1. TypeScript Rules

- **Explicit Interfaces:** Avoid inline types. All props, return objects, and payload data structures must define explicit `interface` or `type` contracts.
- **No `any` rule:** Standard eslint rule `no-explicit-any` is configured to `error`. Workarounds like `// @ts-ignore` are banned unless accompanied by an architectural comment explaining the GPU or browser compiler bug requiring it.
- **Literal Type Helpers:** Leverage TypeScript template literal types for unit mapping where appropriate (e.g. `type HexColor = \`#\${string}\``).

### 2. React & Hook Design Rules

- **Functional Component structures:** Use standard arrow-functions (`const Component: React.FC = () => {}`) or traditional function statements (`export function Component() {}`).
- **Hook Limits:** Keep custom hooks single-purpose. Hooks that fetch data (like `/api/github`) should use SWR or React Query hooks instead of running manual `useEffect` loops with local state variables.
- **Memory Management:** Wrap all math computations inside the R3F render loop in `useMemo` or update them in-place using reference targets. This prevents memory allocations (and GC pauses) during the rendering loop.

### 3. Commit & Pull Request Rules

- **Git branch names:** Use prefixes: `feature/`, `bugfix/`, `docs/`, `refactor/` (e.g. `feature/canvas-mars-glow`).
- **Commit patterns:** Follow Semantic Commits style: `<type>(<scope>): <short summary>` (e.g. `feat(canvas): add orbital splines camera pans`).

## Tradeoffs

- **Strict Type Safety vs. Prototype Speed:** Strict TypeScript rules can slow down initial prototype code. _Decision:_ Enforce strict typing from day one. In the long run, this prevents typing bugs in our 3D math and state systems, making the codebase much more stable.

## Future Expansion

- **Automated Package Checkers:** Add automated dependencies audits (`npm audit`) to pull request validation workflows to block packages with known security issues.

## Risks

- **Inconsistent Formats:** Different code editor setups can conflict on formatting rules. _Mitigation:_ The project includes configured `.editorconfig`, `.prettierrc`, and `.eslintrc.json` files, and runs format checks during pull requests to verify compliance.

## Acceptance Criteria

- The project builds with zero compiler or linting warnings.
- Coding standards are applied uniformly to all TypeScript, TSX, CSS, and configuration files.
- Commit messages follow the Semantic Commits standard.

## Engineering Notes

- **ESLint Configuration (`.eslintrc.json` blueprint):**

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

- **Prettier Configuration (`.prettierrc` blueprint):**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```
