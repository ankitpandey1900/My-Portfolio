# Canvas Routing Strategy

## Purpose

The Routing Strategy document defines navigation, history, deep linking, and browser back/forward integration rules.

---

## 1. Canvas-Based Routing

To prevent webgl context resets, navigation does not trigger page routing (e.g. Next.js App Router swaps):

- **Declarative state:** Scene swapping is managed by updating `currentScene` in our Zustand store.
- **Viewport stability:** Swapping scenes changes which 3D components render without reloading the page, keeping the WebGL canvas stable.

---

## 2. History Stack Cache

We manage navigation history inside our Zustand store (`sceneHistory`):

- Swapping to a new scene appends the scene name to the history array.
- Triggering the back command (`goBackScene()`) pops the top scene name from the array, restoring the previous scene.

---

## 3. Deep Linking & URL Synchronization

To support page reloads and link sharing, URL query parameters synchronize with scene states:

- **Pattern:** `https://solar-portfolio.dev/?scene=planet&target=mars`
- **Sync on Load:** A React hook in the page layout reads URL parameters on load, dispatching actions to the Zustand store to navigate to the correct scene and target planet automatically.
- **Sync on Navigate:** When the user clicks a planet card, the browser URL query parameter updates silently using `window.history.pushState()`.
