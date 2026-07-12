'use client';

import Link from 'next/link';
import {
  CONTACT_INFO,
  EXPERIENCE,
  PROJECTS,
  RESUME_PROFILE,
  SKILL_GROUPS,
} from '../content/portfolio-content';

export function ResumeSection() {
  const featuredProjects = PROJECTS.slice(0, 3);
  const primarySkills = SKILL_GROUPS.flatMap((group) => group.items).slice(0, 10);
  const latestExperience = EXPERIENCE[0];

  return (
    <div className="resume-dossier">
      <div className="resume-dossier__intro">
        <p className="section-prose">{RESUME_PROFILE.summary}</p>
        <div className="resume-dossier__actions" aria-label="Resume actions">
          <Link href="/resume" className="section-cta">
            View full resume
          </Link>
          <a href="/api/resume" className="section-link">
            Download
          </a>
          <a href={`mailto:${CONTACT_INFO.email}`} className="section-link">
            Email
          </a>
        </div>
      </div>

      <div className="resume-dossier__metrics" aria-label="Resume snapshot">
        {RESUME_PROFILE.metrics.map((metric) => (
          <div key={metric.label} className="resume-dossier__metric">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="resume-dossier__grid">
        <section className="resume-dossier__panel" aria-labelledby="resume-current-heading">
          <p className="resume-dossier__eyebrow">Current signal</p>
          <h3 id="resume-current-heading">{latestExperience?.role ?? 'Full-stack developer'}</h3>
          <p>
            {latestExperience
              ? `${latestExperience.company} / ${latestExperience.period}`
              : RESUME_PROFILE.location}
          </p>
          {latestExperience ? (
            <ul>
              {latestExperience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="resume-dossier__panel" aria-labelledby="resume-focus-heading">
          <p className="resume-dossier__eyebrow">Focus areas</p>
          <h3 id="resume-focus-heading">Where I create leverage</h3>
          <ul>
            {RESUME_PROFILE.focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>
      </div>

      <section
        className="resume-dossier__panel resume-dossier__panel--wide"
        aria-labelledby="resume-projects-heading"
      >
        <p className="resume-dossier__eyebrow">Proof of work</p>
        <h3 id="resume-projects-heading">Selected shipped systems</h3>
        <div className="resume-dossier__projects">
          {featuredProjects.map((project) => (
            <article key={project.id}>
              <strong>{project.name}</strong>
              <span>{project.tagline}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="resume-dossier__skills" aria-label="Primary skills">
        {primarySkills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}
