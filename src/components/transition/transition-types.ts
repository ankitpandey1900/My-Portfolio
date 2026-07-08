export type TransitionId =
  | 'CameraTravel'
  | 'PlanetLanding'
  | 'SectionLoading'
  | 'SectionOpening'
  | 'SectionClosing'
  | 'ReturnHome'
  | 'FutureShaderTransition'
  | 'FutureAudioTransition'
  | 'FutureParticleTransition';

export type TransitionState =
  'idle' | 'preparing' | 'running' | 'waiting' | 'completed' | 'cancelled' | 'failed';

export interface TransitionContext {
  id: TransitionId;
  targetId?: string | undefined; // e.g. 'earth' or 'projects'
  priority: number;
}
