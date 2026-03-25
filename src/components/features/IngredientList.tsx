'use client';

interface IngredientListProps {
  ingredients: string | null;
  keyIngredients: string[] | undefined;
  inciList: string | null;
  mode: 'compact' | 'full';
}

export default function IngredientList({
  ingredients,
  keyIngredients,
  inciList,
  mode,
}: IngredientListProps) {
  const parsedIngredients = ingredients
    ? ingredients.split(',').map((i) => i.trim()).filter(Boolean)
    : [];

  const displayKey = keyIngredients?.length
    ? keyIngredients
    : parsedIngredients;

  if (!displayKey.length && !inciList) return null;

  if (mode === 'compact') {
    if (!displayKey.length) return null;

    return (
      <p className="text-sm text-text-secondary">
        {displayKey.slice(0, 3).join(' \u00b7 ')}
      </p>
    );
  }

  const fullComposition = inciList || ingredients;

  return (
    <div>
      {displayKey.length > 0 && (
        <>
          <h3 className="font-heading text-lg mb-3 text-text-primary">
            Ключевые ингредиенты
          </h3>
          <ul className="list-disc pl-5 text-text-secondary mb-4">
            {displayKey.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {fullComposition && (
        <details>
          <summary className="text-sm text-text-tertiary cursor-pointer">
            Полный состав (INCI)
          </summary>
          <p className="text-xs text-text-tertiary leading-relaxed mt-2 p-3 bg-bg-secondary rounded-[var(--radius-sm)]">
            {fullComposition}
          </p>
        </details>
      )}
    </div>
  );
}
