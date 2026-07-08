# Orbit Lifecycle Specification

## Purpose

The **Orbit Lifecycle** specification maps the nine stages from initialize coordinates setup, through run updates, pausing loops, and unmount cleanups.

---

## Lifecycle Stages Mappings

Each orbit instance matches nine coordinated stages:

1. **Initialize**: reads configurations presets, validates ids, and pre-allocates segment points inside `useMemo`.
2. **Start**: Mounts controller. Emits `orbit:started`.
3. **Update**: useFrame calculations run circular coordinates updates.
4. **Pause**: Triggered by state controls. Suspends useFrame updates. Emits `orbit:paused`.
5. **Resume**: Restores updates. Emits `orbit:resumed`.
6. **Stop**: stops updates and resets elapsed time vectors.
7. **Reset**: resets starting positions to initial offsets.
8. **Dispose**: releases `THREE.BufferGeometry` allocations and line materials.
9. **Cleanup**: unbinds listeners and emits `orbit:disposed`.
