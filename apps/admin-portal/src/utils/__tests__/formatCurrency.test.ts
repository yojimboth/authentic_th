import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('TC-UTIL-001: should format AUD currency correctly', () => {
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(100)).toBe('$100');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should format large numbers with commas', () => {
    const result = formatCurrency(1234567);
    expect(result).toBe('$1,234,567');
  });

  it('should format small amounts correctly', () => {
    expect(formatCurrency(1)).toBe('$1');
    expect(formatCurrency(50)).toBe('$50');
  });

  it('should format the mock KPI totalGMV', () => {
    expect(formatCurrency(1200000)).toBe('$1,200,000');
  });

  it('should format platform revenue', () => {
    expect(formatCurrency(45000)).toBe('$45,000');
  });

  it('TC-UTIL-001b: should handle different currencies', () => {
    const usd = formatCurrency(100, 'USD');
    expect(usd).toBeTruthy();
  });
});