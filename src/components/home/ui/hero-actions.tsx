'use client';

import * as React from 'react';
import { HomePlanetController } from '../home-planet-controller';
import type { HeroCTA, HomePlanetPhase } from '../home-planet-types';

interface HeroActionsProps {
  primaryCTA: HeroCTA;
  secondaryCTA?: HeroCTA;
  phase: HomePlanetPhase;
}

function isVisible(phase: HomePlanetPhase): boolean {
  return phase === 'ready' || phase === 'dismissed';
}

export function HeroActions({ primaryCTA, secondaryCTA, phase }: HeroActionsProps) {
  const visible = isVisible(phase);

  const handlePrimary = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (primaryCTA.href === '#journey') {
      event.preventDefault();
      HomePlanetController.beginJourney();
    }
  };

  const handleSecondary = (_event: React.MouseEvent<HTMLAnchorElement>) => {
    if (secondaryCTA?.variant === 'secondary') {
      HomePlanetController.downloadResume();
    }
  };

  return (
    <nav className="hero-actions" aria-label="Primary actions">
      <a
        href={primaryCTA.href}
        aria-label={primaryCTA.label}
        className="luxury-button hero-fade-in"
        data-visible={visible}
        data-variant="primary"
        style={{ '--hero-delay': '680ms' } as React.CSSProperties}
        onClick={handlePrimary}
      >
        {primaryCTA.label}
      </a>
      {secondaryCTA ? (
        <a
          href="/resume"
          aria-label={secondaryCTA.label}
          className="luxury-button hero-fade-in"
          data-visible={visible}
          data-variant="secondary"
          style={{ '--hero-delay': '780ms' } as React.CSSProperties}
          onClick={handleSecondary}
        >
          {secondaryCTA.label}
        </a>
      ) : null}
    </nav>
  );
}
