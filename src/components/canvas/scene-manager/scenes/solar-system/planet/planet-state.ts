import type { PlanetConfig, PlanetLifecycleStage, PlanetState } from './planet-types';

/**
 * Interface mapping active states for the local Planet context.
 */
export interface PlanetStateContextType {
  /** The current active interaction state (e.g. hovered, selected). */
  state: PlanetState;
  /** Current active lifecycle stage. */
  lifecycle: PlanetLifecycleStage;
  /** Composed configuration parameters. */
  config: PlanetConfig;
  /** Trigger to update active interaction state. */
  setState: (state: PlanetState) => void;
  /** Trigger to update active lifecycle stage. */
  setLifecycle: (stage: PlanetLifecycleStage) => void;
}
export default PlanetStateContextType;

