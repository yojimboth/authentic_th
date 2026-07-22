import { Card } from '../../../components/ui/Card';
import { FeeValueInput } from '../components/FeeValueInput';
import { RevenuePreview } from '../components/RevenuePreview';
import { Button } from '../../../components/ui/Button';
import { useBilling } from '../hooks/useBilling';
import { useUIStore } from '../../../store/uiStore';

export function BillingConfigPage() {
  const { feeConfig, isLoading, updateFeeConfig, isUpdating } = useBilling();
  const showToast = useUIStore((s) => s.showToast);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-200" />
          ))}
        </div>
      </div>
    );
  }

  const validateFee = (type: string, value: number): string | null => {
    if (value < 0) return 'Fee cannot be negative';
    if (type === 'PERCENTAGE' && value > 100) return 'Percentage cannot exceed 100%';
    return null;
  };

  const handleUpdate = () => {
    const pErr = validateFee('PERCENTAGE', feeConfig.platformFee.value);
    if (pErr) { showToast(pErr, 'error'); return; }
    const tErr = validateFee('PERCENTAGE', feeConfig.transactionFee.value);
    if (tErr) { showToast(tErr, 'error'); return; }

    updateFeeConfig(feeConfig, {
      onSuccess: () => showToast('Billing configuration updated', 'success'),
      onError: () => showToast('Failed to update billing config', 'error'),
    });
  };

  const activeTenants = feeConfig
    ? Math.round(feeConfig.platformFee.value * 100 * 24 * 30)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[30px] font-bold text-zinc-900">Billing Configuration</h1>
        <p className="mt-1 text-sm text-zinc-500">UR-A02: Define platform fee structure</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Fee Settings">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">Platform Fee</label>
              <div className="flex items-center gap-3">
                <select
                  value={feeConfig.platformFee.type}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => updateFeeConfig({
                    ...feeConfig,
                    platformFee: { ...feeConfig.platformFee, type: e.target.value as 'PERCENTAGE' | 'FIXED' }
                  })}
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Fee</option>
                </select>
                <FeeValueInput
                  value={feeConfig.platformFee.value}
                  onChange={(val) => updateFeeConfig({
                    ...feeConfig,
                    platformFee: { ...feeConfig.platformFee, value: val }
                  })}
                  type={feeConfig.platformFee.type === 'PERCENTAGE' ? 'percentage' : 'fixed'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">Admin Fee</label>
              <div className="flex items-center gap-3">
                <select
                  value={feeConfig.adminFee.type}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => updateFeeConfig({
                    ...feeConfig,
                    adminFee: { ...feeConfig.adminFee, type: e.target.value as 'PERCENTAGE' | 'FIXED' }
                  })}
                >
                  <option value="FIXED">Fixed Fee</option>
                  <option value="PERCENTAGE">Percentage</option>
                </select>
                <FeeValueInput
                  value={feeConfig.adminFee.value}
                  onChange={(val) => updateFeeConfig({
                    ...feeConfig,
                    adminFee: { ...feeConfig.adminFee, value: val }
                  })}
                  type={feeConfig.adminFee.type === 'PERCENTAGE' ? 'percentage' : 'fixed'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">Transaction Fee</label>
              <div className="flex items-center gap-3">
                <select
                  value={feeConfig.transactionFee.type}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => updateFeeConfig({
                    ...feeConfig,
                    transactionFee: { ...feeConfig.transactionFee, type: e.target.value as 'PERCENTAGE' | 'FIXED' }
                  })}
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Fee</option>
                </select>
                <FeeValueInput
                  value={feeConfig.transactionFee.value}
                  onChange={(val) => updateFeeConfig({
                    ...feeConfig,
                    transactionFee: { ...feeConfig.transactionFee, value: val }
                  })}
                  type={feeConfig.transactionFee.type === 'PERCENTAGE' ? 'percentage' : 'fixed'}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <RevenuePreview platformFeePercent={feeConfig.platformFee.value} activeTenants={24} />

          <Card title="Fee Summary">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Platform Fee</span>
                <span className="font-medium text-zinc-900">
                  {feeConfig.platformFee.type === 'PERCENTAGE'
                    ? `${feeConfig.platformFee.value}%`
                    : `$${feeConfig.platformFee.value}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Admin Fee</span>
                <span className="font-medium text-zinc-900">
                  {feeConfig.adminFee.type === 'PERCENTAGE'
                    ? `${feeConfig.adminFee.value}%`
                    : `$${feeConfig.adminFee.value}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Transaction Fee</span>
                <span className="font-medium text-zinc-900">
                  {feeConfig.transactionFee.type === 'PERCENTAGE'
                    ? `${feeConfig.transactionFee.value}%`
                    : `$${feeConfig.transactionFee.value}`}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-zinc-900">Total per transaction</span>
                  <span className="font-bold text-zinc-900">
                    $50.00 + {feeConfig.platformFee.value}% + {feeConfig.transactionFee.value}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleUpdate} loading={isUpdating} size="lg">
          Apply to All Tenants
        </Button>
      </div>
    </div>
  );
}