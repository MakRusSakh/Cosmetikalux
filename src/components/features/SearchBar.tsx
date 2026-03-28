'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useUIStore } from '@/stores/uiStore'

interface SuggestProduct { id: string; name: string; slug: string; brand: string; price: number; image: string | null; categorySlug: string }
interface SuggestCategory { name: string; slug: string }

export default function SearchBar() {
  const router = useRouter()
  const isOpen = useUIStore((s) => s.isSearchOpen)
  const toggle = useUIStore((s) => s.toggleSearch)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<SuggestProduct[]>([])
  const [categories, setCategories] = useState<SuggestCategory[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const close = useCallback(() => { setQuery(''); setProducts([]); setCategories([]); toggle() }, [toggle])

  useEffect(() => { if (isOpen) inputRef.current?.focus() }, [isOpen])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.length < 2) { setProducts([]); setCategories([]); return }
    timerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setProducts(data.products ?? []); setCategories(data.categories ?? [])
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  const submit = () => { if (query.trim().length >= 2) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); close() } }

  if (!isOpen) return null

  const hasResults = products.length > 0 || categories.length > 0

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center pt-24" onClick={close}>
      <div className="bg-bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 h-fit" onClick={(e) => e.stopPropagation()}>
        <div className="p-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') close() }}
            placeholder="Поиск товаров..."
            className="w-full text-lg px-4 py-3 rounded-xl border border-border-light bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/40 text-text-primary placeholder:text-text-tertiary"
          />
        </div>
        {hasResults && (
          <div className="px-4 pb-4 max-h-80 overflow-y-auto">
            {products.map((p) => (
              <Link key={p.id} href={`/catalog/${p.categorySlug}/${p.slug}`} onClick={close}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary transition-colors">
                <div className="w-10 h-10 relative rounded-md overflow-hidden bg-bg-secondary shrink-0">
                  {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary truncate">{p.name}</p>
                  <p className="text-xs text-text-tertiary">{p.brand}</p>
                </div>
                <span className="text-sm font-medium text-text-primary shrink-0">{p.price} ₽</span>
              </Link>
            ))}
            {categories.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border-light">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/catalog/${c.slug}`} onClick={close}
                    className="block px-2 py-1.5 text-sm text-text-tertiary hover:text-accent-primary transition-colors">
                    Категория: {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
