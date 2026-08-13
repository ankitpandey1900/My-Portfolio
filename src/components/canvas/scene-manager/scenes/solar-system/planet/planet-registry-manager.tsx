'use client';

import * as React from 'react';
import { PLANET_DEFINITIONS } from './planet-definitions';
import { PlanetRegistry } from './planet-registry';
import { validatePlanetManifest } from './planet-validation';

/**
 * PlanetRegistryManager validates manifest entries on mount,
 * indexes definitions into registries, and performs unmount cleanups.
 */
export function PlanetRegistryManager() {
  React.useEffect(() => {
    // 1. Validate manifest templates catalog
    const validation = validatePlanetManifest(PLANET_DEFINITIONS);
    if (!validation.success) {
      console.error(
        'PlanetRegistryManager: Manifest validation failed!',
        validation.errors.join('\n')
      );
    }

    // 2. Populate registry entries
    for (const definition of PLANET_DEFINITIONS) {
      PlanetRegistry.register(definition);
    }

    return () => {
      // 3. Clear dynamic indices mappings on unmount
      PlanetRegistry.clear();
    };
  }, []);

  return null;
}
export default PlanetRegistryManager;

