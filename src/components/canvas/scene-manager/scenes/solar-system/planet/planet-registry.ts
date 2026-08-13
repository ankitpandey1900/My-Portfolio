import type { PlanetManifestEntry } from './planet-manifest';

/**
 * PlanetRegistry is the single source of truth managing dynamic configuration lookups.
 * Supports filters, custom order sorting, and slug/portfolio section retrievals.
 */
export class PlanetRegistry {
  private static planetsMap = new Map<string, PlanetManifestEntry>();

  /**
   * Register a new planet configuration entry.
   */
  static register(entry: PlanetManifestEntry): void {
    this.planetsMap.set(entry.id, entry);
  }

  /**
   * Remove a registered planet config by id.
   */
  static unregister(id: string): void {
    this.planetsMap.delete(id);
  }

  /**
   * Look up a planet config by ID.
   */
  static get(id: string): PlanetManifestEntry | undefined {
    return this.planetsMap.get(id);
  }

  /**
   * Look up a planet config by its dynamic URL slug path.
   */
  static getBySlug(slug: string): PlanetManifestEntry | undefined {
    return Array.from(this.planetsMap.values()).find((entry) => entry.slug === slug);
  }

  /**
   * Look up a planet config by its corresponding portfolio section key.
   */
  static getBySection(section: string): PlanetManifestEntry | undefined {
    return Array.from(this.planetsMap.values()).find((entry) => entry.portfolioSection === section);
  }

  /**
   * Return a list of all registered planet configurations.
   */
  static getAll(): PlanetManifestEntry[] {
    return Array.from(this.planetsMap.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Sort registered entries using a custom comparer function.
   */
  static sort(
    compareFn: (a: PlanetManifestEntry, b: PlanetManifestEntry) => number
  ): PlanetManifestEntry[] {
    return Array.from(this.planetsMap.values()).sort(compareFn);
  }

  /**
   * Filter registered entries using a custom criteria function.
   */
  static filter(filterFn: (entry: PlanetManifestEntry) => boolean): PlanetManifestEntry[] {
    return Array.from(this.planetsMap.values()).filter(filterFn);
  }

  /**
   * Clear all indexed map items from the registry.
   */
  static clear(): void {
    this.planetsMap.clear();
  }
}
export default PlanetRegistry;

