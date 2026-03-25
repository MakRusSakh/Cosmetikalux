import type { Metadata } from 'next';
import { getProducts, getCategories, getBrands } from '@/lib/products';
import type { CatalogFilters } from '@/types/product';
import CatalogClient from './CatalogClient';

export const metadata: Metadata = {
  title: 'Каталог — CosmetikaLux',
  description:
    'Каталог корейской косметики премиум-класса. Кремы, сыворотки, маски и другие средства с доставкой по России.',
};

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const filters: CatalogFilters = {
    category: params.category,
    subcategory: params.subcategory,
    brand: params.brand,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    skinType: params.skinType,
    country: params.country,
    search: params.search,
    sort: (params.sort as CatalogFilters['sort']) ?? 'popular',
    page: params.page ? Number(params.page) : 1,
  };

  const result = getProducts(filters);
  const categories = getCategories();
  const brands = getBrands();

  return (
    <CatalogClient
      initialProducts={result.products}
      initialTotal={result.total}
      initialTotalPages={result.totalPages}
      initialPage={result.page}
      initialFilters={filters}
      categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
    />
  );
}
