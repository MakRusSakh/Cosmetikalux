import Link from 'next/link'

const cards = [
  { href: '/account/profile', label: 'Профиль', desc: 'Личные данные и настройки' },
  { href: '/account/orders', label: 'Заказы', desc: 'История покупок' },
  { href: '/account/favorites', label: 'Избранное', desc: 'Сохранённые товары' },
  { href: '/account/addresses', label: 'Адреса', desc: 'Адреса доставки' },
]

export default function AccountPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Мой кабинет</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="block rounded-[var(--radius-md)] border border-border-light bg-bg-surface p-5 hover:border-accent-primary transition-colors">
            <h2 className="font-heading text-lg font-semibold text-text-primary">{card.label}</h2>
            <p className="text-sm text-text-tertiary mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
