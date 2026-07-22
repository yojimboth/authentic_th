export interface HealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  apiLatencyMs: number;
  dbConnections: number;
  timestamp: string;
}

export interface KPIMetrics {
  totalGMV: number;
  activeTenants: number;
  platformRevenue: number;
  avgLatencyMs: number;
}

export interface Alert {
  id: string;
  tenantId?: string;
  tenantName?: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export type AlertSeverity = Alert['severity'];

export interface LatencyDataPoint {
  time: string;
  latency: number;
}