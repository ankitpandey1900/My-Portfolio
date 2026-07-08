# Art Direction Document

## 1. Vision & Core Philosophy

**"Entering an Interactive Universe"**

The user experience should transcend a standard website and feel like a seamless window into a living, breathing digital cosmos. The thematic intersection lies exactly between the stark, scientific utility of **NASA**, the cinematic awe of **Interstellar**, the exploration mechanics of **No Man's Sky**, and the premium, ultra-minimalistic typography and spacing of **Apple** and **Linear**.

**Tone:**
Professional. Premium. Minimal. Futuristic. Elegant. Scientific. Modern. Interactive.

**Anti-Tone (What we avoid):**
This is **NOT** a cyberpunk interface. There are no heavy neon grids, no RGB gaming aesthetic, and no cluttered HUDs (Heads Up Displays) flashing useless data.

---

## 2. Design Language & Aesthetics

- **Deep Space as a Canvas:** Black is not just a background; it is physical volume. We rely on pure black `#000000` or ultra-deep void `#050505` to create infinite depth.
- **Breathing Room:** Space is vast. UI elements should reflect this with immense padding, huge margins, and uncrowded layouts.
- **Cinematic Framing:** Content should feel like it is floating in the void.
- **Sparse UI:** Glass and borders are used _only_ where necessary to separate content from the vacuum of space.
- **Typographic Dominance:** Because visual clutter is banned, typography carries the emotional weight of the UI. Large, striking headlines against absolute darkness.

---

## 3. Color System

### Base Palette

The foundation is built on deep voids and starlight.

- **Background (Void):** `#030305` (Deepest Space)
- **Background (Surface):** `rgba(15, 15, 20, 0.4)` (Frosted UI Panels)
- **Primary Text (Starlight):** `#F2F4F8` (Off-white, easy on the eyes)
- **Secondary Text (Dust):** `#8A8D98` (Muted slate for descriptions)

### Planetary & Phenomenon Colors

Muted, realistic, scientific tones. Avoid hyper-saturated neon.

- **Mars/Experience:** `#A45A40` (Oxidized Rust)
- **Neptune/Projects:** `#3A5A78` (Deep Ice Blue)
- **Moon/About:** `#E0E0E0` (Lunar Grey)
- **Sun/Core:** `#FFAA44` to `#FFDAB9` (Warm, realistic plasma, not blinding yellow)
- **Nebula/Ambient:** `#1A1525` (Subtle deep purple/indigo space dust)

### UI Interaction Colors

- **Interactive / Hover:** `#FFFFFF` (Brightening of opacity, rather than shifting color)
- **Focus Ring:** `rgba(255, 255, 255, 0.2)`
- **Success:** `#4CAF50` (Muted emerald)
- **Warning:** `#FFB74D` (Muted amber)
- **Error:** `#E57373` (Muted crimson)

---

## 4. Typography System

**Primary Font Family:** `Inter` (or `SF Pro Display`) for structural elegance.
**Monospace / Data Font:** `Geist Mono` or `Roboto Mono` for coordinates, loading states, and scientific readouts.

- **Display (Hero):** ~4.5rem (scales with `vw`), `Inter`, Light. Tracking: `-0.03em`. (Huge, thin, cinematic).
- **Heading:** 2rem - 3rem, `Inter`, Medium. Tracking: `-0.02em`.
- **Body:** 1rem - 1.125rem, `Inter`, Regular. Line-height: `1.7`. (Highly legible, airy).
- **Mono / Metadata:** 0.75rem - 0.85rem, `Geist Mono`, Regular. Uppercase, Tracking: `0.05em`. (Used for labels like `SEC // 04` or `ORBIT: LOCKED`).

---

## 5. Lighting

Lighting is the primary tool for creating premium 3D volume.

- **Sun Key Light:** A single, mathematically accurate, high-intensity directional light originating from the center of the solar system. Hard shadows.
- **Planet Rim Lighting:** Crucial for the premium feel. Planets should have a subtle rim light (Fresnel effect) on their dark side to separate them from the black background.
- **Ambient Lighting:** Extremely low (`0.05` intensity). The dark side of planets should be nearly pitch black, forcing dramatic chiaroscuro contrast.
- **Galaxy/Nebula Lighting:** Soft, ambient color emission baked into the environment map (HDRI), subtly reflecting off glass UI elements.

---

## 6. Visual Effects (Post-Processing)

Effects must mimic a high-end cinema camera lens.

- **Tone Mapping:** `ACESFilmic`. Absolute requirement for cinematic color grading and blown-out highlight handling (like staring at the sun).
- **Bloom:** Subtle, large-radius threshold bloom. Only the sun and UI hover states should glow. No excessive light bleed.
- **Depth of Field (DOF):** Active during UI overlays. When a user clicks a planet, the background solar system heavily blurs out (Bokeh effect), shifting focus entirely to the UI.
- **Stars & Dust:** Slow-moving, layered particle systems. Opacity mapped to distance.
- **Avoid:** Motion Blur (causes nausea in web UX), Chromatic Aberration (looks cheap/gamey), Lens Dirt (distracts from the clean Apple-like aesthetic).

