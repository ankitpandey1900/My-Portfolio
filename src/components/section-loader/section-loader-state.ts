import type { ComponentType } from 'react';
import { create } from 'zustand';
import type { SectionId, SectionLoaderContext, SectionLoaderState } from './section-loader-types';

interface SectionLoaderStore extends SectionLoaderContext {
  state: SectionLoaderState;
  loadedView: ComponentType | null;

  setState: (state: SectionLoaderState) => void;
  setSection: (sectionId: SectionId | null) => void;
  setLoadedView: (view: ComponentType | null) => void;
  reset: () => void;
}

export const useSectionLoaderStore = create<SectionLoaderStore>((set) => ({
  state: 'idle',
  currentSection: null,
  startTimestamp: null,
  loadedView: null,

  setState: (state) => set({ state }),

  setSection: (sectionId) =>
    set({
      currentSection: sectionId,
      startTimestamp: Date.now(),
      loadedView: null,
    }),

  setLoadedView: (loadedView) => set({ loadedView }),

  reset: () =>
    set({
      state: 'idle',
      currentSection: null,
      startTimestamp: null,
      loadedView: null,
    }),
}));

