import { NextRequest, NextResponse } from 'next/server'
import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? ''
  if (q.length < 2) return NextResponse.json({ products: [], categories: [] })

  const products = productsData
    .filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(q))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      price: p.price,
      image: p.images[0] ?? null,
      categorySlug: p.categorySlug,
    }))

  const categories = categoriesData
    .filter((c) => c.name.toLowerCase().includes(q))
    .slice(0, 3)
    .map((c) => ({ name: c.name, slug: c.slug }))

  return NextResponse.json({ products, categories })
}
