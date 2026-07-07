# Asset Pipeline Architecture

## Purpose

The Asset Pipeline document defines the static resource lifecycles, loading priorities, prefetching strategies, and GPU resource disposal rules for the **Solar Portfolio**.

## 1. Asset Lifecycle Diagram

Every 3D asset flows through a four-stage process:

```
┌────────────────┐      Request       ┌────────────────┐
│   HTTP Cache   │ ─────────────────> │  System RAM    │
│  (Disk/Browser)│                    │  (Loaded File) │
└────────────────┘                    └───────┬────────┘
                                              │
                                              │ GPU Upload
                                              ▼
┌────────────────┐      Disposal      ┌────────────────┐
│  Disposed RAM  │ <───────────────── │   GPU VRAM     │
│ (Garbage Coll.)│                    │ (Active Mesh)  │
└────────────────┘                    └────────────────┘
```

---

## 2. Loading Hierarchy

To keep the initial load time under 3 seconds, assets are split into three priority levels:

### Priority 1: Core Assets (Pre-loaded)

- **Assets:** Sun model, Earth model, primary HUD fonts, SVG menu icons, initial ambient audio loop.
- **Behavior:** Blocks app entry. Loaded inside the splash screen; progress is shown as a percentage in the loader HUD.

### Priority 2: Deferred Assets (Lazy Loaded)

- **Assets:** Outer planet models (Jupiter, Saturn, Uranus, Neptune) and details textures.
- **Behavior:** Fetched in the background after the visitor enters the 3D solar system. Managed using React `<Suspense>` wrappers.

### Priority 3: Contextual Assets (On-demand)

- **Assets:** Higher-resolution detail textures, project screenshots, audio hover effects.
- **Behavior:** Loaded only when the user interacts with specific elements (e.g. zooming close to a planet or hovering over projects).
