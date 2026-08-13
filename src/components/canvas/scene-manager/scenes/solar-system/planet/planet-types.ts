/**
 * State parameters representing the current interaction layer of a planet.
 */
export type PlanetState =
  | 'loading'
  | 'idle'
  | 'focused'
  | 'hovered'
  | 'selected'
  | 'disabled'
  | 'hidden'
  | 'locked'
  | 'completed';

/**
 * Standard lifecycle stages for rendering and updating individual planet modules.
 */
export type PlanetLifecycleStage =
  | 'initialize'
  | 'load'
  | 'mount'
  | 'update'
  | 'suspend'
  | 'resume'
  | 'deactivate'
  | 'unload'
  | 'destroy'
  | 'cleanup';

/**
 * Configuration schema defining visual and orbital attributes for any planet.
 */
export interface PlanetConfig {
  /** Unique key (e.g. 'earth', 'mars'). */
  id: string;
  /** Internal search name. */
  name: string;
  /** Human-readable display label. */
  displayName: string;
  /** Position index order relative to Sun (1 to 8). */
  order: number;
  /** Physical radius of the planet mesh scale. */
  radius: number;
  /** Primary color palette (hex list). */
  colorPalette: string[];
  /** Relative color texture image file path. */
  texture: string;
  /** Relative surface height normal bump coordinates map path. */
  normalMap: string;
  /** Relative surface gloss limits path. */
  roughnessMap: string;
  /** Emissive light glow color (hex). */
  emissive: string;
  /** Emissive glow factor. */
  emissiveIntensity: number;
  /** Self-rotation axial spin factor. */
  rotationSpeed: number;
  /** Orbital distance from the Sun origin. */
  orbitRadius: number;
  /** Orbital velocity around the Sun. */
  orbitSpeed: number;
  /** Axial tilt angle (degrees). */
  tilt: number;
  /** Camera distance during zoomed planet views. */
  cameraDistance: number;
  /** Camera target offsets on zoom. */
  cameraTarget: [number, number, number];
  /** Portfolio link routed to on focal select. */
  portfolioSection:
    | 'home'
    | 'about'
    | 'projects'
    | 'services'
    | 'skills'
    | 'experience'
    | 'education'
    | 'hackathons'
    | 'github'
    | 'blogs'
    | 'contact'
    | 'resume'
    | 'freelance';
  /** Preset theme. */
  theme: 'realistic' | 'cinematic' | 'minimalist';
  /** Detail preset target. */
  qualityPreset: 'low' | 'medium' | 'high' | 'ultra';
  /** Future metadata extensions. */
  futureMetadata: Record<string, string | number | boolean>;
}

/**
 * Event callbacks emitted dynamically on planet interactions.
 */
export interface PlanetEvents {
  onPlanetLoaded?: (id: string) => void;
  onPlanetHovered?: (id: string, hovered: boolean) => void;
  onPlanetClicked?: (id: string) => void;
  onPlanetFocused?: (id: string) => void;
  onPlanetBlurred?: (id: string) => void;
  onPlanetDisposed?: (id: string) => void;
}
export default PlanetConfig;

