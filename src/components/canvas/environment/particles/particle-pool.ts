// ─────────────────────────────────────────────────────────────────────────────
// Particle Pool
// Ring buffer manager for GPU instanced attributes.
// ─────────────────────────────────────────────────────────────────────────────

export class ParticlePool {
  public maxParticles: number;
  public head: number = 0;

  // Typed arrays for InstancedBufferAttributes
  public positionStart: Float32Array;
  public velocity: Float32Array;
  public acceleration: Float32Array;
  public colorStart: Float32Array;
  public colorEnd: Float32Array;
  public size: Float32Array;
  public rotationParams: Float32Array; // [startRotation, rotationSpeed]
  public timeParams: Float32Array; // [startTime, lifetime]
  public opacityParams: Float32Array; // [opacityStart, opacityEnd]

  // Track dirty ranges for GPU upload
  public dirtyStart: number = -1;
  public dirtyEnd: number = -1;

  constructor(maxParticles: number) {
    this.maxParticles = maxParticles;

    this.positionStart = new Float32Array(maxParticles * 3);
    this.velocity = new Float32Array(maxParticles * 3);
    this.acceleration = new Float32Array(maxParticles * 3);
    this.colorStart = new Float32Array(maxParticles * 3);
    this.colorEnd = new Float32Array(maxParticles * 3);
    this.size = new Float32Array(maxParticles);
    this.rotationParams = new Float32Array(maxParticles * 2);
    this.timeParams = new Float32Array(maxParticles * 2);
    this.opacityParams = new Float32Array(maxParticles * 2);
  }

  /**
   * Spawns a particle by overwriting the oldest one in the ring buffer.
   */
  public spawn(data: {
    position: [number, number, number];
    velocity: [number, number, number];
    acceleration: [number, number, number];
    colorStart: [number, number, number];
    colorEnd: [number, number, number];
    size: number;
    rotation: number;
    rotationSpeed: number;
    startTime: number;
    lifetime: number;
    opacityStart: number;
    opacityEnd: number;
  }): void {
    const idx = this.head;
    const idx2 = idx * 2;
    const idx3 = idx * 3;

    this.positionStart.set(data.position, idx3);
    this.velocity.set(data.velocity, idx3);
    this.acceleration.set(data.acceleration, idx3);
    this.colorStart.set(data.colorStart, idx3);
    this.colorEnd.set(data.colorEnd, idx3);

    this.size[idx] = data.size;

    this.rotationParams[idx2] = data.rotation;
    this.rotationParams[idx2 + 1] = data.rotationSpeed;

    this.timeParams[idx2] = data.startTime;
    this.timeParams[idx2 + 1] = data.lifetime;

    this.opacityParams[idx2] = data.opacityStart;
    this.opacityParams[idx2 + 1] = data.opacityEnd;

    this.markDirty(idx);

    this.head = (this.head + 1) % this.maxParticles;
  }

  private markDirty(index: number) {
    if (this.dirtyStart === -1) {
      this.dirtyStart = index;
      this.dirtyEnd = index;
    } else {
      this.dirtyStart = Math.min(this.dirtyStart, index);
      this.dirtyEnd = Math.max(this.dirtyEnd, index);
    }
  }

  public resetDirtyRange() {
    this.dirtyStart = -1;
    this.dirtyEnd = -1;
  }

  public hasDirtyRange(): boolean {
    return this.dirtyStart !== -1;
  }
}
