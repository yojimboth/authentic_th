import { describe, it, expect } from 'vitest';
import { formatRelativeTime } from '../formatRelativeTime';

describe('formatRelativeTime', () => {
  it('TC-UTIL-002: should format relative time correctly for seconds', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now - 1000).toISOString());
    expect(result).toBe('just now');
  });

  it('should format relative time correctly for minutes', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now - 60000).toISOString());
    expect(result).toBe('1m ago');
  });

  it('should format relative time correctly for hours', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now - 3600000).toISOString());
    expect(result).toBe('1h ago');
  });

  it('should format relative time correctly for days', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now - 86400000).toISOString());
    expect(result).toBe('1d ago');
  });

  it('should format 0 seconds as just now', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now).toISOString());
    expect(result).toBe('just now');
  });

  it('should format 30 minutes ago', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now - 30 * 60000).toISOString());
    expect(result).toBe('30m ago');
  });

  it('should format 5 hours ago', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now - 5 * 3600000).toISOString());
    expect(result).toBe('5h ago');
  });

  it('should format 7 days ago', () => {
    const now = Date.now();
    const result = formatRelativeTime(new Date(now - 7 * 86400000).toISOString());
    expect(result).toBe('7d ago');
  });
});