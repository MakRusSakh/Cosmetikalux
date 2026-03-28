import { describe, it, expect } from 'vitest'
import { getProducts, getProduct, hasNewImage } from '@/lib/products'
import type { Product } from '@/types/product'

describe('getProducts', () => {
  it('возвращает товары с сортировкой по умолчанию (popular)', async () => {
    const result = await getProducts()
    expect(result.products.length).toBeGreaterThan(0)
    expect(result.total).toBeGreaterThan(0)
    expect(result.page).toBe(1)
    for (let i = 1; i < result.products.length; i++) {
      expect(result.products[i - 1].purchaseCount).toBeGreaterThanOrEqual(
        result.products[i].purchaseCount
      )
    }
  })

  it('фильтрует по диапазону цен', async () => {
    const result = await getProducts({ minPrice: 500, maxPrice: 1500 })
    for (const p of result.products) {
      expect(p.price).toBeGreaterThanOrEqual(500)
      expect(p.price).toBeLessThanOrEqual(1500)
    }
  })

  it('ищет по названию', async () => {
    const all = await getProducts()
    const firstName = all.products[0].name.split(' ')[0]
    const result = await getProducts({ search: firstName })
    expect(result.products.length).toBeGreaterThan(0)
    for (const p of result.products) {
      const hay = `${p.name} ${p.brand} ${p.description ?? ''}`.toLowerCase()
      expect(hay).toContain(firstName.toLowerCase())
    }
  })

  it('пагинация возвращает корректную страницу', async () => {
    const p1 = await getProducts({ page: 1 })
    const p2 = await getProducts({ page: 2 })
    if (p1.totalPages > 1) {
      expect(p2.page).toBe(2)
      expect(p2.products[0]?.id).not.toBe(p1.products[0]?.id)
    }
  })
})

describe('getProduct', () => {
  it('находит товар по slug', async () => {
    const all = await getProducts()
    const slug = all.products[0].slug
    const product = await getProduct(slug)
    expect(product).toBeDefined()
    expect(product!.slug).toBe(slug)
  })

  it('возвращает undefined для несуществующего slug', async () => {
    const product = await getProduct('non-existent-slug-xyz')
    expect(product).toBeUndefined()
  })
})

describe('hasNewImage', () => {
  it('true если есть изображение из /images/categories/', () => {
    const product = { images: ['/images/categories/cream.jpg'] } as Product
    expect(hasNewImage(product)).toBe(true)
  })

  it('false если нет таких изображений', () => {
    const product = { images: ['/images/old/cream.jpg'] } as Product
    expect(hasNewImage(product)).toBe(false)
  })

  it('false если images пустой', () => {
    const product = { images: [] } as Product
    expect(hasNewImage(product)).toBe(false)
  })
})
