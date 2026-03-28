import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategories, getProducts } from '@/lib/products';
import CategoryClient from './CategoryClient';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return { title: 'Категория не найдена' };
  return {
    title: `${category.name} — купить корейскую косметику | CosmetikaLux`,
    description: `${category.name} — каталог корейской косметики. Доставка по России.`,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ categorySlug: c.slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const [allCategories, productResult] = await Promise.all([
    getCategories(),
    getProducts({ category: categorySlug }),
  ]);
  const category = allCategories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  const { products } = productResult;

  return (
    <CategoryClient
      products={products}
      categoryName={category.name}
      categorySlug={categorySlug}
    />
  );
}
