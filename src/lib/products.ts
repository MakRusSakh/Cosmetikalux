import type { Product, Category, Brand, CatalogFilters } from "@/types/product";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";

const PAGE_SIZE = 20;
const USE_DB = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql'));

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

// ---------- Products ----------

export async function getProducts(filters: CatalogFilters = {}) {
  if (USE_DB) return getProductsFromDB(filters);
  return getProductsFromJSON(filters);
}

async function getProductsFromDB(filters: CatalogFilters) {
  const prisma = await getPrisma();
  const where: Record<string, unknown> = { isActive: true };

  if (filters.category) where.category = { slug: filters.category };
  if (filters.brand) where.brand = { slug: filters.brand };
  if (filters.country) where.countryCode = filters.country;
  if (filters.skinType) where.skinTypes = { has: filters.skinType };
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.search) {
    const q = filters.search;
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy = buildOrderBy(filters.sort);
  const page = filters.page || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: PAGE_SIZE,
      include: { brand: true, category: true, images: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: items.map(mapDBProduct) as unknown as Product[],
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    page,
  };
}

function buildOrderBy(sort?: string) {
  switch (sort) {
    case "price-asc": return { price: "asc" as const };
    case "price-desc": return { price: "desc" as const };
    case "new": return { createdAt: "desc" as const };
    default: return { purchaseCount: "desc" as const };
  }
}

function getProductsFromJSON(filters: CatalogFilters) {
  let items = (productsData as unknown as unknown as Product[]).filter((p) => p.isActive);

  if (filters.category) items = items.filter((p) => p.categorySlug === filters.category);
  if (filters.subcategory) items = items.filter((p) => p.subcategory === filters.subcategory);
  if (filters.brand) items = items.filter((p) => p.brandSlug === filters.brand);
  if (filters.minPrice) items = items.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice) items = items.filter((p) => p.price <= filters.maxPrice!);
  if (filters.skinType) items = items.filter((p) => p.skinTypes?.includes(filters.skinType!));
  if (filters.country) items = items.filter((p) => p.countryCode === filters.country);
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
    case "price-asc": items.sort((a, b) => a.price - b.price); break;
    case "price-desc": items.sort((a, b) => b.price - a.price); break;
    case "new": items.sort((a, b) => b.id.localeCompare(a.id)); break;
    default: items.sort((a, b) => b.purchaseCount - a.purchaseCount);
  }

  const page = filters.page || 1;
  const total = items.length;
  const start = (page - 1) * PAGE_SIZE;

  return {
    products: items.slice(start, start + PAGE_SIZE),
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    page,
  };
}

// ---------- Single product ----------

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (USE_DB) {
    const prisma = await getPrisma();
    const item = await prisma.product.findUnique({
      where: { slug },
      include: { brand: true, category: true, images: true },
    });
    return item ? (mapDBProduct(item) as unknown as Product) : undefined;
  }
  return (productsData as unknown as unknown as Product[]).find((p) => p.slug === slug);
}

// ---------- Related ----------

export async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
  if (USE_DB) {
    const prisma = await getPrisma();
    const items = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          { category: { slug: product.categorySlug } },
          { brand: { slug: product.brandSlug } },
        ],
      },
      orderBy: { purchaseCount: "desc" },
      take: limit,
      include: { brand: true, category: true, images: true },
    });
    return items.map(mapDBProduct) as unknown as Product[];
  }
  return (productsData as unknown as unknown as Product[])
    .filter(
      (p) =>
        p.id !== product.id &&
        p.isActive &&
        (p.categorySlug === product.categorySlug || p.brand === product.brand)
    )
    .sort((a, b) => b.purchaseCount - a.purchaseCount)
    .slice(0, limit);
}

// ---------- Categories & Brands ----------

export async function getCategories(): Promise<Category[]> {
  if (USE_DB) {
    const prisma = await getPrisma();
    const cats = await prisma.category.findMany({ include: { children: true } });
    return cats as unknown as Category[];
  }
  return categoriesData as Category[];
}

export async function getBrands(): Promise<Brand[]> {
  if (USE_DB) {
    const prisma = await getPrisma();
    const brands = await prisma.brand.findMany({ include: { _count: { select: { products: true } } } });
    return brands.map((b) => ({ ...b, productCount: b._count.products })) as unknown as Brand[];
  }
  return brandsData as Brand[];
}

// ---------- Helpers ----------

export function hasNewImage(product: Product): boolean {
  return product.images?.some((img) => img.startsWith("/images/categories/")) ?? false;
}

/** Маппинг Prisma-записи в формат Product (совместимость с JSON-типом) */
function mapDBProduct(item: Record<string, unknown>): Record<string, unknown> {
  const brand = item.brand as Record<string, unknown> | undefined;
  const category = item.category as Record<string, unknown> | undefined;
  const images = item.images as Array<Record<string, unknown>> | undefined;
  return {
    ...item,
    brand: brand?.name ?? "",
    brandSlug: brand?.slug ?? "",
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    images: images?.map((i) => i.url as string) ?? [],
  };
}
