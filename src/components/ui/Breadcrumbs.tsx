import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ label: 'Главная', href: '/' }, ...items];

  return (
    <nav
      className="flex items-center gap-1.5 text-xs md:text-sm overflow-x-auto whitespace-nowrap py-2"
      aria-label="Хлебные крошки"
      style={{ scrollbarWidth: 'none' }}
    >
      {allItems.map((item, idx) => {
        const isLast = idx === allItems.length - 1;

        return (
          <span key={idx} className="flex items-center gap-1.5 shrink-0">
            {idx > 0 && (
              <span className="text-text-tertiary/50">/</span>
            )}
            {isLast || !item.href ? (
              <span className="text-text-secondary font-medium max-w-[200px] md:max-w-none truncate">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-text-tertiary hover:text-accent-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
