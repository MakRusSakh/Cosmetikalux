import { Product } from '@/types/product';

interface ProductSpecsProps {
  product: Product;
}

interface SpecRow {
  label: string;
  value: string | undefined;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const rows: SpecRow[] = [
    { label: 'Бренд', value: product.brand },
    { label: 'Страна', value: product.country },
    { label: 'Объём', value: product.unit },
    {
      label: 'Тип кожи',
      value: product.skinTypes.length ? product.skinTypes.join(', ') : undefined,
    },
    { label: 'Артикул', value: product.externalId },
    {
      label: 'Шаг ухода',
      value:
        product.routineStep !== null ? `Шаг ${product.routineStep}` : undefined,
    },
  ];

  const visibleRows = rows.filter((r) => r.value);

  if (!visibleRows.length) return null;

  return (
    <div className="bg-bg-surface border border-border-light rounded-[var(--radius-md)] p-6">
      <h2 className="font-heading text-xl font-semibold mb-4">
        Характеристики
      </h2>
      <dl className="divide-y divide-border-light">
        {visibleRows.map((row) => (
          <div key={row.label} className="flex py-3">
            <dt className="w-1/3 text-sm text-text-tertiary">{row.label}</dt>
            <dd className="flex-1 text-sm text-text-secondary">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
