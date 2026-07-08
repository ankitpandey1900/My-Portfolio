import type { PlanetConfig } from './planet-types';

export const FALLBACK_PLANET_CONFIG: PlanetConfig = {
  id: 'fallback',
  name: 'fallback',
  displayName: 'Fallback Planet',
  order: 1,
  radius: 1.0,
  colorPalette: ['#888888', '#aaaaaa'],
  texture: '/textures/planets/fallback_color.png',
  normalMap: '/textures/planets/fallback_normal.png',
  roughnessMap: '/textures/planets/fallback_rough.png',
  emissive: '#000000',
  emissiveIntensity: 0.0,
  rotationSpeed: 0.01,
  orbitRadius: 10.0,
  orbitSpeed: 0.005,
  tilt: 0.0,
  cameraDistance: 5.0,
  cameraTarget: [0, 0, 0],
  portfolioSection: 'about',
  theme: 'cinematic',
  qualityPreset: 'medium',
  futureMetadata: {},
};
export default FALLBACK_PLANET_CONFIG;
