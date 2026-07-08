import type { PlanetManifestEntry } from './planet-manifest';

/**
 * Prepares Zod structural shapes interfaces for future schema verification.
 */
export interface PlanetValidationSchema {
  id: string;
  slug: string;
  displayName: string;
  order: number;
  portfolioSection: string;
  description: string;
  radius: number;
  orbitRadius: number;
  rotationSpeed: number;
  orbitSpeed: number;
  cameraDistance: number;
  cameraTarget: [number, number, number];
  colorPalette: string[];
  icon: string;
  theme: string;
  status: string;
  qualityPreset: string;
}

/**
 * Parses and verifies if the configuration object conforms to structural rules.
 */
export function validateAgainstSchema(config: unknown): config is PlanetManifestEntry {
  if (typeof config !== 'object' || config === null) return false;

  const entry = config as Record<string, unknown>;

  // Check required primary types
  const hasStringKeys =
    typeof entry.id === 'string' &&
    typeof entry.slug === 'string' &&
    typeof entry.displayName === 'string' &&
    typeof entry.description === 'string' &&
    typeof entry.icon === 'string';

  const hasNumericKeys =
    typeof entry.order === 'number' &&
    typeof entry.radius === 'number' &&
    typeof entry.orbitRadius === 'number' &&
    typeof entry.rotationSpeed === 'number' &&
    typeof entry.orbitSpeed === 'number' &&
    typeof entry.cameraDistance === 'number';

  const hasArrayKeys =
    Array.isArray(entry.colorPalette) &&
    Array.isArray(entry.cameraTarget) &&
    entry.cameraTarget.length === 3;

  return hasStringKeys && hasNumericKeys && hasArrayKeys;
}
export default validateAgainstSchema;
