'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type Product } from '@/types/product';
import Modal from '@/components/ui/Modal';
import PriceDisplay from '@/components/ui/PriceDisplay';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import CountryFlag from '@/components/ui/CountryFlag';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  if (!product) return null;

  const keyIngr = product.keyIngredients?.slice(0, 4) ?? [];
  const desc = product.description?.slice(0, 200);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col md:flex-row gap-6 max-h-[80vh] overflow-y-auto">
        {/* Фото */}
        <div className="md:w-[45%] shrink-0">
          <div className="aspect-square relative rounded-[var(--radius-md)] overflow-hidden bg-bg-secondary">
            <Image
              src={product.images?.[0] ?? product.ogImage ?? ''}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>

        {/* Информация */}
        <div className="md:w-[55%] flex flex-col gap-3">
          <p className="text-xs uppercase tracking-wider text-text-tertiary">
            {product.brand}
          </p>

          <h2 className="font-heading text-lg font-semibold text-text-primary leading-tight">
            {product.name}
          </h2>

          {product.rating && (
            <StarRating score={product.rating.score} count={product.rating.count} size="sm" />
          )}

          <PriceDisplay price={product.price} oldPrice={product.oldPrice} size="md" />

          {/* Описание */}
          {desc && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {desc}{desc.length >= 200 ? '...' : ''}
            </p>
          )}

          {/* Ключевые ингредиенты */}
          {keyIngr.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                Ключевые ингредиенты
              </p>
              <div className="flex flex-wrap gap-1.5">
                {keyIngr.map((item) => (
                  <span key={item} className="text-xs px-2.5 py-1 bg-accent-light text-accent-primary rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Тип кожи */}
          {product.skinTypes && product.skinTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.skinTypes.map((type) => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            className="w-full bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-heading uppercase tracking-wider py-3 rounded-[var(--radius-md)] mt-2 transition-opacity hover:opacity-90"
          >
            В корзину
          </button>

          <Link
            href={`/catalog/${product.categorySlug}/${product.slug}`}
            className="text-sm text-accent-primary hover:text-accent-hover text-center"
            onClick={onClose}
          >
            Подробнее →
          </Link>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-text-tertiary pt-3 border-t border-border-light mt-auto">
            <CountryFlag countryCode={product.countryCode} />
            <span>Купили {product.purchaseCount} раз</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
