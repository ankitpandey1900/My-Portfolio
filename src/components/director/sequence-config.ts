// ─────────────────────────────────────────────────────────────────────────────
// Sequence Config
// Default boundaries and debug configurations.
// ─────────────────────────────────────────────────────────────────────────────

export const SEQUENCE_CONFIG = {
  // If true, sequences execute without delays (useful for testing states)
  fastForwardMode: false,

  // Set to true to console.log every timeline step
  debugTimeline: process.env.NODE_ENV === 'development',

  // Failsafe timeouts
  maxParallelTimeoutMs: 30000,
};

