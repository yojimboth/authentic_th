import * as SecureStore from 'expo-secure-store';

/**
 * Audit Logger
 * Logs security-relevant events for compliance and incident response.
 * In production, this would send logs to a secure logging service.
 *
 * SECURITY: All audit events are immutable and tamper-evident in production.
 * For development, logs are stored in SecureStore (encrypted, device-only)
 * and printed to console.
 */

export type AuditEventType =
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'AUTH_FAILURE'
  | 'AUTH_LOCKOUT'
  | 'AUTH_OTP_REQUEST'
  | 'AUTH_OTP_FAILURE'
  | 'AUTH_OTP_VERIFY'
  | 'AUTH_OTP_VERIFY_FAILURE'
  | 'AUTH_PROFILE_COMPLETE'
  | 'AUTH_BIOMETRIC_LOGIN'
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

const AUDIT_LOGS_KEY = 'audit_logs';
const MAX_STORED_LOGS = 500;

const auditLogs: AuditLog[] = [];

let isInitialized = false;

const init = async () => {
  if (isInitialized) return;
  try {
    const stored = await SecureStore.getItemAsync(AUDIT_LOGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AuditLog[];
      auditLogs.push(...parsed.slice(-MAX_STORED_LOGS));
    }
  } catch {
    // Silently fail - logs are recoverable
  }
  isInitialized = true;
};

init();

const persistLogs = async () => {
  try {
    await SecureStore.setItemAsync(AUDIT_LOGS_KEY, JSON.stringify(auditLogs), {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });
  } catch {
    // Silently fail - logging should never block the app
  }
};

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

  auditLogs.push(log);

  // Trim to max stored logs
  if (auditLogs.length > MAX_STORED_LOGS) {
    auditLogs.splice(0, auditLogs.length - MAX_STORED_LOGS);
  }

  // Fire-and-forget persistence
  void persistLogs();

  // Log to console for development
  console.log('[AUDIT]', log);

  return log;
};

// Convenience functions for common audit events
export const logLogin = (userId?: string) =>
  logAuditEvent('AUTH_LOGIN', {}, userId);
export const logLogout = (userId?: string) =>
  logAuditEvent('AUTH_LOGOUT', {}, userId);
export const logAuthFailure = (reason: string, userId?: string) =>
  logAuditEvent('AUTH_FAILURE', { reason }, userId);
export const logAuthLockout = (userId?: string) =>
  logAuditEvent('AUTH_LOCKOUT', {}, userId);
export const logAuthEvent = (
  eventType: AuditEventType,
  details: Record<string, any>,
  userId?: string
) => logAuditEvent(eventType, details, userId);
export const logPaymentInitiated = (amount: number, userId?: string) =>
  logAuditEvent('PAYMENT_INITIATED', { amount }, userId);
export const logPaymentSuccess = (orderId: string, userId?: string) =>
  logAuditEvent('PAYMENT_SUCCESS', { orderId }, userId);
export const logPaymentFailure = (reason: string, userId?: string) =>
  logAuditEvent('PAYMENT_FAILURE', { reason }, userId);