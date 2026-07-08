import Link from 'next/link';
import { EXPERIENCE, GITHUB_STATS, PROJECTS, SKILL_GROUPS } from '@/components/sections/content/portfolio-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Ankit Pandey — Software Engineer resume and experience summary.',
};

export default function ResumePage() {
  return (
    <main className="resume-page">
      <article className="resume-page__content">
        <header>
          <p className="resume-page__eyebrow">Resume</p>
          <h1>Ankit Pandey</h1>
          <p className="resume-page__subtitle">Senior Software Engineer · Immersive Web & Product Systems</p>
        </header>

        <section>
          <h2>Experience</h2>
          {EXPERIENCE.map((entry) => (
            <div key={entry.company + entry.period} className="resume-page__block">
              <h3>
                {entry.role} · {entry.company}
              </h3>
              <p className="resume-page__meta">{entry.period}</p>
              <p>{entry.description}</p>
              <ul>
                {entry.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Selected Projects</h2>
          {PROJECTS.map((p) => (
            <div key={p.name} className="resume-page__block">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2>Skills</h2>
          <div className="resume-page__skills">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label}>
                <strong>{g.label}</strong>
                <p>{g.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>GitHub</h2>
          <p>
            @{GITHUB_STATS.username} · {GITHUB_STATS.contributions} contributions (12 mo)
          </p>
        </section>

        <footer className="resume-page__footer">
          <a href="/api/resume">Download PDF</a>
          <Link href="/">Return to portfolio</Link>
        </footer>
      </article>
    </main>
  );
}
