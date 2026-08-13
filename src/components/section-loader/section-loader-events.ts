import { sceneEventEmitter } from '../canvas/scene-manager/events/scene-event-emitter';

export type SectionLoaderEventName =
  | 'SectionResolveStarted'
  | 'SectionResolved'
  | 'SectionLoading'
  | 'SectionLoaded'
  | 'SectionFailed'
  | 'SectionCancelled';

export interface SectionLoaderPayload {
  sectionId?: string | undefined;
  timestamp: number;
  error?: string | undefined;
}

export const SectionLoaderEvents = {
  emit: (event: SectionLoaderEventName, payload: SectionLoaderPayload) => {
    sceneEventEmitter.emit(`loader:${event}`, payload);
  },
  on: (event: SectionLoaderEventName, callback: (data: SectionLoaderPayload) => void) => {
    return sceneEventEmitter.on(`loader:${event}`, (data) =>
      callback(data as SectionLoaderPayload)
    );
  },
};

