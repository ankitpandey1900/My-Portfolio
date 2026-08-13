export const GESTURE_CONFIG = {
  // Swipes must cover this many pixels to register
  SWIPE_THRESHOLD_PX: 30,

  // Swipes must exceed this velocity (px/ms) to register
  SWIPE_VELOCITY_THRESHOLD: 0.3,

  // Maximum time between taps for a DoubleTap
  DOUBLE_TAP_DELAY_MS: 300,

  // Minimum time finger must be down for LongPress
  LONG_PRESS_DELAY_MS: 500,

  // Drags must move this many pixels before 'dragging' state starts (ignoring accidental jitter)
  DRAG_DEADZONE_PX: 10,

  // Maximum time a tap can take to be considered a tap (not a drag or hold)
  MAX_TAP_DURATION_MS: 250,
};

