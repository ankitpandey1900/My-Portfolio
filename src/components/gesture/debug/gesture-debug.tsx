'use client';

import * as React from 'react';
import { useGestureStore } from '../gesture-state';

export function GestureDebug() {
  const state = useGestureStore((s) => s.state);
  const disabled = useGestureStore((s) => s.disabled);
  const activeTouchPoints = useGestureStore((s) => s.activeTouchPoints);
  const history = useGestureStore((s) => s.history);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        background: 'rgba(0,50,50,0.8)',
        padding: '1rem',
        color: '#0ff',
        fontFamily: 'monospace',
        zIndex: 9999,
        border: '1px solid #0ff',
        pointerEvents: 'none',
        minWidth: '220px',
        maxHeight: '300px',
        overflow: 'hidden',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Gesture System</h3>
      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span>
          <strong>Status:</strong> {disabled ? 'DISABLED' : 'ENABLED'}
        </span>
        <span>
          <strong>State:</strong> {state}
        </span>
        <span>
          <strong>Pointers:</strong> {activeTouchPoints}
        </span>
        <hr style={{ borderColor: '#055', width: '100%', margin: '4px 0' }} />
        <span>
          <strong>History:</strong>
        </span>
        {history.map((h, i) => (
          <span key={i} style={{ color: i === 0 ? '#fff' : '#0aa' }}>
            {h.type} {h.context.velocity ? `(v: ${h.context.velocity.toFixed(2)})` : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
