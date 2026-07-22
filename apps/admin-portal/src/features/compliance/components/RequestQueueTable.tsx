import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useState } from 'react';
import type { ComplianceRequest } from '../../../types/auth';

interface RequestQueueTableProps {
  requests: ComplianceRequest[];
  loading: boolean;
  onPurge: () => void;
  isPurging: boolean;
}

const typeVariant: Record<string, 'blue' | 'rose'> = {
  ACCESS: 'blue',
  FORGOTTEN: 'rose',
};

const statusVariant: Record<string, 'info' | 'success'> = {
  PENDING: 'info',
  COMPLETED: 'success',
};

export function RequestQueueTable({ requests, loading, onPurge, isPurging }: RequestQueueTableProps) {
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [showPurgeStep2, setShowPurgeStep2] = useState(false);

  const columns = [
    {
      key: 'id',
      header: 'Request ID',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'tenant',
      header: 'Tenant',
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: ComplianceRequest) => (
        <Badge variant={typeVariant[row.type]}>{row.type.toLowerCase()}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ComplianceRequest) => (
        <Badge variant={statusVariant[row.status]}>{row.status.toLowerCase()}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ComplianceRequest) => (
        row.status === 'PENDING' && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setShowPurgeConfirm(true);
            }}
          >
            Process
          </Button>
        )
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {requests?.filter((r) => r.status === 'PENDING').length || 0} pending requests
        </p>
        <Button variant="secondary" onClick={() => setShowPurgeConfirm(true)}>
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Execute Hard Purge
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {requests?.map((row) => (
                <tr key={row.id} className={`hover:bg-zinc-50 ${row.status === 'COMPLETED' ? 'opacity-60' : ''}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-zinc-700">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showPurgeConfirm}
        onClose={() => { setShowPurgeConfirm(false); setShowPurgeStep2(false); }}
        title="Execute Hard Purge"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => { setShowPurgeConfirm(false); setShowPurgeStep2(false); }}
            >
              Cancel
            </Button>
            {showPurgeStep2 ? (
              <Button variant="danger" loading={isPurging} onClick={onPurge}>
                Confirm & Purge
              </Button>
            ) : (
              <Button variant="danger" onClick={() => setShowPurgeStep2(true)}>
                I Understand
              </Button>
            )}
          </>
        }
      >
        {showPurgeStep2 ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">Final Confirmation Required</p>
              <p className="mt-1 text-sm text-red-700">
                This will permanently delete ALL user data associated with pending requests across ALL tenants.
                This action is irreversible and cannot be undone.
              </p>
            </div>
            <p className="text-sm text-zinc-600">
              Type <strong>"PURGE"</strong> to confirm you understand the consequences.
            </p>
            <input
              type="text"
              placeholder='Type "PURGE"'
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onPurge();
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">Are you sure?</p>
              <p className="mt-1 text-sm text-amber-700">
                This will permanently delete all user data for the {requests?.filter((r) => r.status === 'PENDING').length || 0} pending compliance requests. This is a destructive action.
              </p>
            </div>
            <p className="text-sm text-zinc-600">
              This action is part of the PDPA compliance workflow. Are you certain you want to proceed?
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}