// ─────────────────────────────────────────────────────────────────────────────
// Particle Config
// Default boundaries and constants for the Particle Engine.
// ─────────────────────────────────────────────────────────────────────────────
import { PARTICLE_PRESETS } from './particle-presets';
import type { ParticlePresetId } from './particle-types';

export const PARTICLE_CONFIG = {
  defaultPreset: 'SolarEnergy' as ParticlePresetId,

  fallbackPreset: PARTICLE_PRESETS['SolarEnergy'],

  // Hard limits to prevent VRAM overflow
  bounds: {
    maxTotalParticles: 100_000,
  },
};
