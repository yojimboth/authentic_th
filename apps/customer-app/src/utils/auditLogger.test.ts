import { logAuditEvent, logLogin, logLogout, logAuthFailure, logPaymentInitiated, logPaymentSuccess } from './auditLogger';

// Mock console.log
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

describe('auditLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logAuditEvent', () => {
    it('should log an audit event', () => {
      logAuditEvent('AUTH_LOGIN', { userId: 'user-1' }, 'user-1');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.objectContaining({
          eventType: 'AUTH_LOGIN',
          userId: 'user-1',
          details: { userId: 'user-1' },
          timestamp: expect.any(String),
        })
      );
    });

    it('should include timestamp', () => {
      logAuditEvent('TEST_EVENT', {});
      
      const callArgs = consoleSpy.mock.calls[0];
      expect(callArgs[1].timestamp).toBeTruthy();
      expect(() => new Date(callArgs[1].timestamp)).not.toThrow();
    });

    it('should support all event types', () => {
      const eventTypes = [
        'AUTH_LOGIN',
        'AUTH_LOGOUT',
        'AUTH_FAILURE',
        'AUTH_LOCKOUT',
        'DATA_ACCESS',
        'DATA_MODIFY',
        'PAYMENT_INITIATED',
        'PAYMENT_SUCCESS',
      ] as const;

      eventTypes.forEach((eventType) => {
        logAuditEvent(eventType, {});
        expect(consoleSpy).toHaveBeenCalledWith(
          '[AUDIT]',
          expect.objectContaining({ eventType })
        );
      });
    });
  });

  describe('logLogin', () => {
    it('should log auth login event', () => {
      logLogin('user-123');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.objectContaining({
          eventType: 'AUTH_LOGIN',
          userId: 'user-123',
        })
      );
    });
  });

  describe('logLogout', () => {
    it('should log auth logout event', () => {
      logLogout('user-123');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.objectContaining({
          eventType: 'AUTH_LOGOUT',
          userId: 'user-123',
        })
      );
    });
  });

  describe('logAuthFailure', () => {
    it('should log auth failure with reason', () => {
      logAuthFailure('Invalid password', 'user-123');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.objectContaining({
          eventType: 'AUTH_FAILURE',
          userId: 'user-123',
          details: { reason: 'Invalid password' },
        })
      );
    });
  });

  describe('logPaymentInitiated', () => {
    it('should log payment initiation with amount', () => {
      logPaymentInitiated(45.50, 'user-123');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.objectContaining({
          eventType: 'PAYMENT_INITIATED',
          userId: 'user-123',
          details: { amount: 45.50 },
        })
      );
    });
  });

  describe('logPaymentSuccess', () => {
    it('should log payment success with orderId', () => {
      logPaymentSuccess('ord-123', 'user-123');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.objectContaining({
          eventType: 'PAYMENT_SUCCESS',
          userId: 'user-123',
          details: { orderId: 'ord-123' },
        })
      );
    });
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });
});