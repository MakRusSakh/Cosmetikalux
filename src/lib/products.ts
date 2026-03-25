import type { Product, Category, Brand, CatalogFilters } from "@/types/product";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";

const PAGE_SIZE = 20;

export function getProducts(filters: CatalogFilters = {}) {
  let items = (productsData as Product[]).filter((p) => p.isActive);

  if (filters.category) {
    items = items.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.subcategory) {
    items = items.filter((p) => p.subcategory === filters.subcategory);
  }
  if (filters.brand) {
    items = items.filter((p) => p.brandSlug === filters.brand);
  }
  if (filters.minPrice) {
    items = items.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice) {
    items = items.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.skinType) {
    items = items.filter((p) => p.skinTypes?.includes(filters.skinType!));
  }
  if (filters.country) {
    items = items.filter((p) => p.countryCode === filters.country);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "new":
      items.sort((a, b) => b.id.localeCompare(a.id));
      break;
    default:
      items.sort((a, b) => b.purchaseCount - a.purchaseCount);
  }

  const page = filters.page || 1;
  const total = items.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;

  return {
    products: items.slice(start, start + PAGE_SIZE),
    total,
    totalPages,
    page,
  };
}

export function getProduct(slug: string): Product | undefined {
  return (productsData as Product[]).find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  return (productsData as Product[])
    .filter(
      (p) =>
        p.id !== product.id &&
        p.isActive &&
        (p.categorySlug === product.categorySlug || p.brand === product.brand)
    )
    .sort((a, b) => b.purchaseCount - a.purchaseCount)
    .slice(0, limit);
}

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getBrands(): Brand[] {
  return brandsData as Brand[];
}
