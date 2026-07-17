/**
 * Audit Logger
 * Logs security-relevant events for compliance and incident response.
 * In production, this would send logs to a secure logging service.
 *
 * SECURITY: All audit events are immutable and tamper-evident in production.
 * For development, logs are stored in memory and printed to console.
 */

export type AuditEventType =
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'AUTH_FAILURE'
  | 'AUTH_LOCKOUT'
  | 'DATA_ACCESS'
  | 'DATA_MODIFY'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILURE';

interface AuditLog {
  timestamp: string;
  eventType: AuditEventType;
  userId?: string;
  details: Record<string, any>;
  ip?: string;
}

const auditLogs: AuditLog[] = [];

export const logAuditEvent = (
  eventType: AuditEventType,
  details: Record<string, any>,
  userId?: string
) => {
  const log: AuditLog = {
    timestamp: new Date().toISOString(),
    eventType,
    userId,
    details,
  };

  // Store in memory (in production, send to secure logging service)
  auditLogs.push(log);

  // Log to console for development
  console.log('[AUDIT]', log);

  return log;
};

// Convenience functions for common audit events
export const logLogin = (userId?: string) => logAuditEvent('AUTH_LOGIN', {}, userId);
export const logLogout = (userId?: string) => logAuditEvent('AUTH_LOGOUT', {}, userId);
export const logAuthFailure = (reason: string, userId?: string) =>
  logAuditEvent('AUTH_FAILURE', { reason }, userId);
export const logAuthLockout = (userId?: string) =>
  logAuditEvent('AUTH_LOCKOUT', {}, userId);
export const logPaymentInitiated = (amount: number, userId?: string) =>
  logAuditEvent('PAYMENT_INITIATED', { amount }, userId);
export const logPaymentSuccess = (orderId: string, userId?: string) =>
  logAuditEvent('PAYMENT_SUCCESS', { orderId }, userId);
export const logPaymentFailure = (reason: string, userId?: string) =>
  logAuditEvent('PAYMENT_FAILURE', { reason }, userId);