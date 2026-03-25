'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import PriceDisplay from '@/components/ui/PriceDisplay';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  className?: string;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4.5 h-4.5 transition-colors duration-200"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const mainImage = product.images[0] ?? product.ogImage;
  const hasHitTag = product.tags.some((t) => t.toLowerCase() === 'хит');
  const hasNewTag = product.tags.some((t) => t.toLowerCase() === 'новинка');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite((prev) => !prev);
  };

  return (
    <Link
      href={`/catalog/${product.categorySlug}/${product.slug}`}
      className={`group block ${className}`}
    >
      {/* Фото-блок */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-bg-secondary mb-3">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Бейджи */}
        {(hasHitTag || hasNewTag || discount) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasHitTag && <Badge variant="hit">Хит</Badge>}
            {hasNewTag && <Badge variant="new">New</Badge>}
            {discount && <Badge variant="sale">-{discount}%</Badge>}
          </div>
        )}

        {/* Кнопка избранное */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          className={[
            'absolute top-2 right-2 w-8 h-8 rounded-full',
            'bg-bg-surface/80 backdrop-blur-sm',
            'flex items-center justify-center',
            'hover:bg-bg-surface transition-colors duration-200',
            isFavorite ? 'text-accent-rose' : 'text-text-tertiary',
          ].join(' ')}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>

      {/* Бренд */}
      <p className="text-xs uppercase tracking-wider text-text-tertiary mb-1 truncate">
        {product.brand}
      </p>

      {/* Название */}
      <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-accent-primary transition-colors">
        {product.name}
      </h3>

      {/* Рейтинг */}
      {product.rating.count > 0 && (
        <StarRating
          score={product.rating.score}
          count={product.rating.count}
          size="sm"
          className="mb-2"
        />
      )}

      {/* Цена */}
      <PriceDisplay
        price={product.price}
        oldPrice={product.oldPrice}
        size="sm"
      />
    </Link>
  );
}
