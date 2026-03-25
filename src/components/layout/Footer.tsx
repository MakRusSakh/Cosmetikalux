import Link from 'next/link'

const catalogLinks = [
  { href: '/catalog/face', label: 'Уход за лицом' },
  { href: '/catalog/body', label: 'Уход за телом' },
  { href: '/catalog/makeup', label: 'Макияж' },
  { href: '/brands', label: 'Бренды' },
]

const customerLinks = [
  { href: '/delivery', label: 'Доставка' },
  { href: '/payment', label: 'Оплата' },
  { href: '/returns', label: 'Возврат' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <p className="font-heading text-lg font-bold text-text-primary tracking-wide mb-3">
              Cosmetika<span className="text-accent-primary">Lux</span>
            </p>
            <p className="text-sm text-text-tertiary leading-relaxed">
              Оригинальная корейская и японская косметика премиум-класса в Южно-Сахалинске.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Каталог</h4>
            <ul className="flex flex-col gap-2">
              {catalogLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-tertiary hover:text-accent-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customers */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Покупателям</h4>
            <ul className="flex flex-col gap-2">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-tertiary hover:text-accent-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Контакты</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-tertiary">
              <li>г. Южно-Сахалинск</li>
              <li>+7 (4242) 00-00-00</li>
              <li>info@cosmetikalux.ru</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-light mt-8 pt-6 text-center text-xs text-text-tertiary">
          &copy; 2024 CosmetikaLux. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
