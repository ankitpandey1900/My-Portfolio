# Optimization Backlog

This backlog tracks deferred optimizations to be implemented in future milestones:

---

## 1. 3D Meshes Level of Detail (LOD)

- **Description:** Render low-poly planet meshes (under 500 vertices) when zoomed out, and swap to high-poly meshes (up to 8,000 vertices) only when the camera zooms in close.
- **Target:** Phase 2.1 (Celestial Bodies)
- **Priority:** Medium

---

## 2. KTX2 Basis-Universal Encoding

- **Description:** Convert PNG/JPEG asset maps to `.ktx2` format using the `toktx` CLI tool.
- **Target:** Phase 2.1 (Celestial Bodies)
- **Priority:** High

---

## 3. CDN Caching Policy

- **Description:** Configure strict cache headers on the CDN (`Cache-Control: public, max-age=31536000, immutable`) to cache static assets indefinitely.
- **Target:** Phase 3.1 (Deployment)
- **Priority:** Low
