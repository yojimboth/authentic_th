interface DataTableProps<T> {
  columns: { key: string; header: string; render?: (row: T) => React.ReactNode }[];
  data?: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyField?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data',
  keyField = 'id',
}: DataTableProps<T>) {
  const rowData = data || [];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (rowData.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-zinc-500">
        {emptyMessage}
      </div>
    );
  }

  return (
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
        <tbody className="divide-y divide-zinc-200 bg-white">
          {rowData.map((row, idx) => (
            <tr key={String(row[keyField as keyof T] ?? idx)} className="hover:bg-zinc-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-zinc-700">
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}