import type { CameraPresetType, SpaceEnvPreset } from '@/lib/store';

export interface SolarSystemSceneConfig {
  cameraPreset: CameraPresetType;
  envPreset: SpaceEnvPreset;
  starfieldPreset: string;
  nebulaPreset: string;
  particlePreset: string;
}

export const SOLAR_SYSTEM_SCENE_CONFIG: SolarSystemSceneConfig = {
  cameraPreset: 'system',
  envPreset: 'deep-space',
  starfieldPreset: 'realistic',
  nebulaPreset: 'minimal-space',
  particlePreset: 'SpaceDust',
};
