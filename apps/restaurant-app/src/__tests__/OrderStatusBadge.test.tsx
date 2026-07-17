import { render, screen } from '@testing-library/react-native';
import { OrderStatusBadge } from '../features/orders/components/OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('renders Pending status', () => {
    render(<OrderStatusBadge status="Pending" />);
    expect(screen.getByText('Pending')).toBeTruthy();
  });

  it('renders Accepted status', () => {
    render(<OrderStatusBadge status="Accepted" />);
    expect(screen.getByText('Accepted')).toBeTruthy();
  });

  it('renders Preparing status', () => {
    render(<OrderStatusBadge status="Preparing" />);
    expect(screen.getByText('Preparing')).toBeTruthy();
  });

  it('renders Ready status', () => {
    render(<OrderStatusBadge status="Ready" />);
    expect(screen.getByText('Ready')).toBeTruthy();
  });

  it('renders Completed status', () => {
    render(<OrderStatusBadge status="Completed" />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('renders Cancelled status', () => {
    render(<OrderStatusBadge status="Cancelled" />);
    expect(screen.getByText('Cancelled')).toBeTruthy();
  });
});