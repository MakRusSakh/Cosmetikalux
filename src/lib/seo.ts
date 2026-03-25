import type { Product, Category } from '@/types/product'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://cosmetikalux.ru'

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + '…'
}

export function getProductMetadata(product: Product): Metadata {
  const title = `${product.name} | CosmetikaLux`
  const description = truncate(product.description, 160)
  const url = `${BASE_URL}/catalog/${product.categorySlug}/${product.slug}`
  const image = product.ogImage || product.images[0]

  return {
    title,
    description,
    keywords: [product.brand, product.category, 'корейская косметика', 'купить'],
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : [],
      type: 'website',
    },
    alternates: { canonical: url },
  }
}

export function getCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} — купить в CosmetikaLux`
  const description = `${category.name} — оригинальная корейская и японская косметика. Доставка по России.`
  const url = `${BASE_URL}/catalog/${category.slug}`

  return {
    title,
    description,
    openGraph: { title, description, url, type: 'website' },
    alternates: { canonical: url },
  }
}

export function getProductJsonLd(product: Product): object {
  const url = `${BASE_URL}/catalog/${product.categorySlug}/${product.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images[0],
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url,
    },
    ...(product.rating.count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.score,
        reviewCount: product.rating.count,
      },
    }),
  }
}

export function getBreadcrumbJsonLd(
  items: { name: string; url?: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  }
}
