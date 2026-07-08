'use client';

import * as React from 'react';
import { GestureRecognizer } from './gesture-recognizer';

export function GestureManager() {
  React.useEffect(() => {
    // Attach to document.documentElement to capture all gestures
    const target = document.documentElement;

    // Passive true prevents us from calling preventDefault, but vastly increases mobile scrolling performance.
    // Ensure CSS `touch-action: none` is used if native scrolling interference occurs.
    target.addEventListener('pointerdown', GestureRecognizer.handlePointerDown, { passive: true });
    target.addEventListener('pointermove', GestureRecognizer.handlePointerMove, { passive: true });
    target.addEventListener('pointerup', GestureRecognizer.handlePointerUp, { passive: true });
    target.addEventListener('pointercancel', GestureRecognizer.handlePointerCancel, {
      passive: true,
    });

    return () => {
      target.removeEventListener('pointerdown', GestureRecognizer.handlePointerDown, {
        passive: true,
      } as EventListenerOptions);
      target.removeEventListener('pointermove', GestureRecognizer.handlePointerMove, {
        passive: true,
      } as EventListenerOptions);
      target.removeEventListener('pointerup', GestureRecognizer.handlePointerUp, {
        passive: true,
      } as EventListenerOptions);
      target.removeEventListener('pointercancel', GestureRecognizer.handlePointerCancel, {
        passive: true,
      } as EventListenerOptions);

      // Safety teardown just in case components unmount mid-gesture
      GestureRecognizer.cancelAll();
    };
  }, []);

  return null;
}
