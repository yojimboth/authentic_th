import { Card } from '../../../components/ui/Card';

interface RevenuePreviewProps {
  platformFeePercent: number;
  activeTenants: number;
}

export function RevenuePreview({ platformFeePercent, activeTenants }: RevenuePreviewProps) {
  const estimatedMonthlyRevenue = Math.round(platformFeePercent * 100 * activeTenants * 30);

  return (
    <Card title="Revenue Preview">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-zinc-500">Projected Monthly Revenue</span>
          <span className="text-2xl font-bold text-zinc-900">${estimatedMonthlyRevenue.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Based on {activeTenants} active tenants at {platformFeePercent}% fee rate</span>
        </div>
      </div>
    </Card>
  );
}