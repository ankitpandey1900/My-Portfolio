import type { StarLayerConfig } from './starfield-types';

/**
 * Mulberry32 — A fast, seedable 32-bit PRNG.
 *
 * Produces deterministic sequences from a single integer seed.
 * Same seed = same star positions across sessions and devices.
 *
 * Reference: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 */
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed | 0;
  }

  /** Returns a pseudo-random float in [0, 1). */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns a float in [min, max). */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

/**
 * Generated star data stored as typed arrays for direct GPU upload.
 * Each array has `count` entries (or count*3 for positions/colors).
 */
export interface StarLayerData {
  /** Interleaved XYZ positions (count * 3 floats). */
  positions: Float32Array;
  /** Per-star point sizes (count floats). */
  sizes: Float32Array;
  /** Per-star brightness values 0–1 (count floats). */
  brightnesses: Float32Array;
  /** Interleaved RGB color values (count * 3 floats). */
  colors: Float32Array;
  /** Phase offsets for twinkling animations (count floats). */
  phaseOffsets: Float32Array;
}

/**
 * Convert a blackbody temperature (in Kelvin) to an approximate RGB color.
 *
 * Uses Tanner Helland's algorithm, which is a fast polynomial approximation
 * of the Planck radiation curve. Accurate for 1000K–40000K.
 *
 * Reference: https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm.html
 */
function kelvinToRgb(kelvin: number): [r: number, g: number, b: number] {
  const temp = kelvin / 100;
  let r: number;
  let g: number;
  let b: number;

  // Red channel
  if (temp <= 66) {
    r = 1;
  } else {
    r = 1.2929 * Math.pow(temp - 60, -0.1332);
    r = Math.max(0, Math.min(1, r));
  }

  // Green channel
  if (temp <= 66) {
    g = 0.3901 * Math.log(temp) - 0.6318;
  } else {
    g = 1.1299 * Math.pow(temp - 60, -0.0755);
  }
  g = Math.max(0, Math.min(1, g));

  // Blue channel
  if (temp >= 66) {
    b = 1;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = 0.5432 * Math.log(temp - 10) - 1.1963;
    b = Math.max(0, Math.min(1, b));
  }

  return [r, g, b];
}

/**
 * Generate star data for a single layer using uniform sphere-point picking.
 *
 * Algorithm (Marsaglia method):
 * 1. Generate two uniform random variables u, v in [-1, 1].
 * 2. Reject if u² + v² >= 1.
 * 3. Compute x = 2u√(1-u²-v²), y = 2v√(1-u²-v²), z = 1-2(u²+v²).
 * 4. Scale the unit vector by a random radius in [radiusInner, radiusOuter].
 *
 * This produces a uniform distribution on the sphere surface, avoiding
 * clustering at the poles that plague latitude/longitude methods.
 */
export function generateStarLayer(config: StarLayerConfig): StarLayerData {
  const {
    count,
    radiusInner,
    radiusOuter,
    sizeRange,
    brightnessRange,
    colorTemperatureRange,
    seed,
  } = config;

  const rng = new SeededRandom(seed);

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightnesses = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const phaseOffsets = new Float32Array(count);

  let generated = 0;

  while (generated < count) {
    // Marsaglia method for uniform sphere-point picking
    const u = rng.range(-1, 1);
    const v = rng.range(-1, 1);
    const s = u * u + v * v;

    // Reject points outside the unit disk
    if (s >= 1) continue;

    const factor = Math.sqrt(1 - s);
    const nx = 2 * u * factor;
    const ny = 2 * v * factor;
    const nz = 1 - 2 * s;

    // Scale to random radius within the shell
    const radius = rng.range(radiusInner, radiusOuter);
    const i3 = generated * 3;

    positions[i3] = nx * radius;
    positions[i3 + 1] = ny * radius;
    positions[i3 + 2] = nz * radius;

    // Star visual properties
    sizes[generated] = rng.range(sizeRange[0], sizeRange[1]);
    brightnesses[generated] = rng.range(brightnessRange[0], brightnessRange[1]);
    phaseOffsets[generated] = rng.range(0, Math.PI * 2);

    // Color from blackbody temperature
    const kelvin = rng.range(colorTemperatureRange[0], colorTemperatureRange[1]);
    const [r, g, b] = kelvinToRgb(kelvin);
    colors[i3] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;

    generated++;
  }

  return { positions, sizes, brightnesses, colors, phaseOffsets };
}
