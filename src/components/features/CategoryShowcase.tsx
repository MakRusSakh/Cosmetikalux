'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { title: 'Увлажнение', slug: 'kosmetika', count: '120+ средств', bg: 'bg-[#E8E0F0]', image: '/images/hero/hero_003_uvlazhnenie.png' },
  { title: 'Против акне', slug: 'lechebnye', count: '45 средств', bg: 'bg-[#E8D8F0]', image: '/images/hero/hero_004_protiv_akne.png' },
  { title: 'Anti-age', slug: 'kosmetika', count: '60 средств', bg: 'bg-[#F0E8E0]', image: '/images/hero/hero_002_anti_age.png' },
  { title: 'Очищение', slug: 'kosmetika', count: '55 средств', bg: 'bg-[#F0EBE6]', image: '/images/hero/hero_005_chistota_por.png' },
  { title: 'SPF-защита', slug: 'kosmetika', count: '30 средств', bg: 'bg-[#F0E4D8]', image: '/images/hero/hero_006_spf_zashchita.png' },
];

export default function CategoryShowcase() {
  const [active, setActive] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % categories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
          Подберём уход под вашу задачу
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mt-2 mb-12" />
      </div>

      {/* 3D Carousel */}
      <div
        className="relative h-[340px] md:h-[400px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: '1200px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {categories.map((cat, i) => {
            const offset = i - active;
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            return (
              <Link
                key={cat.title}
                href={`/catalog/${cat.slug}`}
                onClick={(e) => {
                  if (!isActive) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                className={`absolute w-[220px] md:w-[280px] rounded-[var(--radius-lg)] overflow-hidden shadow-lg transition-all duration-500 ease-out ${cat.bg}`}
                style={{
                  transform: `translateX(${offset * 240}px) translateZ(${isActive ? 60 : -absOffset * 80}px) rotateY(${offset * -8}deg) scale(${isActive ? 1.1 : 1 - absOffset * 0.08})`,
                  zIndex: 10 - absOffset,
                  opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.15,
                  filter: isActive ? 'none' : `blur(${absOffset * 0.5}px)`,
                }}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                </div>
                <div className="p-4 bg-bg-surface/80 backdrop-blur-sm">
                  <h3 className="font-heading text-base font-semibold text-text-primary">
                    {cat.title}
                  </h3>
                  <p className="font-heading text-xs text-text-tertiary mt-0.5">
                    {cat.count}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setActive((prev) => (prev - 1 + categories.length) % categories.length)}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={() => setActive((prev) => (prev + 1) % categories.length)}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active ? 'w-8 h-2.5 bg-accent-primary' : 'w-2.5 h-2.5 bg-border-medium hover:bg-accent-light'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
