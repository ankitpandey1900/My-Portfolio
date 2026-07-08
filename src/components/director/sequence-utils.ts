/** Gradually updates a numeric value over time, respecting abort signals. */
export async function animateValue(
  from: number,
  to: number,
  durationMs: number,
  onStep: (value: number) => void,
  signal?: AbortSignal
): Promise<void> {
  if (durationMs <= 0 || signal?.aborted) {
    onStep(to);
    return;
  }

  const start = performance.now();

  return new Promise((resolve, reject) => {
    const tick = (now: number) => {
      if (signal?.aborted) {
        reject(new Error('Cancelled'));
        return;
      }

      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      onStep(from + (to - from) * eased);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(tick);
  });
}
