# Orbit Math Specification

## Purpose

The **Orbit Math** specification defines the state-free coordinate equations driving all translations and visual segment layouts.

---

## 1. Circular Orbit Coordinates Mappings

For any orbital radius $R$, speed $S$, and elapsed time ticks $t$:

$$\theta_t = \theta_{start} + t \cdot S \cdot d \cdot \text{timeScale} \cdot \text{speedMultiplier}$$

Where:

- $\theta_t$: Current angle in radians.
- $\theta_{start}$: Initial start angle offset.
- $d$: Direction multiplier (1 for counter-clockwise, -1 for clockwise).
- $\text{timeScale}$: Global time scale.
- $\text{speedMultiplier}$: Custom system multiplier.

The raw flat positions in the horizontal plane (XZ) are:

$$x = \cos(\theta_t) \cdot R$$
$$z = \sin(\theta_t) \cdot R$$

---

## 2. Orbital Plane Inclination Tilt

To tilt the orbital plane by an inclination angle $\phi$ (in degrees):

1. Convert degrees to radians:
   $$\phi_{rad} = \frac{\phi \cdot \pi}{180}$$

2. Rotate the coordinates around the horizontal axis ($X$):

   $$x_{rotated} = x$$
   $$y_{rotated} = z \cdot \sin(\phi_{rad})$$
   $$z_{rotated} = z \cdot \cos(\phi_{rad})$$

This creates a 3D coordinate vector $\mathbf{P}(x_{rotated}, y_{rotated}, z_{rotated})$ which is copied directly into R3F position matrices inside the frame loop.
