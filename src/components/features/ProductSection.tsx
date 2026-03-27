'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import ProductCard from '@/components/features/ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  href?: string;
  onProductClick?: (product: Product) => void;
  variant?: 'grid' | 'carousel';
  className?: string;
}

function Carousel3D({ products, onCardClick, disableLink }: { products: Product[]; onCardClick?: (p: Product) => (e: React.MouseEvent) => void; disableLink: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => scroll('right'), 4000);
    return () => clearInterval(id);
  }, [paused, scroll]);

  if (products.length === 0) return null;

  return (
    <div
      className="relative max-w-7xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={scrollRef} className="overflow-x-auto snap-x snap-mandatory flex gap-5 px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[220px] md:w-[260px] snap-start flex-shrink-0"
            onClick={onCardClick ? onCardClick(product) : undefined}
          >
            <ProductCard product={product} disableLink={disableLink} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={() => scroll('left')} className="w-11 h-11 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="w-48 h-1.5 bg-border-light rounded-full overflow-hidden">
          <div className="h-full bg-accent-primary/60 rounded-full" style={{ width: '40%' }} />
        </div>
        <button onClick={() => scroll('right')} className="w-11 h-11 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const isLeft = direction === 'left';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? 'Назад' : 'Вперёд'}
      className={[
        'hidden md:flex absolute top-1/2 -translate-y-1/2 z-10',
        'w-10 h-10 rounded-full bg-bg-surface/90 backdrop-blur-sm',
        'items-center justify-center shadow-md',
        'hover:bg-bg-surface transition-colors',
        'text-text-secondary hover:text-text-primary',
        isLeft ? 'left-1' : 'right-1',
      ].join(' ')}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isLeft ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

export default function ProductSection({
  title,
  products,
  href,
  onProductClick,
  variant = 'grid',
  className = '',
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }, []);

  if (!products || products.length === 0) return null;

  const handleCardClick = (product: Product) => (e: React.MouseEvent) => {
    if (onProductClick) {
      e.preventDefault();
      onProductClick(product);
    }
  };

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      {/* Заголовок блок */}
      <div className="flex items-center justify-between mb-8 px-4 max-w-7xl mx-auto">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-accent-gold mt-2" />
        </div>
        {href && (
          <Link
            href={href}
            className="text-sm text-accent-primary hover:text-accent-hover transition-colors"
          >
            Смотреть все &rarr;
          </Link>
        )}
      </div>

      {/* Контент */}
      {variant === 'grid' ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} onClick={handleCardClick(product)}>
                <ProductCard product={product} disableLink={!!onProductClick} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Carousel3D products={products} onCardClick={onProductClick ? handleCardClick : undefined} disableLink={!!onProductClick} />
      )}
    </section>
  );
}
