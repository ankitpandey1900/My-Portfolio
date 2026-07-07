'use client';

import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';

/** Performance snapshot exposed via ref (not state — avoids re-renders). */
export interface PerformanceSnapshot {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
}

interface UseRenderMonitorOptions {
  /** Number of frames to average over. Default: 60. */
  sampleWindow?: number;
  /** FPS threshold below which a degradation event fires. Default: 40. */
  degradationThreshold?: number;
  /** How many consecutive low-FPS windows before firing the event. Default: 3. */
  consecutiveWindowsBeforeAlert?: number;
}

/**
 * Samples FPS inside the R3F useFrame loop and exposes metrics via a ref.
 * Publishes a `performance:degraded` event when average FPS drops below
 * the threshold for multiple consecutive sample windows.
 *
 * All data is stored in refs to avoid triggering React re-renders.
 */
export function useRenderMonitor({
  sampleWindow = 60,
  degradationThreshold = 40,
  consecutiveWindowsBeforeAlert = 3,
}: UseRenderMonitorOptions = {}) {
  const { gl } = useThree();

  const snapshotRef = React.useRef<PerformanceSnapshot>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
  });

  // Pre-allocate circular buffer to prevent heap allocations/GC pauses in useFrame
  const buffer = React.useRef(new Float32Array(sampleWindow));
  const bufferIndex = React.useRef(0);
  const isFilled = React.useRef(false);

  const lowFpsWindowCount = React.useRef(0);
  const hasFiredDegradation = React.useRef(false);

  useFrame((_, delta) => {
    const frameTimeMs = delta * 1000;

    // Write directly to pre-allocated buffer
    buffer.current[bufferIndex.current] = frameTimeMs;
    bufferIndex.current++;

    // Update GPU metrics from renderer info
    const info = gl.info;
    snapshotRef.current.drawCalls = info.render.calls;
    snapshotRef.current.triangles = info.render.triangles;

    // Check if we reached the sample window size limit
    if (bufferIndex.current >= sampleWindow) {
      bufferIndex.current = 0;
      isFilled.current = true;

      // Calculate rolling average using a simple loop (no closure/array allocations)
      let sum = 0;
      const buf = buffer.current;
      if (buf) {
        for (let i = 0; i < sampleWindow; i++) {
          sum += buf[i] ?? 0;
        }
      }
      const avgFrameTime = sum / sampleWindow;
      const avgFps = 1000 / avgFrameTime;

      snapshotRef.current.fps = Math.round(avgFps);
      snapshotRef.current.frameTime = Math.round(avgFrameTime * 100) / 100;

      // Check for sustained performance degradation
      if (avgFps < degradationThreshold) {
        lowFpsWindowCount.current++;
        if (
          lowFpsWindowCount.current >= consecutiveWindowsBeforeAlert &&
          !hasFiredDegradation.current
        ) {
          hasFiredDegradation.current = true;
          sceneEventEmitter.emit('performance:degraded', {
            fps: snapshotRef.current.fps,
            frameTime: snapshotRef.current.frameTime,
          });
        }
      } else {
        // FPS recovered — reset counters
        if (lowFpsWindowCount.current > 0) {
          lowFpsWindowCount.current = 0;
        }
        if (hasFiredDegradation.current) {
          hasFiredDegradation.current = false;
          sceneEventEmitter.emit('performance:recovered', {
            fps: snapshotRef.current.fps,
          });
        }
      }
    }
  });

  return snapshotRef;
}
export default useRenderMonitor;
