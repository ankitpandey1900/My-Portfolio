import type { PlanetManifestEntry } from './planet-manifest';

export interface ValidationResult {
  success: boolean;
  errors: string[];
}

/**
 * Validates a list of PlanetManifestEntry objects against structural constraints.
 * Resolves constraints like unique ids, unique orders, and valid dimension values.
 */
export function validatePlanetManifest(entries: PlanetManifestEntry[]): ValidationResult {
  const errors: string[] = [];
  const ids = new Set<string>();
  const orders = new Set<number>();
  const slugs = new Set<string>();

  for (const entry of entries) {
    const planetRef = `Planet "${entry.id || 'unknown'}"`;

    // 1. Validate ID
    if (!entry.id) {
      errors.push(`Missing required field: "id" in entry.`);
      continue;
    }
    if (ids.has(entry.id)) {
      errors.push(`Duplicate ID conflict: "${entry.id}" is registered multiple times.`);
    }
    ids.add(entry.id);

    // 2. Validate Slug
    if (!entry.slug) {
      errors.push(`${planetRef} is missing required field: "slug".`);
    } else {
      if (slugs.has(entry.slug)) {
        errors.push(`Duplicate Slug conflict: "${entry.slug}" is registered multiple times.`);
      }
      slugs.add(entry.slug);
    }

    // 3. Validate Order
    if (typeof entry.order !== 'number') {
      errors.push(`${planetRef} order must be a valid number.`);
    } else {
      if (entry.order < 1 || entry.order > 99) {
        errors.push(`${planetRef} order "${entry.order}" is invalid. Must be between 1 and 99.`);
      }
      if (orders.has(entry.order)) {
        errors.push(
          `Duplicate Order conflict: index "${entry.order}" is mapped to multiple planets.`
        );
      }
      orders.add(entry.order);
    }

    // 4. Validate Dimensions
    if (entry.radius <= 0) {
      errors.push(`${planetRef} radius must be greater than 0. Received: ${entry.radius}.`);
    }
    if (entry.orbitRadius <= 0) {
      errors.push(
        `${planetRef} orbit radius must be greater than 0. Received: ${entry.orbitRadius}.`
      );
    }

    // 5. Validate Required Fields
    if (!entry.displayName) {
      errors.push(`${planetRef} is missing required field: "displayName".`);
    }
    if (!entry.portfolioSection) {
      errors.push(`${planetRef} is missing required field: "portfolioSection".`);
    }

    // 6. Validate Moons
    if (entry.moons) {
      for (const moon of entry.moons) {
        if (!moon.id) {
          errors.push(`Moon in ${planetRef} is missing "id".`);
        }
        if (moon.radius <= 0) {
          errors.push(`Moon "${moon.id}" in ${planetRef} has invalid radius: ${moon.radius}.`);
        }
        if (moon.orbitRadius <= 0) {
          errors.push(
            `Moon "${moon.id}" in ${planetRef} has invalid orbit radius: ${moon.orbitRadius}.`
          );
        }
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
export default validatePlanetManifest;
