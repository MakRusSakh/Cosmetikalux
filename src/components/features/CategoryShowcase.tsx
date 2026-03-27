'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { title: 'Увлажнение', slug: 'kosmetika', count: '120+ средств', bg: '#E8E0F0', image: '/images/hero/hero_003_uvlazhnenie.png' },
  { title: 'Против акне', slug: 'lechebnye', count: '45 средств', bg: '#E8D8F0', image: '/images/hero/hero_004_protiv_akne.png' },
  { title: 'Anti-age', slug: 'kosmetika', count: '60 средств', bg: '#F0E8E0', image: '/images/hero/hero_002_anti_age.png' },
  { title: 'Очищение', slug: 'kosmetika', count: '55 средств', bg: '#F0EBE6', image: '/images/hero/hero_005_chistota_por.png' },
  { title: 'SPF-защита', slug: 'kosmetika', count: '30 средств', bg: '#F0E4D8', image: '/images/hero/hero_006_spf_zashchita.png' },
  { title: 'Пигментация', slug: 'kosmetika', count: '35 средств', bg: '#FDF2F2', image: null },
  { title: 'Чувствительная кожа', slug: 'kosmetika', count: '40 средств', bg: '#F0E4F0', image: null },
  { title: 'Уход за телом', slug: 'kosmetika', count: '70 средств', bg: '#E3F2FD', image: null },
];

const N = categories.length;

export default function CategoryShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((p) => (p + 1) % N), []);
  const prev = useCallback(() => setActive((p) => (p - 1 + N) % N), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary text-center">
          Подберём уход под вашу задачу
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mx-auto mt-2" />
      </div>

      <div
        className="relative h-[320px] md:h-[380px] mx-auto max-w-6xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ perspective: '1200px' }}
      >
        {categories.map((cat, i) => {
          let offset = i - active;
          if (offset > N / 2) offset -= N;
          if (offset < -N / 2) offset += N;
          const abs = Math.abs(offset);
          const isCenter = offset === 0;

          return (
            <Link
              key={cat.title}
              href={`/catalog/${cat.slug}`}
              onClick={(e) => { if (!isCenter) { e.preventDefault(); setActive(i); } }}
              className="absolute left-1/2 top-1/2 w-[180px] md:w-[240px] rounded-[var(--radius-lg)] overflow-hidden shadow-lg transition-all duration-500 ease-out cursor-pointer"
              style={{
                backgroundColor: cat.bg,
                transform: `translate(-50%, -50%) translateX(${offset * 200}px) translateZ(${isCenter ? 50 : -abs * 60}px) rotateY(${offset * -6}deg) scale(${isCenter ? 1.15 : Math.max(0.7, 1 - abs * 0.1)})`,
                zIndex: 20 - abs,
                opacity: abs > 3 ? 0 : 1 - abs * 0.15,
                filter: isCenter ? 'none' : `brightness(${1 - abs * 0.05})`,
                pointerEvents: abs > 3 ? 'none' : 'auto',
              }}
            >
              <div className="aspect-[4/3] relative">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.title} fill className="object-cover" sizes="240px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-bg-surface/50 border border-border-light" />
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-heading text-sm font-semibold text-text-primary">{cat.title}</h3>
                <p className="font-heading text-xs text-text-tertiary mt-0.5">{cat.count}</p>
              </div>
            </Link>
          );
        })}

        <button onClick={prev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button onClick={next} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-bg-surface/90 shadow-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {categories.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className={`rounded-full transition-all duration-300 ${i === active ? 'w-8 h-2.5 bg-accent-primary' : 'w-2.5 h-2.5 bg-border-medium hover:bg-accent-light'}`} />
        ))}
      </div>
    </section>
  );
}
