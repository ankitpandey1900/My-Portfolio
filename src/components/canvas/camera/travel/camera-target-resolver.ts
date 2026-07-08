import * as THREE from 'three';
import { DEFAULT_SOLAR_CONFIG } from '../../scene-manager/scenes/solar-system/solar-system-config';
import { PlanetRegistry } from '../../scene-manager/scenes/solar-system/planet/planet-registry';
import { resolvePlanetWorldPosition } from '../../scene-manager/scenes/solar-system/planet/planet-utilities';

/**
 * Resolves a dynamic celestial target into absolute world coordinates.
 */
export class CameraTargetResolver {
  /**
   * Calculates where a planet is (or will be) at a given elapsed time.
   */
  static resolvePlanetPosition(
    planetId: string,
    elapsedSeconds: number,
    timeScale = DEFAULT_SOLAR_CONFIG.timeScale,
    orbitMultiplier = DEFAULT_SOLAR_CONFIG.orbitSpeedMultiplier
  ): THREE.Vector3 {
    const entry = PlanetRegistry.get(planetId);
    if (!entry) {
      return new THREE.Vector3(0, 0, 0);
    }

    return resolvePlanetWorldPosition(entry, elapsedSeconds, timeScale, orbitMultiplier);
  }

  /**
   * Calculates the ideal camera resting position to view a planet.
   */
  static resolveViewingPosition(
    planetPosition: THREE.Vector3,
    planetRadius: number,
    cameraDistance?: number
  ): THREE.Vector3 {
    const distance = cameraDistance ?? planetRadius * 4.2;
    const outward = planetPosition.clone();

    if (outward.lengthSq() < 0.001) {
      outward.set(0, 0, 1);
    } else {
      outward.normalize();
    }

    const elevated = new THREE.Vector3(outward.x, outward.y + 0.12, outward.z).normalize();

    return planetPosition.clone().add(elevated.multiplyScalar(distance));
  }
}
