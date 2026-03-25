'use client'

import { useState } from 'react'
import type { Product } from '@/types/product'
import AnnouncementBar from '@/components/features/AnnouncementBar'
import HeroSection from '@/components/features/HeroSection'
import TrustBar from '@/components/features/TrustBar'
import CategoryShowcase from '@/components/features/CategoryShowcase'
import ProductSection from '@/components/features/ProductSection'
import BrandsStrip from '@/components/features/BrandsStrip'
import NewsletterSection from '@/components/features/NewsletterSection'
import ProductQuickView from '@/components/features/ProductQuickView'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface HomeClientProps {
  bestsellers: Product[]
  newArrivals: Product[]
  cosmetika: Product[]
  zdorovye: Product[]
}

export default function HomeClient({
  bestsellers,
  newArrivals,
  cosmetika,
  zdorovye,
}: HomeClientProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <CategoryShowcase />

        <ProductSection
          title="Бестселлеры"
          products={bestsellers}
          href="/catalog?sort=popular"
          onProductClick={setQuickViewProduct}
          variant="carousel"
        />

        <ProductSection
          title="Новинки"
          products={newArrivals}
          href="/catalog?sort=new"
          onProductClick={setQuickViewProduct}
          variant="grid"
          className="bg-bg-tertiary"
        />

        <ProductSection
          title="Уход за кожей"
          products={cosmetika}
          href="/catalog/kosmetika"
          onProductClick={setQuickViewProduct}
        />

        <ProductSection
          title="Здоровье и витамины"
          products={zdorovye}
          href="/catalog/zdorovye"
          onProductClick={setQuickViewProduct}
        />

        <BrandsStrip />
        <NewsletterSection />
      </main>

      <Footer />

      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
