# Инструкция: Разработка модального окна и страницы товара

> Референс: `PRODUCT_DISPLAY_SPEC.md` (макеты), `DESIGN_SYSTEM.md` (токены), `TECHNICAL_SPECIFICATION.md` (модели)

---

## 1. Общая архитектура

```
src/
├── components/
│   ├── atoms/
│   │   ├── Badge.tsx              # Бейджи: тип кожи, хит, новинка, скидка
│   │   ├── PriceDisplay.tsx       # Цена + старая цена + скидка% + ₽/мл
│   │   ├── StarRating.tsx         # Звёзды + кол-во отзывов
│   │   └── CountryFlag.tsx        # 🇰🇷/🇯🇵 + «Оригинал»
│   ├── molecules/
│   │   ├── ProductCard.tsx        # Карточка в каталоге (уже в задаче 2.4)
│   │   ├── ProductQuickView.tsx   # МОДАЛКА — новый компонент
│   │   ├── IngredientList.tsx     # 3-5 ингредиентов + скрытый INCI
│   │   ├── RoutineStep.tsx        # Визуальная цепочка шагов рутины
│   │   └── ReviewSummary.tsx      # Рейтинг-бар + мини-отзывы
│   └── organisms/
│       ├── ProductGallery.tsx     # Галерея фото: зум, свайп, видео
│       ├── ProductInfo.tsx        # Блок info справа от галереи (PDP)
│       ├── ProductTabs.tsx        # Табы/аккордеон: состав, применение
│       └── RoutineBuilder.tsx     # «Собери рутину» — кросс-селл
├── app/(shop)/
│   └── catalog/
│       └── [categorySlug]/
│           └── [productSlug]/
│               └── page.tsx       # СТРАНИЦА ТОВАРА (SSR)
└── stores/
    └── uiStore.ts                 # quickViewProductId: string | null
```

---

## 2. Модальное окно (ProductQuickView)

### 2.1 Открытие/закрытие

```typescript
// stores/uiStore.ts — добавить в существующий стор
interface UIState {
  quickViewProductId: string | null
  openQuickView: (productId: string) => void
  closeQuickView: () => void
}
```

**Триггер:** клик по карточке товара в каталоге (`ProductCard.tsx`).
**Закрытие:** клик по `×`, клик по оверлею, Escape.
**Анимация:** `opacity 0→1` (200ms) + `scale 0.95→1` (200ms, ease-out).

### 2.2 Загрузка данных

```typescript
// React Query — загрузка при открытии модалки
const { data: product } = useQuery({
  queryKey: ['product', productId],
  queryFn: () => fetchProduct(productId),
  enabled: !!productId,  // загрузка только когда модалка открыта
  staleTime: 5 * 60 * 1000, // кеш 5 мин
})
```

**Скелетон:** пока грузится — показать `Skeleton` (фото-область + 4 строки текста).

### 2.3 Разметка модалки

```
Десктоп: max-w-[960px] h-auto, flex flex-row
Мобайл: fixed bottom-0, h-[85vh], flex flex-col, rounded-t-[--radius-lg]
```

| Зона | Десктоп | Мобайл |
|------|---------|--------|
| Фото | LEFT, 55% ширины, aspect-[4/5] | TOP, 100% ширины, aspect-[1/1] |
| Инфо | RIGHT, 45%, overflow-y-auto | BELOW, scroll |
| CTA | В потоке инфо | Fixed bottom bar, h-16 |

### 2.4 Элементы инфо-блока (строгий порядок)

