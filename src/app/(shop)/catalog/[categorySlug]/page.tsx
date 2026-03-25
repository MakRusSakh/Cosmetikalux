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
  const category = getCategories().find((c) => c.slug === categorySlug);
  if (!category) return { title: 'Категория не найдена' };
  return {
    title: `${category.name} — купить корейскую косметику | CosmetikaLux`,
    description: `${category.name} — каталог корейской косметики. Доставка по России.`,
  };
}

export function generateStaticParams() {
  return getCategories().map((c) => ({ categorySlug: c.slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = getCategories().find((c) => c.slug === categorySlug);
  if (!category) notFound();

  const { products } = getProducts({ category: categorySlug });

  return (
    <CategoryClient
      products={products}
      categoryName={category.name}
      categorySlug={categorySlug}
    />
  );
}