---

## 7. Material System

- **Glass (UI):** High transmission, low roughness, heavy backdrop-filter blur. Must refract the background planets accurately.
- **Metal (UI accents):** Anodized aluminum aesthetics. High metallic, mid-roughness.
- **Planet Surfaces:** High-resolution PBR (Physically Based Rendering) maps. Must include Albedo, Normal (crucial for terrain shadowing), and Roughness (for oceans vs landmasses) maps.
- **Atmospheres:** Custom shader materials utilizing Fresnel equations to create a soft, glowing halo around planets that fades into the void.

---

## 8. Camera Direction

The camera is a physical drone in space. It has mass and inertia.

- **Idle Motion:** Extremely slow, continuous drifting (orbiting the sun at a macro level). Never completely static.
- **Travel Motion:** Cinematic easing (`Expo.easeInOut`). When traveling to a planet, the camera accelerates smoothly and decelerates gracefully. It should take a luxurious 2-3 seconds, not a snappy 0.5s snap.
- **Hover Motion:** Subtle, damped tracking of the mouse pointer (parallax) to give the scene a 3D diorama feel.

---

## 9. Animation Principles

**"Smooth. Premium. Cinematic."**

- **Speed:** Slower is more premium. Avoid fast, snappy, linear animations.
- **Easing:** Always use deep curves (e.g., `Power3.inOut` or `Expo.out`).
- **Choreography:** Stagger UI element entrances. When a planet is clicked, the camera moves _first_, then the planet scales up, and _then_ the UI glass panels fade in sequentially.
- **No Game-like Snapping:** Never instantly snap the camera or UI. Every state change must transition through time.

---

## 10. UI & Interaction Design

- **Navigation:** Hidden until hovered or invoked, using minimal floating frosted orbs. Avoid heavy, solid navbars blocking the top of the screen.
- **Panels/Cards:** Borderless or utilizing an ultra-thin `1px` translucent inner border (`rgba(255,255,255,0.08)`) to catch the light. Heavy background blur.
- **Buttons:** Minimalist text or sleek icons. Hover states expand a subtle glow, lift the shadow, and scale up the element by `1.02x` using fluid spring physics.
- **Forms/Inputs:** Sleek inset backgrounds (`rgba(255,255,255,0.03)`) with soft rounded corners. Focus states trigger a delicate, precise white halo. Avoid standard "Material Design" underlines.
- **Tooltips:** Elegant, minimal floating glass labels with a slight drop shadow. Avoid complex sci-fi HUD lines or crosshairs to strictly maintain the minimal anti-HUD philosophy.

---

## 11. Responsive Behavior

- **Ultra-Wide (21:9):** Maximize FOV. Push UI to the extreme edges to let the 3D scene dominate.
- **Desktop (16:9):** The primary authored experience. Standard cinematic framing.
- **Tablet:** Collapse complex HUD elements. Prioritize touch targets (44x44px minimum).
- **Mobile (Portrait):** The 3D scene becomes a vertical stack. Camera FOV widens. UI panels convert from floating glass cards to full-screen blurred overlays to maximize screen real estate. Swipe gestures dominate navigation.

---

## 12. Audio (Future Phase)

Audio completes the premium cinematic immersion.

- **Ambient:** Deep, slow, evolving synthesizer pads (Hans Zimmer style). Sub-bass rumbles.
- **Hover/Click:** Delicate, high-frequency chimes. Mechanical but soft. (Think high-end UI sounds, not retro 8-bit blips).
- **Travel:** A low-pass filtered whoosh that rises and falls with the camera's acceleration curve.

---

## 13. Accessibility & Performance Guardrails

- **Reduced Motion:** If `prefers-reduced-motion` is detected, disable all idle camera drifting and convert 3-second cinematic travels into instant cross-fades.
- **Contrast:** Ensure all text passes WCAG AA against the dark space background. If a planet is bright, UI panels must dynamically increase their background opacity to protect text legibility.
- **Performance & Rendering:** Maintain 60 FPS at all costs.
  - Turn off WebGL Depth of Field (DOF) and Bloom on mobile devices.
  - Scale down WebGL texture resolutions based on `useAdaptiveQuality()`.
  - Cap device pixel ratio (DPR) to `2.0` on high-density displays to save GPU fill rate.
  - **Glass Over WebGL Warning:** `backdrop-filter: blur()` overlaying an active WebGL canvas causes severe framerate drops on low-end iOS/Android devices. Fallback to a solid translucent color (`rgba(15, 15, 20, 0.9)`) without the blur property when low tier performance is detected.
