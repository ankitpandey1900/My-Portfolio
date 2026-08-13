'use client';

import * as React from 'react';
import { useLandingStore } from '../landing-state';

export function LandingDebug() {
  const state = useLandingStore((s) => s.state);
  const planet = useLandingStore((s) => s.targetPlanetId);
  const section = useLandingStore((s) => s.targetSectionId);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 140,
        left: 20,
        background: 'rgba(50,0,100,0.8)',
        padding: '1rem',
        color: '#f0f',
        fontFamily: 'monospace',
        zIndex: 9999,
        border: '1px solid #f0f',
        pointerEvents: 'none',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Landing System</h3>
      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span>
          <strong>State:</strong> {state}
        </span>
        <span>
          <strong>Planet:</strong> {planet || 'None'}
        </span>
        <span>
          <strong>Section:</strong> {section || 'None'}
        </span>
      </div>
    </div>
  );
}

