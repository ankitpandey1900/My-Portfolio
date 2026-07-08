// ─────────────────────────────────────────────────────────────────────────────
// Starfield Controller
// Pure functions for modifying the Starfield Engine state safely.
// ─────────────────────────────────────────────────────────────────────────────
import { StarfieldEvents } from './starfield-events';
import { useStarfieldStore } from './starfield-state';
import type { DeepPartial, StarfieldPresetConfig, StarfieldPresetId } from './starfield-types';

export const StarfieldController = {
  /**
   * Switches the active preset. Overwrites any custom modifications currently applied.
   */
  setPreset: (presetId: StarfieldPresetId) => {
    useStarfieldStore.getState().setPreset(presetId);
    StarfieldEvents.emit('starfield:presetChanged', { presetId });
  },

  /**
   * Deep merges partial configuration into the active config.
   * Useful for dynamic adjustments like lowering opacity during specific scenes.
   */
  updateConfig: (partialConfig: DeepPartial<StarfieldPresetConfig>) => {
    useStarfieldStore.getState().updateConfig(partialConfig);
  },

  /**
   * Utility for directly modifying the density multiplier.
   */
  setDensity: (density: number) => {
    StarfieldController.updateConfig({ densityBase: density });
  },

  /**
   * Utility for directly modifying the opacity multiplier.
   */
  setOpacity: (opacity: number) => {
    StarfieldController.updateConfig({ opacityBase: opacity });
  },
};
