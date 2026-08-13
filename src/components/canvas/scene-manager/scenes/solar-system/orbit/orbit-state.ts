import type { OrbitConfig, OrbitLifecycleStage, OrbitState } from './orbit-types';

/**
 * Interface mapping active states for the local Orbit context.
 */
export interface OrbitStateContextType {
  /** The active running state (running/paused/stopped). */
  state: OrbitState;
  /** Active lifecycle stage. */
  lifecycle: OrbitLifecycleStage;
  /** Configuration parameters. */
  config: OrbitConfig;
  /** Setter for running states. */
  setState: (state: OrbitState) => void;
  /** Setter for lifecycles. */
  setLifecycle: (stage: OrbitLifecycleStage) => void;
}
export default OrbitStateContextType;

