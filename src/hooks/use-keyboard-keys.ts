'use client';

import * as React from 'react';

function shouldIgnoreTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, button, a[href], [contenteditable="true"]'));
}

function normalizeKey(event: KeyboardEvent): string {
  if (event.key === 'Shift') return 'shift';
  return event.key.toLowerCase();
}

export function useKeyboardKeys(enabled = true) {
  const [pressed, setPressed] = React.useState<ReadonlySet<string>>(() => new Set());

  React.useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => setPressed(new Set()));
      return;
    }

    const update = (mutate: (next: Set<string>) => void) => {
      setPressed((current) => {
        const next = new Set(current);
        mutate(next);
        return next;
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || shouldIgnoreTarget(event.target)) return;
      const key = normalizeKey(event);
      update((next) => next.add(key));
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = normalizeKey(event);
      update((next) => next.delete(key));
    };

    const onBlur = () => setPressed(new Set());

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      setPressed(new Set());
    };
  }, [enabled]);

  const isPressed = React.useCallback((key: string) => pressed.has(key.toLowerCase()), [pressed]);

  return { isPressed, pressed };
}

