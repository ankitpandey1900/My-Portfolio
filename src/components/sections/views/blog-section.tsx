'use client';

import { MissionCard, MissionGrid, MissionTags } from '../ui/mission-card';

const PLANNED_POSTS = [
  'The architecture of a 3D portfolio',
  'Performance budgets for WebGL products',
  'When to reach for R3F vs. DOM',
];

export function BlogSection() {
  return (
    <MissionGrid columns={1}>
      <MissionCard
        id="LOG-BLOG"
        status="building"
        title="Transmission log"
        tagline="Coming soon"
        body="Essays on immersive web engineering, design systems, and building products that feel cinematic without sacrificing performance."
      >
        <MissionTags items={PLANNED_POSTS} />
      </MissionCard>
    </MissionGrid>
  );
}
