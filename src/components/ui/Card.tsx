import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
}: CardProps) {
  return (
    <div
      className={[
        'bg-bg-surface border border-border-light rounded-[var(--radius-md)] shadow-sm',
        hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
