# Dependency Audit

## 1. Production Dependencies

| Dependency                    | Purpose                               | Status |
| :---------------------------- | :------------------------------------ | :----- |
| `three`                       | Core 3D library                       | Used   |
| `@react-three/fiber`          | React wrapper for Three.js            | Used   |
| `@react-three/drei`           | Helper components for R3F             | Used   |
| `@react-three/postprocessing` | Post-processing effects composer      | Used   |
| `three-stdlib`                | Additional Three.js tools and loaders | Used   |
| `zustand`                     | State management store                | Used   |
| `@base-ui/react`              | Accessible, unstyled primitives       | Used   |
| `lucide-react`                | SVG icon library                      | Used   |

---

## 2. Security Scan Status (PostCSS Vulnerability)

- **Vulnerability:** Moderate severity (XSS via unescaped stringify outputs in PostCSS).
- **Location:** Nested within Next.js dependencies (`node_modules/next/node_modules/postcss`).
- **Mitigation:** Safe for our production build since our application is static and does not accept user-input CSS styles.
