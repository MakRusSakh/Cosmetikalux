'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { title: 'Увлажнение', slug: 'kosmetika', count: '120+ средств', bg: 'bg-[#E8E0F0]', image: '/images/hero/hero_003_uvlazhnenie.png' },
  { title: 'Против акне', slug: 'lechebnye', count: '45 средств', bg: 'bg-[#E8D8F0]', image: '/images/hero/hero_004_protiv_akne.png' },
  { title: 'Anti-age', slug: 'kosmetika', count: '60 средств', bg: 'bg-[#F0E8E0]', image: '/images/hero/hero_002_anti_age.png' },
  { title: 'Очищение', slug: 'kosmetika', count: '55 средств', bg: 'bg-[#F0EBE6]', image: '/images/hero/hero_005_chistota_por.png' },
  { title: 'SPF-защита', slug: 'kosmetika', count: '30 средств', bg: 'bg-[#F0E4D8]', image: '/images/hero/hero_006_spf_zashchita.png' },
  { title: 'Пигментация', slug: 'kosmetika', count: '35 средств', bg: 'bg-[#FDF2F2]', image: null },
  { title: 'Чувствительная кожа', slug: 'kosmetika', count: '40 средств', bg: 'bg-[#F0E4F0]', image: null },
  { title: 'Уход за телом', slug: 'kosmetika', count: '70 средств', bg: 'bg-[#E3F2FD]', image: null },
];

// Triple the array for infinite scroll illusion
const items = [...categories, ...categories, ...categories];

export default function CategoryShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start at the middle set
    const cardWidth = 260 + 16; // w + gap
    el.scrollLeft = cardWidth * categories.length;

    let animId: number;
    let speed = 0.5;

    function animate() {
      if (!el || isHovered.current) {
        animId = requestAnimationFrame(animate);
        return;
      }

      el.scrollLeft += speed;

      // Loop: if scrolled past 2nd set, jump back to 1st set
      const oneSetWidth = cardWidth * categories.length;
      if (el.scrollLeft >= oneSetWidth * 2) {
        el.scrollLeft -= oneSetWidth;
      }
      if (el.scrollLeft <= 0) {
        el.scrollLeft += oneSetWidth;
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
          Подберём уход под вашу задачу
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mt-2" />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden px-4"
        onMouseEnter={() => { isHovered.current = true; }}
        onMouseLeave={() => { isHovered.current = false; }}
        style={{ scrollBehavior: 'auto' }}
      >
        {items.map((cat, i) => (
          <Link
            key={`${cat.title}-${i}`}
            href={`/catalog/${cat.slug}`}
            className={`flex-shrink-0 w-[240px] md:w-[260px] rounded-[var(--radius-lg)] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${cat.bg}`}
          >
            <div className="aspect-[4/3] relative">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-bg-surface/50 border border-border-light" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-heading text-sm font-semibold text-text-primary">
                {cat.title}
              </h3>
              <p className="font-heading text-xs text-text-tertiary mt-0.5">
                {cat.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
