import type { ComponentType } from 'react';
import type { SectionId } from '@/components/section-loader/section-loader-types';

type SectionModule = { default: ComponentType };

export const SECTION_CHUNK_LOADERS: Record<SectionId, () => Promise<SectionModule>> = {
  home: () => import('./views/home-section').then((m) => ({ default: m.HomeSection })),
  about: () => import('./views/about-section').then((m) => ({ default: m.AboutSection })),
  projects: () => import('./views/projects-section').then((m) => ({ default: m.ProjectsSection })),
  services: () => import('./views/services-section').then((m) => ({ default: m.ServicesSection })),
  skills: () => import('./views/skills-section').then((m) => ({ default: m.SkillsSection })),
  experience: () => import('./views/experience-section').then((m) => ({ default: m.ExperienceSection })),
  education: () => import('./views/education-section').then((m) => ({ default: m.EducationSection })),
  hackathons: () => import('./views/hackathons-section').then((m) => ({ default: m.HackathonsSection })),
  github: () => import('./views/github-section').then((m) => ({ default: m.GithubSection })),
  blogs: () => import('./views/blog-section').then((m) => ({ default: m.BlogSection })),
  contact: () => import('./views/contact-section').then((m) => ({ default: m.ContactSection })),
  resume: () => import('./views/resume-section').then((m) => ({ default: m.ResumeSection })),
  freelance: () => import('./views/freelance-section').then((m) => ({ default: m.FreelanceSection })),
};

export async function preloadSectionChunk(sectionId: SectionId): Promise<ComponentType> {
  const mod = await SECTION_CHUNK_LOADERS[sectionId]();
  return mod.default;
}