```tsx
<div className="flex flex-col gap-[--space-4]">
  {/* 1. Бренд */}
  <span className="text-caption text-secondary uppercase tracking-wider">
    {product.brand.name}
  </span>

  {/* 2. Название */}
  <h3 className="font-playfair text-h5 font-semibold text-primary">
    {product.name}
  </h3>

  {/* 3. Рейтинг */}
  <StarRating rating={product.avgRating} count={product.reviewCount} />

  {/* 4. Цена */}
  <PriceDisplay
    price={product.price}
    oldPrice={product.oldPrice}
    volume={product.volume}   // для расчёта ₽/мл
  />

  {/* 5. Объём */}
  <span className="text-body-small text-secondary">
    📦 {product.volume}
  </span>

  {/* 6. Бейджи: тип кожи */}
  <div className="flex gap-2 flex-wrap">
    {product.skinTypes.map(type => (
      <Badge key={type} variant="outline">{skinTypeLabel[type]}</Badge>
    ))}
  </div>

  {/* 7. Шаг рутины (только для категории «Уход за лицом») */}
  {product.routineStep && (
    <RoutineStep step={product.routineStep} compact />
  )}

  {/* 8. Ключевые ингредиенты (3 шт макс) */}
  <IngredientList ingredients={product.keyIngredients} max={3} compact />

  {/* 9. CTA */}
  <Button
    variant="cta"
    size="lg"
    className="w-full bg-gradient-cta"
    onClick={() => addToCart(product.id)}
  >
    🛒 В корзину
  </Button>

  {/* 10. Избранное */}
  <button onClick={() => toggleFavorite(product.id)}>
    ♡ В избранное
  </button>

  {/* 11. Ссылка на PDP */}
  <Link href={`/catalog/${product.categorySlug}/${product.slug}`}>
    → Подробнее о товаре
  </Link>

  {/* 12. Страна + социальный триггер */}
  <div className="flex justify-between text-caption text-tertiary">
    <CountryFlag country={product.country} brand={product.brand.name} />
    <span>🔥 Купили {product.purchaseCount} раз</span>
  </div>
</div>
```

### 2.5 Стили модалки

```css
/* Оверлей */
.quick-view-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Модалка */
.quick-view-modal {
  background: var(--bg-surface);        /* #FFFFFF */
  border-radius: var(--radius-lg);      /* 20px */
  box-shadow: var(--shadow-xl);
  max-width: 960px;
  max-height: 90vh;
}

/* CTA-кнопка */
.btn-cta {
  background: linear-gradient(135deg, #C8A2C8 0%, #E8C4C4 100%);
  color: var(--text-inverse);           /* #FFFFFF */
  font: 600 16px/24px 'Playfair Display';
  padding: var(--space-4) var(--space-6); /* 16px 32px */
  border-radius: var(--radius-sm);      /* 6px */
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 162, 200, 0.4);
}
```

---

## 3. Страница товара (PDP)

### 3.1 Серверный компонент (SSR)

```
Файл: src/app/(shop)/catalog/[categorySlug]/[productSlug]/page.tsx
Рендеринг: SSR — актуальные цены и остатки
SEO: generateMetadata() + JSON-LD (Product, BreadcrumbList, AggregateRating)
```

```typescript
// page.tsx — серверный компонент
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.productSlug)
  return {
    title: product.seoTitle || `${product.name} — CosmetikaLux`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      images: [product.images.find(i => i.isMain)?.url],
    },
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.productSlug)
  const related = await getRelatedProducts(product.id)
  return (
    <>
      <Breadcrumbs product={product} />
      <ProductHero product={product} />       {/* Above the fold */}
      <ProductDetails product={product} />    {/* Блоки 1-3 */}
      <ReviewsSection product={product} />    {/* Блок 4 */}
      <RoutineBuilder product={product} related={related} /> {/* Блок 5 */}
      <ProductSpecs product={product} />      {/* Блок 6 */}
      <JsonLd product={product} />
    </>
  )
}
```

### 3.2 Блок Above the Fold — ProductHero

**Десктоп:** 2 колонки — галерея (55%) + инфо (45%).
**Мобайл:** stacked — галерея сверху, инфо снизу, sticky CTA-бар.

```
Компонент: src/components/organisms/ProductGallery.tsx
```

