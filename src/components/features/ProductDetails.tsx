import { Product } from '@/types/product';
import IngredientList from '@/components/features/IngredientList';
import RoutineStep from '@/components/features/RoutineStep';

interface ProductDetailsProps {
  product: Product;
}

const sectionCls =
  'bg-bg-surface border border-border-light rounded-[var(--radius-md)] p-6 mb-6';

export default function ProductDetails({ product }: ProductDetailsProps) {
  const hasIngredients =
    product.ingredients || product.keyIngredients?.length || product.inciList;
  const hasUsage = !!product.usage;
  const hasRoutine = product.routineStep !== null;

  return (
    <div>
      {/* Секция 1: О товаре */}
      <section className={sectionCls}>
        <h2 className="font-heading text-xl font-semibold mb-4">О товаре</h2>
        <p className="text-text-secondary leading-relaxed">
          {product.description}
        </p>
        {product.skinTypes.length > 0 && (
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

      {/* Секция 2: Состав и ингредиенты */}
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

      {/* Секция 3: Как применять */}
      <section className={sectionCls}>
        <h2 className="font-heading text-xl font-semibold mb-4">
          Как применять
        </h2>
        {hasRoutine && (
          <RoutineStep step={product.routineStep} mode="full" />
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
