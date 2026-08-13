'use client';

import { EDUCATION } from '../content/portfolio-content';
import { MissionCard, MissionGrid } from '../ui/mission-card';

export function EducationSection() {
  return (
    <MissionGrid columns={1}>
      {EDUCATION.map((edu, index) => (
        <MissionCard
          key={edu.institution}
          id={`EDU-${String(index + 1).padStart(2, '0')}`}
          status="active"
          title={edu.degree}
          tagline={edu.period}
          body={`${edu.institution}. ${edu.detail}`}
        />
      ))}
    </MissionGrid>
  );
}

