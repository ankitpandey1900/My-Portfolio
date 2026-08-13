'use client';

import { ContactForm } from '@/features/contact/contact-form';
import { CONTACT_INFO, GITHUB_STATS } from '../content/portfolio-content';
import { MissionActions, MissionCard, MissionGrid, MissionLink } from '../ui/mission-card';

export function ContactSection() {
  return (
    <div className="mission-stack">
      <MissionCard
        id="COM-01"
        status="live"
        title="Open channel"
        tagline="Availability"
        body={CONTACT_INFO.availability}
      />
      <ContactForm />
      <MissionGrid>
        <MissionCard id="COM-02" status="signal" title="Email" tagline="Direct line">
          <MissionActions>
            <MissionLink href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</MissionLink>
          </MissionActions>
        </MissionCard>
        <MissionCard id="COM-03" status="signal" title="LinkedIn" tagline="Professional network">
          <MissionActions>
            <MissionLink href={CONTACT_INFO.linkedin} external>
              Connect
            </MissionLink>
          </MissionActions>
        </MissionCard>
      </MissionGrid>
      <MissionActions>
        <MissionLink href={GITHUB_STATS.url} external>
          GitHub
        </MissionLink>
        <MissionLink href={CONTACT_INFO.twitter} external>
          X / Twitter
        </MissionLink>
      </MissionActions>
    </div>
  );
}

