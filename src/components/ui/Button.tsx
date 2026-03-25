'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

const variants = {
  primary:
    'bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse hover:opacity-90',
  secondary:
    'border border-accent-primary text-accent-primary bg-transparent hover:bg-accent-light',
  ghost:
    'bg-transparent text-text-secondary hover:bg-accent-light',
} as const;

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center',
        'font-heading uppercase tracking-wider font-semibold',
        'rounded-[var(--radius-md)]',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
