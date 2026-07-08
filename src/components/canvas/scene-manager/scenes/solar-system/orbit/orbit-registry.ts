import type { OrbitConfig } from './orbit-types';

/**
 * OrbitRegistry catalogs all registered orbital configurations.
 */
export class OrbitRegistry {
  private static orbitsMap = new Map<string, OrbitConfig>();

  /**
   * Register a new orbital configuration.
   */
  static register(config: OrbitConfig): void {
    this.orbitsMap.set(config.id, config);
  }

  /**
   * Retrieve orbit configuration by ID.
   */
  static get(id: string): OrbitConfig | undefined {
    return this.orbitsMap.get(id);
  }

  /**
   * Returns all registered orbits.
   */
  static getAll(): OrbitConfig[] {
    return Array.from(this.orbitsMap.values());
  }

  /**
   * Clears the static maps catalog.
   */
  static clear(): void {
    this.orbitsMap.clear();
  }
}
export default OrbitRegistry;
