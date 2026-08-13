import type { PlanetManifestEntry } from '../planet/planet-manifest';

export interface ResolvedPlanetAssets {
  colorMapPath: string | null;
  normalMapPath: string | null;
  roughnessMapPath: string | null;
  useFallbackColors: boolean;
}

/**
 * PlanetLoader resolves asset references from the manifest:
 * Maps paths dynamically and flags fallbacks if files are missing.
 */
export class PlanetLoader {
  /**
   * Resolve map paths, checking availability.
   */
  static resolveAssets(entry: PlanetManifestEntry): ResolvedPlanetAssets {
    const hasMaps = typeof entry.texture === 'string' && entry.texture.length > 0;

    if (!hasMaps) {
      return {
        colorMapPath: null,
        normalMapPath: null,
        roughnessMapPath: null,
        useFallbackColors: true,
      };
    }

    return {
      colorMapPath: entry.texture || null,
      normalMapPath: entry.normalMap || null,
      roughnessMapPath: entry.roughnessMap || null,
      useFallbackColors: false,
    };
  }
}
export default PlanetLoader;

