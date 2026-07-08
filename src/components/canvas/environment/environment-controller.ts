// ─────────────────────────────────────────────────────────────────────────────
// Environment Controller
// Logic layer for switching environments and reacting to quality tiers.
// ─────────────────────────────────────────────────────────────────────────────
import { useStore } from '@/lib/store';
import { ENVIRONMENT_CONFIG } from './environment-config';
import { EnvironmentEvents } from './environment-events';
import { useEnvironmentStore } from './environment-state';
import type {
  DeepPartial,
  EnvironmentPresetConfig,
  EnvironmentPresetId,
} from './environment-types';

export const EnvironmentController = {
  /** Switch to a new environment preset and emit event */
  setPreset: (presetId: EnvironmentPresetId) => {
    useEnvironmentStore.getState().setPreset(presetId);
    EnvironmentEvents.emit('environment:presetChanged', { presetId });
  },

  /**
   * Sync the environment quality bounds (fog enabled, IBL res)
   * based on the global QualityTier.
   */
  syncQualityBounds: () => {
    const qualityTier = useStore.getState().qualityTier;
    const bounds = ENVIRONMENT_CONFIG.qualityBounds[qualityTier];

    useEnvironmentStore.getState().updateConfig({
      fog: { enabled: bounds.fogEnabled },
    });

    EnvironmentEvents.emit('environment:qualityChanged', { qualityTier });
  },

  /** Update partial configuration */
  updateConfig: (partialConfig: DeepPartial<EnvironmentPresetConfig>) => {
    useEnvironmentStore.getState().updateConfig(partialConfig);
  },
};
