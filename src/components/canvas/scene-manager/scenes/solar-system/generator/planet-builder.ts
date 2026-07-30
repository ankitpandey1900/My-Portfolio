import * as THREE from 'three';
import type { PlanetManifestEntry } from '../planet/planet-manifest';
import {
  createEarthMaterial,
  createGasGiantMaterial,
  createIceGiantMaterial,
  createMarsMaterial,
  createMercuryMaterial,
  createMoonMaterial,
  createPlutoMaterial,
  createRockyPlanetMaterial,
  createVenusMaterial,
} from '../planet/planet-materials';
import { PlanetLoader } from './planet-loader';

function createSpecializedMaterial(entry: PlanetManifestEntry): THREE.Material {
  switch (entry.id) {
    case 'earth-projects':
      return createEarthMaterial();
    case 'mars-services':
      return createMarsMaterial();
    case 'mercury-home':
      return createMercuryMaterial();
    case 'venus-about':
      return createVenusMaterial();
    case 'jupiter-skills':
      return createGasGiantMaterial(['#6a4224', '#a87242', '#d8a868'], '#c04820');
    case 'saturn-experience':
      return createGasGiantMaterial(['#9a7848', '#c8a870', '#ead8a8'], '#d8b878');
    case 'uranus-github':
      return createIceGiantMaterial('#48a8c0', '#78d8e8', '#a8f8f8');
    case 'neptune-contact':
      return createIceGiantMaterial('#142838', '#2a5878', '#6a98c0');
    case 'pluto-contact':
      return createPlutoMaterial();
    default: {
      const [colorA, colorB] = entry.colorPalette;
      return createRockyPlanetMaterial(
        colorA ?? '#8d877d',
        colorB ?? colorA ?? '#6d675d',
        entry.emissive || '#000000',
        entry.emissiveIntensity ?? 0
      );
    }
  }
}

export class PlanetBuilder {
  static buildMaterial(entry: PlanetManifestEntry): THREE.Material {
    const assets = PlanetLoader.resolveAssets(entry);

    if (!assets.useFallbackColors && assets.colorMapPath) {
      const baseColor = entry.colorPalette[0] ?? '#8d877d';
      const secondaryColor = entry.colorPalette[1] ?? baseColor;
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(baseColor).lerp(new THREE.Color(secondaryColor), 0.15),
        roughness: entry.theme === 'minimalist' ? 0.98 : 0.94,
        metalness: 0.008,
        emissive: new THREE.Color(entry.emissive || '#000000'),
        emissiveIntensity: (entry.emissiveIntensity ?? 0) * 0.25,
      });
    }

    return createSpecializedMaterial(entry);
  }

  static buildMoonMaterial(): THREE.ShaderMaterial {
    return createMoonMaterial();
  }
}

export default PlanetBuilder;
