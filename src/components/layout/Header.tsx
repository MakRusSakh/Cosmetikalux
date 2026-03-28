'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'
import { useUIStore } from '@/stores/uiStore'
import { useAuth } from '@/hooks/useAuth'
import MiniCart from '@/components/features/MiniCart'
import SearchBar from '@/components/features/SearchBar'

const navLinks = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/brands', label: 'Бренды' },
  { href: '/new', label: 'Новинки' },
  { href: '/sale', label: 'Акции', accent: true },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartCount = useCartStore((s) => s.totalItems())
  const openCart = useUIStore((s) => s.openCart)
  const toggleSearch = useUIStore((s) => s.toggleSearch)
  const { user, isAuthenticated, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-bg-surface/95 backdrop-blur-sm border-b border-border-light">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-heading text-xl font-bold text-text-primary tracking-wide">
          Cosmetika<span className="text-accent-primary">Lux</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors font-medium ${
                link.accent
                  ? 'text-accent-rose hover:text-accent-rose-hover'
                  : 'text-text-secondary hover:text-accent-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button onClick={toggleSearch} className="text-text-secondary hover:text-accent-primary transition-colors cursor-pointer" aria-label="Поиск">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Favorites */}
          <button className="text-text-secondary hover:text-accent-primary transition-colors cursor-pointer" aria-label="Избранное">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>

          {/* Account / Login */}
          {!isLoading && (
            isAuthenticated ? (
              <Link
                href="/account"
                className="text-sm text-text-secondary hover:text-accent-primary transition-colors font-medium hidden sm:flex items-center gap-1.5"
                aria-label="Личный кабинет"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="max-w-[80px] truncate">{user?.name ?? 'Профиль'}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-text-secondary hover:text-accent-primary transition-colors"
                aria-label="Войти"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )
          )}

          {/* Cart */}
          <button onClick={openCart} className="relative text-text-secondary hover:text-accent-primary transition-colors cursor-pointer" aria-label="Корзина">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent-primary text-text-inverse text-[10px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile burger */}
          <button
            className="md:hidden text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="absolute top-16 left-0 right-0 bg-bg-surface border-b border-border-light p-4 flex flex-col gap-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors font-medium ${
                link.accent
                  ? 'text-accent-rose hover:text-accent-rose-hover'
                  : 'text-text-secondary hover:text-accent-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      <MiniCart />
      <SearchBar />
    </header>
  )
}
