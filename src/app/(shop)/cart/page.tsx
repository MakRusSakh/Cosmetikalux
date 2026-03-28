'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'

const FREE_SHIPPING_THRESHOLD = 3000

function formatPrice(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

function ShippingProgress({ sum, compact }: { sum: number; compact?: boolean }) {
  const remaining = FREE_SHIPPING_THRESHOLD - sum
  const progress = Math.min(sum / FREE_SHIPPING_THRESHOLD, 1) * 100
  const isFree = sum >= FREE_SHIPPING_THRESHOLD

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-border-light rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${isFree ? 'bg-success' : 'bg-accent-gold'}`} style={{ width: `${progress}%` }} />
        </div>
        <span className={`text-xs font-heading whitespace-nowrap ${isFree ? 'text-success font-semibold' : 'text-text-secondary'}`}>
          {isFree ? 'Бесплатная доставка!' : `ещё ${formatPrice(remaining)}`}
        </span>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <p className={`text-sm font-heading mb-1.5 ${isFree ? 'text-success font-semibold' : 'text-text-secondary'}`}>
        {isFree ? '🎉 Бесплатная доставка!' : `До бесплатной доставки осталось ${formatPrice(remaining)}`}
      </p>
      <div className="h-2.5 bg-border-light rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${isFree ? 'bg-success' : 'bg-accent-gold'}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default function CartPage() {
  const { items, remove, updateQty, totalItems, totalPrice } = useCartStore()
  const count = totalItems()
  const sum = totalPrice()

  if (count === 0) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <svg className="w-20 h-20 text-text-tertiary mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.2a1 1 0 00.9 1.3h11a1 1 0 00.9-1.3L17 13M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">Ваша корзина пуста</h1>
        <p className="text-text-secondary mb-8">Самое время начать покупки</p>
        <Link href="/catalog" className="inline-flex items-center justify-center min-h-[44px] font-heading uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse px-8 py-3.5 text-lg transition-all duration-200 hover:opacity-90">
          Перейти в каталог
        </Link>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
        Корзина <span className="text-text-tertiary text-lg font-normal">({count})</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Items */}
        <div className="md:w-2/3 space-y-0">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-5 border-b border-border-light">
              <Link href={`/catalog/${item.categorySlug}/${item.slug}`} className="shrink-0">
                <div className="w-24 h-24 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden">
                  <Image src={item.image} alt={item.name} width={96} height={96} className="w-full h-full object-cover" />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-text-primary line-clamp-2 text-base leading-snug">{item.name}</h3>
                    <p className="text-xs text-text-tertiary mt-0.5">{item.brand}</p>
                    <p className="text-lg font-bold font-heading text-text-primary mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-text-tertiary hover:text-error transition-colors shrink-0 p-1" aria-label="Удалить">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-border-light rounded-[var(--radius-md)]">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-base text-text-secondary hover:text-text-primary transition-colors">−</button>
                    <span className="w-10 text-center text-base font-heading font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-base text-text-secondary hover:text-text-primary transition-colors">+</button>
                  </div>
                  <p className="font-heading text-lg font-bold text-text-primary">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="md:w-1/3">
          <div className="bg-bg-surface border border-border-light rounded-lg p-6 md:sticky md:top-20">
            <h2 className="font-heading text-lg font-bold text-text-primary mb-4">Ваш заказ</h2>

            <ShippingProgress sum={sum} />

            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>Товаров</span>
              <span>{count} шт</span>
            </div>
            <div className="flex justify-between text-sm text-text-secondary mb-4">
              <span>Сумма</span>
              <span>{formatPrice(sum)}</span>
            </div>

            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Промокод" className="flex-1 min-w-0 border border-border-light rounded-[var(--radius-md)] px-3 py-2 text-sm bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary transition-colors" />
              <button className="shrink-0 font-heading text-sm font-semibold uppercase tracking-wider text-accent-primary border border-accent-primary rounded-[var(--radius-md)] px-4 py-2 hover:bg-accent-light transition-colors">
                Применить
              </button>
            </div>

            <hr className="border-border-light mb-4" />

            <div className="flex justify-between items-center mb-5">
              <span className="font-heading text-base font-semibold text-text-primary">Итого</span>
              <span className="font-heading text-xl font-bold text-text-primary">{formatPrice(sum)}</span>
            </div>

            <Link href="/checkout" className="flex items-center justify-center w-full min-h-[44px] font-heading uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse py-4 text-base transition-all duration-200 hover:opacity-90">
              Оформить заказ
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-light shadow-lg p-4 md:hidden z-40">
        <ShippingProgress sum={sum} compact />
        <div className="flex items-center justify-between mt-2">
          <span className="font-heading text-sm text-text-primary">{count} товаров на <b>{formatPrice(sum)}</b></span>
          <Link href="/checkout" className="font-heading uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-gradient-to-r from-accent-primary to-accent-rose text-text-inverse px-6 py-3 text-sm transition-all duration-200 hover:opacity-90">
            Оформить
          </Link>
        </div>
      </div>
      <div className="h-28 md:hidden" />
    </section>
  )
}
