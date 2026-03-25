import type { MetadataRoute } from 'next'
import type { Product, Category } from '@/types/product'
import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://cosmetikalux.ru'

export default function sitemap(): MetadataRoute.Sitemap {
  const products = productsData as Product[]
  const categories = categoriesData as Category[]
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/catalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/catalog/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.isActive)
    .map((p) => ({
      url: `${BASE_URL}/catalog/${p.categorySlug}/${p.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

  return [...staticPages, ...categoryPages, ...productPages]
}
