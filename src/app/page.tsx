import type { Metadata } from 'next'
import { getProducts, hasNewImage } from '@/lib/products'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'CosmetikaLux — Корейская косметика премиум-класса в Южно-Сахалинске',
  description:
    'Оригинальная корейская косметика с доставкой по всей России. Бестселлеры, новинки, уход за кожей и здоровье.',
}

export default function HomePage() {
  const allPopular = getProducts({ sort: 'popular' }).products
  const allNew = getProducts({ sort: 'new' }).products
  const allCosmetika = getProducts({ category: 'kosmetika', sort: 'popular' }).products
  const allZdorovye = getProducts({ category: 'zdorovye', sort: 'popular' }).products

  // На главной — только товары с обновлёнными фото
  const bestsellers = allPopular.filter(hasNewImage).slice(0, 8)
  const newArrivals = allNew.filter(hasNewImage).slice(0, 8)
  const cosmetika = allCosmetika.filter(hasNewImage).slice(0, 8)
  const zdorovye = allZdorovye.filter(hasNewImage).slice(0, 8)

  return (
    <HomeClient
      bestsellers={bestsellers}
      newArrivals={newArrivals}
      cosmetika={cosmetika}
      zdorovye={zdorovye}
    />
  )
}
