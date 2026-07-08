import type { AtmosphereConfig } from '../solar-system-types';
import type { PlanetConfig } from './planet-types';

/**
 * Manifest schema representing dynamic planetary rings.
 */
export interface RingManifest {
  hasRing: boolean;
  innerRadius?: number;
  outerRadius?: number;
  color?: string;
  texture?: string;
}

/**
 * Manifest schema representing dynamic atmosphere configurations.
 */
export interface AtmosphereManifest extends AtmosphereConfig {
  glowOpacity?: number;
}

/**
 * Manifest schema representing dynamic moon parameters.
 */
export interface MoonManifest {
  id: string;
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
}

/**
 * Primary centralized data-driven descriptor schema for planets.
 */
export interface PlanetManifestEntry extends PlanetConfig {
  /** Navigation slug (e.g. 'earth-orbit'). */
  slug: string;
  /** Short summary of the portfolio section details. */
  description: string;
  /** Atmospheric shader configs. */
  atmosphere: AtmosphereManifest;
  /** Ring visual configs. */
  ring: RingManifest;
  /** Attached moons lists. */
  moons: MoonManifest[];
  /** Lucide/visual icon label identifier string. */
  icon: string;
  /** Catalog status tracking visibility overrides. */
  status: 'active' | 'hidden' | 'seasonal' | 'premium' | 'experimental';
}
