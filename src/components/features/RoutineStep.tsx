const STEPS: Record<number, string> = {
  1: 'Очищение маслом',
  2: 'Пенка',
  3: 'Тонер',
  4: 'Эссенция',
  5: 'Сыворотка',
  6: 'Ампула',
  7: 'Маска',
  8: 'Крем для глаз',
  9: 'Крем/SPF',
};

interface RoutineStepProps {
  step: number | null;
  mode: 'compact' | 'full';
  className?: string;
}

export default function RoutineStep({ step, mode, className }: RoutineStepProps) {
  if (step === null) return null;

  if (mode === 'compact') {
    return (
      <p className={`text-sm text-text-tertiary ${className ?? ''}`}>
        <span aria-hidden>💧</span> Шаг {step}: {STEPS[step] ?? `Шаг ${step}`}
      </p>
    );
  }

  const stepIds = Object.keys(STEPS).map(Number);

  return (
    <div className={`flex items-center gap-0 ${className ?? ''}`}>
      {stepIds.map((id, i) => (
        <div key={id} className="flex items-center flex-1 last:flex-initial">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                id === step
                  ? 'bg-accent-primary text-text-inverse'
                  : 'bg-bg-secondary text-text-tertiary'
              }`}
            >
              {id}
            </div>
            <span className="text-[10px] text-center mt-1 max-w-[60px] text-text-tertiary">
              {STEPS[id]}
            </span>
          </div>
          {i < stepIds.length - 1 && (
            <div className="h-0.5 bg-border-light flex-1 mx-1 self-start mt-4" />
          )}
        </div>
      ))}
    </div>
  );
}
