import { describe, expect, it } from 'vitest';
import { PLANET_DEFINITIONS } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-definitions';
import { PlanetRegistry } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-registry';
import { resolveSectionFromPlanet } from '@/components/navigation/planet-section-resolver';

describe('planet-section-resolver', () => {
  it('maps planet IDs to portfolio sections', () => {
    PlanetRegistry.clear();
    PLANET_DEFINITIONS.forEach((planet) => PlanetRegistry.register(planet));

    expect(resolveSectionFromPlanet('earth-projects')).toBe('projects');
    expect(resolveSectionFromPlanet('mars-services')).toBe('services');
    expect(resolveSectionFromPlanet('neptune-github')).toBe('github');
    expect(resolveSectionFromPlanet('unknown-planet')).toBeNull();
  });
});
