import type { PlanetManifestEntry } from '../planet/planet-manifest';
import { PlanetRegistry } from '../planet/planet-registry';
import { validatePlanetManifest } from '../planet/planet-validation';

/**
 * PlanetInitializer is responsible for parsing manifest entries,
 * validating constraints, and registering catalog mappings dynamically.
 */
export class PlanetInitializer {
  /**
   * Validate and load manifest lists into PlanetRegistry catalog maps.
   */
  static initializeRegistry(manifestEntries: PlanetManifestEntry[]): boolean {
    // 1. Run manifest validation constraint checks
    const validation = validatePlanetManifest(manifestEntries);
    if (!validation.success) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          'PlanetInitializer: Manifest validation errors occurred!',
          validation.errors.join('\n')
        );
      }
      return false;
    }

    // 2. Clear any staled dynamic mappings
    PlanetRegistry.clear();

    // 3. Populate definitions records in registry maps
    for (const entry of manifestEntries) {
      PlanetRegistry.register(entry);
    }

    return true;
  }
}
export default PlanetInitializer;

