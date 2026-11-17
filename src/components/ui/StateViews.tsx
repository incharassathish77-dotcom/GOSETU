import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E6E1] bg-[#F7F8F6] text-[#52796F]">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden="true" />}
      </div>
      <h3 className="text-sm font-semibold text-[#1A1F1C]">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#626E66]">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[#D4DBD4] bg-white px-3.5 py-2 text-xs font-medium text-[#1A1F1C] transition-colors hover:bg-[#F1F3F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] whitespace-nowrap shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface LoadingTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function LoadingTableSkeleton({
  rows = 5,
  columns = 5,
}: LoadingTableSkeletonProps) {
  return (
    <div className="divide-y divide-[#E2E6E1]" aria-busy="true" aria-label="Loading records">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid items-center gap-4 px-5 py-3.5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((__, colIdx) => (
            <div
              key={colIdx}
              className="h-3.5 animate-pulse rounded bg-[#ECEFEA]"
              style={{
                width: colIdx === 0 ? '72%' : colIdx === columns - 1 ? '58%' : '85%',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({
  title = 'Unable to load records',
  message,
  onRetry,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start justify-between gap-4 rounded-lg border border-[#F3C6C6] bg-[#FEF5F5] px-5 py-4 sm:flex-row sm:items-center"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C]"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-[#7F1D1D]">{title}</p>
          <p className="mt-0.5 text-xs text-[#991B1B]">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#E5A9A9] bg-white px-3 py-1.5 text-xs font-medium text-[#7F1D1D] transition-colors hover:bg-[#FEF2F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C1C] whitespace-nowrap shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
