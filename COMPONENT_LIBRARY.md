# CosmetikaLux — Каталог UI-компонентов

> Библиотека построена по **Atomic Design**. Стек: React 18 + TypeScript + Tailwind CSS + Lucide Icons.

---

## 1. Atomic Design — структура

| Уровень | Описание | Пример |
|---------|----------|--------|
| **Atoms** | Неделимые элементы UI | Button, Input, Badge, Icon |
| **Molecules** | Группа атомов с единой функцией | Card, Modal, SearchBar, Rating |
| **Organisms** | Крупные блоки из молекул | Header, Footer, ProductCard, CartDrawer |
| **Templates** | Скелеты страниц (layout) | ShopLayout, AdminLayout, CheckoutLayout |

---

## 2. Atoms (`src/components/ui/`)

### Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean; disabled?: boolean
  icon?: LucideIcon; children: React.ReactNode
}
```
| Variant | Tailwind |
|---------|----------|
| primary | `bg-gradient-to-br from-[#C8A2C8] to-[#E8C4C4] text-white shadow-sm` |
| secondary | `border-[1.5px] border-[#E0D8D0] text-[#1A1A1A] hover:border-[#C8A2C8]` |
| outline | `border border-[#C8A2C8] text-[#C8A2C8] bg-transparent` |
| ghost | `text-[#C8A2C8] hover:underline bg-transparent` |

Размеры: `sm` — `px-4 py-1.5 text-xs`, `md` — `px-8 py-3 text-[15px]`, `lg` — `px-10 py-4 text-base`.

### Input
```typescript
interface InputProps {
  label?: string; error?: string; icon?: LucideIcon
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
}
```
Стили: `rounded-[6px] border border-[#E0D8D0] focus:border-[#C8A2C8]`. Ошибка: `border-[#D4737D]`.

### Badge
```typescript
interface BadgeProps { variant: 'hit' | 'new' | 'sale' | 'organic'; text?: string }
```
| Variant | Фон | Текст по умолчанию |
|---------|-----|-----|
| hit | `bg-[#C9A96E]` | ХИТ |
| new | `bg-[#C8A2C8]` | НОВИНКА |
| sale | `bg-[#D4737D]` | АКЦИЯ |
| organic | `bg-[#7BAE7F]` | ЭКО |

Общее: `text-white text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full px-3 py-0.5`.

### Skeleton
```typescript
interface SkeletonProps { width?: string | number; height?: string | number; rounded?: 'sm' | 'md' | 'lg' | 'full' }
```
Анимация: `animate-pulse bg-[#F7F3EF]`.

### PriceTag
```typescript
interface PriceTagProps { price: number; oldPrice?: number; currency?: string /* '₽' */ }
```
Цена: `font-playfair text-[28px] font-bold text-[#1A1A1A]`. Старая: `text-[18px] text-[#8A8A8A] line-through`.

### Icon
```typescript
interface IconProps { name: keyof typeof icons; size?: number; color?: string }
```
Обёртка над Lucide. По умолчанию `size=24`, `color='currentColor'`.

---

## 3. Molecules (`src/components/ui/`)

### Card
```typescript
interface CardProps { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void }
```
Стили: `bg-white border border-[#F0EBE6] rounded-[12px] shadow-sm`. Hover: `hover:shadow-md`.

### Modal
```typescript
interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; size?: 'sm' | 'md' | 'lg' | 'full' }
```
Оверлей: `bg-black/50 backdrop-blur-[4px]`. Контент: `bg-white rounded-[20px] shadow-xl`. Закрытие: оверлей / `×` / Escape. Анимация: `scale 0.95→1, opacity 0→1` за 200ms.

### SearchBar
```typescript
interface SearchBarProps { onSearch: (q: string) => void; placeholder?: string; suggestions?: string[] }
```
Полнотекстовый поиск PostgreSQL. Подсказки — dropdown с `shadow-lg`.

### Rating
```typescript
interface RatingProps { value: number; max?: number; readonly?: boolean; onChange?: (v: number) => void }
```
Звёзды `fill-[#C9A96E]`. Текст рядом: `text-[12px] text-[#8A8A8A]`.

### Pagination
```typescript
interface PaginationProps { page: number; total: number; limit: number; onChange: (p: number) => void }
```

---

## 4. Organisms

### Header (`src/components/layout/Header.tsx`)
Логотип (Playfair 700), навигация (Каталог, Бренды, Акции, Блог), иконки: поиск, избранное, корзина с `Badge` (count), профиль. Мобильная версия — бургер. Sticky: `bg-white/90 backdrop-blur-[16px] shadow-sm`.

### Footer (`src/components/layout/Footer.tsx`)
4 колонки: О магазине, Покупателям, Категории, Контакты. Соцсети: Telegram, VK. Платёжные иконки. Фон: `bg-[#F7F3EF]`.

### ProductCard (`src/components/features/ProductCard.tsx`)
```typescript
interface ProductCardProps {
  product: Product  // image, title, brand, price, oldPrice, badges
  onQuickView: (id: string) => void
  onAddToCart: (id: string) => void
  onToggleFavorite: (id: string) => void
}
```
Фото `aspect-square`, hover `scale(1.05)`. Бейджи — absolute сверху слева. CTA «В корзину» — primary.

### ProductGrid (`src/components/features/ProductGrid.tsx`)
```typescript
interface ProductGridProps { products: Product[]; loading?: boolean }
```
Сетка: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`.

### ProductModal (`src/components/features/ProductQuickView.tsx`)
Quick-view: `max-w-[960px]`. Десктоп — фото 55% слева + инфо 45% справа. Мобайл — bottom-sheet 85vh. Содержит: карусель, бренд, название, StarRating, PriceDisplay, бейджи кожи, CTA, ссылку «Подробнее». Zustand: `uiStore.quickViewProductId`.

### CartDrawer (`src/components/features/CartDrawer.tsx`)
```typescript
interface CartDrawerProps { isOpen: boolean; onClose: () => void }
```
Slide-out справа: товары (фото, название, цена, `±`), итого, «Оформить заказ». Glassmorphism: `bg-white/90 backdrop-blur-[16px]`.

### CatalogFilters (`src/components/features/CatalogFilters.tsx`)
Дерево категорий (аккордеон), чекбоксы брендов, range-slider цены, dropdown сортировки. Мобайл — bottom-sheet.

---

## 5. Feature Components (`src/components/features/`)

| Компонент | Описание |
|-----------|----------|
| **checkout/CheckoutForm** | 2 шага: адрес доставки + оплата (карта/СБП). Валидация. CTA «Оплатить». |
| **profile/OrderHistory** | Список заказов по статусам: новый → оплачен → отправлен → доставлен → отменён. |
| **chat/ChatWidget** | Плавающая кнопка `rounded-full shadow-glow bg-gradient-cta`. Окно чата с ИИ (GigaChat). Glass: `bg-white/72 backdrop-blur-[16px] rounded-[32px]`. |
| **admin/ProductEditor** | CRUD-форма товара: name, brand, price, images (drag-n-drop), категория, теги, тип кожи. Превью карточки live. |

---

## 6. Дизайн-токены → Tailwind-классы

Маппинг CSS-переменных из `DESIGN_SYSTEM.md` на `tailwind.config.ts`:

```typescript
// tailwind.config.ts — extend
colors: {
  bg:       { primary: '#FDFBF9', secondary: '#F7F3EF', tertiary: '#FFF8F5', surface: '#FFFFFF' },
  text:     { primary: '#1A1A1A', secondary: '#4A4A4A', tertiary: '#8A8A8A', inverse: '#FFFFFF' },
  accent:   { primary: '#C8A2C8', hover: '#B88DB8', light: '#F0E4F0', rose: '#E8C4C4', gold: '#C9A96E' },
  semantic: { success: '#7BAE7F', warning: '#E4C76B', error: '#D4737D', info: '#7BA5C9' },
  border:   { light: '#F0EBE6', medium: '#E0D8D0', accent: '#C8A2C8' },
},
borderRadius: { sm: '6px', md: '12px', lg: '20px', xl: '32px', full: '9999px' },
fontFamily:   { playfair: ['Playfair Display', 'serif'] },
boxShadow: {
  sm: '0 1px 3px rgba(26,26,26,0.04), 0 1px 2px rgba(26,26,26,0.03)',
  md: '0 4px 12px rgba(26,26,26,0.06), 0 2px 4px rgba(26,26,26,0.04)',
  lg: '0 12px 32px rgba(26,26,26,0.08), 0 4px 8px rgba(26,26,26,0.04)',
  xl: '0 24px 48px rgba(26,26,26,0.10), 0 8px 16px rgba(26,26,26,0.06)',
  glow: '0 0 24px rgba(200,162,200,0.20)',
},
```

**Типографика**: Playfair Display везде. Заголовки — `font-bold`. Кнопки — `font-semibold uppercase tracking-[0.04em]`. Бейджи — `text-[11px] tracking-[0.08em]`.

**Градиенты**: CTA — `from-[#C8A2C8] to-[#E8C4C4]`. Hero — `from-[#FFF8F5] via-[#F0E4F0] to-[#FAF5EB]`.
