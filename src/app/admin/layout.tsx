import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Дашборд' },
  { href: '/admin/products', label: 'Товары' },
  { href: '/admin/orders', label: 'Заказы' },
  { href: '/admin/clients', label: 'Клиенты' },
  { href: '/admin/promo', label: 'Промокоды' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#1A1A1A] text-white p-6 flex-shrink-0">
        <div className="font-heading text-lg font-bold mb-8 tracking-wide">
          CosmetikaLux Admin
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm py-2 px-2 rounded text-gray-300 hover:text-[#C8A2C8] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
