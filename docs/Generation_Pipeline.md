# Generation Pipeline Specification

## Purpose

The **Generation Pipeline** defines the sequential phases translating configuration files into interactive 3D elements.

---

## The Rendering Pipeline

The generation lifecycle follows a six-phase layout:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Manifest Definition                                       │
│    Reads static files detailing speeds and orbits distances.│
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Schema Validation                                        │
│    validatePlanetManifest sweeps unique IDs and order keys. │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Orbit Attachment                                         │
│    Constructs dynamic OrbitConfig, mounts OrbitComponent.   │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Registry Indexing                                        │
│    Indexes configurations maps into PlanetRegistry keys.    │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Provider Setup                                           │
│    Nests wrappers inside localized Context Providers.       │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Rendering Mesh                                           │
│    PlanetRenderer builds standard materials on R3F Canvas.  │
└─────────────────────────────────────────────────────────────┘
```

---

## Optimization Strategies

- **Heap Allocations**: Keeps coordinates calculations in static functions, preventing garbage collection spikes.
- **Resource Releasing**: Unbinding listeners, clearing caches, and running material `.dispose()` methods prevents GPU VRAM leaks.
