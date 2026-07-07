# Performance Audit

## 1. Adaptive DPR

- **Status:** ✅ Validated
- **Details:** Device Pixel Ratio (DPR) is capped at `2.0` on high-density screens (like Retina displays) to avoid rendering redundant sub-pixels. On low-graphics settings, it drops to `1.0` to preserve GPU resources.

---

## 2. Mesh and Texture Compression

- **Status:** ✅ Validated
- **Details:** All 3D assets are optimized before loading:
  - **Geometries:** Compressed to Draco `.glb` binaries.
  - **Textures:** Compressed to KTX2 basis-universal format (`.ktx2`), allowing the GPU to read compressed textures directly without unpacking them first.

---

## 3. GPU Memory Disposal

- **Status:** ✅ Validated
- **Details:** The `<SceneWrapper>` unmount hook recursively traverses scene groups, calling `.dispose()` on all child geometries, materials, and textures to clean up VRAM on unmount.
