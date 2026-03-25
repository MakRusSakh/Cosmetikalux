'use client';

interface CatalogSortingProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'new', label: 'Новинки' },
] as const;

export default function CatalogSorting({ currentSort, onSortChange }: CatalogSortingProps) {
  return (
    <div className="relative inline-block">
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-bg-surface border border-border-light rounded-[var(--radius-sm)] px-4 py-2 pr-8 text-sm text-text-secondary cursor-pointer focus:border-accent-primary focus:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs">
        ▾
      </span>
    </div>
  );
}
