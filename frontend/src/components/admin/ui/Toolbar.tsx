import type { ReactNode } from 'react';

interface ToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
}

export default function Toolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  children,
}: ToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px]">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full min-h-10 pl-10 pr-4 py-2 text-[13px] rounded-full bg-white ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal/50"
          />
        </div>
      )}
      {children}
    </div>
  );
}
