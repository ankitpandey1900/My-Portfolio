/**
 * Configuration schema for dynamic planetary atmosphere rendering.
 */
export interface AtmosphereConfig {
  /** If true, renders a custom atmospheric shader shell around the planet. */
  hasAtmosphere: boolean;
  /** Atmosphere glow color (hex string). */
  color?: string;
  /** Density falloff factor for the shader glow profile. */
  density?: number;
}

/**
 * Configuration schema for dynamic moons/satellites orbiting a planet.
 */
export interface MoonRegistryEntry {
  id: string;
  name: string;
  /** Radius of the moon mesh scale. */
  radius: number;
  /** Distance from the parent planet mesh center. */
  orbitRadius: number;
  /** Velocity factor of orbit loops. */
  orbitSpeed: number;
  /** Self-rotation velocity factor. */
  rotationSpeed: number;
}

/**
 * Registry schema representing a single planetary celestial body.
 */
export interface PlanetRegistryEntry {
  /** Unique string key (e.g. 'mercury', 'earth'). */
  id: string;
  /** Human-readable display label. */
  name: string;
  /** Index order relative to the Sun (1 to 8). */
  order: number;
  /** Physical radius of the planet mesh scale. */
  radius: number;
  /** Average orbit distance from the Sun center. */
  orbitRadius: number;
  /** Orbit translation velocity factor. */
  orbitSpeed: number;
  /** Self-rotation velocity factor. */
  rotationSpeed: number;
  /** List of hex colors mapping to shader profiles. */
  colorPalette: string[];
  /** References to compiled textures inside local public paths. */
  textureReferences: {
    map?: string;
    normalMap?: string;
    roughnessMap?: string;
    specularMap?: string;
  };
  /** Atmosphere details. */
  atmosphere: AtmosphereConfig;
  /** Attached moons. */
  moons: MoonRegistryEntry[];
  /** Linked section redirecting users on focus target change. */
  portfolioSection: 'about' | 'projects' | 'experience' | 'skills' | 'contact' | 'home';
  /** Celestial locks tracking visitor interaction pathways. */
  unlockState: 'locked' | 'unlocked' | 'active';
  /** Arbitrary metadata parameters. */
  metadata: Record<string, string | number | boolean>;
}

/**
 * Global configurations controlling the Solar System rendering speed and modes.
 */
export interface SolarSystemConfig {
  /** Time scaling factor (pauses transitions if set to 0). */
  timeScale: number;
  /** Global speed multiplier adjusting all orbits. */
  orbitSpeedMultiplier: number;
  /** Reduces orbital velocity and animation loops for accessibility aids. */
  accessibilityMode: boolean;
  /** Visual rendering style preset. */
  theme: 'realistic' | 'cinematic' | 'minimalist';
  /** Navigation detail level. */
  difficulty: 'normal' | 'sandbox' | 'explorer';
}

