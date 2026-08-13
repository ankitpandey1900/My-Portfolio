'use client';

import { EXPERIENCE } from '../content/portfolio-content';
import { MissionCard, MissionGrid, MissionTags } from '../ui/mission-card';

export function ExperienceSection() {
  return (
    <MissionGrid columns={1}>
      {EXPERIENCE.map((entry, index) => (
        <MissionCard
          key={entry.company + entry.period}
          id={`FLT-${String(index + 1).padStart(2, '0')}`}
          status="live"
          title={`${entry.role} · ${entry.company}`}
          tagline={entry.period}
          body={entry.description}
        >
          <MissionTags items={entry.highlights} />
        </MissionCard>
      ))}
    </MissionGrid>
  );
}

