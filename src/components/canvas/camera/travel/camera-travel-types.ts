import * as THREE from 'three';

export type TravelState =
  | 'idle'
  | 'preparing'
  | 'travelling'
  | 'arriving'
  | 'focused'
  | 'returning'
  | 'cancelled'
  | 'error';

export interface TravelRequest {
  targetId: string | null;
  targetPosition?: THREE.Vector3Tuple;
  targetLookAt?: THREE.Vector3Tuple;
  durationMs?: number;
  easing?: 'linear' | 'ease-in-out' | 'custom';
  /** Multiplier applied to planet cameraDistance (e.g. 0.55 for close-up). */
  cameraDistanceScale?: number;
  onComplete?: () => void;
  onInterrupt?: () => void;
}

export interface TravelPath {
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
  startLookAt: THREE.Vector3;
  endLookAt: THREE.Vector3;
  midPointOffset?: THREE.Vector3; // Used for arc sweeping
  progress: number;
}

