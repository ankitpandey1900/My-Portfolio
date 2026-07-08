'use client';

import * as React from 'react';

const SESSION_KEY = 'portfolio_session_id';

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return;

    fetch('/api/telemetry/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrer: document.referrer || undefined,
        device: getDeviceType(),
        browser: navigator.userAgent.slice(0, 128),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionId) {
          sessionStorage.setItem(SESSION_KEY, data.sessionId);
        }
      })
      .catch(() => {
        // Analytics is non-blocking
      });
  }, []);

  return <>{children}</>;
}

export function trackEvent(eventType: string, payload?: Record<string, unknown>) {
  const sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) return;

  fetch('/api/telemetry/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, eventType, payload }),
  }).catch(() => {
    // Non-blocking
  });
}
