import { Search, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  filterLabel?: string;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = 'Status',
  secondaryAction,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626E66]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-9 w-full rounded-md border border-[#D7DDD7] bg-white pl-9 pr-8 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#626E66] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <label className="flex items-center gap-2 text-xs font-medium text-[#4F5A53]">
          <span className="whitespace-nowrap">{filterLabel}</span>
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-9 rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="h-9 rounded-md border border-[#D7DDD7] bg-white px-3 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F1F3F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] whitespace-nowrap shrink-0"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
