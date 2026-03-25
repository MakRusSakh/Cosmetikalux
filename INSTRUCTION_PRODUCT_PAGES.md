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

## 7. Сквозная секция «Для мужчин» (`/dlya-muzhchin`)

### 7.1 Концепция

Отдельная страница-витрина, агрегирующая товары из разных категорий по тегу `для_мужчин`.
Товары физически остаются в своих категориях (Здоровье, Уход за лицом и т.д.),
но дополнительно отображаются на этой странице.

### 7.2 Архитектура

```
src/app/(shop)/dlya-muzhchin/
└── page.tsx          # SSR, агрегация по тегу для_мужчин
```

```typescript
// page.tsx
export const metadata: Metadata = {
  title: 'Для мужчин — японские БАДы и витамины | CosmetikaLux',
  description: 'Мужское здоровье: витамины FANCL по возрастам, мака, '
    + 'экстракт устриц, пальма сереноа. Оригинал из Японии.',
}

export default async function MensPage() {
  const products = await getProductsByTag('для_мужчин')
  return (
    <>
      <MensHero />
      <MensCategories products={products} />
      <ProductGrid products={products} />
    </>
  )
}
```

### 7.3 Структура страницы

```
┌──────────────────────────────────────────────────────────────────┐
│  HERO-БАННЕР                                                     │
│  «Мужское здоровье — японские витамины и БАДы»                   │
│  Подзаголовок: «Подберите комплекс по вашему возрасту»            │
│  Фон: тёмный (--text-primary #1A1A1A), акцент --accent-gold      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  ПОДБОР ПО ВОЗРАСТУ (горизонтальные карточки)                     │
│                                                                    │
│  [20-29]  [30-39]  [40-49]  [50-59]  [60+]                       │
│  FANCL    FANCL    FANCL    FANCL    FANCL                        │
│  2 200₽   2 500₽   3 700₽   4 300₽   4 500₽                     │
│                                                                    │
│  Клик → фильтр каталога по возрастной группе                      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  КАТЕГОРИИ МУЖСКОГО ЗДОРОВЬЯ                                      │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 💪       │ │ 🧠       │ │ 🫀       │ │ ⚡       │            │
│  │ Сила и   │ │ Мозг и   │ │ Сердце и │ │ Энергия  │            │
│  │ выносл.  │ │ память   │ │ сосуды   │ │ и тонус  │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│                                                                    │
│  Каждая → якорь к подгруппе товаров ниже                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  СЕТКА ТОВАРОВ (ProductGrid, те же ProductCard что в каталоге)   │
│                                                                    │
│  Группировка:                                                      │
│  • Витамины по возрастам (FANCL Men's 20-60+)                     │
│  • Мужская сила (DHC Maca, ORIHIRO Oyster, Palmetto)             │
│  • Энергия и тонус (DHC Full Of Energy, Turtle Extract)          │
│  • Сердце и сосуды (Nattokinase — если пересечение с тегом)       │
│                                                                    │
│  Каждая группа: заголовок + горизонтальный скролл 4 карточки      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  БЛОК ДОВЕРИЯ                                                      │
│  🇯🇵 Оригинал из Японии · 📋 Сертификаты · 🚚 Доставка 2-5 дн  │
└──────────────────────────────────────────────────────────────────┘
```

### 7.4 Цветовая схема мужской секции

> Принцип «Quietly Confident» — маскулинность через вычитание (убираем пастель,
> курсив, декор), а не через добавление (без агрессии, чёрного, неона).
> Источники: Hims, Roman, FANCL Men's, iHerb, исследования Joe Hallock.

#### Палитра

| Роль | Цвет | HEX | Где применяется |
|------|-------|-----|-----------------|
| **Primary** | Muted Navy | `#34435E` | Hero-фон, заголовки секций, хедер секции |
| **Secondary** | Slate | `#6D8196` | Подзаголовки, иконки, бордеры |
| **Accent** | Sage Green | `#9CAF88` | Бейджи «в наличии», иконки здоровья |
| **Background** | Warm White | `#FAF9F6` | Основной фон страницы |
| **Surface** | Light Warm Grey | `#F0EDEA` | Фон карточек, блок доверия |
| **Text Primary** | Charcoal | `#2D3436` | Основной текст |
| **Text Secondary** | Medium Grey | `#636E72` | Описания, подсказки |
| **CTA** | Deep Teal | `#0D9488` | Кнопка «В корзину» |
| **CTA Hover** | Darker Teal | `#0F766E` | Hover-состояние кнопки |
| **Danger/Sale** | Muted Red | `#C53030` | Скидка%, «Осталось 3 шт» |

