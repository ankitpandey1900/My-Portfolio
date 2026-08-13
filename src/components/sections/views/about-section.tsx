'use client';

import { ABOUT_CONTENT } from '../content/portfolio-content';
import { MissionCard, MissionGrid } from '../ui/mission-card';

export function AboutSection() {
  return (
    <div className="mission-stack">
      {ABOUT_CONTENT.story.map((paragraph, index) => (
        <MissionCard
          key={paragraph.slice(0, 24)}
          id={`0${index + 1}`}
          status="active"
          title={index === 0 ? 'My Background' : 'Working Philosophy'}
          body={paragraph}
        />
      ))}
      <MissionGrid columns={1}>
        {ABOUT_CONTENT.values.map((value, index) => (
          <MissionCard
            key={value.label}
            id={`0${index + 1}`}
            status="signal"
            title={value.label}
            body={value.detail}
          />
        ))}
      </MissionGrid>
      <MissionCard
        id="01"
        status="live"
        title="Current Focus"
        tagline="Core Tech Stack"
        body={ABOUT_CONTENT.focus}
      />
    </div>
  );
}

