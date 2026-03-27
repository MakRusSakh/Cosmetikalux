import type { Metadata } from 'next'
import { hasNewImage } from '@/lib/products'
import type { Product } from '@/types/product'
import productsData from '@/data/products.json'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'CosmetikaLux — Корейская косметика премиум-класса в Южно-Сахалинске',
  description:
    'Оригинальная корейская косметика с доставкой по всей России. Бестселлеры, новинки, уход за кожей и здоровье.',
}

export default function HomePage() {
  const all = (productsData as unknown as Product[]).filter((p) => p.isActive && hasNewImage(p))

  const byPopular = [...all].sort((a, b) => b.purchaseCount - a.purchaseCount)
  const byNew = [...all].sort((a, b) => b.id.localeCompare(a.id))

  const bestsellers = byPopular.slice(0, 8)
  const newArrivals = byNew.slice(0, 8)
  const cosmetika = byPopular.slice(8, 16)
  const zdorovye = byPopular.slice(16, 24)

  return (
    <HomeClient
      bestsellers={bestsellers}
      newArrivals={newArrivals}
      cosmetika={cosmetika}
      zdorovye={zdorovye}
    />
  )
}
