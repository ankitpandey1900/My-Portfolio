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

      <div className="mt-6">
        <MissionCard
          id="FR-00"
          status="building"
          title="Freelance & Client Projects"
          tagline="Independent Builds"
          body="Delivering high-impact, scalable, and immersive web experiences for startups and agencies. Over 20+ projects delivered with 15+ happy clients across a 3+ year journey."
        />
        <MissionGrid>
          <MissionCard
            id="FR-01"
            status="signal"
            title="Cue Junction & Darshan Cafe"
            tagline="SaaS Platform"
            body="Unified management system handling operations and real-time billing, powered by Next.js 16 and PostgreSQL."
          />
          <MissionCard
            id="FR-02"
            status="signal"
            title="Aesthetic Beauty & Hair"
            tagline="E-Commerce"
            body="High-conversion e-commerce platform built with Next.js and Stripe for a modern shopping experience."
          />
        </MissionGrid>
      </div>
    </div>
  );
}

