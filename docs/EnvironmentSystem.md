# Environment System Architecture (Task 6.2)

The Environment System manages the foundational rendering aspects of the universe, providing a configuration-driven, robust engine to control lighting, backgrounds, HDRI, Fog, Tone Mapping, and Exposure.

## Engine Structure

The system is organized using the decoupled Engine Pattern:

1. **`environment-types.ts`**: Defines the strict boundary interface (`EnvironmentPresetConfig`, `EnvironmentState`).
2. **`environment-config.ts`**: Default configurations and failsafes.
3. **`environment-presets.ts`**: The registry of environments (`deep-space`, `nebula-glow`, `solar-flare`, `dark-space`).
4. **`environment-state.ts`**: A localized Zustand store handling deep-merge config updates and current preset.
5. **`environment-events.ts`**: Typed pub/sub event bridge using `sceneEventEmitter`.
6. **`environment-controller.ts`**: Pure logic to set presets and sync qualities.
7. **`environment-manager.tsx`**: Headless React hook mapping global quality changes to the controller.
8. **`environment-scene.tsx`**: The R3F rendering graph (Lights, Fog, Three.js Scene properties).
9. **`environment-provider.tsx`**: The injection root wrapper for the canvas.

## Configuration-Driven

All environment elements are strictly defined through `EnvironmentPresetConfig`.
To change an environment, trigger:

```typescript
EnvironmentController.setPreset('nebula-glow');
```

To tweak a specific value on the fly:

```typescript
EnvironmentController.updateConfig({
  lighting: { ambientIntensity: 1.2 },
});
```

## Performance Enhancements

- **Re-used Allocations**: Color objects (`new THREE.Color()`) are memoized inside `EnvironmentScene` to prevent memory leaks during rapid config updates.
- **Adaptive Quality Hooks**: The `EnvironmentManager` subscribes to the global `QualityTier`. On low-tier devices, expensive operations like volumetric fog and high-res IBL maps can be automatically bypassed by the controller.
- **State Decoupling**: Extracted away from the heavy global `store.ts` to limit unnecessary React re-renders.
