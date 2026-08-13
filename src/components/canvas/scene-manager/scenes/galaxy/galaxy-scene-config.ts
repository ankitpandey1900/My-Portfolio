import type { CameraPresetType, SpaceEnvPreset, ToneMappingType } from '@/lib/store';

export interface GalaxySceneConfig {
  cameraPreset: CameraPresetType;
  envPreset: SpaceEnvPreset;
  exposure: number;
  environmentIntensity: number;
  ambientIntensity: number;
  starfieldPreset: string;
  nebulaPreset: string;
  toneMapping: ToneMappingType;
}

export const GALAXY_SCENE_CONFIG: GalaxySceneConfig = {
  cameraPreset: 'galaxy',
  envPreset: 'deep-space',
  exposure: 1.0,
  environmentIntensity: 0.8,
  ambientIntensity: 0.1,
  starfieldPreset: 'ultra-dense',
  nebulaPreset: 'deep-space',
  toneMapping: 'ACESFilmic',
};

