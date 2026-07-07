# Camera Presets Specification

## Purpose

The **Camera Presets** define the pre-configured coordinate vectors, focal targets, and fields of view used to position the camera during standard user interactions (e.g. entering the portfolio, selecting a planet, or choosing a different view mode).

---

## Preset Definitions

Presets are defined in `src/components/canvas/camera/camera-presets.ts` as:

| Preset Name                    | Description                                           | Position Vector | LookAt Vector | Field of View |
| :----------------------------- | :---------------------------------------------------- | :-------------- | :------------ | :-----------: |
| **Galaxy View (`'galaxy'`)**   | Zoomed-out cinematic view showing the overall system. | `[0, 60, 120]`  | `[0, 0, 0]`   |      45°      |
| **System View (`'system'`)**   | Intermediate view displaying the planetary orbits.    | `[0, 25, 55]`   | `[0, 0, 0]`   |      45°      |
| **Planet Detail (`'planet'`)** | Zoomed-in focused tracking of a selected planet mesh. | `[0, 6, 15]`    | `[0, 0, 0]`   |      35°      |
| **Cockpit Mode (`'cockpit'`)** | Immersive close-up/interior view.                     | `[0, 1.2, 3.5]` | `[0, 0, 0]`   |      65°      |

---

## Constraints

To prevent users from zooming through mesh surfaces or out into empty spaces during interactive free panning, the following boundary constraints are defined:

- **Minimum Zoom Distance**: `4` units (prevents camera clipping inside planetary geometry cores).
- **Maximum Zoom Distance**: `400` units (constrains users within active skybox environments).
- **Minimum FOV Limit**: `25` degrees (caps maximum focal zoom magnification).
- **Maximum FOV Limit**: `75` degrees (prevents visual wide-angle fisheye distortion).
