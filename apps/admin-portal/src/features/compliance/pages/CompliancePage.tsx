import { useCompliance } from '../hooks/useCompliance';
import { RequestQueueTable } from '../components/RequestQueueTable';
import { AuditExportButton } from '../components/AuditExportButton';
import { useUIStore } from '../../../store/uiStore';

export function CompliancePage() {
  const {
    requests,
    isLoading,
    purge,
    exportAudit,
    isPurging,
    isExporting,
  } = useCompliance();

  const showToast = useUIStore((s) => s.showToast);

  const handlePurge = () => {
    purge(undefined, {
      onSuccess: () => {
        showToast('Hard purge completed successfully', 'success');
      },
      onError: () => {
        showToast('Purge failed - user not found', 'error');
      },
    });
  };

  const handleExport = () => {
    exportAudit(undefined, {
      onSuccess: () => {
        showToast('Audit log exported successfully', 'success');
      },
      onError: () => {
        showToast('Export failed', 'error');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-zinc-900">Compliance Center</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage PDPA data subject requests</p>
        </div>
        <AuditExportButton onClick={handleExport} loading={isExporting} />
      </div>

      <RequestQueueTable
        requests={requests || []}
        loading={isLoading}
        onPurge={handlePurge}
        isPurging={isPurging}
      />

      {isPurging && (
        <div className="rounded-lg bg-indigo-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            <span className="text-sm text-indigo-700">Processing purge request...</span>
          </div>
        </div>
      )}
    </div>
  );
}