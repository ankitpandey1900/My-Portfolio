# 14_Performance_Budget

## Purpose

The Performance Budget document establishes strict runtime, compile-time, and asset performance budgets for the **Solar Portfolio**. It details optimization workflows, texture processing rules, level-of-detail (LOD) configurations, and script splitting guidelines to ensure a fast, responsive user experience.

## Goals

1. **Fast Initial Load:** The initial page shell must load and render in under 1.5 seconds.
2. **Smooth Interaction:** Maintain a steady 60 FPS rendering cycle on standard hardware.
3. **Optimized Assets:** Implement automated size optimization pipelines for all 3D assets and textures.

## Architecture

Performance is managed at three key levels: **Asset Processing**, **Runtime Loop Optimization (WebGL)**, and **Script Bundle Partitioning (Next.js)**.

```
┌──────────────────────────────────────────────────────────┐
│                 Next.js Bundle Splitting                 │
│      Dynamic import of 3D Canvas assets (under 150KB)    │
└────────────────────────────┬─────────────────────────────┘
                             │
       ┌─────────────────────┴─────────────────────┐
       ▼                                           ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│     3D WebGL Loop Tuning     │            │    Asset Pre-Optimization    │
│  - LOD mesh degradation      │            │  - Draco Mesh Compression    │
│  - Frustum Camera Culling    │            │  - KTX2 Texture formats      │
│  - Max 1 shadow light        │            │  - Max 2K diffuse textures   │
└──────────────────────────────┘            └──────────────────────────────┘
```

## Decisions

### 1. WebGL Performance Tuning

- **Level of Detail (LOD) Nodes:** Planet meshes will utilize R3F `<detailed>` nodes. When the camera is far away (Galaxy or Overview state), low-poly meshes (under 500 vertices) are rendered. As the camera zooms in, they swap dynamically to high-poly versions (up to 8,000 vertices with normal maps).
- **Texture Compression (KTX2 / Basis Universal):** Textures are compressed to KTX2 format. This maintains high quality while allowing GPUs to read textures directly in compressed format, saving memory and preventing frame drops.
- **Camera Frustum Culling:** R3F frustum culling is enabled on all stars and orbital rings, pausing render calculations for assets outside the viewport.
- **Lighting Constraints:** Shadow-casting lights are capped at a maximum of **1** (directed from the Sun at coordinates `[0,0,0]`). Ambient lights are baked into textures where possible, and dynamic lights are disabled on mobile devices.

### 2. File Size Budgets

| Asset Class            | Max Budget | Format Target | Optimization Tool            |
| :--------------------- | :--------- | :------------ | :--------------------------- |
| **Initial JS Shell**   | 120 KB     | Gzipped JS    | `next/dynamic` chunking      |
| **WebGL Core Bundle**  | 250 KB     | Gzipped JS    | Tree-shaken Three.js imports |
| **Solar System Model** | 1.5 MB     | GLB (Draco)   | `gltf-pipeline / gltfpack`   |
| **Sun Texture Map**    | 800 KB     | KTX2 / Basis  | `toktx` CLI                  |
| **Planet Diffuse Map** | 400 KB     | KTX2 / Basis  | `toktx` CLI                  |
| **Looping Audio File** | 1.2 MB     | WebM / MP3    | FFmpeg compression           |

## Tradeoffs

- **Procedural Shaders vs. Pre-baked Textures:** Procedural shaders look infinite and generate details dynamically, but compiling too many complex shaders can cause framerate hitching on startup. _Decision:_ Use pre-baked textures for most planet surfaces, and reserve custom shaders only for critical focal elements (the Sun heat haze and Earth atmosphere glows).
- **Post-processing Bloom vs. Performance:** WebGL bloom effects look beautiful but require rendering the scene twice per frame. _Decision:_ Disable Bloom and lens flare filters by default on mobile devices and integrated GPU profiles, allowing users to toggle them on manually if desired.

## Future Expansion

- **Adaptive Quality Engine:** Build a dynamic frame rate monitor hook. If the render loop drops below 45 FPS for three consecutive frames, the site will automatically reduce particle counts, disable shadows, and notify the user that it has switched to "Performance Mode".

## Risks

- **Vercel Edge Asset Timeouts:** Large 3D models can take too long to download on slow networks. _Mitigation:_ Deliver all public folder static files through Cloudflare's CDN with aggressive caching settings.

## Acceptance Criteria

- **Google PageSpeed Score:** > 90 for Desktop configurations.
- **FPS Minimum floor:** Steady 60 FPS on desktop (with dedicated GPU) and 30 FPS on average mobile devices.
- **Memory footprint:** The browser tab's RAM usage must remain under 120MB during active solar navigation.

## Engineering Notes

- **Command script to compress GLTF files:**

```bash
# Convert a raw GLTF file to a Draco-compressed GLB binary
npx gltf-pipeline -i raw_model.gltf -o public/models/optimized_model.glb -d
```

- **Command script to compress textures to KTX2:**

```bash
# Convert PNG textures to KTX2 format with supercompression
toktx --encode uastc --zstd 15 public/textures/planet_diffuse.ktx2 public/textures/planet_diffuse.png
```

- **React Dynamic Import implementation blueprint:**

```tsx
import dynamic from 'next/dynamic';

const SolarSystemCanvas = dynamic(() => import('@/components/canvas/solar-system-canvas'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});
```
