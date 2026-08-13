import { GestureEvents, type GesturePayload } from './gesture-events';
import { GestureRecognizer } from './gesture-recognizer';
import { useGestureStore } from './gesture-state';
import type { GestureType } from './gesture-types';

export const GestureController = {
  enableGestures: () => {
    useGestureStore.getState().setDisabled(false);
  },

  disableGestures: () => {
    GestureRecognizer.cancelAll();
    useGestureStore.getState().setDisabled(true);
  },

  registerGesture: (type: GestureType, callback: (data: GesturePayload) => void) => {
    return GestureEvents.on(type, callback);
  },

  getCurrentGesture: () => {
    return useGestureStore.getState().state;
  },

  cancelGesture: () => {
    GestureRecognizer.cancelAll();
  },
};

