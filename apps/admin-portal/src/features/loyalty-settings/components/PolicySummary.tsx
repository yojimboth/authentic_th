import { Card } from '../../../components/ui/Card';
import type { LoyaltySettings } from '../../../types/loyalty';

interface PolicySummaryProps {
  settings: LoyaltySettings;
}

export function PolicySummary({ settings }: PolicySummaryProps) {
  return (
    <Card title="Policy Summary">
      <div className="space-y-3">
        <div className="rounded-lg bg-indigo-50 p-3">
          <p className="text-sm text-indigo-800">
            Current Policy: Users earn <strong>1 point per ${settings.conversionRate.toFixed(2)} AUD</strong> spent.
            {settings.allowOverride
              ? ' Stores <strong className="text-indigo-900">can</strong> adjust rates for individual tenants.'
              : ' Stores <strong className="text-indigo-900">cannot</strong> adjust rates.'
            }
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-zinc-50 p-3">
            <p className="text-zinc-500">Conversion Rate</p>
            <p className="font-semibold text-zinc-900">1 : ${settings.conversionRate.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3">
            <p className="text-zinc-500">Override Allowed</p>
            <p className={`font-semibold ${settings.allowOverride ? 'text-emerald-600' : 'text-zinc-900'}`}>
              {settings.allowOverride ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}