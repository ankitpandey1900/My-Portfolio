import { describe, expect, it } from 'vitest';
import { SectionResolver } from '@/components/section-loader/section-resolver';

describe('SectionResolver', () => {
  it('validates known section IDs', () => {
    expect(SectionResolver.isValidSection('about')).toBe(true);
    expect(SectionResolver.isValidSection('skills')).toBe(true);
    expect(SectionResolver.isValidSection('invalid')).toBe(false);
  });

  it('resolves registered sections', () => {
    const section = SectionResolver.resolveSection('projects');
    expect(section).not.toBeNull();
    expect(section?.id).toBe('projects');
    expect(section?.name).toBe('Projects');
  });

  it('returns null for unknown sections', () => {
    expect(SectionResolver.resolveSection('unknown')).toBeNull();
  });
});
