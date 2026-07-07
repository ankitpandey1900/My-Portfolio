# Texture Optimization Workflow

## Purpose

The Texture Workflow document defines the image formats, resolutions, baking specs, and compression settings for WebGL textures.

## 1. Texture Map Classifications

- **Albedo (Color) Map:** Stores base color data. Gamma space (`sRGB`).
- **Normal Map:** Stores surface relief details. Linear space (`Linear`). Export using OpenGL coordinates (+Y up).
- **Roughness/Metalness Map:** Stores surface glossiness and metallic properties. Packed into a single file to save memory (Roughness in the green channel, Metalness in the blue channel). Linear space.
- **Occlusion (AO) Map:** Stores shadow details. Linear space.

---

## 2. Resolution Standards

To optimize GPU memory across device profiles, we enforce strict resolution limits:

| Asset Category                     | Desktop Resolution | Mobile Resolution | Format       |
| :--------------------------------- | :----------------- | :---------------- | :----------- |
| **Large Bodies** (Sun, Jupiter)    | 2048 x 2048        | 1024 x 1024       | KTX2 / Basis |
| **Medium Bodies** (Earth, Mars)    | 1024 x 1024        | 512 x 512         | KTX2 / Basis |
| **Small Elements** (Moons, Panels) | 512 x 512          | 256 x 256         | KTX2 / WEBP  |
| **Skybox Nebulae**                 | 4096 x 2048        | 2048 x 1024       | KTX2 / WEBP  |

---

## 3. KTX2 / Basis Universal Conversion

We use KTX2 (.ktx2) for all 3D engine textures. KTX2 allows GPUs to read compressed textures directly without unpacking them first, saving memory and keeping frame rates high.

To compress flat PNG/JPEG images into KTX2 basis textures, run:

```bash
# Convert PNG image to KTX2 UASTC format with mipmaps enabled
toktx --encode uastc --mipmap public/assets/textures/planet-earth-albedo.ktx2 public/assets/textures/planet-earth-albedo.png
```

For basic UI fallbacks and flat images, export in WebP format:

```bash
# Convert image to WebP (75% quality compression)
cwebp -q 75 public/assets/textures/screenshot.png -o public/assets/textures/screenshot.webp
```
