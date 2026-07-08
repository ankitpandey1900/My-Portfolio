# Planet Lifecycle Specification

## Purpose

The **Planet Lifecycle** document details the operational phases of a planetary body, starting from compilation setups, moving through user coordinate interactions, and concluding with VRAM cleanup sweeps.

---

## Lifecycle Phases Matrix

Each planet component matches ten lifecycle stages coordinated by the manager:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Initialize  │ ──> │     Load     │ ──> │    Mount     │
│ (types map)  │     │ (textures)   │     │ (R3F Scene)  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Suspend    │ <── │    Resume    │ <── │    Update    │
│  (pauses)    │     │  (re-focus)  │     │ (useFrame)   │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Deactivate  │ ──> │    Unload    │ ──> │   Destroy    │
│ (blur state) │     │ (unmounts)   │     │ (VRAM clear) │
└──────────────┘     └──────────────┘     └──────────────┘
```

1. **Initialize**: Factory maps types and reads registry profiles.
2. **Load**: Triggers asset pipeline loader queues (textures, normal maps).
3. **Mount**: Registers coordinates in the R3F Canvas and binds manager pointer hovers. Emits `planet:loaded`.
4. **Update**: Coordinates orbital sweeps and axial spin updates on the GPU inside `useFrame`.
5. **Suspend**: Invoked when transitioning context (e.g. camera warping to details panel overlays). Pauses self-rotation.
6. **Resume**: Restores speed multipliers and updates focus vectors.
7. **Deactivate**: Disables mouse focus overlays. Emits `planet:blurred`.
8. **Unload**: Commences unmounting sweeps.
9. **Destroy**: Frees material arrays and disposes textures.
10. **Cleanup**: Emits `planet:disposed`, freeing pointers.
