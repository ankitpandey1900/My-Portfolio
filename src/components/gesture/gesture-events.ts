import { sceneEventEmitter } from '../canvas/scene-manager/events/scene-event-emitter';
import type { GestureContext, GestureType } from './gesture-types';

export interface GesturePayload {
  type: GestureType;
  context: Partial<GestureContext>;
}

export const GestureEvents = {
  emit: (payload: GesturePayload) => {
    sceneEventEmitter.emit(`gesture:${payload.type}`, payload);
  },
  on: (type: GestureType, callback: (data: GesturePayload) => void) => {
    return sceneEventEmitter.on(`gesture:${type}`, (data) => callback(data as GesturePayload));
  },
};
