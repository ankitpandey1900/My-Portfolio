/**
 * Configuration schema governing active spawner and caching layers parameters.
 */
export interface SpawnerConfig {
  /** Enables loading details dynamically on demand. */
  lazyGeneration: boolean;
  /** Maximum number of planets kept in active rendering groups. */
  maxActivePlanets: number;
  /** Timeout limit before asset loading falls back (in milliseconds). */
  loadTimeout: number;
}

/**
 * Registry structure tracking spawn durations and timings.
 */
export interface SpawnLog {
  id: string;
  spawnTime: number;
  status: 'success' | 'failed';
  error?: string;
}
