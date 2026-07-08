'use client';

import { HOME_PLANET_CONFIG } from '@/components/home/home-planet-config';
import { MissionCard, MissionGrid } from '../ui/mission-card';

export function HomeSection() {
  const { identity, stats } = HOME_PLANET_CONFIG;

  return (
    <div className="mission-stack">
      <MissionCard
        id="ORG-00"
        status="live"
        title="Mission origin"
        tagline={identity.title}
        body={`${identity.name} — ${identity.tagline}. Your entry point in the portfolio solar system.`}
      />
      <MissionGrid>
        {stats.map((stat, index) => (
          <MissionCard
            key={stat.label}
            id={`ORG-${String(index + 1).padStart(2, '0')}`}
            status="signal"
            title={stat.value}
            tagline={stat.label}
            body={stat.description ?? ''}
          />
        ))}
      </MissionGrid>
    </div>
  );
}
