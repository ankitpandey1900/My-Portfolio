'use client';

import { GITHUB_STATS } from '../content/portfolio-content';
import { MissionActions, MissionCard, MissionGrid, MissionLink, MissionTags } from '../ui/mission-card';

export function GithubSection() {
  return (
    <div className="mission-stack">
      <MissionGrid>
        <MissionCard
          id="GH-01"
          status="live"
          title="Contributions"
          tagline="12 month signal"
          body={GITHUB_STATS.contributions}
        />
        <MissionCard
          id="GH-02"
          status="active"
          title="Handle"
          tagline="Primary repository hub"
          body={`@${GITHUB_STATS.username}`}
        />
      </MissionGrid>
      <MissionCard id="GH-03" status="signal" title="Pinned repositories" tagline="Featured builds">
        <MissionTags items={GITHUB_STATS.pinnedRepos} />
        <MissionActions>
          <MissionLink href={GITHUB_STATS.url} external>
            View on GitHub
          </MissionLink>
        </MissionActions>
      </MissionCard>
    </div>
  );
}
