'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/stores/cartStore'
import { useUIStore } from '@/stores/uiStore'

export default function MiniCart() {
  const { items, remove, updateQty, totalItems, totalPrice } = useCartStore()
  const { isCartOpen, closeCart } = useUIStore()

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={closeCart}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-bg-surface shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h2 className="font-heading text-lg font-semibold text-text-primary">
            Корзина ({totalItems()})
          </h2>
          <button
            onClick={closeCart}
            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Закрыть корзину"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-text-muted text-sm">Корзина пуста</p>
            <Link
              href="/catalog"
              onClick={closeCart}
              className="text-sm font-medium text-accent-primary hover:text-accent-primary-hover transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <ul className="flex-1 overflow-y-auto divide-y divide-border-light px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <div className="relative w-[60px] h-[60px] shrink-0 rounded-lg overflow-hidden bg-bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="60px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">{item.name}</p>
                    <p className="text-sm text-text-muted mt-0.5">{item.price.toLocaleString('ru-RU')} ₽</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-border-light text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors text-xs cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-sm text-text-primary w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-border-light text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="self-start text-text-muted hover:text-accent-rose transition-colors cursor-pointer"
                    aria-label="Удалить"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-border-light px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm font-semibold text-text-primary">
                <span>Итого</span>
                <span>{totalPrice().toLocaleString('ru-RU')} ₽</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center py-2.5 rounded-xl bg-accent-primary text-text-inverse text-sm font-medium hover:bg-accent-primary-hover transition-colors"
              >
                Оформить заказ
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-center text-sm text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
              >
                Продолжить покупки
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
