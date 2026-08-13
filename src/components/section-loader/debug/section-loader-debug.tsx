'use client';

import * as React from 'react';
import { useSectionLoaderStore } from '../section-loader-state';

export function SectionLoaderDebug() {
  const state = useSectionLoaderStore((s) => s.state);
  const section = useSectionLoaderStore((s) => s.currentSection);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 230,
        left: 20,
        background: 'rgba(0,100,100,0.8)',
        padding: '1rem',
        color: '#0ff',
        fontFamily: 'monospace',
        zIndex: 9999,
        border: '1px solid #0ff',
        pointerEvents: 'none',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Section Loader</h3>
      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span>
          <strong>State:</strong> {state}
        </span>
        <span>
          <strong>Target:</strong> {section || 'None'}
        </span>
      </div>
    </div>
  );
}

