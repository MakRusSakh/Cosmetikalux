# CosmetikaLux — Каталог UI-компонентов

> Библиотека компонентов построена по методологии **Atomic Design**.
> Стек: React 18 + TypeScript + Tailwind CSS + Lucide Icons.

---

## 1. Atomic Design — структура

| Уровень | Описание | Пример |
|---------|----------|--------|
| **Atoms** | Неделимые элементы UI | Button, Input, Badge, Icon |
| **Molecules** | Группа атомов с единой функцией | Card, Modal, SearchBar, Rating |
| **Organisms** | Крупные блоки из молекул | Header, Footer, ProductCard, CartDrawer |
| **Templates** | Скелеты страниц (layout) | ShopLayout, AdminLayout, CheckoutLayout |

Все компоненты лежат в `src/components/` с разбивкой по уровням.

---

## 2. Atoms (`src/components/ui/`)

### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: LucideIcon
  children: React.ReactNode
  onClick?: () => void
}
```

| Variant | Tailwind-классы |
|---------|----------------|
| primary | `bg-gradient-to-br from-[#C8A2C8] to-[#E8C4C4] text-white shadow-sm` |
| secondary | `border-[1.5px] border-[#E0D8D0] text-[#1A1A1A] hover:border-[#C8A2C8]` |
| outline | `border border-[#C8A2C8] text-[#C8A2C8] bg-transparent` |
| ghost | `text-[#C8A2C8] hover:underline bg-transparent` |

Размеры: `sm` — `px-4 py-1.5 text-xs`, `md` — `px-8 py-3 text-[15px]`, `lg` — `px-10 py-4 text-base`.

### Input

```typescript
interface InputProps {
  label?: string
  error?: string
  icon?: LucideIcon
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
}
```

Стили: `rounded-[6px] border border-[#E0D8D0] focus:border-[#C8A2C8] font-playfair`. При `error` — `border-[#D4737D] text-[#D4737D]`.

### Badge

```typescript
interface BadgeProps {
  variant: 'hit' | 'new' | 'sale' | 'organic'
  text?: string
}
```

| Variant | Фон | Текст |
|---------|-----|-------|
| hit | `bg-[#C9A96E]` | ХИТ |
| new | `bg-[#C8A2C8]` | НОВИНКА |
| sale | `bg-[#D4737D]` | АКЦИЯ |
| organic | `bg-[#7BAE7F]` | ЭКО |

Общее: `text-white text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full px-3 py-0.5`.

### Skeleton

```typescript
interface SkeletonProps {
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}
```

Анимация: `animate-pulse bg-[#F7F3EF]`. Используется при загрузке карточек и модалок.

### PriceTag

```typescript
interface PriceTagProps {
  price: number
  oldPrice?: number
  currency?: string  // по умолчанию '₽'
}
```

Новая цена: `font-playfair text-[28px] font-bold text-[#1A1A1A]`. Старая: `text-[18px] text-[#8A8A8A] line-through`.

### Icon

```typescript
interface IconProps {
  name: keyof typeof icons  // обёртка над Lucide
  size?: number             // по умолчанию 24
  color?: string            // по умолчанию 'currentColor'
}
```

---

## 3. Molecules (`src/components/ui/`)

### Card

```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean     // shadow-sm → shadow-md при hover
  onClick?: () => void
}
```

Стили: `bg-white border border-[#F0EBE6] rounded-[12px] shadow-sm`. При `hover` — `hover:shadow-md transition-shadow`.

### Modal

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
}
```

Оверлей: `bg-black/50 backdrop-blur-[4px]`. Контент: `bg-white rounded-[20px] shadow-xl`. Закрытие: клик по оверлею, кнопка `×`, клавиша Escape. Анимация: `opacity 0→1 + scale 0.95→1` за 200ms.

### SearchBar

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  suggestions?: string[]
}
```

Полнотекстовый поиск PostgreSQL. Подсказки отображаются в dropdown с `shadow-lg`.

### Rating

```typescript
interface RatingProps {
  value: number
  max?: number        // по умолчанию 5
  readonly?: boolean
  onChange?: (v: number) => void
}
```

Звёзды: заливка `fill-[#C9A96E]` (золото). Рядом выводится `(count отзывов)` текстом `text-caption text-[#8A8A8A]`.

### Pagination

```typescript
interface PaginationProps {
  page: number
  total: number
  limit: number
  onChange: (page: number) => void
}
```

---

## 4. Organisms

### Header (`src/components/layout/Header.tsx`)

Элементы: логотип «CosmetikaLux» (Playfair 700), навигация (Каталог, Бренды, Акции, Блог), иконка поиска, избранное (сердце), корзина (с `Badge` count), профиль. На мобильных — бургер-меню. Sticky: `bg-white/90 backdrop-blur-[16px] shadow-sm`.

### Footer (`src/components/layout/Footer.tsx`)

Колонки: О магазине, Покупателям, Категории, Контакты. Соц. сети: Telegram, VK, Instagram. Иконки платёжных систем. Фон: `bg-[#F7F3EF]`.

