# Performance Targets

## Purpose

Defines FPS targets per device class, adaptive quality tiers, and the automatic degradation/recovery system.

---

## FPS Targets by Device Class

| Device Class                | Target FPS | Min Acceptable | DPR     | Post-Processing |
| :-------------------------- | :--------- | :------------- | :------ | :-------------- |
| **Desktop (dedicated GPU)** | 60         | 50             | 2.0     | Full pipeline   |
| **Laptop (integrated GPU)** | 60         | 45             | 1.5–2.0 | Full or reduced |
| **Tablet**                  | 45–60      | 30             | 1.0–1.5 | Disabled        |
| **Mobile**                  | 30–45      | 24             | 1.0     | Disabled        |

---

## Adaptive Quality Tiers

The `useAdaptiveQuality` hook automatically adjusts rendering quality based on measured performance:

| Tier       | DPR | Post-Processing | Star Density | Trigger                                       |
| :--------- | :-- | :-------------- | :----------- | :-------------------------------------------- |
| **Ultra**  | 2.0 | Enabled         | 10,000       | Manual selection or recovery from High        |
| **High**   | 2.0 | Enabled         | 8,000        | Default starting tier                         |
| **Medium** | 1.5 | Disabled        | 5,000        | FPS below 40 for 3 consecutive sample windows |
| **Low**    | 1.0 | Disabled        | 3,000        | Continued degradation after Medium            |

---

## Degradation Protocol

1. `useRenderMonitor` samples FPS over a rolling window of 60 frames.
2. If average FPS drops below 40 for 3 consecutive windows, a `performance:degraded` event fires.
3. `useAdaptiveQuality` receives the event and steps the quality tier down by one level.
4. When FPS recovers above 40, a `performance:recovered` event fires.
5. After a 10-second cooldown, the quality tier steps back up by one level.
6. This prevents oscillation (rapid up/down switching).

---

## Memory Budget

| Resource              | Budget           | Notes                                 |
| :-------------------- | :--------------- | :------------------------------------ |
| **Browser tab RAM**   | < 120 MB         | During active solar navigation        |
| **GPU VRAM**          | < 256 MB         | Including all loaded textures         |
| **Initial JS bundle** | < 120 KB gzipped | Shell only, canvas loaded dynamically |
| **WebGL bundle**      | < 250 KB gzipped | Tree-shaken Three.js imports          |
