'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}

const btnBase = 'min-w-[36px] h-9 rounded-[var(--radius-sm)] text-sm flex items-center justify-center transition-colors';
const btnNormal = `${btnBase} bg-bg-surface border border-border-light text-text-secondary hover:bg-accent-light`;
const btnActive = `${btnBase} bg-accent-primary text-text-inverse`;
const btnDisabled = `${btnBase} bg-bg-surface border border-border-light text-text-secondary opacity-40 cursor-not-allowed`;

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav className="flex items-center gap-1" aria-label="Пагинация">
      <button
        className={isFirst ? btnDisabled : btnNormal}
        onClick={() => onPageChange(1)}
        disabled={isFirst}
        aria-label="Первая страница"
      >
        &laquo;
      </button>
      <button
        className={isFirst ? btnDisabled : btnNormal}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Предыдущая страница"
      >
        &lsaquo;
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className={`${btnBase} text-text-tertiary`}>
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            className={page === currentPage ? btnActive : btnNormal}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className={isLast ? btnDisabled : btnNormal}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Следующая страница"
      >
        &rsaquo;
      </button>
      <button
        className={isLast ? btnDisabled : btnNormal}
        onClick={() => onPageChange(totalPages)}
        disabled={isLast}
        aria-label="Последняя страница"
      >
        &raquo;
      </button>
    </nav>
  );
}
