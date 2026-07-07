import type { CameraPresetType, SpaceEnvPreset, ToneMappingType } from '@/lib/store';

export interface GalaxySceneConfig {
  cameraPreset: CameraPresetType;
  envPreset: SpaceEnvPreset;
  exposure: number;
  environmentIntensity: number;
  ambientIntensity: number;
  starDensity: number;
  nebulaIntensity: number;
  toneMapping: ToneMappingType;
}

export const GALAXY_SCENE_CONFIG: GalaxySceneConfig = {
  cameraPreset: 'galaxy',
  envPreset: 'deep-space',
  exposure: 1.0,
  environmentIntensity: 0.8,
  ambientIntensity: 0.1,
  starDensity: 12000,
  nebulaIntensity: 0.6,
  toneMapping: 'ACESFilmic',
};
