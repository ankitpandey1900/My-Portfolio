export interface PlanetTextureSet {
  map: string;
  normalMap?: string;
  specularMap?: string;
  emissiveMap?: string;
  clouds?: string;
  roughness?: number;
  metalness?: number;
  emissiveIntensity?: number;
}

export const PLANET_TEXTURES: Record<string, PlanetTextureSet> = {
  'earth-projects': {
    map: '/textures/planets/earth_atmos_2048.jpg',
    normalMap: '/textures/planets/earth_normal_2048.jpg',
    specularMap: '/textures/planets/earth_specular_2048.jpg',
    emissiveMap: '/textures/planets/earth_lights_2048.png',
    clouds: '/textures/planets/earth_clouds_1024.png',
    roughness: 0.82,
    metalness: 0.02,
    emissiveIntensity: 0.55,
  },
};

export const MOON_TEXTURE = '/textures/planets/moon_1024.jpg';

export function getPlanetTextureSet(planetId: string): PlanetTextureSet | null {
  return PLANET_TEXTURES[planetId] ?? null;
}
