import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Mail, MapPin } from 'lucide-react';
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
// resume
const IconLinkedIn = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconGitHub = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export const metadata: Metadata = {
  title: 'Resume | Ankit Pandey',
  description: 'Ankit Pandey - Full-stack developer resume and experience summary.',
};

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-white/30 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1b2735_0%,transparent_70%)] opacity-40" />
        <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-5 py-12 md:py-24">
        {/* Top Navigation */}
        <nav className="mb-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Universe
          </Link>
        </nav>

        {/* Hero Section */}
        <header className="mb-24">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-white/60 text-[10px] font-semibold tracking-[0.2em] uppercase mb-8 shadow-[0_0_20px_rgba(255,255,255,0.03)] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/80 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            Curriculum Vitae
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-sans font-bold tracking-tighter mb-6 text-white">
            {RESUME_PROFILE.name}
          </h1>

          <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mb-12 leading-relaxed">
            {RESUME_PROFILE.headline}
          </p>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              <span className="border-b border-transparent group-hover:border-white/20 pb-0.5 transition-all">
                {CONTACT_INFO.email.toLowerCase()}
              </span>
            </a>
            
            <a
              href={CONTACT_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <IconLinkedIn className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              <span className="border-b border-transparent group-hover:border-white/20 pb-0.5 transition-all">
                LinkedIn
              </span>
            </a>
            
            <a
              href={GITHUB_STATS.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <IconGitHub className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              <span className="border-b border-transparent group-hover:border-white/20 pb-0.5 transition-all">
                GitHub
              </span>
            </a>
            
            <div className="flex items-center gap-2 text-white/40">
              <MapPin className="w-4 h-4" />
              <span>{RESUME_PROFILE.location}</span>
            </div>
          </div>
        </header>

        {/* Summary & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          {/* Main Summary Card */}
          <div className="lg:col-span-2 p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.03] transition-colors flex flex-col justify-center">
            <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-white/40 mb-6">
              Profile Summary
            </h2>
            <p className="text-white/80 leading-relaxed font-light text-lg sm:text-xl md:leading-[1.8]">
              {RESUME_PROFILE.summary}
            </p>
          </div>
          
          {/* 2x2 Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {RESUME_PROFILE.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex flex-col justify-center items-center text-center group hover:bg-white/[0.04] transition-colors h-full min-h-[140px]"
              >
                <span className="text-3xl sm:text-4xl font-sans font-medium text-white tracking-tight mb-2 group-hover:scale-105 transition-transform duration-500 ease-out">
                  {metric.value}
                </span>
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-white/20 font-display font-bold text-2xl">01</span>
            <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
            <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1 ml-4" />
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12">
            {EXPERIENCE.map((entry, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12 group">
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)] group-hover:scale-150 transition-transform duration-300" />

                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-amber-500 transition-all">
                      {entry.role}
                    </h3>
                    <p className="text-white/60 font-medium text-lg">{entry.company}</p>
                  </div>
                  <div className="inline-flex items-center text-orange-400/80 text-sm font-mono font-semibold tracking-widest uppercase mt-2 md:mt-0">
                    {entry.period}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.04] transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 group-hover:bg-orange-500/10 transition-colors pointer-events-none" />
                  <p className="text-white/70 mb-6 leading-relaxed font-light text-sm md:text-base">{entry.description}</p>
                  <ul className="flex flex-col gap-3">
                    {entry.highlights.map((highlight, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-3 text-sm md:text-base text-white/60 leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500/50 shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-white/20 font-sans font-light text-2xl">02</span>
            <h2 className="text-2xl font-bold tracking-tight">Selected Projects</h2>
            <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1 ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.03] hover:-translate-y-1 transition-all group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
                    {project.id}
                  </span>
                  <div className="flex gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-white transition-colors"
                      >
                        <IconGitHub className="w-4 h-4" />
                      </a>
                    )}
                    {project.href && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-sans font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1 font-light">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/60 text-[10px] font-medium tracking-wider uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two Column: Skills & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Skills */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-white/20 font-sans font-light text-2xl">03</span>
              <h2 className="text-2xl font-bold tracking-tight">Technical Arsenal</h2>
            </div>
            <div className="space-y-4 md:space-y-5">
              {SKILL_GROUPS.map((group) => (
                <div
                  key={group.label}
                  className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-4 sm:mb-5">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-white/70 text-[11px] sm:text-xs font-medium hover:bg-white/[0.06] hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-10">
                <span className="text-white/20 font-sans font-light text-2xl">04</span>
                <h2 className="text-2xl font-bold tracking-tight">Education</h2>
              </div>
              <div className="space-y-4 md:space-y-5">
                {EDUCATION.map((edu) => (
                  <div
                    key={edu.institution}
                    className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1"
                  >
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-2 mb-2">
                      <h3 className="font-semibold text-white text-base sm:text-lg pr-4">{edu.degree}</h3>
                      <span className="text-[10px] sm:text-xs font-medium tracking-[0.1em] uppercase text-white/40 shrink-0 xl:text-right xl:mt-1">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-white/60 font-medium text-sm sm:text-base">{edu.institution}</p>
                    <p className="text-white/40 text-xs sm:text-sm font-light leading-relaxed mt-2">{edu.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer CTA */}
        <footer className="text-center p-12 md:p-16 rounded-3xl bg-white/[0.02] border border-white/[0.04] mt-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to collaborate?</h2>
          <p className="text-white/60 mb-10 max-w-md mx-auto font-light leading-relaxed">{RESUME_PROFILE.availability}</p>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold tracking-wide text-sm hover:scale-105 active:scale-95 transition-transform"
          >
            Start a Conversation
          </a>
        </footer>
      </div>
    </main>
  );
}
