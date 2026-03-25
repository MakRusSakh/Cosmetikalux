'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/types/product';
import ProductCard from '@/components/features/ProductCard';
import CatalogSorting from '@/components/features/CatalogSorting';
import Pagination from '@/components/ui/Pagination';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface CategoryClientProps {
  products: Product[];
  categoryName: string;
  categorySlug: string;
}

const PAGE_SIZE = 20;

function sortProducts(items: Product[], sort: string): Product[] {
  const sorted = [...items];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'new':
      return sorted.sort((a, b) => b.id.localeCompare(a.id));
    default:
      return sorted.sort((a, b) => b.purchaseCount - a.purchaseCount);
  }
}

function pluralize(n: number): string {
  const mod = n % 10;
  const mod100 = n % 100;
  if (mod === 1 && mod100 !== 11) return 'товар';
  if (mod >= 2 && mod <= 4 && (mod100 < 12 || mod100 > 14)) return 'товара';
  return 'товаров';
}

export default function CategoryClient({ products, categoryName, categorySlug }: CategoryClientProps) {
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
  };

  const breadcrumbs = [
    { label: 'Каталог', href: '/catalog' },
    { label: categoryName },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            {categoryName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {sorted.length} {pluralize(sorted.length)}
          </p>
        </div>
        <CatalogSorting currentSort={sort} onSortChange={handleSortChange} />
      </div>

      {paginated.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-gray-400">
          В этой категории пока нет товаров
        </p>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </section>
  );
}
