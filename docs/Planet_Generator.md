# Planet Generator Specification

## Purpose

The **Planet Generator** compiles abstract JSON configurations parsed from the Planet Manifest into fully initialized and rendered 3D planet instances inside the R3F Canvas.

---

## Modularity & Components

The engine is structured under `src/components/canvas/scene-manager/scenes/solar-system/generator/`:

- **`planet-generator-types.ts`**: Types mapping configs.
- **`planet-generator-config.ts`**: Preset parameters mappings.
- **`planet-initializer.ts`**: Manages validations and maps registration sweeps.
- **`planet-loader.ts`**: Safe asset loading and fallbacks.
- **`planet-builder.ts`**: Compiles custom THREE.MeshStandardMaterials.
- **`planet-renderer.tsx`**: Renders standard sphere geometries and materials.
- **`planet-spawner.tsx`**: Controls lazy generation.
- **`planet-generator.tsx`**: Orchestrator loop component.

---

## Error Handling & Fallbacks

1. **Validation Checks**: `PlanetInitializer` intercepts and cancels loading loops if duplicate orders or ID collisons are detected.
2. **Missing Textures**: If asset maps fail to resolve, `PlanetLoader` flags fallbacks immediately and procedural colors from palettes are selected.
3. **Unmount Safety**: Geometries are managed inline inside JSX nodes, while custom materials are cleanly disposed on unmount.
