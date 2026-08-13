// ─────────────────────────────────────────────────────────────────────────────
// Home Planet Types
// All TypeScript types for the Home Planet system.
// ─────────────────────────────────────────────────────────────────────────────

/** Ordered state machine phases for the cinematic hero reveal sequence. */
export type HomePlanetPhase = 'idle' | 'initializing' | 'intro' | 'reveal' | 'ready' | 'dismissed';

/** A single quick stat displayed in the HeroStats bar. */
export interface HeroStat {
  /** Short metric label shown below the value (e.g. "PROJECTS"). */
  label: string;
  /** The displayed value (e.g. "30+" or "5"). */
  value: string;
  /** Optional long-form tooltip descriptor. */
  description?: string;
}

/** Configuration for a single Call-to-Action button. */
export interface HeroCTA {
  /** Visible button text. */
  label: string;
  /** href destination. Use '#' for SPA actions. */
  href: string;
  /** If true, opens link in a new tab. */
  external?: boolean;
  /** Icon name from Lucide (optional). */
  icon?: string;
  /** Visual variant. */
  variant: 'primary' | 'secondary' | 'ghost';
}

/** Availability status badge shown near the hero name. */
export interface AvailabilityStatus {
  /** Whether to render the badge at all. */
  visible: boolean;
  /** Badge label text (e.g. "Available for Work"). */
  label: string;
  /** Semantic color. */
  color: 'green' | 'amber' | 'red';
}

/** Top-level hero identity content pulled from config. */
export interface HeroIdentity {
  name: string;
  title: string;
  tagline: string;
  /** Short paragraph bio — max 2 sentences. */
  bio: string;
  /** Current focus statement. */
  currentFocus: string;
  availability: AvailabilityStatus;
}

/** Voyage widget field shown in the Dreamair-style glass panel. */
export interface HeroVoyageField {
  label: string;
  value: string;
  hint?: string;
}

/** Planet marker chip for the landing voyage rail. */
export interface HeroPlanetMarker {
  id: string;
  label: string;
  accent: string;
}

/** Bottom-right fact snippet. */
export interface HeroFactSnippet {
  title: string;
  body: string;
}

/** SPACER-style mission eyebrow + codename. */
export interface HeroMission {
  eyebrow: string;
  codename: string;
}

/** Top navigation link on the landing hero. */
export interface HeroNavLink {
  label: string;
  href: string;
  external?: boolean;
}

/** Complete Home Planet configuration shape. */
export interface HomePlanetConfig {
  identity: HeroIdentity;
  mission: HeroMission;
  stats: HeroStat[];
  navLinks: HeroNavLink[];
  voyage: {
    fields: HeroVoyageField[];
    ctaLabel: string;
    ctaMeta: string;
  };
  planetMarkers: HeroPlanetMarker[];
  factSnippet: HeroFactSnippet;
  primaryCTA: HeroCTA;
  secondaryCTA: HeroCTA;
  optionalCTA?: HeroCTA;
  /** Animation phase durations in milliseconds. */
  phaseDurations: {
    initializing: number;
    intro: number;
    reveal: number;
  };
}

/** Zustand store shape for the Home Planet state machine. */
export interface HomePlanetStore {
  phase: HomePlanetPhase;
  isVisible: boolean;
  hasInteracted: boolean;
  setPhase: (phase: HomePlanetPhase) => void;
  setVisible: (visible: boolean) => void;
  setInteracted: () => void;
  reset: () => void;
}

