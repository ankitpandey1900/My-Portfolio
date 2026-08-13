// ─────────────────────────────────────────────────────────────────────────────
// Particle Presets
// Configuration instances for different particle effects.
// ─────────────────────────────────────────────────────────────────────────────
import type { QualityTier } from '@/lib/store';
import type {
  ParticleEmitterConfig,
  ParticlePresetConfig,
  ParticlePresetId,
} from './particle-types';

// Helper to scale emitter settings based on quality tier
const createQualityTiers = (
  base: ParticleEmitterConfig
): Record<QualityTier, ParticleEmitterConfig[]> => {
  return {
    ultra: [{ ...base }],
    high: [
      {
        ...base,
        spawnRate: base.spawnRate * 0.7,
        maxParticles: Math.floor(base.maxParticles * 0.7),
      },
    ],
    medium: [
      {
        ...base,
        spawnRate: base.spawnRate * 0.4,
        maxParticles: Math.floor(base.maxParticles * 0.4),
      },
    ],
    low: [
      {
        ...base,
        spawnRate: base.spawnRate * 0.2,
        maxParticles: Math.floor(base.maxParticles * 0.2),
      },
    ],
  };
};

export const PARTICLE_PRESETS: Partial<Record<ParticlePresetId, ParticlePresetConfig>> = {
  SolarEnergy: {
    id: 'SolarEnergy',
    emitters: createQualityTiers({
      id: 'solar-corona-sparks',
      shape: 'Sphere',
      spawnRate: 40,
      spawnJitter: 0.15,
      maxParticles: 280,

      lifetime: [3.0, 8.0],
      size: [0.04, 0.12],
      velocity: [0.08, 0.22],
      acceleration: [0, 0, 0], // outward from sphere center

      emissionRadius: [12.0, 15.0], // Just outside the sun surface
      emissionAngle: [0, Math.PI * 2],

      colorStart: [1.0, 0.6, 0.1], // Hot orange/yellow
      colorEnd: [1.0, 0.2, 0.0], // Deep red
      opacityStart: 0.22,
      opacityEnd: 0.0,

      noiseFrequency: 0.5,
      noiseAmplitude: 1.0,

      rotationSpeed: [-2, 2],
    }),
  },
  SpaceDust: {
    id: 'SpaceDust',
    emitters: createQualityTiers({
      id: 'ambient-dust',
      shape: 'Sphere',
      spawnRate: 28,
      spawnJitter: 0.35,
      maxParticles: 260,

      lifetime: [8.0, 18.0],
      size: [0.03, 0.08],
      velocity: [0.04, 0.12],
      acceleration: [0, 0, 0],

      emissionRadius: [20.0, 60.0],
      emissionAngle: [0, Math.PI * 2],

      colorStart: [0.8, 0.9, 1.0], // Pale blue/white
      colorEnd: [0.5, 0.6, 1.0],
      opacityStart: 0.18,
      opacityEnd: 0.0,

      noiseFrequency: 0.2,
      noiseAmplitude: 2.0,

      rotationSpeed: [-0.5, 0.5],
    }),
  },
};

