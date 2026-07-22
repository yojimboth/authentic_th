import { useLoyalty } from '../hooks/useLoyalty';
import { ConversionRateInput } from '../components/ConversionRateInput';
import { OverrideToggle } from '../components/OverrideToggle';
import { PolicySummary } from '../components/PolicySummary';
import { Button } from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';

export function LoyaltySettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useLoyalty();
  const showToast = useUIStore((s) => s.showToast);

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded bg-zinc-200" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[30px] font-bold text-zinc-900">Loyalty Governance</h1>
        <p className="mt-1 text-sm text-zinc-500">UR-A02: Set global loyalty point rules</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">Conversion Rate</h2>
            <ConversionRateInput
              value={settings.conversionRate}
              onChange={(val) => updateSettings({ conversionRate: val }, {
                onSuccess: () => {},
                onError: () => showToast('Failed to update rate', 'error'),
              })}
            />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">Override Settings</h2>
            <OverrideToggle
              checked={settings.allowOverride}
              onChange={(checked) => updateSettings({ allowOverride: checked }, {
                onSuccess: () => {},
                onError: () => showToast('Failed to update settings', 'error'),
              })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <PolicySummary settings={settings} />

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900">About This Policy</h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              The global loyalty policy defines how users earn and redeem points across all
              restaurant tenants. Setting a conversion rate determines how much money is required
              to earn one loyalty point. When override is disabled, all tenants must use the
              platform-defined rate.
            </p>
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              <strong>Note:</strong> Changes to the conversion rate will apply to all active tenants
              immediately. Historical point balances remain unaffected.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => showToast('Settings saved successfully', 'success')} loading={isUpdating} size="lg">
          Save Global Policy
        </Button>
      </div>
    </div>
  );
}