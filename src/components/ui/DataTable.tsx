import type { ReactNode } from 'react';
import { EmptyState, ErrorBanner, LoadingTableSkeleton } from './StateViews';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  isLoading = false,
  errorMessage = null,
  onRetry,
  emptyTitle = 'No matching records',
  emptyDescription = 'Adjust your search query or status filter to view records.',
  emptyActionLabel,
  onEmptyAction,
}: DataTableProps<T>) {
  if (errorMessage) {
    return (
      <div className="p-4">
        <ErrorBanner message={errorMessage} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingTableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#E2E6E1] bg-[#FAFBF9]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold text-[#4F5A53] whitespace-nowrap ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                } ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ECEFEA] bg-white">
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              className={`text-sm text-[#1A1F1C] transition-colors ${
                onRowClick
                  ? 'cursor-pointer hover:bg-[#F7F9F7] focus-visible:bg-[#F7F9F7] focus-visible:outline-none'
                  : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 align-middle ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.className ?? ''}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