#### Сравнение с основным каталогом

| Элемент | Основной каталог | Секция «Для мужчин» |
|---------|-----------------|---------------------|
| Фон hero | Gradient lavender→rose | Muted Navy `#34435E` |
| Фон страницы | `#FDFBF9` тёплый | `#FAF9F6` чуть холоднее |
| Фон карточек | `#FFFFFF` | `#F0EDEA` warm grey |
| CTA-кнопка | Gradient lavender→rose | Solid teal `#0D9488` |
| Акцент | Lavender `#C8A2C8` | Sage `#9CAF88` |
| Заголовки | Playfair 600 | Playfair 700, чуть крупнее |
| Карточки | Стандартные | Те же + бейдж + grey surface |
| Сетка | 4 колонки с фильтрами | Группы + горизонтальный скролл |

#### CSS-переменные (scope: `.men-section`)

```css
.men-section {
  --men-primary: #34435E;
  --men-secondary: #6D8196;
  --men-accent: #9CAF88;
  --men-bg: #FAF9F6;
  --men-surface: #F0EDEA;
  --men-text: #2D3436;
  --men-text-secondary: #636E72;
  --men-cta: #0D9488;
  --men-cta-hover: #0F766E;
  --men-sale: #C53030;
}
```

#### Градиент Hero-баннера

```css
.men-hero {
  background: linear-gradient(135deg, #34435E 0%, #2D3436 60%, #1A2332 100%);
  color: #FAF9F6;
}
.men-hero h1 {
  font: 700 48px/56px 'Playfair Display';
  color: #FAF9F6;
}
.men-hero .subtitle {
  font: 400 18px/28px 'Playfair Display';
  color: #9CAF88; /* sage accent для подзаголовка */
}
```

### 7.5 Психология мужских покупок — UX-правила

> Мужчины — целевые покупатели: пришёл → нашёл → купил.
> 60% используют 1-2 средства. Решение быстрее, чем у женщин.
> Главное: не мешать, дать доверие, показать результат.

#### 7 правил мужской секции:

**1. Меньше выбора = больше продаж**
- Показывать 5-8 hero-товаров на главной секции (не все 15)
- Блок «Рекомендуем» с 1 товаром-бестселлером для каждой задачи
- Исследование: 6 вариантов конвертят в 10 раз лучше, чем 24

**2. Функциональный язык, не эмоциональный**
```
❌ «Почувствуйте гармонию тела и духа»
✅ «Энергия и выносливость. Курс 30 дней. Результат с 2-й недели.»

❌ «Позаботьтесь о себе»
✅ «Витамины для мужчин 30-39: цинк, B-комплекс, экстракт устриц»
```

**3. Доверие через факты, не эмоции**
- ★ рейтинг + количество отзывов (конверсия +380%)
- 🇯🇵 «Произведено в Японии, стандарт GMP»
- 📋 «Сертификат JHFA» (Japan Health Food Association)
- 🔬 Точные дозировки: «Цинк 15мг · Maca 900мг · B6 30мг»
- Избегать расплывчатых обещаний → конкретные цифры

**4. Всё важное — без скролла**
- Цена, рейтинг, ключевая выгода, кнопка — above the fold
- Мужчины сканируют быстрее и уходят раньше при путанице
- Детали доступны по клику, но не навязаны

**5. Подбор по возрасту как навигация**
- FANCL Men's 20-29 / 30-39 / 40-49 / 50-59 / 60+ — идеальная точка входа
- «Мне 35, что мне нужно?» → один клик → подборка
- Снимает «парадокс выбора» — главный барьер мужских покупок

