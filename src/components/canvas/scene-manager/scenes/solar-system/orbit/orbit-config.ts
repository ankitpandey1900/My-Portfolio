import type { OrbitConfig } from './orbit-types';

export const FALLBACK_ORBIT_CONFIG: OrbitConfig = {
  id: 'fallback',
  parentId: 'sun',
  radius: 10.0,
  speed: 0.005,
  direction: 1,
  inclination: 0.0,
  eccentricity: 0.0,
  startAngle: 0.0,
  clockwise: false,
  paused: false,
  visible: true,
  qualityPreset: 'medium',
  debugEnabled: false,
};
export default FALLBACK_ORBIT_CONFIG;
