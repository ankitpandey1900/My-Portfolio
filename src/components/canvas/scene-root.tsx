'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side wrapper for the 3D canvas.
 *
 * next/dynamic with ssr:false must be used inside a Client Component
 * (not a Server Component like page.tsx). This wrapper provides that boundary.
 * The ExperienceCanvas and all Three.js/R3F code is excluded from SSR.
 */
const ExperienceCanvas = dynamic(
  () => import('@/components/canvas/experience-canvas').then((mod) => mod.ExperienceCanvas),
  { ssr: false }
);

export function SceneRoot() {
  return <ExperienceCanvas />;
}
export default SceneRoot;
