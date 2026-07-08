# Hero Architecture

## Design Decisions

### Why a pure HTML overlay instead of 3D text?

Rendering text legibly inside a WebGL scene is technically complex and expensive. HTML text is perfectly sharp at all DPR settings, uses native accessibility APIs, and is trivially responsive. The 3D canvas handles the visuals; the DOM handles the content.

### Why use CSS transitions instead of GSAP/Framer Motion?

The only properties animated are `opacity` and `transform`. These are fully GPU-composited by the browser — zero JavaScript animation loops required. This keeps the main thread free for the 3D rendering engine. GSAP/Framer Motion should be reserved for complex orchestrations only.

### Why does HomePlanetController call `setCurrentScene('SYSTEM')` directly?

The scene graph is controlled by Zustand's global `useStore`. Because the Home Planet system is the **very first** system to run (before any planet is selected), it is the singular actor responsible for triggering the scene transition from `GALAXY` to `SYSTEM`. Routing through NavigationManager would add an unnecessary layer of indirection here.

## Z-Index Map

```
z = 0   → WebGL Canvas (ExperienceCanvas)
z = 10  → HeroOverlay (vignette)
z = 11  → HomeHero (text + CTAs)
z = 50+ → Debug panels (dev only)
```

## Timing Diagram

```
t=0ms    → Mount: HomePlanetManager mounts, emits 'home:heroMounted'
t=0ms    → Phase: idle → initializing
t=400ms  → Phase: initializing → intro (overlay fully fades in)
t=1600ms → Phase: intro → reveal (text begins staggered entrance)
t=2400ms → Phase: reveal → ready (CTAs appear, hero is fully active)

[user clicks Begin Journey]

t+0ms   → Phase: ready → dismissed (hero fades out)
t+600ms → setCurrentScene('SYSTEM') called
t+700ms → React unmounts HomeHero component
```
