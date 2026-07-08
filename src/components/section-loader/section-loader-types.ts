export type SectionId =
  | 'home'
  | 'about'
  | 'projects'
  | 'services'
  | 'skills'
  | 'experience'
  | 'education'
  | 'hackathons'
  | 'github'
  | 'blogs'
  | 'contact'
  | 'resume';

export type SectionLoaderState =
  'idle' | 'resolving' | 'loading' | 'loaded' | 'failed' | 'cancelled';

export interface SectionLoaderContext {
  currentSection: SectionId | null;
  startTimestamp: number | null;
}
