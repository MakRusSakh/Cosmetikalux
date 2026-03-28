import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/stores/cartStore'

const mockItem = {
  id: 'prod_001',
  name: 'Крем для лица',
  price: 1200,
  image: '/images/cream.jpg',
  slug: 'cream-face',
  categorySlug: 'uhod',
  brand: 'COSRX',
}

const mockItem2 = {
  id: 'prod_002',
  name: 'Тонер с муцином',
  price: 890,
  image: '/images/toner.jpg',
  slug: 'toner-mucin',
  categorySlug: 'uhod',
  brand: 'COSRX',
}

beforeEach(() => {
  useCartStore.setState({ items: [] })
})

describe('cartStore', () => {
  it('добавляет товар в корзину', () => {
    useCartStore.getState().add(mockItem)
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(1)
    expect(items[0].name).toBe('Крем для лица')
  })

  it('увеличивает количество при повторном добавлении', () => {
    const { add } = useCartStore.getState()
    add(mockItem)
    add(mockItem)
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('удаляет товар из корзины', () => {
    useCartStore.getState().add(mockItem)
    useCartStore.getState().add(mockItem2)
    useCartStore.getState().remove('prod_001')
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('prod_002')
  })

  it('обновляет количество товара', () => {
    useCartStore.getState().add(mockItem)
    useCartStore.getState().updateQty('prod_001', 5)
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('удаляет товар при updateQty <= 0', () => {
    useCartStore.getState().add(mockItem)
    useCartStore.getState().updateQty('prod_001', 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('очищает корзину', () => {
    useCartStore.getState().add(mockItem)
    useCartStore.getState().add(mockItem2)
    useCartStore.getState().clear()
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('считает общее количество товаров', () => {
    useCartStore.getState().add(mockItem)
    useCartStore.getState().add(mockItem)
    useCartStore.getState().add(mockItem2)
    expect(useCartStore.getState().totalItems()).toBe(3)
  })

  it('считает общую стоимость', () => {
    useCartStore.getState().add(mockItem)
    useCartStore.getState().add(mockItem)
    useCartStore.getState().add(mockItem2)
    expect(useCartStore.getState().totalPrice()).toBe(1200 * 2 + 890)
  })
})
