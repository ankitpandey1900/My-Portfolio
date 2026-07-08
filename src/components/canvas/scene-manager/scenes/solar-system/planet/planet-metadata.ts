/**
 * Accessibility configuration mapping localized screen reader labels.
 */
export interface AccessibilityMetadata {
  ariaLabel: string;
  keyboardShortcutHelp: string;
  focusAnnouncement: string;
}

/**
 * Localized translations map for multi-language future support.
 */
export interface LocalizedDescription {
  en: string;
  es?: string;
  fr?: string;
  de?: string;
}

export interface ExtendedPlanetMetadata {
  accessibility: AccessibilityMetadata;
  localization: LocalizedDescription;
  tags: string[];
}
