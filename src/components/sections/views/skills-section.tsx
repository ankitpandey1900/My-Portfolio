'use client';

import { SKILL_GROUPS } from '../content/portfolio-content';
import { MissionCard, MissionGrid, MissionTags } from '../ui/mission-card';

export function SkillsSection() {
  return (
    <MissionGrid>
      {SKILL_GROUPS.map((group, index) => (
        <MissionCard
          key={group.label}
          id={`0${index + 1}`}
          status="active"
          title={group.label}
          tagline={`${group.items.length} core skills`}
        >
          <MissionTags items={group.items} />
        </MissionCard>
      ))}
    </MissionGrid>
  );
}

