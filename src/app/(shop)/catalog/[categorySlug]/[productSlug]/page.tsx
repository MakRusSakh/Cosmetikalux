import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProduct, getRelatedProducts } from '@/lib/products'
import ProductGallery from '@/components/features/ProductGallery'
import ProductDetails from '@/components/features/ProductDetails'
import ProductSpecs from '@/components/features/ProductSpecs'
import RelatedProducts from '@/components/features/RelatedProducts'
import PriceDisplay from '@/components/ui/PriceDisplay'
import StarRating from '@/components/ui/StarRating'
import CountryFlag from '@/components/ui/CountryFlag'
import Badge from '@/components/ui/Badge'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import AddToCartButton from './AddToCartButton'

interface PageProps {
  params: Promise<{ categorySlug: string; productSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productSlug } = await params
  const product = await getProduct(productSlug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: { images: [{ url: product.ogImage }] },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { categorySlug, productSlug } = await params
  const product = await getProduct(productSlug)
  if (!product) notFound()

  const related = await getRelatedProducts(product, 8)

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Каталог', href: '/catalog' },
          { label: product.category, href: `/catalog/${categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Галерея */}
        <div className="md:w-[55%]">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Информация */}
        <div className="md:w-[45%]">
          <p className="text-xs uppercase tracking-wider text-text-tertiary mb-2">
            {product.brand}
          </p>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">
            {product.name}
          </h1>
          <StarRating
            score={product.rating.score}
            count={product.rating.count}
            size="md"
            className="mb-4"
          />
          <PriceDisplay
            price={product.price}
            oldPrice={product.oldPrice}
            pricePerUnit={product.pricePerUnit}
            size="lg"
            className="mb-6"
          />

          {product.skinTypes?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.skinTypes.map((type) => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))}
            </div>
          )}

          {product.unit && (
            <p className="text-sm text-text-secondary mb-6">{product.unit}</p>
          )}

          <AddToCartButton productId={product.id} productName={product.name} />

          <div className="mt-6 p-4 bg-bg-tertiary rounded-[var(--radius-md)] text-sm text-text-secondary">
            🚚 Доставка по Южно-Сахалинску — бесплатно от 3000₽
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-text-tertiary">
            <CountryFlag countryCode={product.countryCode} />
            <span>Купили {product.purchaseCount} раз</span>
          </div>
        </div>
      </div>

      {/* Стрелка "скролл вниз" */}
      <div className="hidden md:flex justify-center mt-8 animate-bounce">
        <a href="#details" className="text-accent-primary hover:text-accent-hover transition-colors">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </a>
      </div>

      {/* Описание, состав, применение */}
      <div id="details" className="mt-8 border-t border-border-light pt-8">
        <ProductDetails product={product} />
      </div>

      {/* Характеристики */}
      <div className="mt-8">
        <ProductSpecs product={product} />
      </div>

      {/* Похожие товары */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-border-light pt-8">
          <RelatedProducts products={related} />
        </div>
      )}
    </main>
  )
}
