import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { DataTable } from '../../../components/ui/DataTable';
import { ActionMenu } from './ActionMenu';
import { AddTenantModal } from './AddTenantModal';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import type { Tenant } from '../../../types/tenant';

interface TenantDataTableProps {
  tenants: Tenant[];
  loading: boolean;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  isSuspendLoading: boolean;
  isActivateLoading: boolean;
  isDeleteLoading: boolean;
  onCreate: (data: { name: string; domain: string }) => void;
  isCreating: boolean;
}

const statusVariant: Record<string, 'success' | 'danger' | 'warning'> = {
  Active: 'success',
  Suspended: 'danger',
  Pending: 'warning',
};

export function TenantDataTable({
  tenants,
  loading,
  onSuspend,
  onActivate,
  onDelete,
  isSuspendLoading,
  isActivateLoading,
  isDeleteLoading,
  onCreate,
  isCreating,
}: TenantDataTableProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: Tenant) => (
        <div>
          <p className="font-medium text-zinc-900">{row.name}</p>
          <p className="text-xs text-zinc-500">{row.domain}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Tenant) => (
        <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: Tenant) => (
        <span className="text-zinc-500">{row.createdAt}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Tenant) => (
        <ActionMenu
          tenant={row}
          onSuspend={onSuspend}
          onActivate={onActivate}
          onDelete={(id) => setDeleteTarget(tenants.find((t) => t.id === id) || null)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">Manage restaurant tenant lifecycle</p>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Tenant
        </Button>
      </div>

      <DataTable<Tenant>
        columns={columns}
        data={tenants}
        loading={loading}
        emptyMessage="No tenants found. Add your first tenant to get started."
      />

      <AddTenantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onCreate}
        loading={isCreating}
      />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={
          deleteTarget?.status === 'Active'
            ? 'Delete Active Tenant'
            : 'Delete Tenant'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteTarget) onDelete(deleteTarget.id);
                setDeleteTarget(null);
              }}
              loading={isDeleteLoading}
            >
              Delete
            </Button>
          </>
        }
      >
        {deleteTarget?.status === 'Active' && (
          <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            <strong>Warning:</strong> This tenant is active. Deleting will cancel all pending orders and permanently remove all associated data.
          </div>
        )}
        {deleteTarget?.status === 'Suspended' && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            This tenant is currently suspended. All data will be permanently removed.
          </div>
        )}
        <p className="text-sm text-zinc-600">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.domain})? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}