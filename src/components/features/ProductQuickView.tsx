'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type Product } from '@/types/product';
import Modal from '@/components/ui/Modal';
import PriceDisplay from '@/components/ui/PriceDisplay';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import CountryFlag from '@/components/ui/CountryFlag';
import IngredientList from '@/components/features/IngredientList';
import RoutineStep from '@/components/features/RoutineStep';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Image */}
        <div className="md:w-[55%] shrink-0">
          <div className="aspect-[4/5] relative rounded-[var(--radius-md)] overflow-hidden bg-bg-secondary">
            <Image
              src={product.images[0] ?? product.ogImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="md:w-[45%] flex flex-col">
          {/* Brand */}
          <p className="text-xs uppercase tracking-wider text-text-tertiary">
            {product.brand}
          </p>

          {/* Name */}
          <h2 className="font-heading text-xl font-semibold text-text-primary mt-1">
            {product.name}
          </h2>

          {/* Rating */}
          {product.rating && (
            <StarRating
              score={product.rating.score}
              count={product.rating.count}
              size="md"
              className="mt-2"
            />
          )}

          {/* Price */}
          <PriceDisplay
            price={product.price}
            oldPrice={product.oldPrice}
            pricePerUnit={product.pricePerUnit}
            size="md"
            className="mt-3"
          />

          {/* Skin Types */}
          {product.skinTypes && product.skinTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.skinTypes.map((type) => (
                <Badge key={type} variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
          )}

          {/* Routine Step */}
          <div className="mt-3">
            <RoutineStep step={typeof product.routineStep === 'number' ? product.routineStep : null} mode="compact" />
          </div>

          {/* Ingredients */}
          <div className="mt-3">
            <IngredientList
              ingredients={product.ingredients}
              keyIngredients={product.keyIngredients}
              inciList={product.inciList}
              mode="compact"
            />
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            className="w-full bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse font-heading uppercase tracking-wider py-3 rounded-[var(--radius-md)] mt-4 transition-opacity hover:opacity-90"
          >
            В корзину
          </button>

          {/* Details Link */}
          <Link
            href={`/catalog/${product.categorySlug}/${product.slug}`}
            className="text-sm text-accent-primary hover:text-accent-hover mt-2 text-center"
            onClick={onClose}
          >
            Подробнее &rarr;
          </Link>

          {/* Footer: Country + Purchase Count */}
          <div className="flex items-center justify-between text-xs text-text-tertiary mt-auto pt-4 border-t border-border-light">
            <CountryFlag countryCode={product.countryCode} />
            <span>Купили {product.purchaseCount} раз</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
