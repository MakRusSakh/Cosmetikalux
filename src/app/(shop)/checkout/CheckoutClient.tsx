'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/stores/cartStore'
import Link from 'next/link'

const contactSchema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  email: z.string().email('Некорректный email').or(z.literal('')).optional(),
})
type ContactData = z.infer<typeof contactSchema>

const deliveryOptions = ['Самовывоз', 'Курьер', 'ПВЗ'] as const
const paymentOptions = ['Картой онлайн', 'СБП', 'При получении'] as const

const steps = ['Контакты', 'Доставка', 'Подтверждение']

const inputCls =
  'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary'

export default function CheckoutClient() {
  const { items, totalPrice } = useCartStore()
  const [step, setStep] = useState(1)
  const [delivery, setDelivery] = useState<(typeof deliveryOptions)[number]>('Самовывоз')
  const [address, setAddress] = useState({ city: '', street: '', apt: '', zip: '' })
  const [payment, setPayment] = useState<(typeof paymentOptions)[number]>('Картой онлайн')

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  })

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500 mb-4">Корзина пуста</p>
        <Link href="/catalog" className="text-accent-primary underline hover:opacity-80">
          Перейти в каталог
        </Link>
      </div>
    )
  }

  const onContactSubmit = () => setStep(2)

  const onOrder = () => {
    const contact = getValues()
    alert(
      `Заказ оформлен!\n${contact.name}, ${contact.phone}\nДоставка: ${delivery}\nОплата: ${payment}\nИтого: ${totalPrice().toLocaleString('ru-RU')} ₽`
    )
  }

  return (
    <div>
      {/* Индикатор шагов */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step >= i + 1 ? 'bg-accent-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Шаг 1 — Контакты */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-4">
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
          <button type="submit" className="w-full rounded-lg bg-accent-primary py-3 text-white font-semibold hover:opacity-90 transition">
            Далее
          </button>
        </form>
      )}

      {/* Шаг 2 — Доставка */}
      {step === 2 && (
        <div className="space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium mb-1">Способ доставки</legend>
            {deliveryOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={delivery === opt} onChange={() => setDelivery(opt)} className="accent-accent-primary" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </fieldset>
          {delivery === 'Курьер' && (
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Город" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={inputCls} />
              <input placeholder="Улица, дом" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className={inputCls} />
              <input placeholder="Квартира" value={address.apt} onChange={(e) => setAddress({ ...address, apt: e.target.value })} className={inputCls} />
              <input placeholder="Индекс" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className={inputCls} />
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold hover:bg-gray-50 transition">
              Назад
            </button>
            <button onClick={() => setStep(3)} className="flex-1 rounded-lg bg-accent-primary py-3 text-white font-semibold hover:opacity-90 transition">
              Далее
            </button>
          </div>
        </div>
      )}

      {/* Шаг 3 — Подтверждение */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-lg border border-gray-200 p-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Итого</span>
              <span>{totalPrice().toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium mb-1">Способ оплаты</legend>
            {paymentOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={payment === opt} onChange={() => setPayment(opt)} className="accent-accent-primary" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </fieldset>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold hover:bg-gray-50 transition">
              Назад
            </button>
            <button onClick={onOrder} className="flex-1 rounded-lg bg-accent-primary py-3 text-white font-semibold hover:opacity-90 transition">
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
