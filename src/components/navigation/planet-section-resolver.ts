import { PlanetRegistry } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-registry';
import type { SectionId } from '@/components/section-loader/section-loader-types';
import { SECTION_REGISTRY } from '@/components/section-loader/section-registry';

/**
 * Resolves a planet ID to a validated portfolio section ID via PlanetRegistry.
 */
export function resolveSectionFromPlanet(planetId: string): SectionId | null {
  const planet = PlanetRegistry.get(planetId);
  if (!planet?.portfolioSection) return null;

  const sectionId = planet.portfolioSection as SectionId;
  return SECTION_REGISTRY[sectionId] ? sectionId : null;
}

/**
 * Resolves a section ID back to its primary planet ID.
 */
export function resolvePlanetFromSection(sectionId: SectionId): string | null {
  const planet = PlanetRegistry.getBySection(sectionId);
  return planet?.id ?? null;
}
