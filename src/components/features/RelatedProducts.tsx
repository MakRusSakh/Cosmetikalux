'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types/product';
import ProductCard from '@/components/features/ProductCard';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function RelatedProducts({
  products,
  title = 'Вам также понравится',
}: RelatedProductsProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    function handleResize() {
      setVisibleCount(window.innerWidth >= 768 ? 4 : 2);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCount);

  useEffect(() => {
    if (scrollIndex > maxIndex) {
      setScrollIndex(maxIndex);
    }
  }, [maxIndex, scrollIndex]);

  const handlePrev = useCallback(() => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setScrollIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  if (products.length === 0) return null;

  /* Ширина одной карточки: на md 25%-18px, на mobile 50%-8px.
     Для translateX используем процентный сдвиг через calc-подобную логику.
     Проще: сдвигаем на (100/visibleCount)% за каждый шаг. */
  const stepPercent = 100 / visibleCount;
  const gapCompensation = visibleCount === 4 ? 24 : 16; // gap-6=24px, gap-4=16px
  const cardGapShift = gapCompensation * scrollIndex;

  return (
    <section className="py-12">
      {/* Заголовок + навигация */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          {title}
        </h2>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            aria-label="Назад"
            className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center hover:bg-accent-light hover:border-accent-primary transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={scrollIndex >= maxIndex}
            aria-label="Вперёд"
            className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center hover:bg-accent-light hover:border-accent-primary transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Карусель — десктоп */}
      <div className="hidden md:block overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${scrollIndex * stepPercent}% - ${cardGapShift}px))`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[calc(25%-18px)] shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Карусель — мобайл (touch scroll) */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[calc(50%-8px)] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
