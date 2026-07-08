'use client';

export function ResumeSection() {
  return (
    <div className="section-stack">
      <p className="section-prose">
        A concise overview of experience, skills, and selected projects — formatted for recruiters
        and hiring managers who need clarity fast.
      </p>
      <a href="/resume" className="section-cta">
        View resume
      </a>
      <a href="/api/resume" className="section-link">
        Download PDF
      </a>
    </div>
  );
}
