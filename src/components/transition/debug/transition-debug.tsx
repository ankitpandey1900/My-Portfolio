'use client';

import * as React from 'react';
import { useTransitionStore } from '../transition-state';

export function TransitionDebug() {
  const state = useTransitionStore((s) => s.state);
  const current = useTransitionStore((s) => s.currentTransition);
  const queue = useTransitionStore((s) => s.queue);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 310,
        left: 20,
        background: 'rgba(50,50,0,0.8)',
        padding: '1rem',
        color: '#ff0',
        fontFamily: 'monospace',
        zIndex: 9999,
        border: '1px solid #ff0',
        pointerEvents: 'none',
        minWidth: '220px',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Transition Queue</h3>
      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span>
          <strong>State:</strong> {state}
        </span>
        <span>
          <strong>Active:</strong>{' '}
          {current ? `${current.id} (${current.targetId || 'global'})` : 'None'}
        </span>
        <span>
          <strong>Queue:</strong> {queue.length} items
        </span>
        {queue.map((q, i) => (
          <span key={q.uid} style={{ marginLeft: '10px', color: '#ccc' }}>
            {i + 1}. {q.id} (prio: {q.priority})
          </span>
        ))}
      </div>
    </div>
  );
}
