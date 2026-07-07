# Starfield Generation Algorithm

## Purpose

This document outlines the deterministic, mathematical approaches used to generate star coordinates, scale variations, and physical color temperatures without depending on manual coordinate placement or large pre-baked assets.

---

## Seeded Pseudorandom Number Generation

To ensure reproducibility across user sessions and dev reload sequences, generation relies on a custom `SeededRandom` class executing the **Mulberry32** algorithm:

```typescript
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed | 0;
  }

  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
```

---

## Uniform Spherical Distribution (Marsaglia Method)

Simple latitude/longitude selection creates overlapping clusters at the poles (clumping). To produce an even, natural spatial dispersion of stars across the sky box sphere, we use the **Marsaglia sphere-point picking** algorithm:

1. Generate random values $u$ and $v$ within the range $[-1, 1]$.
2. Discard and reject samples where $u^2 + v^2 \ge 1$.
3. Compute the unit coordinates:
   $$x = 2u\sqrt{1 - u^2 - v^2}$$
   $$y = 2v\sqrt{1 - u^2 - v^2}$$
   $$z = 1 - 2(u^2 + v^2)$$
4. Multiply $(x, y, z)$ by a randomly selected radius $R \in [R_{\text{inner}}, R_{\text{outer}}]$.

---

## Color Temperature Approximation

Star colors are derived from realistic stellar physics using blackbody color temperature approximations (Tanner Helland's Kelvin-to-RGB conversion):

- **Cool Stars (~3000K–4000K)**: Shift toward warm orange-red colors.
- **Medium Stars (~5000K–6500K)**: Render as bright yellow or pure white.
- **Hot Stars (9000K–15000K+)**: Shift toward bright, icy blue-white profiles.

This range avoids uniform, artificial color distributions, making the deep space environment feel natural.
