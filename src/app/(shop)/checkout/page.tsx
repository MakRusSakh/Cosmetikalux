import type { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Оформление заказа | CosmetikaLux',
  description: 'Оформите заказ корейской косметики с доставкой по России',
}

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8 text-center">
        Оформление заказа
      </h1>
      <CheckoutClient />
    </section>
  )
}
