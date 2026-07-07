# Model Export & Optimization Workflow

## Purpose

The Model Workflow document defines the pipeline for transferring 3D assets from modeling tools (like Blender) to the WebGL rendering engine.

## 1. Modeling Specifications (Blender)

- **Scale:** Use standard SI metric units. $1$ Blender unit must equal $1$ WebGL unit.
- **Orientation:** Export using **Y-Up** and **-Z Forward** coordinate mappings.
- **Origin Points:** Ensure mesh origin points are set to the geometric center (or the rotational pivot point for planets and orbits) to prevent erratic orbit rotations.
- **Transforms:** Apply all modifiers (Decimate, Mirror, Subdivision) and **Clear Transforms (Ctrl+A -> All Transforms)** before exporting to prevent visual clipping.
- **Unwrapping:** Use non-overlapping UV coordinates. Avoid using procedural Blender cycles nodes; bake textures to flat images instead.

---

## 2. Export Settings (GLTF/GLB)

When exporting from Blender as GLTF/GLB (`.gltf` / `.glb`):

- **Include:** Limit to Selected Objects only. Disable cameras and lights options.
- **Geometry:** Enable UVs, Normals, and Vertex Colors. Disable Shape Keys if they are unused.
- **Materials:** Select Export Materials. Set images format to automatic.
- **Compression:** Disable Blender's built-in compression. Compression is handled during post-processing using CLI tools.

---

## 3. CLI Optimization (glTF-Pipeline & Draco)

Once exported from Blender, compress the model using `gltf-pipeline` to shrink file size:

```bash
# Compress GLB using Draco compression (compression level 7)
npx gltf-pipeline -i public/assets/models/planet-earth.glb -o public/assets/models/planet-earth-compressed.glb -d
```

For complex meshes, use `@gltf-transform/cli` to apply Meshopt compression:

```bash
npx @gltf-transform/cli optimize public/assets/models/planet-earth.glb public/assets/models/planet-earth-optimized.glb --level 3
```

---

## 4. JSX Components Generation (`gltfjsx`)

To convert the optimized GLB into a reusable, declarative R3F React component:

```bash
npx gltfjsx public/assets/models/planet-earth-compressed.glb --transform --typescript --keep-names
```

This generates a React component referencing `<mesh>` nodes, making it easy to attach interactive events, custom materials, or animation loops to specific parts of the model.
