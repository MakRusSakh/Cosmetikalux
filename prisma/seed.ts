import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface RawBrand {
  name: string;
  slug: string;
  country: string;
  countryCode: string;
}

interface RawCategory {
  name: string;
  slug: string;
  subcategories: { name: string; slug: string }[];
}

interface RawProduct {
  id: string;
  externalId: string;
  slug: string;
  name: string;
  nameEnglish?: string;
  brand: string;
  brandSlug: string;
  price: number;
  oldPrice: number | null;
  unit: string;
  pricePerUnit: number | null;
  category: string;
  categorySlug: string;
  subcategory: string;
  country: string;
  description: string;
  ingredients: string | string[];
  inciList?: string;
  usage?: string;
  skinTypes: string[];
  keyIngredients: string[];
  routineStep: number | null;
  images: string[];
  ogImage: string;
  rating: { score: number; count: number };
  purchaseCount: number;
  isActive: boolean;
}

function loadJson<T>(filename: string): T {
  const raw = readFileSync(join(__dirname, '..', 'src', 'data', filename), 'utf-8');
  return JSON.parse(raw) as T;
}

async function main() {
  console.log('🌱 Запуск seed-скрипта...');

  // 1. Очистка таблиц (порядок учитывает FK)
  await prisma.$transaction([
    prisma.favorite.deleteMany(),
    prisma.review.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.address.deleteMany(),
    prisma.user.deleteMany(),
    prisma.promoCode.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.brand.deleteMany(),
  ]);
  console.log('✓ Таблицы очищены');

  // 2. Бренды
  const rawBrands = loadJson<RawBrand[]>('brands.json');
  const seenBrandSlugs = new Set<string>();
  const uniqueBrands = rawBrands.filter((b) => {
    if (seenBrandSlugs.has(b.slug)) return false;
    seenBrandSlugs.add(b.slug);
    return true;
  });

  for (const b of uniqueBrands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, country: b.country, countryCode: b.countryCode },
      create: { name: b.name, slug: b.slug, country: b.country, countryCode: b.countryCode },
    });
  }
  console.log(`✓ Брендов создано: ${uniqueBrands.length}`);

  // 3. Категории (родительские + подкатегории)
  const rawCategories = loadJson<RawCategory[]>('categories.json');
  let catCount = 0;

  for (const cat of rawCategories) {
    const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    const parent = await prisma.category.upsert({
      where: { slug },
      update: { name: cat.name },
      create: { name: cat.name, slug },
    });
    catCount++;

    for (const sub of cat.subcategories) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, parentId: parent.id },
        create: { name: sub.name, slug: sub.slug, parentId: parent.id },
      });
      catCount++;
    }
  }
  console.log(`✓ Категорий создано: ${catCount}`);

  // 4. Товары
  const rawProducts = loadJson<RawProduct[]>('products.json');

  const brandMap = new Map<string, string>();
  const allBrands = await prisma.brand.findMany({ select: { id: true, slug: true } });
  for (const b of allBrands) brandMap.set(b.slug, b.id);

  const categoryMap = new Map<string, string>();
  const allCategories = await prisma.category.findMany({ select: { id: true, slug: true } });
  for (const c of allCategories) categoryMap.set(c.slug, c.id);

  let prodCount = 0;
  const seenExternalIds = new Set<string>();

  for (const p of rawProducts) {
    if (seenExternalIds.has(p.externalId)) continue;
    seenExternalIds.add(p.externalId);

    const brandId = brandMap.get(p.brandSlug);
    const categoryId = categoryMap.get(p.categorySlug);
    if (!brandId || !categoryId) {
      console.warn(`⚠ Пропущен "${p.name}": бренд=${p.brandSlug} категория=${p.categorySlug}`);
      continue;
    }

    const ingredients = Array.isArray(p.ingredients)
      ? p.ingredients.join(', ')
      : (p.ingredients ?? '');

    await prisma.product.create({
      data: {
        externalId: p.externalId,
        slug: p.slug,
        name: p.name,
        nameEnglish: p.nameEnglish ?? null,
        price: p.price,
        oldPrice: p.oldPrice,
        unit: p.unit ?? null,
        pricePerUnit: p.pricePerUnit?.toString() ?? null,
        description: p.description ?? '',
        ingredients,
        inciList: p.inciList ?? null,
        usage: p.usage ?? null,
        skinTypes: p.skinTypes ?? [],
        keyIngredients: p.keyIngredients ?? [],
        routineStep: p.routineStep,
        ogImage: p.ogImage ?? null,
        rating: p.rating?.score ?? 0,
        ratingCount: p.rating?.count ?? 0,
        purchaseCount: p.purchaseCount ?? 0,
        isActive: p.isActive ?? true,
        brandId,
        categoryId,
        images: {
          create: (p.images ?? []).map((url, i) => ({
            url,
            alt: p.name,
            sortOrder: i,
          })),
        },
      },
    });
    prodCount++;
  }

  console.log(`✓ Товаров создано: ${prodCount}`);
  console.log('🎉 Seed завершён успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
