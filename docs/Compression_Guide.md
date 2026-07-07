# Compression Guide

## Purpose

The Compression Guide defines the compression thresholds and optimization tools for all file types in the portfolio.

---

## 1. Summary of Formats

| Asset Class     | Raw Extension   | Optimized Target         | Tools                     |
| :-------------- | :-------------- | :----------------------- | :------------------------ |
| **3D Meshes**   | `.obj` / `.fbx` | `.glb` (Draco / Meshopt) | `gltf-pipeline`, Blender  |
| **Image maps**  | `.png` / `.jpg` | `.ktx2` (Basis UASTC)    | `toktx`, `gltf-transform` |
| **UI Images**   | `.png` / `.jpg` | `.webp` (Lossy 75%)      | `cwebp`, Sharp            |
| **UI Icons**    | `.png`          | `.svg` (Optimized)       | SVGO, Figma               |
| **Audio Loops** | `.wav`          | `.webm` / `.mp3`         | FFmpeg, Audacity          |
| **Videos**      | `.mov` / `.mp4` | `.webm` (vp9 / AV1)      | FFmpeg, Handbrake         |

---

## 2. Mesh Compression Settings (Draco)

Draco compresses 3D geometries by quantizing coordinates and connectivity data. Use these settings in `gltf-pipeline`:

- **Compression Level (`-d`):** `7` (optimal ratio between file size reduction and decompression speed).
- **Position Quantization:** `11` bits (preserves sub-millimeter detail accuracy on mesh edges).
- **Normal Quantization:** `8` bits.
- **TexCoord Quantization:** `10` bits.

---

## 3. Texture Compression Settings (KTX2 UASTC)

Use KTX2 for 3D textures. KTX2 allows GPUs to read compressed textures directly, saving memory and keeping frame rates high.

- **UASTC Mode:** Standard mode for normal maps and high-detail textures.
- **ETC1S Mode:** High-compression mode for basic albedo maps (reduces file size by up to 75% compared to UASTC).
- **Mipmaps:** Enable mipmaps (`--mipmap`) to automatically downscale textures for objects far from the camera, saving GPU performance.
