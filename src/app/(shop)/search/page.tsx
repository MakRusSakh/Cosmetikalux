import Link from 'next/link'
import productsData from '@/data/products.json'
import type { Product } from '@/types/product'
import ProductCard from '@/components/features/ProductCard'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const query = q.trim().toLowerCase()

  const results: Product[] = query.length >= 2
    ? (productsData as Product[]).filter((p) => {
        const hay = `${p.name} ${p.brand} ${p.description}`.toLowerCase()
        return query.split(/\s+/).every((w) => hay.includes(w))
      }).slice(0, 40)
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-6">
        <Link href="/" className="hover:text-accent-primary transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-text-primary">Поиск</span>
      </nav>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">
        {query ? <>Результаты по запросу &laquo;{q}&raquo; <span className="text-text-tertiary font-normal text-lg">({results.length})</span></> : 'Поиск'}
      </h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : query.length >= 2 ? (
        <p className="text-text-secondary text-center py-16">Ничего не найдено. Попробуйте изменить запрос.</p>
      ) : (
        <p className="text-text-secondary text-center py-16">Введите запрос для поиска товаров.</p>
      )}
    </div>
  )
}
