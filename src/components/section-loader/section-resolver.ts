import type { SectionId } from './section-loader-types';
import { SECTION_REGISTRY } from './section-registry';

export const SectionResolver = {
  /**
   * Validates if a given string is a valid registered SectionId.
   */
  isValidSection: (sectionId: string): sectionId is SectionId => {
    return Object.prototype.hasOwnProperty.call(SECTION_REGISTRY, sectionId);
  },

  /**
   * Resolves a section configuration.
   */
  resolveSection: (sectionId: string) => {
    if (SectionResolver.isValidSection(sectionId)) {
      return SECTION_REGISTRY[sectionId];
    }
    return null;
  },
};

