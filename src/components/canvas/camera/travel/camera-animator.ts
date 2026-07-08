/**
 * Mathematical easing functions and time stepping for camera travel.
 */
export class CameraAnimator {
  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  static easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  static easeLinear(t: number): number {
    return t;
  }

  /**
   * Resolves the string identifier to the easing function.
   */
  static getEasingFunction(easing?: 'linear' | 'ease-in-out' | 'ease-out' | 'custom'): (t: number) => number {
    switch (easing) {
      case 'linear':
        return this.easeLinear;
      case 'ease-in-out':
        return this.easeInOutCubic;
      case 'ease-out':
      default:
        return this.easeOutExpo;
    }
  }

  /**
   * Calculates the normalized progress (0.0 to 1.0) given elapsed and total duration.
   */
  static calculateProgress(elapsedMs: number, durationMs: number): number {
    if (durationMs <= 0) return 1.0;
    return Math.min(Math.max(elapsedMs / durationMs, 0.0), 1.0);
  }
}
