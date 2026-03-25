interface PriceDisplayProps {
  price: number;
  oldPrice?: number | null;
  pricePerUnit?: string | number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const priceSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
} as const;

function formatPrice(value: number): string {
  return value.toLocaleString('ru-RU') + ' ₽';
}

export default function PriceDisplay({
  price,
  oldPrice = null,
  pricePerUnit = null,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const discount = oldPrice
    ? Math.round((1 - price / oldPrice) * 100)
    : null;

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-heading font-bold text-text-primary ${priceSizes[size]}`}>
          {formatPrice(price)}
        </span>
        {oldPrice && discount ? (
          <>
            <span className="line-through text-text-tertiary text-sm">
              {formatPrice(oldPrice)}
            </span>
            <span className="bg-error/10 text-error rounded-full px-2 py-0.5 text-xs font-medium">
              -{discount}%
            </span>
          </>
        ) : null}
      </div>
      {pricePerUnit ? (
        <span className="text-xs text-text-tertiary mt-0.5">{pricePerUnit}</span>
      ) : null}
    </div>
  );
}
