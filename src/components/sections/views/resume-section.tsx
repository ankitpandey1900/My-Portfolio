'use client';

import {
  CONTACT_INFO,
  EXPERIENCE,
  RESUME_PROFILE,
  SKILL_GROUPS,
} from '../content/portfolio-content';
import {
  MissionActions,
  MissionCard,
  MissionGrid,
  MissionLink,
  MissionTags,
} from '../ui/mission-card';

export function ResumeSection() {
  const latestExperience = EXPERIENCE[0];
  const primarySkills = SKILL_GROUPS.flatMap((group) => group.items).slice(0, 8);

  return (
    <div className="mission-stack">
      {/* Profile Overview */}
      <MissionCard
        id="RES-01"
        status="live"
        title={RESUME_PROFILE.name}
        tagline={RESUME_PROFILE.headline}
        body={RESUME_PROFILE.summary}
      >
        <MissionActions>
          <MissionLink href="/resume">View Full Dossier</MissionLink>
          <MissionLink href={`mailto:${CONTACT_INFO.email}`}>Initiate Contact</MissionLink>
        </MissionActions>
      </MissionCard>

      {/* Metrics Grid */}
      <MissionGrid columns={2}>
        {RESUME_PROFILE.metrics.map((metric, idx) => (
          <MissionCard
            key={metric.label}
            id={`MTR-${idx + 1}`}
            status="signal"
            title={metric.value}
            tagline={metric.label}
          />
        ))}
      </MissionGrid>

      {/* Current Signal (Latest Experience) */}
      <MissionCard
        id="EXP-01"
        status="active"
        title="Current Signal"
        tagline={latestExperience?.role ?? 'Independent Engineer'}
        body={
          latestExperience
            ? `${latestExperience.company} — ${latestExperience.period}`
            : RESUME_PROFILE.location
        }
      >
        {latestExperience && (
          <div className="mt-4 text-[13px] text-white/60 leading-relaxed space-y-2">
            {latestExperience.highlights.slice(0, 2).map((highlight, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">›</span>
                {highlight}
              </p>
            ))}
          </div>
        )}
      </MissionCard>

      {/* Technical Arsenal */}
      <MissionCard
        id="SKL-01"
        status="building"
        title="Technical Arsenal"
        tagline="Core Systems & Frameworks"
      >
        <MissionTags items={primarySkills} />
      </MissionCard>
    </div>
  );
}
