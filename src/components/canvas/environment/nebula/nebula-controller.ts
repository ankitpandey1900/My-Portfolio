// ─────────────────────────────────────────────────────────────────────────────
// Nebula Controller
// Logic layer for switching nebulas and handling updates.
// ─────────────────────────────────────────────────────────────────────────────
import { useStore } from '@/lib/store';
import { NebulaEvents } from './nebula-events';
import { useNebulaStore } from './nebula-state';
import type { DeepPartial, NebulaPresetConfig, NebulaPresetId } from './nebula-types';

export const NebulaController = {
  /** Switch to a new nebula preset and emit event */
  setPreset: (presetId: NebulaPresetId) => {
    useNebulaStore.getState().setPreset(presetId);
    NebulaEvents.emit('nebula:presetChanged', { presetId });
  },

  /**
   * Sync the nebula quality bounds
   * based on the global QualityTier.
   */
  syncQualityBounds: () => {
    const qualityTier = useStore.getState().qualityTier;
    NebulaEvents.emit('nebula:qualityChanged', { qualityTier });
  },

  /** Update partial configuration */
  updateConfig: (partialConfig: DeepPartial<NebulaPresetConfig>) => {
    useNebulaStore.getState().updateConfig(partialConfig);
  },
};