| Элемент | Компонент | Токены |
|---------|-----------|--------|
| Галерея | `ProductGallery` | radius-md, aspect-[4/5] |
| Бренд | `<span>` uppercase | caption, text-secondary, tracking-wider |
| Название | `<h1>` | h3 (32px/40px/600), text-primary |
| Рейтинг | `StarRating` | accent-gold (#C9A96E) |
| Цена | `PriceDisplay` | price (28px/700), old-price strike |
| Количество | `QuantitySelector` | radius-sm, border-medium |
| CTA | `Button variant="cta"` | gradient-cta, radius-sm |
| Избранное | `FavoriteButton` | accent-rose on active |
| Доставка | Info-бар | bg-tertiary (#FFF8F5), radius-md |
| Аутентичность | `CountryFlag` + текст | text-secondary |

### 3.3 Блок 1: О товаре

```tsx
<section className="space-y-[--space-5]">
  {/* Краткое описание: 2-3 предложения */}
  <p className="text-body-large text-secondary">
    {product.shortDescription}
  </p>

  {/* Бейджи */}
  <div className="flex gap-3 flex-wrap">
    {product.skinTypes.map(t => <Badge icon="🧴">{label}</Badge>)}
    {product.ageGroup && <Badge icon="📅">{product.ageGroup}</Badge>}
    {product.isVegan && <Badge icon="🌿">Веган</Badge>}
  </div>
</section>
```

### 3.4 Блок 2: Ключевые ингредиенты

**3 слоя:** герой-ингредиенты → описание на простом языке → полный INCI (скрытый).

```tsx
<section>
  <h2 className="text-h5">Ключевые ингредиенты</h2>

  {/* Слой 1+2: герой-ингредиенты с описанием */}
  {product.keyIngredients.map(ing => (
    <div className="flex items-start gap-3">
      <span className="text-accent-lavender">🔬</span>
      <div>
        <span className="font-semibold">{ing.name} {ing.concentration}</span>
        <span className="text-secondary"> — {ing.benefit}</span>
      </div>
    </div>
  ))}

  {/* Слой 3: полный INCI */}
  <details>
    <summary className="text-body-small text-tertiary cursor-pointer">
      Полный состав (INCI)
    </summary>
    <p className="text-caption text-tertiary mt-2">
      {product.composition}
    </p>
  </details>
</section>
```

### 3.5 Блок 3: Как использовать + шаг рутины

```tsx
<section>
  <h2 className="text-h5">Как использовать</h2>

  {/* Визуальная цепочка рутины */}
  {product.routineStep && (
    <RoutineStep step={product.routineStep} full />
    // Показывает все 9 шагов, текущий выделен accent-lavender
    // [1]→[2]→[3]→[4]→[5]→[6]→[★7★]→[8]→[9]
    // Каждый шаг кликабелен → ведёт на товары этого шага
  )}

  {/* Инструкция */}
  <p className="text-body text-secondary">
    {product.application}
  </p>

  {/* Совет по типу кожи */}
  {product.skinTip && (
    <div className="bg-tertiary rounded-[--radius-md] p-[--space-4]">
      💡 <strong>Совет:</strong> {product.skinTip}
    </div>
  )}
</section>
```

### 3.6 Блок 4: Отзывы

```
Компонент: src/components/organisms/ReviewsSection.tsx
Данные: product.reviews[] (Prisma relation)
```

| Элемент | Описание |
|---------|----------|
| Рейтинг-бар | 5 полос с процентами (★5 → ★1) |
| Фото от покупателей | Горизонтальная сетка 4 фото, клик = лайтбокс |
| Текстовые отзывы | Имя, рейтинг, текст, «Подтверждённая покупка» |
| Сортировка | Сначала полезные / новые / с фото |
| Форма отзыва | Рейтинг (★), текст, загрузка фото. Только авторизованным |

### 3.7 Блок 5: Собери рутину (RoutineBuilder)

```
Компонент: src/components/organisms/RoutineBuilder.tsx
Данные: related[] с RelationType = COMPLEMENTARY
```

- Показать 2-4 товара как шаги рутины
- Каждый товар: мини-карточка (фото, название, цена, «+ В корзину»)
- Бандл-скидка: «Купите 3 средства — скидка 10%»
- Общая сумма бандла с экономией

### 3.8 Блок 6: Характеристики (ProductSpecs)

Таблица ключ-значение:

```
Объём:           product.volume
Страна:          product.country + флаг
Бренд:           product.brand.name (ссылка на страницу бренда)
Тип кожи:        product.skinTypes[]
Возраст:         product.ageGroup
Текстура:        product.texture
Время:           product.timeOfDay (утро/вечер/оба)
Срок годности:   product.shelfLife
Артикул:         product.sku
```

### 3.9 Мобильный sticky CTA-бар

```tsx
// Появляется при скролле ниже основного CTA
<div className="fixed bottom-0 left-0 right-0 h-16 bg-surface
                border-t border-light flex items-center px-4
                justify-between z-50 md:hidden">
  <PriceDisplay price={product.price} compact />
  <Button variant="cta" size="md">🛒 В корзину</Button>
</div>
```

---

## 4. Поля БД — что нужно добавить в Prisma

Существующая модель Product уже содержит основные поля. Нужно добавить:

```prisma
model Product {
  // ... существующие поля ...

  // Новые поля для карточки товара
  skinTypes       SkinType[]        // [DRY, SENSITIVE]
  ageGroup        String?           // "25+", "30-45"
  routineStep     Int?              // 1-9 (шаг K-beauty рутины)
  texture         String?           // "крем", "гель", "эмульсия"
  timeOfDay       String?           // "утро", "вечер", "утро+вечер"
  skinTip         String?           // совет по типу кожи
  country         String?           // "Корея", "Япония"
  shelfLife       String?           // "12 мес."
  purchaseCount   Int     @default(0) // счётчик покупок (для соц.триггера)
}

model KeyIngredient {
  id              String  @id @default(cuid())
  productId       String
  product         Product @relation(fields: [productId], references: [id])
  name            String            // "Ниацинамид"
  nameInci        String?           // "Niacinamide"
  concentration   String?           // "5%"
  benefit         String            // "Выравнивает тон кожи"
  sortOrder       Int     @default(0)
}
```

---

## 5. API эндпоинты

| Метод | URL | Описание | Кеш |
|-------|-----|----------|-----|
| GET | `/api/products/[slug]` | Полные данные товара + ингредиенты + изображения | 5 мин |
| GET | `/api/products/[id]/reviews` | Отзывы с пагинацией и сортировкой | 2 мин |
| GET | `/api/products/[id]/related` | Комплементарные товары (рутина) | 10 мин |
| POST | `/api/products/[id]/reviews` | Создать отзыв (auth required) | — |
| POST | `/api/cart/add` | Добавить в корзину | — |
| POST | `/api/favorites/toggle` | Добавить/убрать из избранного | — |

---

## 6. JSON-LD разметка (SEO)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Round Lab Birch Juice Moisturizing Intensive Cream 50ml",
  "brand": { "@type": "Brand", "name": "Round Lab" },
  "image": ["url1", "url2"],
  "description": "...",
  "sku": "RL-BJC-50",
  "offers": {
    "@type": "Offer",
    "price": "2350",
    "priceCurrency": "RUB",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "CosmetikaLux" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.2",
    "reviewCount": "47"
  }
}
```

---

## 7. Адаптация по категориям

| Категория | Модалка: скрыть | PDP: добавить |
|-----------|----------------|---------------|
| Уход за лицом | — | Шаг рутины, INCI, «Собери рутину» |
| Здоровье и БАДы | Шаг рутины | Курс (30/60/90 дн), дозировка, противопоказания |
| Гигиена полости рта | Ингредиенты, шаг рутины | Жёсткость, для детей/взрослых |
| Лечебные средства | Шаг рутины | Показания, противопоказания, инструкция |
| Продукты | Ингредиенты, шаг рутины | Состав, пищевая ценность, срок годности |

---

## 8. Порядок разработки

| Шаг | Задача | Зависимости |
|-----|--------|-------------|
| 1 | Атомы: `Badge`, `PriceDisplay`, `StarRating`, `CountryFlag` | Дизайн-система |
| 2 | `IngredientList`, `RoutineStep` (molecules) | Атомы |
| 3 | `ProductQuickView` (модалка) | Атомы + молекулы + uiStore |
| 4 | `ProductGallery` (organism) | — |
| 5 | `ProductHero` = Gallery + Info (above the fold PDP) | Gallery + атомы |
| 6 | `ProductDetails` (блоки 1-3) | IngredientList + RoutineStep |
| 7 | `ReviewsSection` (блок 4) | StarRating |
| 8 | `RoutineBuilder` (блок 5) | ProductCard мини |
| 9 | `ProductSpecs` (блок 6) | — |
| 10 | Сборка PDP page.tsx + SSR + SEO | Всё выше |
| 11 | Миграция Prisma (новые поля) | — |
| 12 | API эндпоинты | Prisma |
