'use client';

import { HACKATHONS } from '../content/portfolio-content';
import { MissionCard, MissionGrid } from '../ui/mission-card';

export function HackathonsSection() {
  return (
    <MissionGrid columns={1}>
      {HACKATHONS.map((entry, index) => (
        <MissionCard
          key={entry.name}
          id={`HCK-${String(index + 1).padStart(2, '0')}`}
          status="live"
          title={entry.name}
          tagline={entry.result}
          body={entry.project}
        />
      ))}
    </MissionGrid>
  );
}
