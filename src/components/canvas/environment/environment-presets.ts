import type { EnvironmentPresetConfig, EnvironmentPresetId } from './environment-types';

export const ENVIRONMENT_PRESETS: Record<EnvironmentPresetId, EnvironmentPresetConfig> = {
  'deep-space': {
    id: 'deep-space',
    background: {
      mode: 'color',
      color: '#040506',
      dreiPreset: 'night',
    },
    lighting: {
      ambientIntensity: 0.045,
      ambientColor: '#587a96',
      directionalIntensity: 2.2,
      directionalColor: '#ffe0ad',
      environmentIntensity: 0.35,
    },
    post: {
      exposure: 0.95,
      toneMapping: 'ACESFilmic',
      brightness: 0.98,
      contrast: 1.18,
      saturation: 0.86,
    },
    fog: {
      enabled: true,
      color: '#040506',
      near: 160,
      far: 900,
    },
  },
  'nebula-glow': {
    id: 'nebula-glow',
    background: {
      mode: 'color',
      color: '#07080a',
      dreiPreset: 'night',
    },
    lighting: {
      ambientIntensity: 0.08,
      ambientColor: '#6f8190',
      directionalIntensity: 2.0,
      directionalColor: '#f2b866',
      environmentIntensity: 0.5,
    },
    post: {
      exposure: 1.05,
      toneMapping: 'ACESFilmic',
      brightness: 1.0,
      contrast: 1.14,
      saturation: 0.9,
    },
    fog: {
      enabled: true,
      color: '#07080a',
      near: 120,
      far: 760,
    },
  },
  'solar-flare': {
    id: 'solar-flare',
    background: {
      mode: 'color',
      color: '#050403',
      dreiPreset: 'sunset',
    },
    lighting: {
      ambientIntensity: 0.07,
      ambientColor: '#8a7a63',
      directionalIntensity: 3.0,
      directionalColor: '#ffe4b8',
      environmentIntensity: 0.75,
    },
    post: {
      exposure: 1.14,
      toneMapping: 'ACESFilmic',
      brightness: 1.02,
      contrast: 1.2,
      saturation: 0.92,
    },
    fog: {
      enabled: true,
      color: '#050403',
      near: 110,
      far: 900,
    },
  },
  'dark-space': {
    id: 'dark-space',
    background: {
      mode: 'color',
      color: '#000000',
      dreiPreset: 'night',
    },
    lighting: {
      ambientIntensity: 0.018,
      ambientColor: '#516678',
      directionalIntensity: 1.15,
      directionalColor: '#f4d8aa',
      environmentIntensity: 0.16,
    },
    post: {
      exposure: 0.82,
      toneMapping: 'ACESFilmic',
      brightness: 0.9,
      contrast: 1.42,
      saturation: 0.72,
    },
    fog: {
      enabled: false,
      color: '#000000',
      near: 10,
      far: 100,
    },
  },
};
