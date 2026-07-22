import { useDashboard } from '../hooks/useDashboard';
import { GlobalKPIs } from '../components/GlobalKPIs';
import { SystemHealthChart } from '../components/SystemHealthChart';
import { TenantAlertFeed } from '../components/TenantAlertFeed';

export function DashboardPage() {
  const { kpis, alerts, latencyHistory, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Monitor entire ecosystem health</p>
      </div>

      <GlobalKPIs kpis={kpis} loading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SystemHealthChart data={latencyHistory} loading={isLoading} />
        </div>
        <div>
          <TenantAlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}