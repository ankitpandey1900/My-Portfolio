'use client';

import { QuoteForm } from '@/features/services/quote-form';
import { CONTACT_INFO, SERVICES, TESTIMONIALS } from '../content/portfolio-content';
import { MissionActions, MissionCard, MissionGrid, MissionLink, MissionTags } from '../ui/mission-card';

export function ServicesSection() {
  return (
    <div className="mission-stack">
      <MissionGrid columns={1}>
        {SERVICES.map((service, index) => (
          <MissionCard
            key={service.title}
            id={`SRV-${String(index + 1).padStart(2, '0')}`}
            status="active"
            title={service.title}
            body={service.description}
          >
            <MissionTags items={service.deliverables} />
          </MissionCard>
        ))}
      </MissionGrid>
      <QuoteForm />
      {TESTIMONIALS.map((item, index) => (
        <MissionCard
          key={item.author}
          id={`SIG-${String(index + 1).padStart(2, '0')}`}
          status="signal"
          title={item.author}
          body={`"${item.quote}"`}
        />
      ))}
      {CONTACT_INFO.calUrl ? (
        <MissionActions>
          <MissionLink href={CONTACT_INFO.calUrl} external>
            Book discovery call
          </MissionLink>
        </MissionActions>
      ) : null}
    </div>
  );
}

