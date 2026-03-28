'use client'

import { useState, useCallback } from 'react'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cartStore'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const addToCart = useCartStore((s) => s.add)

  const handleAdd = useCallback(() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? '',
      slug: product.slug,
      categorySlug: product.categorySlug,
      brand: product.brand,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }, [addToCart, product])

  return (
    <div>
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Добавить ${product.name} в корзину`}
        className="w-full py-3.5 bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-heading uppercase tracking-wider rounded-[var(--radius-md)] hover:opacity-90 transition"
      >
        {added ? 'Добавлено \u2713' : 'В корзину'}
      </button>
      <button
        type="button"
        className="mt-3 w-full py-2.5 border border-border-light rounded-[var(--radius-md)] text-text-secondary text-sm hover:bg-accent-light transition flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4.5 h-4.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        В избранное
      </button>
    </div>
  )
}
