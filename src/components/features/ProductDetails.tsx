import { Product } from '@/types/product';
import IngredientList from '@/components/features/IngredientList';
import RoutineStep from '@/components/features/RoutineStep';

interface ProductDetailsProps {
  product: Product;
}

const sectionCls =
  'bg-bg-surface border border-border-light rounded-[var(--radius-md)] p-6 mb-6 font-heading';

function parseDescription(desc: string) {
  const lines = desc.split('\n').filter((l) => l.trim());
  const headline = lines[0] || '';
  const benefits: string[] = [];
  const paragraphs: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('◈')) {
      benefits.push(line.replace(/^◈\s*/, ''));
    } else if (line.length > 20) {
      paragraphs.push(line);
    }
  }

  return { headline, benefits, paragraphs };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const hasIngredients =
    product.ingredients || product.keyIngredients?.length || product.inciList;
  const hasUsage = !!product.usage;
  const hasRoutine = typeof product.routineStep === 'number';
  const desc = product.description || '';
  const hasStructured = desc.includes('◈');
  const parsed = hasStructured ? parseDescription(desc) : null;

  return (
    <div>
      <section className={sectionCls}>
        <h2 className="font-heading text-xl font-semibold mb-4">О товаре</h2>

        {parsed ? (
          <div>
            <p className="text-lg font-medium text-text-primary mb-4">
              {parsed.headline}
            </p>
            {parsed.benefits.length > 0 && (
              <ul className="space-y-2 mb-5">
                {parsed.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-text-secondary">
                    <span className="text-accent-primary mt-0.5 shrink-0">◈</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {parsed.paragraphs.map((p, i) => (
              <p key={i} className="text-text-secondary leading-relaxed mb-3">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {desc}
          </p>
        )}

        {product.skinTypes?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {product.skinTypes.map((type) => (
              <span
                key={type}
                className="text-xs px-3 py-1 rounded-full bg-bg-secondary text-text-tertiary"
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className={sectionCls}>
        <h2 className="font-heading text-xl font-semibold mb-4">
          Состав и ингредиенты
        </h2>
        {hasIngredients ? (
          <IngredientList
            mode="full"
            ingredients={product.ingredients}
            keyIngredients={product.keyIngredients}
            inciList={product.inciList}
          />
        ) : (
          <p className="text-text-tertiary italic">Состав уточняется</p>
        )}
      </section>

      <section className={sectionCls}>
        <h2 className="font-heading text-xl font-semibold mb-4">
          Как применять
        </h2>
        {hasRoutine && (
          <RoutineStep step={typeof product.routineStep === 'number' ? product.routineStep : null} mode="full" />
        )}
        {hasUsage && (
          <p className="text-text-secondary leading-relaxed mt-4">
            {product.usage}
          </p>
        )}
        {!hasUsage && !hasRoutine && (
          <p className="text-text-tertiary italic">
            Следуйте инструкции на упаковке
          </p>
        )}
      </section>
    </div>
  );
}
