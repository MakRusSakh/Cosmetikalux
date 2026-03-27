import type { Metadata } from 'next'
import { getProducts, hasNewImage } from '@/lib/products'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'CosmetikaLux — Корейская косметика премиум-класса в Южно-Сахалинске',
  description:
    'Оригинальная корейская косметика с доставкой по всей России. Бестселлеры, новинки, уход за кожей и здоровье.',
}

export default function HomePage() {
  // Все товары с обновлёнными фото
  const allWithNewImg = getProducts({ sort: 'popular' }).products.filter(hasNewImage)
  const allNewByDate = getProducts({ sort: 'new' }).products.filter(hasNewImage)

  const bestsellers = allWithNewImg.slice(0, 8)
  const newArrivals = allNewByDate.slice(0, 8)
  const cosmetika = allWithNewImg.slice(8, 16)
  const zdorovye = allWithNewImg.slice(16, 24)

  return (
    <HomeClient
      bestsellers={bestsellers}
      newArrivals={newArrivals}
      cosmetika={cosmetika}
      zdorovye={zdorovye}
    />
  )
}
