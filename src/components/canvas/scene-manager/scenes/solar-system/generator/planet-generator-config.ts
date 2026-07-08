import type { SpawnerConfig } from './planet-generator-types';

export const DEFAULT_SPAWNER_CONFIG: SpawnerConfig = {
  lazyGeneration: true,
  maxActivePlanets: 8,
  loadTimeout: 5000,
};
export default DEFAULT_SPAWNER_CONFIG;
