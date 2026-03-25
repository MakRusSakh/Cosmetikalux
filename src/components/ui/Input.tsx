import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-0">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-text-secondary mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full px-4 py-2.5 text-text-primary bg-bg-surface',
              'border border-border-light rounded-[var(--radius-sm)]',
              'focus:border-accent-primary focus:ring-1 focus:ring-accent-primary',
              'outline-none transition-all duration-200',
              'placeholder:text-text-tertiary',
              icon ? 'pl-10' : '',
              error ? 'border-error' : '',
              className,
            ].join(' ')}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-error mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
