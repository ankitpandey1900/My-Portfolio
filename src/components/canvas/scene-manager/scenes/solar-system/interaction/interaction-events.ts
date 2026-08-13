import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import type { InteractionEventName, InteractionPayload } from './interaction-types';

/**
 * Type-safe wrapper for interaction events bridging to the global scene emitter.
 */
export const InteractionEvents = {
  emit: (event: InteractionEventName, payload: InteractionPayload) => {
    sceneEventEmitter.emit(`interaction:${event}`, payload);
  },
  on: (event: InteractionEventName, callback: (data: InteractionPayload) => void) => {
    // sceneEventEmitter.on returns a cleanup function
    return sceneEventEmitter.on(`interaction:${event}`, (data) =>
      callback(data as InteractionPayload)
    );
  },
};

