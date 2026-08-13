/**
 * Preset details representing a single quality tier for the Sun System.
 */
export interface SunPresetConfig {
  /** Physical radius of the core sphere. */
  radius: number;
  /** Primary glow color of the plasma core (hex string). */
  coreColor: string;
  /** Glow halo outline color (hex string). */
  glowColor: string;
  /** Solar flare ray color. */
  flareColor?: string;
  /** Emissive intensity factor for physical lights. */
  emissiveIntensity: number;
  /** Scale factor of the glow shell relative to core radius. */
  glowScale: number;
  /** Opacity factor of the glow shell. */
  glowOpacity: number;
  /** Scale factor of the corona disk relative to core radius. */
  coronaScale: number;
  /** Opacity factor of the corona disk. */
  coronaOpacity: number;
  /** Rotation speed of the corona layers. */
  coronaSpeed: number;
  /** Toggle parameter for outer glow rendering. */
  enableGlow: boolean;
  /** Toggle parameter for outer corona rendering. */
  enableCorona: boolean;
  /** Toggle solar prominence flare rays. */
  enableFlares?: boolean;
  /** Noise octave detail level (fBm) for core plasma shader. */
  octaves: number;
}
export default SunPresetConfig;

