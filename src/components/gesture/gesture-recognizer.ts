import { GESTURE_CONFIG } from './gesture-config';
import { GestureEvents } from './gesture-events';
import { useGestureStore } from './gesture-state';
import type { GestureContext, GestureType } from './gesture-types';

// Track pointers natively in a Map to support true multi-touch
const pointers = new Map<number, PointerEvent>();

let startX = 0;
let startY = 0;
let startTime = 0;

let lastTapTime = 0;
let longPressTimer: NodeJS.Timeout | null = null;
let isDragging = false;
let isPinching = false;
let initialPinchDistance = 0;

const emitGesture = (type: GestureType, context: Partial<GestureContext>) => {
  GestureEvents.emit({ type, context });
  useGestureStore.getState().logGesture(type, context);
};

const getPinchDistance = () => {
  if (pointers.size < 2) return 0;
  const pts = Array.from(pointers.values());
  const p1 = pts[0];
  const p2 = pts[1];
  if (!p1 || !p2) return 0;
  const dx = p1.clientX - p2.clientX;
  const dy = p1.clientY - p2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const GestureRecognizer = {
  handlePointerDown: (e: PointerEvent) => {
    const store = useGestureStore.getState();
    if (store.disabled) return;

    pointers.set(e.pointerId, e);
    store.setActiveTouchPoints(pointers.size);

    if (pointers.size === 1) {
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
      isDragging = false;

      store.setState('touching');

      if (longPressTimer) clearTimeout(longPressTimer);
      longPressTimer = setTimeout(() => {
        if (!isDragging && pointers.size === 1) {
          emitGesture('LongPress', { startX, startY, timestamp: Date.now() });
        }
      }, GESTURE_CONFIG.LONG_PRESS_DELAY_MS);
    } else if (pointers.size === 2) {
      isPinching = true;
      initialPinchDistance = getPinchDistance();
      store.setState('pinching');
      emitGesture('PinchStart', { scale: 1, timestamp: Date.now() });
    }
  },

  handlePointerMove: (e: PointerEvent) => {
    const store = useGestureStore.getState();
    if (store.disabled || !pointers.has(e.pointerId)) return;

    pointers.set(e.pointerId, e);

    if (pointers.size === 1) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (!isDragging && distance > GESTURE_CONFIG.DRAG_DEADZONE_PX) {
        isDragging = true;
        store.setState('dragging');
        if (longPressTimer) clearTimeout(longPressTimer);
        emitGesture('DragStart', {
          startX,
          startY,
          currentX: e.clientX,
          currentY: e.clientY,
          deltaX,
          deltaY,
          timestamp: Date.now(),
        });
      } else if (isDragging) {
        emitGesture('DragMove', {
          startX,
          startY,
          currentX: e.clientX,
          currentY: e.clientY,
          deltaX,
          deltaY,
          timestamp: Date.now(),
        });
      }
    } else if (pointers.size === 2 && isPinching) {
      const currentDistance = getPinchDistance();
      const scale = currentDistance / initialPinchDistance;
      emitGesture('PinchMove', { scale, timestamp: Date.now() });
    }
  },

  handlePointerUp: (e: PointerEvent) => {
    const store = useGestureStore.getState();
    if (store.disabled || !pointers.has(e.pointerId)) return;

    if (longPressTimer) clearTimeout(longPressTimer);

    if (pointers.size === 1 && !isPinching) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const duration = Date.now() - startTime;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (isDragging) {
        emitGesture('DragEnd', {
          currentX: e.clientX,
          currentY: e.clientY,
          deltaX,
          deltaY,
          timestamp: Date.now(),
        });

        // Evaluate swipe
        if (distance > GESTURE_CONFIG.SWIPE_THRESHOLD_PX) {
          const velocity = distance / Math.max(duration, 1);
          if (velocity > GESTURE_CONFIG.SWIPE_VELOCITY_THRESHOLD) {
            store.setState('swiping');
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              emitGesture(deltaX > 0 ? 'SwipeRight' : 'SwipeLeft', {
                velocity,
                deltaX,
                deltaY,
                timestamp: Date.now(),
              });
            } else {
              emitGesture(deltaY > 0 ? 'SwipeDown' : 'SwipeUp', {
                velocity,
                deltaX,
                deltaY,
                timestamp: Date.now(),
              });
            }
          }
        }
      } else {
        if (duration < GESTURE_CONFIG.MAX_TAP_DURATION_MS) {
          const timeSinceLastTap = Date.now() - lastTapTime;
          if (timeSinceLastTap < GESTURE_CONFIG.DOUBLE_TAP_DELAY_MS) {
            emitGesture('DoubleTap', { startX, startY, timestamp: Date.now() });
            lastTapTime = 0; // reset
          } else {
            emitGesture('Tap', { startX, startY, timestamp: Date.now() });
            lastTapTime = Date.now();
          }
        }
      }
    } else if (pointers.size === 2 && isPinching) {
      emitGesture('PinchEnd', { timestamp: Date.now() });
      isPinching = false;
    }

    pointers.delete(e.pointerId);
    store.setActiveTouchPoints(pointers.size);

    if (pointers.size === 0) {
      store.setState('idle');
      isDragging = false;
      isPinching = false;
    }
  },

  handlePointerCancel: (e: PointerEvent) => {
    if (longPressTimer) clearTimeout(longPressTimer);
    pointers.delete(e.pointerId);
    useGestureStore.getState().setActiveTouchPoints(pointers.size);
    if (pointers.size === 0) {
      useGestureStore.getState().setState('cancelled');
      isDragging = false;
      isPinching = false;
    }
  },

  cancelAll: () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    pointers.clear();
    isDragging = false;
    isPinching = false;
    useGestureStore.getState().setActiveTouchPoints(0);
    useGestureStore.getState().setState('cancelled');
  },
};

