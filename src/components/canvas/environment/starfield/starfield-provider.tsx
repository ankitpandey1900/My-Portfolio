// ─────────────────────────────────────────────────────────────────────────────
// Starfield Provider
// Top-level engine composition component.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { StarfieldRenderer } from './starfield-renderer';

export function StarfieldProvider() {
  return (
    <>
      <StarfieldRenderer />
    </>
  );
}
