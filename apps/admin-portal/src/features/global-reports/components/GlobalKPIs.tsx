import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../utils/formatCurrency';
import type { KPIMetrics } from '../../../types/health';

interface GlobalKPIsProps {
  kpis: KPIMetrics | undefined;
  loading: boolean;
}

const kpiCards = [
  { label: 'Total GMV', value: 'kpi', color: 'indigo' },
  { label: 'Active Tenants', value: 'tenants', color: 'emerald' },
  { label: 'Platform Revenue', value: 'revenue', color: 'violet' },
  { label: 'System Latency', value: 'latency', color: 'amber' },
];

function getKpiColor(color: string) {
  const map: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return map[color] || 'bg-zinc-50 text-zinc-600';
}

function getKpiIcon(color: string) {
  const map: Record<string, React.ReactNode> = {
    indigo: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    emerald: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    violet: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    amber: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  };
  return map[color] || null;
}

export function GlobalKPIs({ kpis, loading }: GlobalKPIsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-200" />
              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-zinc-200" />
                <div className="h-6 w-28 animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis && kpiCards.map((kpi) => (
        <Card key={kpi.label}>
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getKpiColor(kpi.color)}`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {getKpiIcon(kpi.color)}
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-500">{kpi.label}</p>
              <p className="text-xl font-bold text-zinc-900">
                {kpi.value === 'kpi' && formatCurrency(kpis.totalGMV)}
                {kpi.value === 'tenants' && kpis.activeTenants}
                {kpi.value === 'revenue' && formatCurrency(kpis.platformRevenue)}
                {kpi.value === 'latency' && `${Math.round(kpis.avgLatencyMs)}ms`}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}