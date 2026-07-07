# 17_Audio_System

## Purpose

The Audio System document defines the implementation guidelines, sound formats, browser playback overrides, and spatial acoustics for the **Solar Portfolio**. It establishes rules for background soundtracks and sound effects (SFX) using the Web Audio API.

## Goals

1. **Deeper Immersion:** Use atmospheric soundscapes to enhance the space exploration narrative.
2. **Browser Compliance:** Meet browser autoplay guidelines by implementing clear user opt-in options.
3. **Spatial Awareness:** Create a dynamic 3D soundscape where audio volume and panning shift as the user navigates the solar system.

## Architecture

The system uses the **Web Audio API context tree**, connecting audio source nodes to panner nodes, gain controls, and a master output node.

```
┌───────────────────────────────────────────────┐
│               Audio Source Nodes              │
│  - Ambient space loop (WebM/MP3)              │
│  - SFX buffers (Warp travel, HUD clicks)      │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│               Spatial Panner Node             │
│  - Coordinates tied to camera vectors         │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                 Gain Controller               │
│  - Volume levels tied to HUD sliders          │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│               Master Output Node              │
│  - Browser speakers output                    │
└───────────────────────────────────────────────┘
```

## Decisions

### 1. Audio Track Configuration

- **Ambient Soundscape:** A low-frequency looping synthesizer track (60-second duration) to represent deep space.
- **Warp SFX:** A rising white-noise effect that plays during camera warp transitions, matching travel speeds.
- **HUD Interactions:** Crisp, high-frequency digital clicks (50ms duration) that play when hovering over or selecting buttons.
- **Spatial Audio Nodes:** The Sun and planets are configured as Web Audio spatial sound sources. As the camera zooms in on a planet, its specific ambient sound (e.g. Earth's subtle wind tones, Jupiter's low electromagnetic hums) becomes louder and pans left/right depending on the viewport angle.

### 2. Autoplay & Opt-In Loop

- Browsers block audio autoplay until a user interacts with the page.
- **Opt-In screen:** The initial site loader features a clear visual choice:
  - **"Launch with Audio"** - Instantiates the Web Audio context, starts the space track, and fades it in over 1 second.
  - **"Launch in Silence"** - Keeps the audio context suspended and sets the system state to muted.
- **Mute Control:** A persistent HUD button allows visitors to toggle audio on and off at any time.

## Tradeoffs

- **Web Audio API vs. Standard HTML5 Audio Tag:** The `<audio>` tag is simple to use but lacks spatial panning and low-latency scheduling. _Decision:_ We use the Web Audio API to support advanced spatial panning and instant SFX triggers.
- **Audio File Size vs. Quality:** High-quality WAV files sound clean but have large file sizes. _Decision:_ Compress audio to WebM (with Ogg Vorbis compression) for browsers that support it, with MP3 files as a fallback, keeping audio file sizes under 2MB.

## Future Expansion

- **Dynamic Audio Modulator:** Hook audio frequencies up to the camera's speed, pitch-shifting the ambient soundscape during fast travel warp transitions.

## Risks

- **Audio Stutter during WebGL Loads:** Compiling WebGL shaders can freeze the main thread, causing audio playback to stutter. _Mitigation:_ Audio decoding is handled asynchronously in a separate Web Worker, ensuring playback remains smooth even during heavy asset loading.

## Acceptance Criteria

- The site does not attempt to play audio before the user interacts with the page.
- Fading mute/unmute actions executes smoothly over a 500ms duration.
- Spatial panning values shift correctly as the camera orbits different planets.

## Engineering Notes

- **Spatial Audio Context Hook Blueprint (`src/hooks/use-audio-manager.ts` outline):**

```ts
import { useEffect, useRef } from 'react';

export function useAudioManager() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioContextRef.current) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    audioContextRef.current = ctx;
    masterGainRef.current = gain;
  };

  const setVolume = (volume: number) => {
    if (!masterGainRef.current) return;
    masterGainRef.current.gain.value = volume;
  };

  return { initAudio, setVolume };
}
```

- **Audio Assets Locations:** Save all assets in `/public/audio/` in both `.webm` and `.mp3` formats.
