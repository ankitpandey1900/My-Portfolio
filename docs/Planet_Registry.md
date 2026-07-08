# Planet Registry Specification

## Purpose

The **Planet Registry** provides a unified schema for storing and indexing celestial configurations. This allows the system to populate planets dynamically on demand from static presets rather than hardcoding coordinates inside mesh layout structures.

---

## Schema Schema

The registry maps each planet to the `PlanetRegistryEntry` interface:

```typescript
export interface PlanetRegistryEntry {
  id: string; // Unique string key (e.g. 'earth')
  name: string; // Display label
  order: number; // Order index relative to Sun (1 to 8)
  radius: number; // Scale radius of the mesh
  orbitRadius: number; // Orbit distance from origin
  orbitSpeed: number; // Orbit translation speed
  rotationSpeed: number; // Self-rotation speed
  colorPalette: string[]; // Gaseous/crust color hex mappings
  textureReferences: {
    map?: string; // Color texture path
    normalMap?: string; // Surface height coordinates
    roughnessMap?: string; // Dynamic highlight limits
    specularMap?: string; // Reflection maps
  };
  atmosphere: AtmosphereConfig; // Atmosphere details
  moons: MoonRegistryEntry[]; // Attached moons
  portfolioSection: 'about' | 'projects' | 'experience' | 'skills' | 'contact' | 'home';
  unlockState: 'locked' | 'unlocked' | 'active';
  metadata: Record<string, string | number | boolean>;
}
```

---

## Field Specifications

- **`order`**: Used to index planet indices correctly.
- **`orbitRadius` & `orbitSpeed`**: Directs coordinate translations in R3F loops.
- **`textureReferences`**: Paths points directly to KTX2/WEBP compressed files managed by the Asset Pipeline.
- **`portfolioSection`**: Directs navigational states. When a planet is clicked, the UI routes to this portfolio section context.
- **`unlockState`**: Reserved for future gamification triggers (locks planet features until preceding sections are read).
