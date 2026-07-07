# Loader System Specs

## Purpose

The Loader System document defines the preloading pipeline, caching rules, and asset tracking workflows for the **Solar Portfolio**.

## Assets Preloading Flow

We use Drei's loading helpers (`useGLTF`, `useTexture`, `useAudio`) to load assets.

- **Loading Manager (`src/components/canvas/loaders/asset-loader-manager.tsx`):** Listens to Drei's `useProgress()` hook and updates the Zustand store's loading progress metrics (`isLoading`, `progress`).
- **Initial Loader Screen:** Renders a clean 2D HUD loader overlay showing the loading progress percentage. It blocks entrance to the solar system until critical assets (such as the Sun and Earth models) are fully loaded.
- **Non-Critical Assets:** Secondary assets (like far planets) are lazy loaded in the background using React `<Suspense>` wrappers.

---

## Asset Formats

To keep load times under 3 seconds, all 3D assets must be pre-optimized:

- **Models:** Draco-compressed `.glb` binaries.
- **Textures:** Basis Universal `.ktx2` texture files.
- **Audio:** Loopable `.webm` (Ogg Vorbis) and `.mp3` fallbacks.
- **Fonts:** Pre-loaded Google Fonts.
