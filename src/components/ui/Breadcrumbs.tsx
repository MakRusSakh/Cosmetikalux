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
    <nav className="flex items-center gap-2 text-sm" aria-label="Хлебные крошки">
      {allItems.map((item, idx) => {
        const isLast = idx === allItems.length - 1;

        return (
          <span key={idx} className="flex items-center gap-2">
            {idx > 0 && (
              <span className="text-text-tertiary/50">/</span>
            )}
            {isLast || !item.href ? (
              <span className="text-text-secondary font-medium">{item.label}</span>
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
