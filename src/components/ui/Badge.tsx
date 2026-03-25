import { type ReactNode } from 'react';

const variants = {
  hit: 'bg-accent-light text-accent-primary',
  new: 'bg-accent-rose-light text-accent-rose',
  sale: 'bg-red-50 text-error',
  outline: 'border border-border-medium text-text-tertiary',
} as const;

type Variant = keyof typeof variants;

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'hit',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5',
        'text-xs font-medium',
        'rounded-[var(--radius-full)]',
        variants[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
