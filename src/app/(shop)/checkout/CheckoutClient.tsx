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
import { ChevronDown, ChevronUp } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  email: z.string().email('Некорректный email').or(z.literal('')).optional(),
})
type ContactData = z.infer<typeof contactSchema>

const deliveryOpts = [{ key: 'pickup', label: 'Самовывоз', note: 'бесплатно', cost: 0 }, { key: 'courier', label: 'Курьер', note: 'от 300 ₽', cost: 300 }, { key: 'pvz', label: 'Пункт выдачи', note: 'от 200 ₽', cost: 200 }] as const
const paymentOpts = ['Картой онлайн', 'СБП', 'При получении'] as const
const steps = ['Контакты', 'Доставка и оплата', 'Подтверждение']
const inputCls = 'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary'
const btnPrimary = 'flex-1 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary py-3 text-white font-semibold hover:opacity-90 transition font-heading'
const btnBack = 'flex-1 rounded-lg border border-gray-300 py-3 font-semibold hover:bg-gray-50 transition font-heading'

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
  const total = totalPrice() + deliveryCost
  const onOrder = () => {
    const c = getValues()
    alert(`Заказ оформлен!\n${c.name}, ${c.phone}\nДоставка: ${delivery}\nОплата: ${payment}\nИтого: ${total.toLocaleString('ru-RU')} ₽`)
  }

  /* ---- Мини-корзина ---- */
  const MiniCart = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="font-heading font-semibold text-sm">Ваш заказ ({items.reduce((s, i) => s + i.quantity, 0)})</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md object-cover flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.quantity} × {item.price.toLocaleString('ru-RU')} ₽</p>
            </div>
            <span className="text-xs font-medium whitespace-nowrap">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Подитого</span><span>{totalPrice().toLocaleString('ru-RU')} ₽</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Доставка</span><span>{deliveryCost === 0 ? 'бесплатно' : `${deliveryCost.toLocaleString('ru-RU')} ₽`}</span></div>
        <div className="flex justify-between font-heading font-bold text-base pt-1 border-t"><span>Итого</span><span>{total.toLocaleString('ru-RU')} ₽</span></div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Прогресс-бар */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && <div className={`w-8 h-0.5 ${step > i ? 'bg-accent-primary' : 'bg-gray-200'}`} />}
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step > i + 1 ? 'bg-accent-primary text-white' : step === i + 1 ? 'bg-accent-primary text-white ring-2 ring-accent-primary/30' : 'bg-gray-200 text-gray-400'}`}>{i + 1}</span>
            <span className="hidden sm:inline text-xs text-gray-500 font-heading">{label}</span>
          </div>
        ))}
      </div>

      {/* Мобильная мини-корзина (сворачиваемая) */}
      <div className="md:hidden mb-4">
        <button onClick={() => setCartOpen(!cartOpen)} className="w-full flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-heading">
          <span>Заказ · {total.toLocaleString('ru-RU')} ₽</span>
          {cartOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {cartOpen && <div className="mt-2"><MiniCart /></div>}
      </div>

      {/* 2 колонки */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Левая — форма */}
        <div className="md:w-3/5">
          {/* Шаг 1 */}
          {step === 1 && (
            <form onSubmit={handleSubmit(() => setStep(2))} className="space-y-4">
              <h2 className="font-heading text-lg font-bold">Контактные данные</h2>
              {isAuthenticated && user?.name && <p className="text-sm text-gray-600">Здравствуйте, {user.name}!</p>}
              <div>
                <label className="block text-sm font-medium mb-1">Имя *</label>
                <input {...register('name')} placeholder="Ваше имя" className={inputCls} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Телефон *</label>
                <input {...register('phone')} placeholder="+79001234567" className={inputCls} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register('email')} placeholder="email@example.com" className={inputCls} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              {!isAuthenticated && <p className="text-xs text-gray-400">Уже есть аккаунт? <Link href="/login" className="text-accent-primary underline">Войти</Link></p>}
              <button type="submit" className={`${btnPrimary} w-full`}>Далее</button>
            </form>
          )}

          {/* Шаг 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-bold">Доставка</h2>
              <fieldset className="space-y-2">
                {deliveryOpts.map((opt) => (
                  <label key={opt.key} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${delivery === opt.key ? 'border-accent-primary bg-accent-primary/5' : 'border-gray-200'}`}>
                    <input type="radio" name="delivery" checked={delivery === opt.key} onChange={() => setDelivery(opt.key)} className="accent-accent-primary" />
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">{opt.note}</span>
                  </label>
                ))}
              </fieldset>
              {delivery === 'courier' && (
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Город" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={inputCls} />
                  <input placeholder="Улица, дом" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className={inputCls} />
                  <input placeholder="Квартира" value={address.apt} onChange={(e) => setAddress({ ...address, apt: e.target.value })} className={inputCls} />
                  <input placeholder="Индекс" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className={inputCls} />
                </div>
              )}
              <h2 className="font-heading text-lg font-bold pt-2">Оплата</h2>
              <fieldset className="space-y-2">
                {paymentOpts.map((opt) => (
                  <label key={opt} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${payment === opt ? 'border-accent-primary bg-accent-primary/5' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" checked={payment === opt} onChange={() => setPayment(opt)} className="accent-accent-primary" />
                    <span className="text-sm font-medium">{opt}</span>
                  </label>
                ))}
              </fieldset>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className={btnBack}>Назад</button>
                <button onClick={() => setStep(3)} className={btnPrimary}>Далее</button>
              </div>
            </div>
          )}

          {/* Шаг 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold">Подтверждение заказа</h2>
              <div className="rounded-lg border border-gray-200 p-4 text-sm space-y-2">
                <p><span className="text-gray-500">Контакт:</span> {getValues('name')}, {getValues('phone')}</p>
                <p><span className="text-gray-500">Доставка:</span> {deliveryOpts.find((d) => d.key === delivery)?.label}</p>
                <p><span className="text-gray-500">Оплата:</span> {payment}</p>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-accent-primary" />
                <span className="text-xs text-gray-500">Я согласен с <Link href="/terms" className="underline text-accent-primary">условиями</Link> обработки данных</span>
              </label>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className={btnBack}>Назад</button>
                <button onClick={onOrder} disabled={!agreed} className={`${btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed`}>Подтвердить заказ</button>
              </div>
            </div>
          )}
        </div>

        {/* Правая — мини-корзина (desktop) */}
        <div className="hidden md:block md:w-2/5">
          <div className="sticky top-24"><MiniCart /></div>
        </div>
      </div>
    </div>
  )
}
