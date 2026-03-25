# CosmetikaLux 2.0 — Структура проекта

> Полная карта директорий Next.js 15 / App Router

## 1. Корневые файлы и Prisma

```
cosmetikalux/
├── next.config.ts            # Next.js: images, redirects, headers
├── tailwind.config.ts        # Дизайн-токены: цвета, шрифты, отступы
├── tsconfig.json             # TypeScript strict, aliases (@/*)
├── package.json              # Зависимости и скрипты
├── .env.example              # БД, Redis, ЮKassa, СДЭК, GigaChat, SMS.ru, Resend
├── middleware.ts              # Защита /account/*, /admin/*
├── docker-compose.yml        # PostgreSQL + Redis + Nginx (VPS)
├── Dockerfile                # Сборка приложения
├── prisma/
│   ├── schema.prisma         # Все модели: User, Product, Order, Cart, Chat, Blog, Bonus
│   ├── seed.ts               # 5 категорий, 3 бренда, 10 товаров
│   └── migrations/           # Автогенерируемые миграции
└── public/
    ├── images/products/      # Фото товаров, баннеры
    ├── fonts/                # Playfair Display, Inter
    └── icons/                # Favicon, PWA-иконки
```

## 2. App Router — маршруты (src/app/)

```
src/app/
├── layout.tsx / globals.css / sitemap.ts / robots.ts
│
├── (shop)/                   ── Публичный магазин ──
│   ├── layout.tsx            # Header + Footer + ChatWidget
│   ├── page.tsx              # Главная: Hero, хиты, новинки, бренды
│   ├── catalog/page.tsx                        # Каталог с фильтрами
│   ├── catalog/[categorySlug]/page.tsx         # Категория
│   ├── catalog/[categorySlug]/[productSlug]/page.tsx  # Товар (SSR)
│   ├── brands/page.tsx                         # Список брендов
│   ├── brands/[brandSlug]/page.tsx             # Товары бренда
│   ├── cart/page.tsx                           # Корзина
│   ├── checkout/page.tsx                       # Чекаут
│   ├── checkout/success/page.tsx               # Успешная оплата
│   ├── blog/page.tsx                           # Статьи
│   ├── blog/[slug]/page.tsx                    # Статья (SSG + ISR)
│   ├── about / delivery / returns / contacts / privacy / terms  # Статические
│
├── (auth)/                   ── Аутентификация ──
│   ├── login / register / forgot-password      # page.tsx в каждой
│
├── (account)/                ── Личный кабинет ──
│   ├── layout.tsx            # Sidebar-навигация
│   └── account/
│       ├── page.tsx          # Дашборд
│       ├── profile / skin-profile / addresses / favorites / bonus  # page.tsx
│       ├── orders/page.tsx   # История заказов
│       ├── orders/[orderId]/page.tsx  # Детали + трекинг
│       ├── subscriptions / notifications  # page.tsx
│       └── consultations / routine        # ИИ (фаза 8)
│
├── admin/                    ── Админ-панель ──
│   ├── layout.tsx / page.tsx (дашборд)
│   ├── products / categories / brands / orders / customers / promotions  # page.tsx
│   └── chat/ → page.tsx, system-prompt/page.tsx, analytics/page.tsx
│
└── api/                      ── Route Handlers ──
    ├── auth/[...nextauth]/route.ts
    ├── products/route.ts              # GET список + фильтры
    ├── products/[slug]/route.ts       # GET товар
    ├── products/[slug]/reviews/route.ts
    ├── categories/route.ts            # GET дерево
    ├── brands/route.ts                # GET список
    ├── search/route.ts                # Полнотекстовый поиск
    ├── cart/route.ts                  # GET, POST, DELETE
    ├── cart/[itemId]/route.ts         # PATCH, DELETE
    ├── orders/route.ts                # GET мои, POST создание
    ├── payment/create/route.ts        # ЮKassa: создание
    ├── payment/webhook/route.ts       # ЮKassa: webhook
    ├── profile/route.ts + skin/route.ts
    ├── addresses / favorites / notifications / subscriptions  # route.ts
    ├── bonus/route.ts + transactions/route.ts
    ├── promo/validate/route.ts
    ├── blog/route.ts + [slug]/route.ts
    ├── chat/message/route.ts          # SSE-стриминг GigaChat
    ├── chat/session/route.ts + history/route.ts
    ├── sync/stock/route.ts            # POST от 1С: остатки
    ├── sync/products/route.ts         # POST от 1С: товары
    ├── sync/orders/route.ts           # GET заказы для 1С
    ├── sync/orders/[orderId]/status/route.ts
    └── sync/status/route.ts           # Мониторинг
```

