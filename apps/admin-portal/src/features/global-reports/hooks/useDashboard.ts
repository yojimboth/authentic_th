import { useQuery } from '@tanstack/react-query';
import { healthService } from '../../../api/services/mockBackend';
import type { KPIMetrics, Alert, LatencyDataPoint } from '../../../types/health';

export function useDashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: healthService.getKPIs,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: healthService.getAlerts,
  });

  const { data: latencyHistory, isLoading: latencyLoading } = useQuery({
    queryKey: ['latency-history'],
    queryFn: healthService.getLatencyHistory,
  });

  return {
    kpis: kpis as KPIMetrics,
    alerts: alerts as Alert[],
    latencyHistory: latencyHistory as LatencyDataPoint[],
    isLoading: kpisLoading || alertsLoading || latencyLoading,
  };
}