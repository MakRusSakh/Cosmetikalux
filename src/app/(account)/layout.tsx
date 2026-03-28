import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const navItems = [
  { href: '/account/profile', label: 'Профиль' },
  { href: '/account/orders', label: 'Заказы' },
  { href: '/account/favorites', label: 'Избранное' },
  { href: '/account/addresses', label: 'Адреса' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex gap-4 overflow-x-auto pb-4 md:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="font-heading text-sm text-text-secondary whitespace-nowrap hover:text-accent-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="font-heading text-sm text-text-secondary hover:text-accent-primary transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  )
}
