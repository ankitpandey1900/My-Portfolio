// ─────────────────────────────────────────────────────────────────────────────
// Home Planet Config
// Single source of truth for all Home Planet content.
// ─────────────────────────────────────────────────────────────────────────────
import type { HomePlanetConfig } from './home-planet-types';

export const HOME_PLANET_CONFIG: HomePlanetConfig = {
  identity: {
    name: 'Ankit Pandey',
    title: 'Software Engineering Student',
    tagline:
      'I don’t just learn technologies — I build real-world products and robust systems that people can actually use every day.',
    bio: "I'm a passionate Software Engineering student racing to reach elite-level development.\n\nMy current focus:\n• Full Stack Development\n• Backend Architecture & System Design\n• AI Integration in practical applications\n• Creating polished, production-ready experiences\n\nCurrently investing heavily in building high-quality tools for students, developers, and creators.",
    currentFocus: 'Building high-quality tools',
    availability: {
      visible: true,
      label: 'Available for work',
      color: 'green',
    },
  },

  mission: {
    eyebrow: 'Personal portfolio · 2026',
    codename: 'ANKIT',
  },

  stats: [
    {
      value: '6+',
      label: 'Projects shipped',
      description: 'AllTracker, this portfolio, and production-facing apps',
    },
    {
      value: '800+',
      label: 'Hours building',
      description: 'Deep work on AllTracker and full-stack systems',
    },
    {
      value: '12+',
      label: 'Core technologies',
      description: 'TypeScript, React, Node, Three.js, PostgreSQL, and more',
    },
  ],

  navLinks: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'GitHub', href: 'https://github.com/ankitpandey1900', external: true },
    { label: 'Contact', href: '#contact' },
  ],

  voyage: {
    fields: [],
    ctaLabel: 'Enter portfolio',
    ctaMeta: '',
  },

  planetMarkers: [],

  factSnippet: {
    title: '',
    body: '',
  },

  primaryCTA: {
    label: 'Explore solar system',
    href: '#',
    variant: 'primary',
    icon: 'Rocket',
  },

  secondaryCTA: {
    label: 'View resume',
    href: '/resume',
    external: true,
    variant: 'secondary',
    icon: 'Download',
  },

  phaseDurations: {
    initializing: 380,
    intro: 880,
    reveal: 680,
  },
};
