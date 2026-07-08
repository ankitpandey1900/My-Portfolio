'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  id?: string;
  status?: 'live' | 'building' | 'archived' | 'active' | 'signal';
  title: string;
  tagline?: string;
  body?: string;
  children?: React.ReactNode;
  className?: string;
}

export function MissionCard({
  id,
  status = 'active',
  title,
  tagline,
  body,
  children,
  className,
}: MissionCardProps) {
  return (
    <article className={cn('mission-log', className)}>
      {(id || status) && (
        <header className="mission-log__head">
          {id ? <span className="mission-log__id">{id}</span> : <span />}
          <span className="mission-log__status" data-status={status}>
            {status.toUpperCase()}
          </span>
        </header>
      )}
      <h3 className="mission-log__title">{title}</h3>
      {tagline ? <p className="mission-log__tagline">{tagline}</p> : null}
      {body ? <p className="mission-log__body">{body}</p> : null}
      {children}
    </article>
  );
}

interface MissionGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
}

export function MissionGrid({ children, columns = 2 }: MissionGridProps) {
  return (
    <div className={cn('mission-grid', columns === 1 && 'mission-grid--single')}>{children}</div>
  );
}

interface MissionTagsProps {
  items: string[];
}

export function MissionTags({ items }: MissionTagsProps) {
  return (
    <ul className="mission-log__stack">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

interface MissionActionsProps {
  children: React.ReactNode;
}

export function MissionActions({ children }: MissionActionsProps) {
  return <div className="mission-log__actions">{children}</div>;
}

export function MissionLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className="mission-log__link"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
