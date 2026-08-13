'use client';

import * as React from 'react';
import { useNavigationStore } from '../navigation-store';

export function NavigationDebug() {
  const state = useNavigationStore((s) => s.state);
  const planet = useNavigationStore((s) => s.currentPlanetId);
  const section = useNavigationStore((s) => s.currentSectionId);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0,0,0,0.8)',
        padding: '1rem',
        color: '#0f0',
        fontFamily: 'monospace',
        zIndex: 9999,
        border: '1px solid #0f0',
        pointerEvents: 'none',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Navigation System</h3>
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

