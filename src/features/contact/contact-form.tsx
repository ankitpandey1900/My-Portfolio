'use client';

import * as React from 'react';

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) throw new Error('Failed');

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className={className ?? 'section-stack'} onSubmit={handleSubmit}>
      <label className="section-field">
        <span className="section-field__label">Name</span>
        <input
          className="section-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          autoComplete="name"
        />
      </label>
      <label className="section-field">
        <span className="section-field__label">Email</span>
        <input
          className="section-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label className="section-field">
        <span className="section-field__label">Message</span>
        <textarea
          className="section-input section-input--area"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          rows={4}
        />
      </label>
      <button type="submit" className="section-cta" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'success' && <p className="section-note">Message sent. I&apos;ll respond soon.</p>}
      {status === 'error' && <p className="section-note">Something went wrong. Try email directly.</p>}
    </form>
  );
}
