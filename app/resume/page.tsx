import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CONTACT_INFO,
  EDUCATION,
  EXPERIENCE,
  GITHUB_STATS,
  HACKATHONS,
  PROJECTS,
  RESUME_PROFILE,
  SKILL_GROUPS,
} from '@/components/sections/content/portfolio-content';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Ankit Pandey - full-stack developer resume and experience summary.',
};

export default function ResumePage() {
  return (
    <main className="resume-page">
      <article className="resume-page__content">
        <header className="resume-page__hero">
          <div>
            <p className="resume-page__eyebrow">Resume / Candidate dossier</p>
            <h1>{RESUME_PROFILE.name}</h1>
            <p className="resume-page__subtitle">{RESUME_PROFILE.headline}</p>
          </div>

          <div className="resume-page__hero-actions" aria-label="Primary resume actions">
            <a href="/api/resume">Download PDF</a>
            <Link href="/">Portfolio</Link>
          </div>
        </header>

        <section className="resume-page__summary" aria-label="Profile summary">
          <p>{RESUME_PROFILE.summary}</p>
          <div className="resume-page__contact">
            <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            <a href={CONTACT_INFO.linkedin}>LinkedIn</a>
            <a href={GITHUB_STATS.url}>GitHub</a>
            <span>{RESUME_PROFILE.location}</span>
          </div>
        </section>

        <section className="resume-page__metrics" aria-label="Resume snapshot">
          {RESUME_PROFILE.metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>

        <section>
          <div className="resume-page__section-heading">
            <p className="resume-page__eyebrow">01</p>
            <h2>Experience</h2>
          </div>
          {EXPERIENCE.map((entry) => (
            <div key={entry.company + entry.period} className="resume-page__block">
              <div className="resume-page__block-heading">
                <h3>{entry.role}</h3>
                <span>{entry.period}</span>
              </div>
              <p className="resume-page__meta">{entry.company}</p>
              <p>{entry.description}</p>
              <ul>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <div className="resume-page__section-heading">
            <p className="resume-page__eyebrow">02</p>
            <h2>Selected Projects</h2>
          </div>
          <div className="resume-page__project-grid">
            {PROJECTS.map((project) => (
              <article key={project.id} className="resume-page__project">
                <div>
                  <p className="resume-page__meta">{project.id}</p>
                  <h3>{project.name}</h3>
                </div>
                <p>{project.description}</p>
                <p className="resume-page__stack">{project.stack.join(' / ')}</p>
                <div className="resume-page__project-links">
                  {project.href ? <a href={project.href}>Live</a> : null}
                  {project.github ? <a href={project.github}>Code</a> : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="resume-page__section-heading">
            <p className="resume-page__eyebrow">03</p>
            <h2>Skills</h2>
          </div>
          <div className="resume-page__skills">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <strong>{group.label}</strong>
                <p>{group.items.join(' / ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-page__two-column">
          <div>
            <div className="resume-page__section-heading">
              <p className="resume-page__eyebrow">04</p>
              <h2>Education</h2>
            </div>
            {EDUCATION.map((education) => (
              <div key={education.institution} className="resume-page__block">
                <h3>{education.degree}</h3>
                <p className="resume-page__meta">{education.period}</p>
                <p>{education.institution}</p>
                <p>{education.detail}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="resume-page__section-heading">
              <p className="resume-page__eyebrow">05</p>
              <h2>Build Sprints</h2>
            </div>
            {HACKATHONS.map((entry) => (
              <div key={entry.name} className="resume-page__block">
                <h3>{entry.name}</h3>
                <p className="resume-page__meta">{entry.result}</p>
                <p>{entry.project}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-page__availability">
          <p>{RESUME_PROFILE.availability}</p>
          <a href={`mailto:${CONTACT_INFO.email}`}>Start a conversation</a>
        </section>
      </article>
    </main>
  );
}
