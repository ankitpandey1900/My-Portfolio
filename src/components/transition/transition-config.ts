export const TRANSITION_CONFIG = {
  // Global maximum duration any single transition can take before failing automatically
  MAX_TRANSITION_TIMEOUT_MS: 15000,

  // Brief delay allowing React rendering cycles to settle before grabbing next queued item
  QUEUE_POLL_DELAY_MS: 50,
};
