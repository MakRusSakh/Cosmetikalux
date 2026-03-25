interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'card';
  count?: number;
}

const variantStyles = {
  line: 'h-4 w-full rounded-[var(--radius-sm)]',
  circle: 'h-12 w-12 rounded-full',
  card: 'h-64 w-full rounded-[var(--radius-md)]',
} as const;

export default function Skeleton({
  className = '',
  variant = 'line',
  count = 1,
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={[
        'animate-pulse bg-bg-secondary',
        variantStyles[variant],
        className,
      ].join(' ')}
    />
  ));

  if (count === 1) return items[0];

  return <div className="flex flex-col gap-3">{items}</div>;
}
