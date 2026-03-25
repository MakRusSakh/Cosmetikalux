'use client';

import type { CatalogFilters as CatalogFiltersType } from '@/types/product';

interface FilterOption {
  slug: string;
  name: string;
}

interface CatalogFiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
  filters: CatalogFiltersType;
  onFilterChange: (filters: CatalogFiltersType) => void;
  className?: string;
}

const SKIN_TYPES: FilterOption[] = [
  { slug: 'all', name: 'Для всех типов кожи' },
  { slug: 'dry', name: 'Сухая' },
  { slug: 'oily', name: 'Жирная' },
  { slug: 'combination', name: 'Комбинированная' },
  { slug: 'sensitive', name: 'Чувствительная' },
  { slug: 'aging', name: 'Возрастная' },
];

const COUNTRIES: FilterOption[] = [
  { slug: 'KR', name: 'Корея' },
  { slug: 'JP', name: 'Япония' },
];

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  selected?: string;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <details open className="border-b border-border-light pb-4 mb-4">
      <summary className="font-heading text-sm font-semibold mb-2 cursor-pointer">
        {label}
      </summary>
      <div className="mt-2">
        {options.map((option) => (
          <label
            key={option.slug}
            className="flex items-center gap-2 py-1 text-sm text-text-secondary cursor-pointer"
          >
            <input
              type="checkbox"
              className="accent-accent-primary"
              checked={selected === option.slug}
              onChange={() =>
                onChange(selected === option.slug ? undefined : option.slug)
              }
            />
            {option.name}
          </label>
        ))}
      </div>
    </details>
  );
}

function PriceRange({
  minPrice,
  maxPrice,
  onChange,
}: {
  minPrice?: number;
  maxPrice?: number;
  onChange: (min?: number, max?: number) => void;
}) {
  return (
    <details open className="border-b border-border-light pb-4 mb-4">
      <summary className="font-heading text-sm font-semibold mb-2 cursor-pointer">
        Цена
      </summary>
      <div className="flex gap-2 mt-2">
        <input
          type="number"
          placeholder="от"
          className="w-full rounded-[var(--radius-md)] border border-border-light bg-bg-primary px-3 py-1.5 text-sm text-text-primary outline-none focus:border-accent-primary"
          value={minPrice ?? ''}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : undefined;
            onChange(val, maxPrice);
          }}
        />
        <input
          type="number"
          placeholder="до"
          className="w-full rounded-[var(--radius-md)] border border-border-light bg-bg-primary px-3 py-1.5 text-sm text-text-primary outline-none focus:border-accent-primary"
          value={maxPrice ?? ''}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : undefined;
            onChange(minPrice, val);
          }}
        />
      </div>
    </details>
  );
}

export default function CatalogFilters({
  categories,
  brands,
  filters,
  onFilterChange,
  className = '',
}: CatalogFiltersProps) {
  const update = (patch: Partial<CatalogFiltersType>) =>
    onFilterChange({ ...filters, ...patch, page: 1 });

  const resetFilters = () =>
    onFilterChange({ sort: filters.sort, search: filters.search });

  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.skinType ||
    filters.country;

  return (
    <aside
      className={[
        'hidden md:block w-full md:w-64 bg-bg-surface p-4',
        'rounded-[var(--radius-md)] border border-border-light',
        className,
      ].join(' ')}
    >
      <CheckboxGroup
        label="Категория"
        options={categories}
        selected={filters.category}
        onChange={(value) => update({ category: value, subcategory: undefined })}
      />

      <CheckboxGroup
        label="Бренд"
        options={brands}
        selected={filters.brand}
        onChange={(value) => update({ brand: value })}
      />

      <PriceRange
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={(min, max) => update({ minPrice: min, maxPrice: max })}
      />

      <CheckboxGroup
        label="Тип кожи"
        options={SKIN_TYPES}
        selected={filters.skinType}
        onChange={(value) => update({ skinType: value })}
      />

      <CheckboxGroup
        label="Страна"
        options={COUNTRIES}
        selected={filters.country}
        onChange={(value) => update({ country: value })}
      />

      {hasActiveFilters && (
        <button
          type="button"
          className="text-sm text-accent-primary hover:text-accent-hover cursor-pointer mt-4"
          onClick={resetFilters}
        >
          Сбросить фильтры
        </button>
      )}
    </aside>
  );
}
