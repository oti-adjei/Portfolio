import Button from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
      <Button icon="ri-arrow-left-s-line" disabled={page === 1} onClick={() => onChange(Math.max(1, page - 1))}>
        Previous
      </Button>
      <span className="text-[12px] text-gray-500 tabular-nums">
        Page {page} of {totalPages}
      </span>
      <Button
        icon="ri-arrow-right-s-line"
        disabled={page === totalPages}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
      >
        Next
      </Button>
    </nav>
  );
}
