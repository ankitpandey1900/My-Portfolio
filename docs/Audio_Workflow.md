# Audio Pipeline Architecture

## Purpose

The Audio Pipeline document defines the audio compression rules, volume category groups, and spatial audio configurations.

## 1. File Formats & Compression

To minimize loading times, we use highly compressed audio files:

- **Primary format:** WebM / Ogg Vorbis (`.webm` / `.ogg`) at `96kbps` constant bitrate (best compression for web browsers).
- **Fallback format:** Standard MP3 (`.mp3`) at `128kbps` constant bitrate for older browsers.
- **Mono vs Stereo:**
  - **Stereo:** Reserved for global ambient background music loops.
  - **Mono:** Enforced for all spatial sound effects (hover alerts, planet hums) so browsers can calculate 3D panning directions correctly.

---

## 2. Dynamic Volume Groups

Volume levels are split into three mix buses in our Zustand store:

```
                  ┌─────────────────┐
                  │   Master Mute   │
                  └────────┬────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Music Group   │ │   Ambient Group │ │    SFX Group    │
│  (Ambient Loop) │ │  (Planet Hums)  │ │ (Hover/Clicks)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

- **Master Volume:** Controls global audio output. Defaults to `0.5`.
- **Music Bus:** Background music loops. Defaults to `0.3`.
- **Ambient Bus:** Dynamic hums that fade in as you get closer to planets.
- **SFX Bus:** Instant UI click and hover feedbacks.

---

## 3. Web Audio API / R3F Audio Analyser

- **Positional nodes:** Planet meshes can mount R3F `<positionalAudio>` helper components.
- **Ref/Distance mapping:** Sound levels fall off logarithmically based on the camera's distance to the planet mesh:
  - **Ref Distance:** `1.0` units.
  - **Rolloff Factor:** `2.0` (smooth, fast fade-out as you zoom away).
- **Disposal:** Dispose of audio context objects when components unmount to prevent audio memory leaks.
