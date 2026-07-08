/**
 * LandingConfig
 * Configuration values for the Landing Experience System.
 */
export const LANDING_CONFIG = {
  /**
   * The artificial delay (in ms) simulating a landing sequence.
   * This provides time for future audio cues, particle effects,
   * and UI pre-loading before the portfolio section opens.
   */
  DEFAULT_LANDING_DURATION: 1500,

  /**
   * Timeout (in ms) to abort landing if the UI fails to signal completion.
   */
  LANDING_TIMEOUT: 5000,
};
