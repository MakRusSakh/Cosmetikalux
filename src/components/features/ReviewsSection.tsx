'use client';

import { useState, useCallback } from 'react';
import StarRating from '@/components/ui/StarRating';

const reviews = [
  { name: 'Дарья', age: 26, city: 'Новосибирск', product: 'HERA UV Mist Cushion', rating: 5, text: 'Наконец нашла кушон для своего тона кожи! HERA ложится как вторая кожа, держится весь день.' },
  { name: 'Анна', age: 28, city: 'Владивосток', product: 'Sulwhasoo First Care', rating: 4, text: 'Отличный тонер, кожа стала гладкой и свежее. Единственное — хотелось бы больше объём, уходит быстро.' },
  { name: 'Елена', age: 41, city: 'Сахалинск', product: 'Some By Mi Toner', rating: 5, text: 'Заказываю уже третий раз. Веснушки за 4 дня, всё в прошлом. Серьёзно. Сервис на высоте!' },
  { name: 'Ирина', age: 45, city: 'Москва', product: 'Medi-Peel Peptide 9', rating: 5, text: 'Крем с пептидами — лучшее, что я пробовала. Морщинки стали менее заметны уже через 2 недели.' },
  { name: 'Ольга', age: 33, city: 'Краснодар', product: 'COSRX Snail Mucin', rating: 5, text: 'Муцин улитки — это магия. Кожа стала бархатной, воспаления прошли. Рекомендую всем!' },
  { name: 'Светлана', age: 31, city: 'Хабаровск', product: 'Laneige Lip Mask', rating: 5, text: 'Маска для губ — маст-хэв! Губы ягодный, хватает на год, аромат восхитительный.' },
  { name: 'Марина', age: 38, city: 'Екатеринбург', product: 'Dr.Jart+ Ceramidin', rating: 5, text: 'Спас мою кожу зимой. Барьер восстановился за неделю, сухость как рукой сняло.' },
];

function ArrowButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Предыдущий отзыв' : 'Следующий отзыв'}
      className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-bg-surface shadow-sm border border-border-light hover:border-accent-primary/40 transition-colors"
    >
      <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {direction === 'left'
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  const maxIndex = reviews.length - 3;

  const prev = useCallback(() => setActive((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setActive((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  return (
    <section className="bg-gradient-to-b from-bg-primary to-bg-secondary py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-text-primary">
          Что говорят наши покупатели
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mx-auto mt-2 mb-10" />

        {/* Carousel */}
        <div className="flex items-center gap-4">
          <ArrowButton direction="left" onClick={prev} />

          {/* Mobile: scroll snap / Desktop: translate */}
          <div className="flex-1 overflow-hidden">
            {/* Mobile */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
              {reviews.map((r, i) => (
                <ReviewCard key={i} review={r} />
              ))}
            </div>
            {/* Desktop */}
            <div className="hidden md:block">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${active * (100 / 3 + 2)}%)` }}
              >
                {reviews.map((r, i) => (
                  <ReviewCard key={i} review={r} />
                ))}
              </div>
            </div>
          </div>

          <ArrowButton direction="right" onClick={next} />
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Показать отзывы с ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === active ? 'bg-accent-primary' : 'bg-border-medium'
              }`}
            />
          ))}
        </div>

        {/* Summary badge */}
        <div className="flex justify-center mt-8">
          <div className="bg-bg-surface rounded-full px-6 py-2 shadow-sm flex items-center gap-2 text-sm text-text-secondary">
            <span className="text-accent-gold">&#9733;</span>
            <span className="font-semibold text-text-primary">4.8</span>
            <span>&middot; 237 отзывов &middot; 98% рекомендуют</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface Review {
  name: string;
  age: number;
  city: string;
  product: string;
  rating: number;
  text: string;
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="min-w-[85%] md:min-w-0 md:w-1/3 flex-shrink-0 snap-center">
      <div className="bg-bg-surface rounded-[var(--radius-lg)] p-6 shadow-sm h-full flex flex-col">
        {/* Quote mark */}
        <span className="text-4xl text-accent-primary/30 font-heading leading-none select-none">&ldquo;</span>

        {/* Stars */}
        <div className="mt-1">
          <StarRating score={review.rating} count={0} size="sm" showCount={false} />
        </div>

        {/* Review text */}
        <p className="font-heading text-sm text-text-secondary leading-relaxed italic mt-3 flex-1">
          {review.text}
        </p>

        {/* Divider */}
        <div className="h-px bg-border-light mt-4 mb-3" />

        {/* Author */}
        <p className="font-heading font-semibold text-text-primary">{review.name}</p>
        <p className="text-xs text-text-tertiary">{review.age} лет, {review.city}</p>
        <p className="text-xs text-accent-primary uppercase mt-1">{review.product}</p>
      </div>
    </div>
  );
}
