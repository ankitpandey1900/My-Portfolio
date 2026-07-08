import { preloadSectionChunk } from '@/components/sections/section-chunks';
import { SECTION_LOADER_CONFIG } from './section-loader-config';
import { SectionLoaderEvents } from './section-loader-events';
import { useSectionLoaderStore } from './section-loader-state';
import type { SectionId } from './section-loader-types';
import { SectionResolver } from './section-resolver';

export const SectionLoaderController = {
  loadSection: (sectionId: string) => {
    const store = useSectionLoaderStore.getState();

    if (
      store.currentSection === sectionId &&
      (store.state === 'resolving' || store.state === 'loading' || store.state === 'loaded')
    ) {
      return;
    }

    SectionLoaderEvents.emit('SectionResolveStarted', { sectionId, timestamp: Date.now() });
    store.setState('resolving');

    const resolvedSection = SectionResolver.resolveSection(sectionId);

    if (!resolvedSection) {
      store.setState('failed');
      SectionLoaderEvents.emit('SectionFailed', {
        sectionId,
        timestamp: Date.now(),
        error: `Section not found in registry: ${sectionId}`,
      });
      return;
    }

    SectionLoaderEvents.emit('SectionResolved', {
      sectionId: resolvedSection.id,
      timestamp: Date.now(),
    });

    store.setSection(resolvedSection.id);
    store.setState('loading');
    SectionLoaderEvents.emit('SectionLoading', {
      sectionId: resolvedSection.id,
      timestamp: Date.now(),
    });

    const minDelay = SECTION_LOADER_CONFIG.SIMULATED_LOAD_DURATION;

    Promise.all([
      preloadSectionChunk(resolvedSection.id as SectionId),
      new Promise((resolve) => setTimeout(resolve, minDelay)),
    ])
      .then(([View]) => {
        const currentState = useSectionLoaderStore.getState();
        if (currentState.state !== 'loading' || currentState.currentSection !== resolvedSection.id) {
          return;
        }
        currentState.setLoadedView(View);
        currentState.setState('loaded');
        SectionLoaderEvents.emit('SectionLoaded', {
          sectionId: resolvedSection.id,
          timestamp: Date.now(),
        });
      })
      .catch((error: Error) => {
        useSectionLoaderStore.getState().setState('failed');
        SectionLoaderEvents.emit('SectionFailed', {
          sectionId: resolvedSection.id,
          timestamp: Date.now(),
          error: error.message,
        });
      });
  },

  cancelLoading: () => {
    const store = useSectionLoaderStore.getState();
    if (store.state === 'idle' || store.state === 'cancelled') return;

    store.setState('cancelled');
    store.setLoadedView(null);
    SectionLoaderEvents.emit('SectionCancelled', {
      sectionId: store.currentSection || undefined,
      timestamp: Date.now(),
    });
  },

  reloadSection: () => {
    const store = useSectionLoaderStore.getState();
    if (store.currentSection) {
      SectionLoaderController.loadSection(store.currentSection);
    }
  },

  getCurrentSection: (): SectionId | null => {
    return useSectionLoaderStore.getState().currentSection;
  },

  isSectionLoaded: (): boolean => {
    return useSectionLoaderStore.getState().state === 'loaded';
  },
};
