export const SECTION_LOADER_CONFIG = {
  // Artificial delay to simulate dynamic imports (React.lazy / next/dynamic chunk loading)
  SIMULATED_LOAD_DURATION: 280,

  // Timeout before aborting a load attempt
  LOAD_TIMEOUT: 5000,

  // Number of retries before permanently failing
  MAX_RETRIES: 2,
};

