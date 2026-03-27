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
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const N = products.length;

  const next = useCallback(() => setActive((p) => (p + 1) % N), [N]);
  const prev = useCallback(() => setActive((p) => (p - 1 + N) % N), [N]);

  useEffect(() => {
    if (paused || N === 0) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next, N]);

  if (N === 0) return null;

  return (
    <div>
      <div
        className="relative h-[420px] md:h-[480px] mx-auto max-w-6xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ perspective: '1200px' }}
      >
        {products.map((product, i) => {
          let offset = i - active;
          if (offset > N / 2) offset -= N;
          if (offset < -N / 2) offset += N;
          const abs = Math.abs(offset);
          const isCenter = offset === 0;

          return (
            <div
              key={product.id}
              className="absolute left-1/2 top-1/2 w-[200px] md:w-[260px] transition-all duration-500 ease-out bg-bg-surface rounded-[var(--radius-md)] shadow-md"
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 230}px) translateZ(${isCenter ? 40 : -abs * 50}px) rotateY(${offset * -5}deg) scale(${isCenter ? 1.08 : Math.max(0.75, 1 - abs * 0.08)})`,
                zIndex: 20 - abs,
                opacity: abs > 3 ? 0 : 1 - abs * 0.15,
                filter: isCenter ? 'none' : `brightness(${1 - abs * 0.04})`,
                pointerEvents: abs > 3 ? 'none' : 'auto',
              }}
              onClick={isCenter ? (onCardClick ? onCardClick(product) : undefined) : (e) => { e.preventDefault(); setActive(i); }}
            >
              <ProductCard product={product} disableLink={disableLink || !isCenter} />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={prev} className="w-11 h-11 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex gap-2">
          {products.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`rounded-full transition-all duration-300 ${i === active ? 'w-8 h-2.5 bg-accent-primary' : 'w-2.5 h-2.5 bg-border-medium hover:bg-accent-light'}`} />
          ))}
        </div>
        <button onClick={next} className="w-11 h-11 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
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
