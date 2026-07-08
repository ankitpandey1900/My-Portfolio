'use client';

import * as React from 'react';
import { OrbitComponent } from '../orbit/orbit-component';
import { OrbitProvider } from '../orbit/orbit-provider';
import { PLANET_DEFINITIONS } from '../planet/planet-definitions';
import { PlanetFactory } from '../planet/planet-factory';
import { PlanetRegistry } from '../planet/planet-registry';
import type { PlanetManifestEntry } from '../planet/planet-manifest';
import { buildPlanetOrbitConfig } from '../planet/planet-utilities';
import { PlanetSpawner } from './planet-spawner';

function getPlanetEntries(): PlanetManifestEntry[] {
  const registered = PlanetRegistry.getAll();
  return registered.length > 0 ? registered : PLANET_DEFINITIONS;
}

export function PlanetGenerator() {
  const entries = React.useMemo(() => getPlanetEntries(), []);

  const spawnedPlanets = React.useMemo(() => {
    const total = entries.length;
    return entries.map((entry) => ({
      entry,
      orbitConfig: buildPlanetOrbitConfig(entry, total),
    }));
  }, [entries]);

  return (
    <group name="spawner-generated-planets">
      {spawnedPlanets.map(({ entry, orbitConfig }) => (
        <PlanetSpawner key={entry.id} entry={entry}>
          <OrbitProvider config={orbitConfig}>
            <OrbitComponent>
              <PlanetFactory id={entry.id} fallbackEntry={entry} />
            </OrbitComponent>
          </OrbitProvider>
        </PlanetSpawner>
      ))}
    </group>
  );
}
export default PlanetGenerator;
