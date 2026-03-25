interface StarRatingProps {
  score: number;
  count: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
  className?: string;
}

const starSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4.5 h-4.5',
} as const;

function StarIcon({ className, clipPercent }: { className: string; clipPercent?: number }) {
  const style = clipPercent !== undefined
    ? { clipPath: `inset(0 ${100 - clipPercent}% 0 0)` }
    : undefined;

  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
    </svg>
  );
}

export default function StarRating({
  score,
  count,
  size = 'md',
  showCount = true,
  className = '',
}: StarRatingProps) {
  const full = Math.floor(score);
  const partial = score - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);
  const sizeClass = starSizes[size];

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: full }, (_, i) => (
        <StarIcon key={`f${i}`} className={`${sizeClass} text-accent-gold`} />
      ))}
      {partial > 0 && (
        <span className="relative inline-block">
          <StarIcon className={`${sizeClass} text-border-medium`} />
          <span className="absolute inset-0">
            <StarIcon className={`${sizeClass} text-accent-gold`} clipPercent={Math.round(partial * 100)} />
          </span>
        </span>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <StarIcon key={`e${i}`} className={`${sizeClass} text-border-medium`} />
      ))}
      {showCount && (
        <span className="text-text-tertiary text-xs ml-1">({count})</span>
      )}
    </div>
  );
}
