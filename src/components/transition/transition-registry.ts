import type { TransitionId } from './transition-types';

export interface TransitionMetadata {
  id: TransitionId;
  defaultPriority: number;
  interruptible: boolean; // Can it be cancelled mid-flight by a higher priority transition?
}

export const TRANSITION_REGISTRY: Record<TransitionId, TransitionMetadata> = {
  CameraTravel: { id: 'CameraTravel', defaultPriority: 10, interruptible: true },
  PlanetLanding: { id: 'PlanetLanding', defaultPriority: 20, interruptible: false },
  SectionLoading: { id: 'SectionLoading', defaultPriority: 30, interruptible: false },
  SectionOpening: { id: 'SectionOpening', defaultPriority: 40, interruptible: false },
  SectionClosing: { id: 'SectionClosing', defaultPriority: 50, interruptible: false },
  ReturnHome: { id: 'ReturnHome', defaultPriority: 100, interruptible: true },
  FutureShaderTransition: { id: 'FutureShaderTransition', defaultPriority: 5, interruptible: true },
  FutureAudioTransition: { id: 'FutureAudioTransition', defaultPriority: 1, interruptible: true },
  FutureParticleTransition: {
    id: 'FutureParticleTransition',
    defaultPriority: 2,
    interruptible: true,
  },
};
