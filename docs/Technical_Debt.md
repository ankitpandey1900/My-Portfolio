# Technical Debt Register

This register tracks code debt and areas for future refactoring:

---

## 1. React 19 ForwardRef Typings

- **Debt Area:** Component ref overrides in dynamic tag elements (e.g. `<Typography>`).
- **Workaround:** Component declarations are cast to `any` to prevent compilation errors under React 19's ForwardRef types.
- **Impact:** Low. The components render correctly in production.
- **Resolution Plan:** Refactor when React 19 typings are officially updated to natively support dynamic tag references.

---

## 2. Upstream PostCSS Vulnerability

- **Debt Area:** Moderate severity CSS XSS vulnerability within PostCSS.
- **Location:** Nested within Next.js dependencies (`node_modules/next/node_modules/postcss`).
- **Impact:** Low. Our application is static and does not accept user-input CSS styles.
- **Resolution Plan:** Monitor Next.js releases and update `next` once the PostCSS dependency is bumped.
