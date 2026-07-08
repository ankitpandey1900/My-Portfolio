'use client';

import type { HeroStat, HomePlanetPhase } from '../home-planet-types';

interface HeroStatsProps {
  stats: HeroStat[];
  phase: HomePlanetPhase;
}

const VISIBLE_STATS = new Set(['YRS BUILDING', 'PROJECTS', 'TECHNOLOGIES']);

export function HeroStats({ stats, phase }: HeroStatsProps) {
  const isVisible = phase === 'ready' || phase === 'dismissed';
  const selectedStats = stats.filter((stat) => VISIBLE_STATS.has(stat.label));

  return (
    <footer className="hero-footer" aria-label="Portfolio highlights">
      {selectedStats.map((stat, index) => (
        <div
          key={stat.label}
          className="hero-stat hero-fade-in"
          data-visible={isVisible}
          style={{ '--hero-delay': `${820 + index * 90}ms` } as React.CSSProperties}
          title={stat.description}
        >
          <span className="hero-stat__label">{stat.label}</span>
          <span className="hero-stat__value">{stat.value}</span>
          <span className="hero-stat__description">{stat.description}</span>
        </div>
      ))}

      <div
        className="hero-aside hero-fade-in"
        data-visible={isVisible}
        style={{ '--hero-delay': '980ms' } as React.CSSProperties}
      >
        <span className="hero-aside__label">Current Location</span>
        <p className="hero-aside__title">Earth Orbit</p>
        <p className="hero-aside__body">
          Building precise interfaces, resilient systems, and cinematic web experiences.
        </p>
        <div className="hero-status">
          <span className="hero-status__dot" aria-hidden="true" />
          <span>Available for selective work.</span>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        Scroll to explore
      </div>
    </footer>
  );
}
