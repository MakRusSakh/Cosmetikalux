import { NextRequest, NextResponse } from 'next/server'
import productsData from '@/data/products.json'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const results = productsData
    .filter((p) => {
      const hay = `${p.name} ${p.brand} ${p.description}`.toLowerCase()
      return q.split(/\s+/).every((w) => hay.includes(w))
    })
    .slice(0, 20)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      price: p.price,
      image: p.images[0] ?? null,
      categorySlug: p.categorySlug,
    }))

  return NextResponse.json(results)
}
