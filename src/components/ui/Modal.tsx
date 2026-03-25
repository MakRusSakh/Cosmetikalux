'use client';

import { type ReactNode, useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'max-w-[480px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[960px]',
} as const;

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={[
          'bg-bg-surface rounded-[var(--radius-lg)] shadow-xl w-full mx-auto relative p-6',
          'opacity-100 scale-100 transition-all duration-200',
          sizeMap[size],
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
          onClick={onClose}
          aria-label="Закрыть"
        >
          &#215;
        </button>
        {title && <h2 className="font-heading text-xl mb-4 text-text-primary">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
