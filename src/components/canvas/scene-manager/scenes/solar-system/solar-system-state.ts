import { SolarSystemRegistry } from './solar-system-registry';
import type { SolarSystemConfig } from './solar-system-types';

/**
 * Interface mapping active states for the Solar System context.
 */
export interface SolarSystemState {
  /** Environmental configuration parameters. */
  config: SolarSystemConfig;
  /** Active focused planet target ID (null if viewing whole system). */
  activeTargetId: string | null;
  /** Class holding registries mappings. */
  registry: SolarSystemRegistry;
  /** Toggle parameter determining if orbital tracks are drawn. */
  isOrbitActive: boolean;
  /** Setter to shift active target. */
  setActiveTarget: (id: string | null) => void;
  /** Setter to toggle orbits visibility. */
  setOrbitActive: (active: boolean) => void;
  /** Action updating configurations parameters. */
  updateConfig: (updater: Partial<SolarSystemConfig>) => void;
}
export default SolarSystemState;
