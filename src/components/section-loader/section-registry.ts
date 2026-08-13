import type { SectionId } from './section-loader-types';

/**
 * Registry of all valid portfolio sections that can be loaded.
 * In a future sprint, this will contain the dynamic imports for UI chunks.
 */
export const SECTION_REGISTRY: Record<SectionId, { id: SectionId; name: string }> = {
  home: { id: 'home', name: 'Home' },
  about: { id: 'about', name: 'About Me' },
  projects: { id: 'projects', name: 'Projects' },
  services: { id: 'services', name: 'Services' },
  skills: { id: 'skills', name: 'Skills' },
  experience: { id: 'experience', name: 'Experience' },
  education: { id: 'education', name: 'Education' },
  hackathons: { id: 'hackathons', name: 'Hackathons' },
  github: { id: 'github', name: 'GitHub' },
  blogs: { id: 'blogs', name: 'Blogs' },
  contact: { id: 'contact', name: 'Contact' },
  resume: { id: 'resume', name: 'Resume' },
  freelance: { id: 'freelance', name: 'Freelance' },
};

