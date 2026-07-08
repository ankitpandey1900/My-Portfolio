// ─────────────────────────────────────────────────────────────────────────────
// Environment Types
// Strictly typed boundaries for the Environment Engine (Task 6.2).
// ─────────────────────────────────────────────────────────────────────────────

/** Supported image-based lighting and background types. */
export type EnvironmentBackgroundMode = 'color' | 'hdri' | 'transparent';

/** Tone mapping types supported by the rendering pipeline. */
export type ToneMappingType = 'ACESFilmic' | 'Cineon' | 'Linear' | 'Reinhard' | 'None';

/** Identifiers for registered environment presets. */
export type EnvironmentPresetId = 'deep-space' | 'nebula-glow' | 'solar-flare' | 'dark-space';

/** Configuration for a specific environment preset. */
export interface EnvironmentPresetConfig {
  /** Unique identifier for the preset. */
  id: EnvironmentPresetId;

  /** Background and clear color settings. */
  background: {
    mode: EnvironmentBackgroundMode;
    color?: string; // Hex color string, e.g., '#030305'
    dreiPreset?: 'night' | 'sunset' | 'city' | 'dawn' | 'park' | 'studio' | 'forest' | 'apartment'; // Built-in drei environments
  };

  /** Global illumination and directional lighting settings. */
  lighting: {
    ambientIntensity: number;
    ambientColor: string;
    directionalIntensity: number;
    directionalColor: string;
    environmentIntensity: number; // IBL intensity
  };

  /** Post-processing and tone mapping integration. */
  post: {
    exposure: number;
    toneMapping: ToneMappingType;
    brightness: number; // Future-proofing for post-processing
    contrast: number; // Future-proofing for post-processing
    saturation: number; // Future-proofing for post-processing
  };

  /** Depth and atmospheric fog. */
  fog: {
    enabled: boolean;
    color: string;
    near: number;
    far: number;
  };
}

/** State for the Environment Engine store. */
export interface EnvironmentState {
  currentPresetId: EnvironmentPresetId;
  activeConfig: EnvironmentPresetConfig;
  setPreset: (presetId: EnvironmentPresetId) => void;
  updateConfig: (partialConfig: DeepPartial<EnvironmentPresetConfig>) => void;
}

/** Utility type for partial deep updates to config. */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
