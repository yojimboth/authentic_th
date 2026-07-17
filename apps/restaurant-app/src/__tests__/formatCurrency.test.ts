import { render, screen } from '@testing-library/react-native';
import { formatCurrency } from '../utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats a basic amount', () => {
    const result = formatCurrency(10);
    expect(result).toBe('$10.00');
  });

  it('formats with cents', () => {
    const result = formatCurrency(15.5);
    expect(result).toBe('$15.50');
  });

  it('formats larger amounts', () => {
    const result = formatCurrency(1250);
    expect(result).toBe('$1,250.00');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toBe('$0.00');
  });

  it('formats with decimals', () => {
    const result = formatCurrency(44.64);
    expect(result).toBe('$44.64');
  });
});