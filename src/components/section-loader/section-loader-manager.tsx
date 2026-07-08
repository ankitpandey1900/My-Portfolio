'use client';

import * as React from 'react';
import { NavigationEvents } from '../navigation/navigation-events';
import { SectionLoaderController } from './section-loader-controller';

/**
 * SectionLoaderManager
 * Headless orchestrator intercepting navigation events to trigger chunk loading.
 */
export function SectionLoaderManager() {
  React.useEffect(() => {
    // When Navigation dictates a section has opened, start loading its contents
    const unsubSection = NavigationEvents.on('SectionOpened', (payload) => {
      if (payload.sectionId) {
        SectionLoaderController.loadSection(payload.sectionId);
      }
    });

    const unsubReturn = NavigationEvents.on('ReturnHome', () => {
      SectionLoaderController.cancelLoading();
    });

    return () => {
      unsubSection();
      unsubReturn();
    };
  }, []);

  return null;
}