**6. Прозрачная цена и доставка**
- Скрытые расходы = причина ухода #1 (48%)
- Показывать итоговую цену сразу
- «Бесплатная доставка от 3 000₽» — на видном месте (70% мужчин считают это #1 фактором)
- Гостевой чекаут обязателен (мужчины не хотят регистрироваться)

**7. Фотографии: продукт, не лайфстайл**
- Чистое фото упаковки на нейтральном фоне
- Никаких моделей-бодибилдеров
- Если люди — реалистичные, спокойные, уверенные
- Упаковка крупно + состав читаемо

### 7.6 Макет карточки товара в мужской секции

```
┌─────────────────────────────────────────┐
│  bg: #F0EDEA (warm grey surface)         │
│                                           │
│  ┌───────────────────────────────────┐   │
│  │                                   │   │
│  │      ФОТО УПАКОВКИ               │   │
│  │      (чистое, на белом фоне)      │   │
│  │                                   │   │
│  └───────────────────────────────────┘   │
│                                           │
│  FANCL                    🇯🇵             │
│  Men's Vitamins 30-39                     │
│  ★★★★☆ 4.5 (23)                          │
│                                           │
│  2 500 ₽                                 │
│  Курс: 30 дней · 83 ₽/день              │
│                                           │
│  💪 Цинк 15мг · B6 · CoQ10              │
│                                           │
│  ┌───────────────────────────────────┐   │
│  │        🛒  В КОРЗИНУ              │   │  ← teal #0D9488
│  └───────────────────────────────────┘   │
│                                           │
└─────────────────────────────────────────┘
```

**Отличия от стандартной карточки:**
- Фон `#F0EDEA` вместо белого
- Кнопка teal `#0D9488` вместо gradient lavender
- «Курс: 30 дней · 83₽/день» — цена за день (мужчины считают ROI)
- Дозировки ключевых веществ вместо «тип кожи»
- Нет шага рутины (не релевантно для БАДов)

### 7.7 Блок доверия (расширенный для мужчин)

```
┌──────────────────────────────────────────────────────────────────┐
│  bg: #F0EDEA                                                      │
│                                                                    │
│  🇯🇵 Оригинал из Японии    📋 Стандарт GMP     ✓ JHFA            │
│                                                                    │
│  🚚 Бесплатно от 3 000₽   ↩ Возврат 14 дней   🔒 Безопасная     │
│                                                 оплата            │
│                                                                    │
│  «Все добавки проходят строгий контроль качества                  │
│   в соответствии с японскими стандартами безопасности»             │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### 7.8 Навигация — интеграция в меню

```
Десктоп хедер: КАТАЛОГ | БРЕНДЫ | НОВИНКИ | ДЛЯ МУЖЧИН | АКЦИИ
Мобайл бургер: пункт «Для мужчин» с иконкой
Мега-меню каталога: отдельный блок «Для мужчин →» справа
```

### 7.9 API

```typescript
// GET /api/products?tag=для_мужчин
// Реиспользует общий эндпоинт каталога с фильтром по тегу
const products = await prisma.product.findMany({
  where: {
    isActive: true,
    tags: { has: 'для_мужчин' }
  },
  include: { brand: true, images: { where: { isMain: true } } },
  orderBy: { purchaseCount: 'desc' }
})
```

### 7.10 Расширение в будущем

Секция может расти за счёт:
- Мужская косметика (кремы, лосьоны после бритья) — когда появится в ассортименте
- Мужские аксессуары (бритвы, инструменты)
- Мужские наборы/бандлы

Аналогичная архитектура для секции «Для детей» (`/dlya-detey`).

---

## 8. Адаптация карточек по категориям

| Категория | Модалка: скрыть | PDP: добавить |
|-----------|----------------|---------------|
| Уход за лицом | — | Шаг рутины, INCI, «Собери рутину» |
| Здоровье и БАДы | Шаг рутины | Курс (30/60/90 дн), дозировка, противопоказания |
| Гигиена полости рта | Ингредиенты, шаг рутины | Жёсткость, для детей/взрослых |
| Лечебные средства | Шаг рутины | Показания, противопоказания, инструкция |
| Продукты | Ингредиенты, шаг рутины | Состав, пищевая ценность, срок годности |

---

## 9. Порядок разработки

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