### ProductCard (`src/components/features/ProductCard.tsx`)

```typescript
interface ProductCardProps {
  product: Product   // image, title, brand, price, oldPrice, badges
  onQuickView: (id: string) => void
  onAddToCart: (id: string) => void
  onToggleFavorite: (id: string) => void
}
```

Карточка: `border border-[#F0EBE6] rounded-[12px]`. Фото — `aspect-square`, hover: `scale(1.05)` с `overflow-hidden`. Бейджи — абсолютное позиционирование сверху слева. Кнопка «В корзину» — primary CTA.

### ProductGrid (`src/components/features/ProductGrid.tsx`)

```typescript
interface ProductGridProps {
  products: Product[]
  loading?: boolean
}
```

Адаптивная сетка: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`.

### ProductModal (`src/components/features/ProductQuickView.tsx`)

Quick-view модалка: `max-w-[960px]`. Десктоп: фото слева (55%) + инфо справа (45%). Мобайл: bottom-sheet 85vh. Содержит: карусель фото, бренд, название, StarRating, PriceDisplay, бейджи типа кожи, кнопку CTA, ссылку «Подробнее». Управление: Zustand `uiStore.quickViewProductId`.

### CartDrawer (`src/components/features/CartDrawer.tsx`)

```typescript
interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}
```

Slide-out панель справа: список товаров (фото, название, цена, количество `±`), итого, кнопка «Оформить заказ» (primary CTA). Glassmorphism: `bg-white/90 backdrop-blur-[16px]`.

### CatalogFilters (`src/components/features/CatalogFilters.tsx`)

Фильтры: дерево категорий (аккордеон), чекбоксы брендов, ползунок цены (range slider), выпадающий список сортировки (цена, популярность, новизна). На мобильных — открывается как bottom-sheet.

---

## 5. Feature Components (`src/components/features/`)

### checkout/CheckoutForm

Двухшаговая форма: Шаг 1 — адрес доставки (Input-поля + выбор способа), Шаг 2 — оплата (карта/СБП). Валидация на каждом шаге. Кнопка «Оплатить» — primary CTA.

### profile/OrderHistory

Список заказов с группировкой по статусу: `новый | оплачен | отправлен | доставлен | отменён`. Каждый заказ: дата, сумма, кол-во товаров, трек-номер.

### chat/ChatWidget

Плавающая кнопка внизу справа: `rounded-full shadow-glow bg-gradient-cta`. По клику — окно чата с ИИ-консультантом (GigaChat). Glassmorphism: `bg-white/72 backdrop-blur-[16px] border border-[#C8A2C8]/20 rounded-[32px]`.

### admin/ProductEditor

CRUD-форма: поля name, brand, price, description, images (drag-n-drop), категория, теги, тип кожи, шаг рутины. Превью карточки в реальном времени.

---

## 6. Дизайн-токены → Tailwind-классы

Маппинг CSS-переменных из `DESIGN_SYSTEM.md` на классы в `tailwind.config.ts`:

```typescript
// tailwind.config.ts — extend.colors
colors: {
  bg:      { primary: '#FDFBF9', secondary: '#F7F3EF', tertiary: '#FFF8F5', surface: '#FFFFFF' },
  text:    { primary: '#1A1A1A', secondary: '#4A4A4A', tertiary: '#8A8A8A', inverse: '#FFFFFF' },
  accent:  { primary: '#C8A2C8', hover: '#B88DB8', light: '#F0E4F0',
             rose: '#E8C4C4', gold: '#C9A96E' },
  semantic:{ success: '#7BAE7F', warning: '#E4C76B', error: '#D4737D', info: '#7BA5C9' },
  border:  { light: '#F0EBE6', medium: '#E0D8D0', accent: '#C8A2C8' },
},
borderRadius: {
  sm: '6px', md: '12px', lg: '20px', xl: '32px', full: '9999px',
},
fontFamily: {
  playfair: ['Playfair Display', 'serif'],
},
boxShadow: {
  sm:   '0 1px 3px rgba(26,26,26,0.04), 0 1px 2px rgba(26,26,26,0.03)',
  md:   '0 4px 12px rgba(26,26,26,0.06), 0 2px 4px rgba(26,26,26,0.04)',
  lg:   '0 12px 32px rgba(26,26,26,0.08), 0 4px 8px rgba(26,26,26,0.04)',
  xl:   '0 24px 48px rgba(26,26,26,0.10), 0 8px 16px rgba(26,26,26,0.06)',
  glow: '0 0 24px rgba(200,162,200,0.20)',
},
```

**Типографика** — шрифт Playfair Display везде. Заголовки: `font-playfair font-bold`. Кнопки: `font-playfair font-semibold uppercase tracking-[0.04em]`. Бейджи: `text-[11px] font-semibold uppercase tracking-[0.08em]`.

**Градиенты**: CTA — `bg-gradient-to-br from-[#C8A2C8] to-[#E8C4C4]`. Hero — `bg-gradient-to-br from-[#FFF8F5] via-[#F0E4F0] to-[#FAF5EB]`.
