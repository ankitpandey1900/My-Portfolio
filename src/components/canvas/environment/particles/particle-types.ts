// ─────────────────────────────────────────────────────────────────────────────
// Particle Types
// Defines the strict interfaces for the scalable GPU Particle Engine.
// ─────────────────────────────────────────────────────────────────────────────
import type { QualityTier } from '@/lib/store';

export type ParticlePresetId =
  | 'SolarEnergy'
  | 'SpaceDust'
  | 'FloatingDust'
  | 'EnergyPulse'
  | 'AmbientGlow'
  | 'CometTrail'
  | 'PlanetAtmosphere'
  | 'EngineTrail'
  | 'Explosion';

export type EmitterShape =
  'Point' | 'Sphere' | 'Ring' | 'Orbit' | 'Cone' | 'MeshSurface' | 'Spline';

/** Emitter configurations */
export interface ParticleEmitterConfig {
  id: string;
  shape: EmitterShape;
  spawnRate: number; // Particles per second
  /** Random variation in spawn rate (0-1) */
  spawnJitter: number;
  /** Max concurrent particles this emitter can track */
  maxParticles: number;

  // -- Particle Properties --
  lifetime: [min: number, max: number];
  size: [min: number, max: number];
  velocity: [min: number, max: number];
  acceleration: [x: number, y: number, z: number];

  // -- Shape Properties --
  emissionRadius: [min: number, max: number];
  emissionAngle: [min: number, max: number]; // For cone

  // -- Visual Properties --
  colorStart: [r: number, g: number, b: number];
  colorEnd: [r: number, g: number, b: number];
  opacityStart: number;
  opacityEnd: number;

  // -- Noise & Turbulence --
  noiseFrequency: number;
  noiseAmplitude: number;

  // -- Physics --
  rotationSpeed: [min: number, max: number];
}

export interface ParticlePresetConfig {
  id: ParticlePresetId;
  emitters: Record<QualityTier, ParticleEmitterConfig[]>;
}

export interface ParticleState {
  currentPresetId: ParticlePresetId;
  activeConfig: ParticlePresetConfig;
  setPreset: (presetId: ParticlePresetId) => void;
  updateConfig: (partialConfig: DeepPartial<ParticlePresetConfig>) => void;
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

