/**
 * State parameters representing the running status of an orbit.
 */
export type OrbitState = 'initializing' | 'running' | 'paused' | 'stopped' | 'disposed';

/**
 * Standard lifecycle stages for orbital calculations and renderings.
 */
export type OrbitLifecycleStage =
  'initialize' | 'start' | 'update' | 'pause' | 'resume' | 'stop' | 'reset' | 'dispose' | 'cleanup';

/**
 * Configuration schema defining mechanical and visual parameters for any orbit.
 */
export interface OrbitConfig {
  /** Unique key identifying the orbit. */
  id: string;
  /** Unique key of the parent body centered at origin (e.g. 'sun'). */
  parentId: string;
  /** Distance from parent center. */
  radius: number;
  /** Translation velocity. */
  speed: number;
  /** Direction multiplier (1 for forward, -1 for reverse). */
  direction: 1 | -1;
  /** Orbital plane inclination angle (degrees relative to system plane). */
  inclination: number;
  /** Orbit eccentricity factor (flatness: 0 for circular, 0-1 for elliptical). */
  eccentricity: number;
  /** Initial starting angle (radians). */
  startAngle: number;
  /** Toggle direction: true for clockwise, false for counter-clockwise. */
  clockwise: boolean;
  /** Pause mechanical translation movements. */
  paused: boolean;
  /** Drawing visibility of the visual line ring path. */
  visible: boolean;
  /** Quality tier configuration profile. */
  qualityPreset: 'low' | 'medium' | 'high' | 'ultra';
  /** Flag to toggle developer telemetry. */
  debugEnabled: boolean;
}

/**
 * Event callbacks emitted dynamically on orbit mechanic triggers.
 */
export interface OrbitEvents {
  onOrbitStarted?: (id: string) => void;
  onOrbitPaused?: (id: string) => void;
  onOrbitResumed?: (id: string) => void;
  onOrbitStopped?: (id: string) => void;
  onOrbitCompleted?: (id: string) => void;
  onOrbitReset?: (id: string) => void;
  onSpeedChanged?: (id: string, speed: number) => void;
  onRadiusChanged?: (id: string, radius: number) => void;
}
export default OrbitConfig;

