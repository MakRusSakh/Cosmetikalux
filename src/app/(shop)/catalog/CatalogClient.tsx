'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product, CatalogFilters } from '@/types/product';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import ProductCard from '@/components/features/ProductCard';
import CatalogFiltersPanel from '@/components/features/CatalogFilters';
import CatalogSorting from '@/components/features/CatalogSorting';

interface CatalogClientProps {
  initialProducts: Product[];
  initialTotal: number;
  initialTotalPages: number;
  initialPage: number;
  initialFilters: CatalogFilters;
  categories: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
}

export default function CatalogClient({
  initialProducts,
  initialTotal,
  initialTotalPages,
  initialPage,
  initialFilters,
  categories,
  brands,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [products] = useState(initialProducts);
  const [total] = useState(initialTotal);
  const [totalPages] = useState(initialTotalPages);
  const [page] = useState(initialPage);

  const pushFilters = useCallback(
    (next: CatalogFilters) => {
      const params = new URLSearchParams();
      if (next.category) params.set('category', next.category);
      if (next.subcategory) params.set('subcategory', next.subcategory);
      if (next.brand) params.set('brand', next.brand);
      if (next.minPrice) params.set('minPrice', String(next.minPrice));
      if (next.maxPrice) params.set('maxPrice', String(next.maxPrice));
      if (next.skinType) params.set('skinType', next.skinType);
      if (next.country) params.set('country', next.country);
      if (next.search) params.set('search', next.search);
      if (next.sort && next.sort !== 'popular') params.set('sort', next.sort);
      if (next.page && next.page > 1) params.set('page', String(next.page));
      const qs = params.toString();
      router.push(`/catalog${qs ? `?${qs}` : ''}`);
    },
    [router],
  );

  const handleFilterChange = useCallback(
    (next: CatalogFilters) => {
      setFilters(next);
      pushFilters(next);
    },
    [pushFilters],
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      const next = { ...filters, sort: sort as CatalogFilters['sort'], page: 1 };
      setFilters(next);
      pushFilters(next);
    },
    [filters, pushFilters],
  );

  const handlePageChange = useCallback(
    (p: number) => {
      const next = { ...filters, page: p };
      setFilters(next);
      pushFilters(next);
    },
    [filters, pushFilters],
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Каталог' }]} />

      <h1 className="font-heading text-3xl font-bold mb-2 mt-4">Каталог</h1>
      <p className="text-text-tertiary mb-6">
        Найдено {total} {total === 1 ? 'товар' : total < 5 ? 'товара' : 'товаров'}
      </p>

      <div className="flex gap-8">
        <CatalogFiltersPanel
          categories={categories}
          brands={brands}
          filters={filters}
          onFilterChange={handleFilterChange}
          className="shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <CatalogSorting
              currentSort={filters.sort ?? 'popular'}
              onSortChange={handleSortChange}
            />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-tertiary py-16">
              Товары не найдены. Попробуйте изменить фильтры.
            </p>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
