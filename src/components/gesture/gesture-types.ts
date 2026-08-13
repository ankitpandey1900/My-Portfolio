export type GestureType =
  | 'Tap'
  | 'DoubleTap'
  | 'LongPress'
  | 'SwipeLeft'
  | 'SwipeRight'
  | 'SwipeUp'
  | 'SwipeDown'
  | 'DragStart'
  | 'DragMove'
  | 'DragEnd'
  | 'PinchStart'
  | 'PinchMove'
  | 'PinchEnd';

export type GestureState =
  'idle' | 'touching' | 'dragging' | 'pinching' | 'swiping' | 'cancelled' | 'disabled';

export interface GestureContext {
  activePointers: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  scale: number;
  velocity: number;
  timestamp: number;
}

