/**
 * NAVIGATION_CONFIG
 * @deprecated Use resolveSectionFromPlanet() with PlanetRegistry instead.
 * Kept for backwards compatibility with any external references.
 */
export const NAVIGATION_CONFIG: Record<string, string> = {
  'mercury-home': 'home',
  'venus-about': 'about',
  'earth-projects': 'projects',
  'mars-services': 'services',
  'jupiter-skills': 'skills',
  'saturn-experience': 'experience',
  'neptune-github': 'github',
  'pluto-contact': 'contact',
};

export const reverseNavigationMap = (): Record<string, string> => {
  const reversed: Record<string, string> = {};
  for (const [planet, section] of Object.entries(NAVIGATION_CONFIG)) {
    reversed[section] = planet;
  }
  return reversed;
};
