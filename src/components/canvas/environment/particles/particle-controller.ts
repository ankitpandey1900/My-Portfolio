// ─────────────────────────────────────────────────────────────────────────────
// Particle Controller
// Pure functions for modifying the Particle Engine state safely.
// ─────────────────────────────────────────────────────────────────────────────
import { useParticleStore } from './particle-state';
import type { DeepPartial, ParticlePresetConfig, ParticlePresetId } from './particle-types';

export const ParticleController = {
  setPreset: (presetId: ParticlePresetId) => {
    useParticleStore.getState().setPreset(presetId);
  },

  updateConfig: (partialConfig: DeepPartial<ParticlePresetConfig>) => {
    useParticleStore.getState().updateConfig(partialConfig);
  },
};
