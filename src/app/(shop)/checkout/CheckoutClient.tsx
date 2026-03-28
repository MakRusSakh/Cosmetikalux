'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/stores/cartStore'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'

const FREE_DELIVERY = 3000
const contactSchema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  email: z.string().email('Некорректный email').or(z.literal('')).optional(),
})
type ContactData = z.infer<typeof contactSchema>

const deliveryOpts = [{ key: 'pickup', label: 'Самовывоз', note: 'бесплатно', cost: 0 }, { key: 'courier', label: 'Курьер', note: 'от 300 ₽', cost: 300 }, { key: 'pvz', label: 'Пункт выдачи', note: 'от 200 ₽', cost: 200 }] as const
const paymentOpts = ['Картой онлайн', 'СБП', 'При получении'] as const
const steps = ['Контакты', 'Доставка и оплата', 'Подтверждение']
const inputCls = 'w-full rounded-lg border border-gray-300 px-4 py-3.5 text-base focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary'
const btnPrimary = 'flex-1 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary py-4 text-base text-white font-semibold hover:opacity-90 transition font-heading'
const btnBack = 'flex-1 rounded-lg border border-gray-300 py-4 text-base font-semibold hover:bg-gray-50 transition font-heading'

function DeliveryProgress({ price, compact }: { price: number; compact?: boolean }) {
  const free = price >= FREE_DELIVERY
  const pct = Math.min(100, (price / FREE_DELIVERY) * 100)
  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <p className={`font-heading ${compact ? 'text-xs' : 'text-sm'} ${free ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
        {free ? '🎉 Бесплатная доставка!' : `До бесплатной доставки осталось ${(FREE_DELIVERY - price).toLocaleString('ru-RU')} ₽`}
      </p>
      <div className={`w-full ${compact ? 'h-1.5' : 'h-2'} bg-gray-200 rounded-full overflow-hidden`}>
        <div className={`h-full rounded-full transition-all ${free ? 'bg-green-500' : 'bg-accent-primary'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function CheckoutClient() {
  const router = useRouter()
  const { items, totalPrice } = useCartStore()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [delivery, setDelivery] = useState<string>('pickup')
  const [address, setAddress] = useState({ city: '', street: '', apt: '', zip: '' })
  const [payment, setPayment] = useState<string>('Картой онлайн')
  const [agreed, setAgreed] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<ContactData>({ resolver: zodResolver(contactSchema) })
  useEffect(() => { if (items.length === 0) router.replace('/cart') }, [items.length, router])
  useEffect(() => {
    if (isAuthenticated && user?.name) setValue('name', user.name)
    if (isAuthenticated && user?.email) setValue('email', user.email)
  }, [isAuthenticated, user, setValue])
  if (items.length === 0) return null
  const deliveryCost = deliveryOpts.find((d) => d.key === delivery)?.cost ?? 0
  const price = totalPrice()
  const total = price + deliveryCost
  const qty = items.reduce((s, i) => s + i.quantity, 0)
  const onOrder = () => {
    const c = getValues()
    alert(`Заказ оформлен!\n${c.name}, ${c.phone}\nДоставка: ${delivery}\nОплата: ${payment}\nИтого: ${total.toLocaleString('ru-RU')} ₽`)
  }
  const stepBtn = step < 3 ? () => step === 1 ? handleSubmit(() => setStep(2))() : setStep(3) : onOrder

  return (
    <div className="max-w-6xl mx-auto pb-36 md:pb-0">
      {/* Прогресс-бар */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            {i > 0 && <div className={`w-10 h-0.5 ${step > i ? 'bg-accent-primary' : 'bg-gray-200'}`} />}
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold font-heading ${step > i + 1 ? 'bg-accent-primary text-white' : step === i + 1 ? 'bg-accent-primary text-white ring-2 ring-accent-primary/30' : 'bg-gray-200 text-gray-400'}`}>{i + 1}</span>
            <span className="hidden sm:inline text-sm text-gray-500 font-heading">{label}</span>
          </div>
        ))}
      </div>

      {/* Мобильная мини-корзина */}
      <div className="md:hidden mb-4">
        <button onClick={() => setCartOpen(!cartOpen)} className="w-full flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-base font-heading">
          <span>Заказ · {total.toLocaleString('ru-RU')} ₽</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={cartOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} /></svg>
        </button>
        {cartOpen && <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          {items.map((item) => <div key={item.id} className="flex items-center gap-3">
            <Image src={item.image} alt={item.name} width={56} height={56} className="rounded-md object-cover flex-shrink-0" />
            <div className="min-w-0 flex-1"><p className="text-sm truncate">{item.name}</p><p className="text-xs text-gray-500">{item.quantity} × {item.price.toLocaleString('ru-RU')} ₽</p></div>
            <span className="text-base font-bold whitespace-nowrap">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
          </div>)}
        </div>}
      </div>

      {/* 2 колонки */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-[60%]">
          {step === 1 && (
            <form onSubmit={handleSubmit(() => setStep(2))} className="space-y-5">
              <h2 className="font-heading text-2xl font-bold">Контактные данные</h2>
              {isAuthenticated && user?.name && <p className="text-sm text-gray-600">Здравствуйте, {user.name}!</p>}
              {(['name', 'phone', 'email'] as const).map((f) => (
                <div key={f}>
                  <label className="block text-base font-semibold mb-2 font-heading">{f === 'name' ? 'Имя *' : f === 'phone' ? 'Телефон *' : 'Email'}</label>
                  <input {...register(f)} placeholder={f === 'name' ? 'Ваше имя' : f === 'phone' ? '+79001234567' : 'email@example.com'} className={inputCls} />
                  {errors[f] && <p className="text-red-500 text-xs mt-1">{errors[f]?.message}</p>}
                </div>
              ))}
              {!isAuthenticated && <p className="text-xs text-gray-400">Уже есть аккаунт? <Link href="/login" className="text-accent-primary underline">Войти</Link></p>}
              <button type="submit" className={`${btnPrimary} w-full`}>Далее</button>
            </form>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading text-2xl font-bold">Доставка</h2>
              <fieldset className="space-y-2">
                {deliveryOpts.map((opt) => (
                  <label key={opt.key} className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition ${delivery === opt.key ? 'border-accent-primary bg-accent-primary/5' : 'border-gray-200'}`}>
                    <input type="radio" name="delivery" checked={delivery === opt.key} onChange={() => setDelivery(opt.key)} className="accent-accent-primary" />
                    <span className="text-base font-medium">{opt.label}</span><span className="text-sm text-gray-400 ml-auto">{opt.note}</span>
                  </label>
                ))}
              </fieldset>
              {delivery === 'courier' && (
                <div className="grid grid-cols-2 gap-3">
                  {(['city', 'street', 'apt', 'zip'] as const).map((f) => (
                    <input key={f} placeholder={{ city: 'Город', street: 'Улица, дом', apt: 'Квартира', zip: 'Индекс' }[f]} value={address[f]} onChange={(e) => setAddress({ ...address, [f]: e.target.value })} className={inputCls} />
                  ))}
                </div>
              )}
              <h2 className="font-heading text-2xl font-bold pt-2">Оплата</h2>
              <fieldset className="space-y-2">
                {paymentOpts.map((opt) => (
                  <label key={opt} className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition ${payment === opt ? 'border-accent-primary bg-accent-primary/5' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" checked={payment === opt} onChange={() => setPayment(opt)} className="accent-accent-primary" />
                    <span className="text-base font-medium">{opt}</span>
                  </label>
                ))}
              </fieldset>
              <div className="flex gap-3"><button onClick={() => setStep(1)} className={btnBack}>Назад</button><button onClick={() => setStep(3)} className={btnPrimary}>Далее</button></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-heading text-2xl font-bold">Подтверждение заказа</h2>
              <div className="rounded-lg border border-gray-200 p-5 text-base space-y-2">
                <p><span className="text-gray-500">Контакт:</span> {getValues('name')}, {getValues('phone')}</p>
                <p><span className="text-gray-500">Доставка:</span> {deliveryOpts.find((d) => d.key === delivery)?.label}</p>
                <p><span className="text-gray-500">Оплата:</span> {payment}</p>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-accent-primary" />
                <span className="text-sm text-gray-500">Я согласен с <Link href="/terms" className="underline text-accent-primary">условиями</Link> обработки данных</span>
              </label>
              <div className="flex gap-3"><button onClick={() => setStep(2)} className={btnBack}>Назад</button><button onClick={onOrder} disabled={!agreed} className={`${btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed`}>Подтвердить заказ</button></div>
            </div>
          )}
        </div>

        {/* Правая колонка — desktop */}
        <div className="hidden md:block md:w-[40%]">
          <div className="sticky top-24 space-y-4">
            <DeliveryProgress price={price} />
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <h3 className="font-heading font-semibold text-base">Ваш заказ ({qty})</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={56} height={56} className="rounded-md object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1"><p className="text-sm truncate">{item.name}</p><p className="text-xs text-gray-500">{item.quantity} × {item.price.toLocaleString('ru-RU')} ₽</p></div>
                    <span className="text-base font-bold whitespace-nowrap">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Подитого</span><span>{price.toLocaleString('ru-RU')} ₽</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Доставка</span><span>{deliveryCost === 0 ? 'бесплатно' : `${deliveryCost.toLocaleString('ru-RU')} ₽`}</span></div>
                <div className="flex justify-between font-heading font-bold text-xl pt-2 border-t"><span>Итого</span><span>{total.toLocaleString('ru-RU')} ₽</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer — mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 space-y-2 z-50">
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-sm">{qty} товар{qty > 4 || qty === 0 ? 'ов' : qty > 1 ? 'а' : ''} на {total.toLocaleString('ru-RU')} ₽</span>
        </div>
        <DeliveryProgress price={price} compact />
        <button onClick={stepBtn} disabled={step === 3 && !agreed} className={`${btnPrimary} w-full disabled:opacity-40 disabled:cursor-not-allowed`}>
          {step < 3 ? 'Далее' : 'Подтвердить заказ'}
        </button>
      </div>
    </div>
  )
}
