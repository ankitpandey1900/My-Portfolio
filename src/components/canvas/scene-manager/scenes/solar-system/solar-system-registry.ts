import type { PlanetRegistryEntry } from './solar-system-types';

/**
 * SolarSystemRegistry stores registered celestial bodies.
 * Configured dynamically, it handles lookups and custom additions.
 */
export class SolarSystemRegistry {
  private planetsMap = new Map<string, PlanetRegistryEntry>();
  private dwarfPlanetsMap = new Map<string, PlanetRegistryEntry>();
  private asteroidCountValue = 500;

  /**
   * Register a new planet mesh entry.
   */
  registerPlanet(entry: PlanetRegistryEntry): void {
    this.planetsMap.set(entry.id, entry);
  }

  /**
   * Register a new dwarf planet entry.
   */
  registerDwarfPlanet(entry: PlanetRegistryEntry): void {
    this.dwarfPlanetsMap.set(entry.id, entry);
  }

  /**
   * Retrieve a planet entry by its unique string id.
   */
  getPlanet(id: string): PlanetRegistryEntry | undefined {
    return this.planetsMap.get(id);
  }

  /**
   * Retrieve a dwarf planet entry by its unique string id.
   */
  getDwarfPlanet(id: string): PlanetRegistryEntry | undefined {
    return this.dwarfPlanetsMap.get(id);
  }

  /**
   * Returns a sorted list of all registered planets.
   */
  getAllPlanets(): PlanetRegistryEntry[] {
    return Array.from(this.planetsMap.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Returns a list of all registered dwarf planets.
   */
  getAllDwarfPlanets(): PlanetRegistryEntry[] {
    return Array.from(this.dwarfPlanetsMap.values());
  }

  /**
   * Gets the asteroid density count.
   */
  get asteroidCount(): number {
    return this.asteroidCountValue;
  }

  /**
   * Sets the asteroid density count.
   */
  setAsteroidCount(count: number): void {
    this.asteroidCountValue = count;
  }

  /**
   * Clears all registered entries.
   */
  clear(): void {
    this.planetsMap.clear();
    this.dwarfPlanetsMap.clear();
  }
}