## 3. Компоненты (src/components/)

```
ui/                 # АТОМЫ
  Button, Input, Badge, Card, Modal, Skeleton, PriceDisplay, StarRating, CountryFlag

layout/             # Структура
  Header, Footer, MobileMenu, Breadcrumbs

home/               # Главная
  HeroBanner, PromoSection, HitProducts, NewProducts,
  SaleProducts, BrandShowcase, Benefits, Newsletter

catalog/
  CatalogFilters    # Категория, бренд, цена, тип кожи

product/            # Товар
  ProductCard, ProductQuickView, ProductGallery, ProductInfo,
  ProductTabs, IngredientList, RoutineStep, RoutineBuilder,
  RelatedProducts, ReviewSummary, ReviewForm

cart/
  CartItem, CartSummary, MiniCart

checkout/
  ContactForm, DeliveryForm, PaymentForm, OrderConfirm

chat/               # ИИ «Лина» (фаза 8)
  ChatWidget, ChatMessage, ChatInput, ChatProductCard, QuickButtons
```

## 4. Lib, Stores, Types, Hooks

```
src/lib/
├── prisma.ts / redis.ts / auth.ts / utils.ts / seo.ts
├── yokassa.ts / cdek.ts / pochta.ts       # Клиенты API
├── bonus.ts / promo.ts / products.ts      # Бизнес-логика
├── sync-monitor.ts                        # Мониторинг 1С
├── validators/                            # Zod: auth, order, product, profile
├── notifications/email.ts + sms.ts        # Resend + SMS.ru
└── ai/                                    # Фаза 8
    gigachat.ts, provider.ts, generate.ts, prompts.ts, rag.ts

src/stores/
├── cartStore.ts       # items[], promoCode, bonusToUse, totals
├── chatStore.ts       # sessions[], currentMsg, isStreaming
└── uiStore.ts         # isMobileMenu, isSearchOpen, quickViewProductId

src/types/
├── product.ts         # Product, Category, Brand, Review, Filter
├── order.ts           # Order, OrderItem, OrderStatus, DeliveryMethod
├── user.ts            # User, SkinProfile, Address, BonusAccount
├── chat.ts            # ChatSession, ChatMessage
└── api.ts             # ApiResponse<T>, PaginatedResponse<T>, ApiError

src/hooks/
├── useDebounce.ts     # Задержка ввода (поиск, фильтры)
├── useMediaQuery.ts   # isMobile, isTablet, isDesktop
└── useIntersection.ts # Lazy-load, бесконечная прокрутка
```

## 5. Atomic Design — пояснение

| Уровень | Папка | Примеры | Суть |
|---------|-------|---------|------|
| **Atoms** | `ui/` | Button, Input, Badge | Неделимые элементы без бизнес-логики |
| **Molecules** | `product/`, `cart/` | ProductCard, CartItem | Комбинации атомов с минимальной логикой |
| **Organisms** | `layout/`, `checkout/`, `chat/` | Header, ChatWidget | Блоки с собственным состоянием |
| **Templates** | `app/**/layout.tsx` | ShopLayout, AdminLayout | Скелеты страниц |
| **Pages** | `app/**/page.tsx` | Каталог, товар, чекаут | Маршруты с загрузкой данных |

Поток данных: **page -> organism -> molecule -> atom**.
Состояние: **Zustand** (корзина, UI) + **React Query** (серверные данные).
