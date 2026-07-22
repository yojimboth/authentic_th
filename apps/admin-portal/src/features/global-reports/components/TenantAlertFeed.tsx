import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';
import type { Alert } from '../../../types/health';

interface TenantAlertFeedProps {
  alerts?: Alert[];
}

const severityVariant = {
  info: 'info' as const,
  warning: 'warning' as const,
  critical: 'danger' as const,
};

export function TenantAlertFeed({ alerts }: TenantAlertFeedProps) {
  const alertsList = alerts || [];
  
  if (alertsList.length === 0) {
    return (
      <Card title="Alerts">
        <p className="text-center text-sm text-zinc-500">No active alerts</p>
      </Card>
    );
  }

  return (
    <Card title={`Alerts (${alertsList.length})`}>
      <div className="space-y-3">
        {alertsList.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3"
          >
            <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
              alert.severity === 'critical' ? 'bg-red-500' :
              alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-700">{alert.message}</p>
              <div className="mt-1 flex items-center gap-2">
                {alert.tenantName && (
                  <Badge variant="default">{alert.tenantName}</Badge>
                )}
                <Badge variant={severityVariant[alert.severity]}>
                  {alert.severity}
                </Badge>
                <span className="text-xs text-zinc-400">{formatRelativeTime(alert.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}