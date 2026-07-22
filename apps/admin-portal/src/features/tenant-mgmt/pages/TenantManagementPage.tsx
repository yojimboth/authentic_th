import { useTenants } from '../hooks/useTenants';
import { TenantDataTable } from '../components/TenantDataTable';
import { useUIStore } from '../../../store/uiStore';

export function TenantManagementPage() {
  const {
    tenants,
    isLoading,
    createTenant,
    suspendTenant,
    activateTenant,
    deleteTenant,
    isCreating,
    isSuspendLoading,
    isActivateLoading,
    isDeleteLoading,
  } = useTenants();

  const showToast = useUIStore((s) => s.showToast);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-zinc-900">Tenant Management</h1>
          <p className="mt-1 text-sm text-zinc-500">UR-A01: Control restaurant tenant lifecycle</p>
        </div>
      </div>

      <TenantDataTable
        tenants={tenants}
        loading={isLoading}
        onSuspend={(id) => {
          suspendTenant(id, {
            onSuccess: () => showToast('Tenant suspended successfully', 'success'),
            onError: () => showToast('Failed to suspend tenant', 'error'),
          });
        }}
        onActivate={(id) => {
          activateTenant(id, {
            onSuccess: () => showToast('Tenant activated successfully', 'success'),
            onError: () => showToast('Failed to activate tenant', 'error'),
          });
        }}
        onDelete={(id) => {
          deleteTenant(id, {
            onSuccess: () => showToast('Tenant deleted successfully', 'success'),
            onError: () => showToast('Failed to delete tenant', 'error'),
          });
        }}
        onCreate={(data) => {
          createTenant(data, {
            onSuccess: () => showToast('Tenant created successfully', 'success'),
            onError: () => showToast('Failed to create tenant', 'error'),
          });
        }}
        isCreating={isCreating}
        isSuspendLoading={isSuspendLoading}
        isActivateLoading={isActivateLoading}
        isDeleteLoading={isDeleteLoading}
      />
    </div>
  );
}