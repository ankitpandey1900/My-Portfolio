export type LandingState =
  | 'idle'
  | 'preparing'
  | 'landing'
  | 'arrived'
  | 'openingSection'
  | 'completed'
  | 'cancelled'
  | 'error';

export interface LandingContext {
  targetPlanetId: string | null;
  targetSectionId: string | null;
  startTimestamp: number | null;
}

