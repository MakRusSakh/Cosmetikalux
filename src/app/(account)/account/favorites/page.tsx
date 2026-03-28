'use client'

import Link from 'next/link'

export default function FavoritesPage() {
  // TODO: заменить на React Query + API /api/favorites
  const favorites: unknown[] = []

  return (
    <section className="space-y-6">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl text-text-primary">
        Избранное
      </h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
          <p className="text-text-secondary">
            Вы ещё ничего не добавили в избранное
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-semibold rounded-[var(--radius-md)] hover:opacity-90 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        /* TODO: сетка ProductCard */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* {favorites.map(p => <ProductCard key={p.id} product={p} />)} */}
        </div>
      )}
    </section>
  )
}
