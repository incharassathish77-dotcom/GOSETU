import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-[#626E66]">
      <span className="tabular-nums">
        Showing {startItem}–{endItem} of {totalItems} records
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="inline-flex h-8 items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F1F3F0] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Prev</span>
        </button>

        <span className="px-2 font-mono text-[11px] text-[#4F5A53] tabular-nums">
          Page {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="inline-flex h-8 items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F1F3F0] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
