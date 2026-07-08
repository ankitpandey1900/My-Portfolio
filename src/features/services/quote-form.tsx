'use client';

import * as React from 'react';
import { trackEvent } from '@/components/analytics/analytics-provider';

const SERVICE_OPTIONS = [
  'Full-Stack Product Development',
  'Immersive Web Experiences',
  'Architecture Consultation',
];

interface QuoteFormProps {
  className?: string;
}

export function QuoteForm({ className }: QuoteFormProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [services, setServices] = React.useState<string[]>([SERVICE_OPTIONS[0]!]);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (services.length === 0) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, services, notes, priceEstimate: 0 }),
      });

      if (!response.ok) throw new Error('Failed');

      setStatus('success');
      trackEvent('quote_request', { services });
      setName('');
      setEmail('');
      setNotes('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className={className ?? 'section-stack'} onSubmit={handleSubmit}>
      <p className="section-prose">Request a scoped proposal for your project.</p>
      <fieldset className="section-stack section-stack--tight">
        <legend className="section-field__label">Services</legend>
        {SERVICE_OPTIONS.map((service) => (
          <label key={service} className="section-check">
            <input
              type="checkbox"
              checked={services.includes(service)}
              onChange={() => toggleService(service)}
            />
            <span>{service}</span>
          </label>
        ))}
      </fieldset>
      <label className="section-field">
        <span className="section-field__label">Name</span>
        <input className="section-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="section-field">
        <span className="section-field__label">Email</span>
        <input
          className="section-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="section-field">
        <span className="section-field__label">Project notes</span>
        <textarea
          className="section-input section-input--area"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </label>
      <button type="submit" className="section-cta" disabled={status === 'loading' || services.length === 0}>
        {status === 'loading' ? 'Submitting…' : 'Request quote'}
      </button>
      {status === 'success' && <p className="section-note">Quote request received.</p>}
      {status === 'error' && <p className="section-note">Unable to submit. Email directly instead.</p>}
    </form>
  );
}
