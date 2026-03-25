import type { Metadata } from 'next'
import { getProducts } from '@/lib/products'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'CosmetikaLux — Корейская косметика премиум-класса в Южно-Сахалинске',
  description:
    'Оригинальная корейская косметика с доставкой по всей России. Бестселлеры, новинки, уход за кожей и здоровье.',
}

export default function HomePage() {
  const bestsellers = getProducts({ sort: 'popular' }).products.slice(0, 8)
  const newArrivals = getProducts({ sort: 'new' }).products.slice(0, 8)
  const cosmetika = getProducts({ category: 'kosmetika', sort: 'popular' }).products.slice(0, 8)
  const zdorovye = getProducts({ category: 'zdorovye', sort: 'popular' }).products.slice(0, 8)

  return (
    <HomeClient
      bestsellers={bestsellers}
      newArrivals={newArrivals}
      cosmetika={cosmetika}
      zdorovye={zdorovye}
    />
  )
}
