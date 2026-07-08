// ─────────────────────────────────────────────────────────────────────────────
// Sequence Types
// Strict definitions for the Cinematic Director's orchestration engine.
// ─────────────────────────────────────────────────────────────────────────────

export type SequenceId =
  | 'IntroSequence'
  | 'HomeReveal'
  | 'PlanetTravel'
  | 'PlanetLanding'
  | 'SectionReveal'
  | 'SectionExit'
  | 'ReturnHome'
  | 'FutureDemoMode'
  | 'FutureIdleSequence';

export type SequenceStatus =
  | 'Idle'
  | 'Preparing'
  | 'Loading'
  | 'Running'
  | 'Paused'
  | 'Waiting'
  | 'Completed'
  | 'Cancelled'
  | 'Failed';

// ─────────────────────────────────────────────────────────────────────────────
// Action Primitives
// ─────────────────────────────────────────────────────────────────────────────

export interface BaseAction {
  id?: string; // Optional ID for debugging
}

/** Waits for a specified duration in milliseconds */
export interface DelayAction extends BaseAction {
  type: 'delay';
  durationMs: number;
}

/** Executes an array of actions simultaneously, waiting for all to complete */
export interface ParallelAction extends BaseAction {
  type: 'parallel';
  actions: SequenceAction[];
}

/** Executes an array of actions sequentially, one after another */
export interface SequentialAction extends BaseAction {
  type: 'sequential';
  actions: SequenceAction[];
}

/** Emits an event to the global bus */
export interface EmitEventAction extends BaseAction {
  type: 'emitEvent';
  eventName: string;
  payload?: unknown;
}

/** Calls an arbitrary synchronous or asynchronous function */
export interface CallAction extends BaseAction {
  type: 'call';
  fn: (context: { signal: AbortSignal }) => void | Promise<void>;
}

/** Evaluates a condition and executes the corresponding action branch */
export interface ConditionalAction extends BaseAction {
  type: 'conditional';
  condition: () => boolean;
  onTrue?: SequenceAction;
  onFalse?: SequenceAction;
}

export type SequenceAction =
  | DelayAction
  | ParallelAction
  | SequentialAction
  | EmitEventAction
  | CallAction
  | ConditionalAction;

// ─────────────────────────────────────────────────────────────────────────────
// Definitions & State
// ─────────────────────────────────────────────────────────────────────────────

export interface SequenceDefinition {
  id: SequenceId;
  steps: SequenceAction[];
  interruptible?: boolean;
}

export interface SequenceState {
  currentSequenceId: SequenceId | null;
  status: SequenceStatus;
  queue: SequenceId[];
  isGlobalMuted: boolean;

  setStatus: (status: SequenceStatus) => void;
  setCurrentSequence: (id: SequenceId | null) => void;
  enqueue: (id: SequenceId) => void;
  clearQueue: () => void;
  dequeue: () => SequenceId | undefined;
}
