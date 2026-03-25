# CosmetikaLux 2.0 — Структура проекта

> Полная карта директорий Next.js 15 / App Router

---

## 1. Корневые файлы

```
cosmetikalux/
├── next.config.ts          # Next.js: images, redirects, headers
├── tailwind.config.ts      # Дизайн-токены: цвета, шрифты, отступы, тени
├── tsconfig.json           # TypeScript strict, path aliases (@/*)
├── package.json            # Зависимости и скрипты
├── .env.example            # Переменные: БД, Redis, ЮKassa, СДЭК, GigaChat, SMS.ru, Resend
├── middleware.ts            # Защита /account/*, /admin/*
├── docker-compose.yml      # PostgreSQL + Redis + Nginx (VPS)
├── Dockerfile              # Сборка приложения
└── sentry.client.config.ts # Мониторинг ошибок
```

## 2. Prisma и Public

```
prisma/
├── schema.prisma           # Модели: User, Product, Order, Cart, Chat, Blog, Bonus...
├── seed.ts                 # Тестовые данные: 5 категорий, 3 бренда, 10 товаров
└── migrations/             # Автогенерируемые миграции

public/
├── images/products/        # Фото товаров, баннеры, промо
├── fonts/                  # Playfair Display, Inter (self-hosted)
└── icons/                  # Favicon, PWA-иконки
```

## 3. App Router — маршруты

```
src/app/
├── layout.tsx              # Корневой layout: шрифты, metadata, providers
├── globals.css             # CSS-переменные, Tailwind-директивы
├── sitemap.ts              # Динамический sitemap
├── robots.ts               # robots.txt
├── (shop)/                 ── Публичный магазин (Header + Footer) ──
│   ├── layout.tsx          # ShopLayout: Header, Footer, ChatWidget
│   ├── page.tsx            # Главная: Hero, хиты, новинки, бренды
│   ├── catalog/
│   │   ├── page.tsx        # Каталог: сетка, фильтры, сортировка
│   │   └── [categorySlug]/
│   │       ├── page.tsx    # Категория + breadcrumbs
│   │       └── [productSlug]/page.tsx  # Товар (SSR): галерея, табы, отзывы
│   ├── brands/
│   │   ├── page.tsx        # Список брендов
│   │   └── [brandSlug]/page.tsx  # Товары бренда
│   ├── cart/page.tsx       # Корзина: товары, промокод, итоги
│   ├── checkout/
│   │   ├── page.tsx        # Чекаут: контакты → доставка → оплата
│   │   └── success/page.tsx # Успешная оплата
│   ├── blog/
│   │   ├── page.tsx        # Список статей
│   │   └── [slug]/page.tsx # Статья (SSG + ISR)
│   ├── about/page.tsx      # О нас
│   ├── delivery/page.tsx   # Доставка и оплата
│   ├── returns/page.tsx    # Возврат
│   ├── contacts/page.tsx   # Контакты + карта
│   ├── privacy/page.tsx    # Политика конфиденциальности
│   └── terms/page.tsx      # Пользовательское соглашение
├── (auth)/                 ── Аутентификация ──
│   ├── login/page.tsx      # Вход: телефон + пароль
│   ├── register/page.tsx   # Регистрация
│   └── forgot-password/page.tsx
├── (account)/              ── Личный кабинет (sidebar) ──
│   ├── layout.tsx          # AccountLayout: боковая навигация
│   └── account/
│       ├── page.tsx        # Дашборд: заказы, бонусы
│       ├── profile/page.tsx        # Профиль
│       ├── skin-profile/page.tsx   # Профиль кожи
│       ├── addresses/page.tsx      # Адреса доставки
│       ├── orders/page.tsx         # История заказов
│       ├── orders/[orderId]/page.tsx # Детали + трекинг
│       ├── favorites/page.tsx      # Избранное
│       ├── bonus/page.tsx          # Бонусный счёт
│       ├── subscriptions/page.tsx  # Автозаказы (2/4/8 недель)
│       ├── notifications/page.tsx  # Уведомления
│       ├── consultations/page.tsx  # ИИ-консультации (фаза 8)
│       └── routine/page.tsx        # Рутина ухода (фаза 8)
├── admin/                  ── Админ-панель (CSR, ADMIN only) ──
│   ├── layout.tsx          # AdminLayout: sidebar, top-bar
│   ├── page.tsx            # Дашборд: заказы, выручка
│   ├── products/page.tsx   # CRUD товаров
│   ├── categories/page.tsx # Категории
│   ├── brands/page.tsx     # Бренды
│   ├── orders/page.tsx     # Управление заказами
│   ├── customers/page.tsx  # Клиенты
│   ├── promotions/page.tsx # Промокоды
│   └── chat/
│       ├── page.tsx              # Чат-сессии
│       ├── system-prompt/page.tsx # Промпт «Лина»
│       └── analytics/page.tsx     # Метрики ИИ
└── api/                    ── API Route Handlers ──
    ├── auth/[...nextauth]/route.ts     # NextAuth v5 (Credentials)
    ├── products/route.ts               # GET: список + фильтры + пагинация
    ├── products/[slug]/route.ts        # GET: товар по slug
    ├── products/[slug]/reviews/route.ts # GET, POST: отзывы
    ├── categories/route.ts    # GET: дерево категорий
    ├── brands/route.ts        # GET: список брендов
    ├── search/route.ts        # GET: полнотекстовый поиск
    ├── cart/route.ts          # GET, POST, DELETE
    ├── cart/[itemId]/route.ts # PATCH, DELETE
    ├── orders/route.ts        # GET (мои), POST (создание)
    ├── payment/create/route.ts   # POST: платёж ЮKassa
    ├── payment/webhook/route.ts  # POST: webhook ЮKassa
    ├── profile/route.ts       # GET, PATCH
    ├── profile/skin/route.ts  # GET, PUT
    ├── addresses/route.ts     # CRUD
    ├── favorites/route.ts     # GET, POST, DELETE
    ├── bonus/route.ts         # GET баланс
    ├── bonus/transactions/route.ts # GET история
    ├── promo/validate/route.ts    # POST проверка промокода
    ├── notifications/route.ts # GET, PATCH
    ├── subscriptions/route.ts # CRUD автозаказов
    ├── blog/route.ts          # GET список
    ├── blog/[slug]/route.ts   # GET пост
    ├── chat/message/route.ts  # POST: SSE-стриминг GigaChat
    ├── chat/session/route.ts  # POST создание, GET список
    ├── chat/history/route.ts  # GET история
    ├── sync/stock/route.ts    # POST от 1С: остатки/цены
    ├── sync/products/route.ts # POST от 1С: товары
    ├── sync/orders/route.ts   # GET: заказы для 1С
    ├── sync/orders/[orderId]/status/route.ts # PATCH из 1С
    ├── sync/status/route.ts   # GET: мониторинг синхронизации
    └── admin/promotions/route.ts # CRUD промокодов (админ)
```

## 4. Компоненты

```
src/components/
├── ui/                     # АТОМЫ — базовые элементы
│   ├── Button.tsx          # primary, secondary, outline, ghost
│   ├── Input.tsx           # Лейбл, ошибка, иконка
│   ├── Badge.tsx           # Хит, новинка, скидка, тип кожи
│   ├── Card.tsx            # Универсальная обёртка
│   ├── Modal.tsx           # Модальное окно + backdrop
│   ├── Skeleton.tsx        # Загрузочные плейсхолдеры
│   ├── PriceDisplay.tsx    # Цена + скидка% + ₽/мл
│   ├── StarRating.tsx      # Звёзды + кол-во отзывов
│   └── CountryFlag.tsx     # Флаг страны + «Оригинал»
├── layout/                 # Структура страницы
│   ├── Header.tsx          # Лого, навигация, поиск, корзина, ЛК
│   ├── Footer.tsx          # Контакты, навигация, соцсети
│   ├── MobileMenu.tsx      # Бургер-меню (Framer Motion)
│   └── Breadcrumbs.tsx     # Хлебные крошки
├── home/                   # Главная страница
│   ├── HeroBanner.tsx      # Карусель баннеров (Embla)
│   ├── PromoSection.tsx    # Акции
│   ├── HitProducts.tsx     # Хиты продаж
│   ├── NewProducts.tsx     # Новинки
│   ├── SaleProducts.tsx    # Распродажа
│   ├── BrandShowcase.tsx   # Логотипы брендов
│   ├── Benefits.tsx        # Преимущества
│   └── Newsletter.tsx      # Подписка на рассылку
├── catalog/
│   └── CatalogFilters.tsx  # Фильтры: категория, бренд, цена, тип кожи
├── product/                # Товар
│   ├── ProductCard.tsx     # Карточка в каталоге
│   ├── ProductQuickView.tsx # Модалка быстрого просмотра
│   ├── ProductGallery.tsx  # Галерея: зум, свайп, видео
│   ├── ProductInfo.tsx     # Инфо-блок (PDP)
│   ├── ProductTabs.tsx     # Табы: состав, применение, отзывы
│   ├── IngredientList.tsx  # Ингредиенты + INCI
│   ├── RoutineStep.tsx     # Шаги рутины
│   ├── RoutineBuilder.tsx  # «Собери рутину» — кросс-селл
│   ├── RelatedProducts.tsx # Похожие товары
│   ├── ReviewSummary.tsx   # Рейтинг-бар
│   └── ReviewForm.tsx      # Форма отзыва
├── cart/
│   ├── CartItem.tsx        # Строка товара
│   ├── CartSummary.tsx     # Итоги
│   └── MiniCart.tsx        # Мини-корзина в Header
├── checkout/
│   ├── ContactForm.tsx     # Имя, телефон, email
│   ├── DeliveryForm.tsx    # Самовывоз / СДЭК / Почта
│   ├── PaymentForm.tsx     # Онлайн / при получении
│   └── OrderConfirm.tsx    # Итоговая сводка
└── chat/                   # ИИ-консультант «Лина» (фаза 8)
    ├── ChatWidget.tsx      # Плавающая кнопка + панель
    ├── ChatMessage.tsx     # Bubble + markdown
    ├── ChatInput.tsx       # Поле ввода
    ├── ChatProductCard.tsx # Карточка товара в чате
    └── QuickButtons.tsx    # Быстрые вопросы
```

## 5. Библиотеки, сторы, типы, хуки

```
src/lib/
├── prisma.ts              # Singleton PrismaClient
├── redis.ts               # Redis: кэш остатков/цен (TTL 5 мин)
├── auth.ts                # NextAuth v5
├── utils.ts               # Форматирование цен, дат
├── seo.ts                 # metadata + JSON-LD
├── yokassa.ts             # Клиент ЮKassa API
├── cdek.ts                # Клиент СДЭК API
├── pochta.ts              # Клиент Почта России API
├── bonus.ts               # Бонусы: начисление 5%, списание, уровни
├── promo.ts               # Валидация промокодов
├── products.ts            # getProducts(), getProductBySlug()
├── sync-monitor.ts        # Логирование синхронизации
├── validators/            # Zod-схемы: auth, order, product, profile
├── notifications/
│   ├── email.ts           # Resend: подтверждения, статусы
│   └── sms.ts             # SMS.ru: коды, статусы
└── ai/                    # Фаза 8
    ├── gigachat.ts        # OAuth2, кэш Redis, auto-refresh
    ├── provider.ts        # Абстрактный AIProvider
    ├── generate.ts        # SSE-стриминг, retry
    ├── prompts.ts         # Системный промпт «Лина»
    └── rag.ts             # Ключевые слова → SQL → top 10

src/stores/
├── cartStore.ts           # items[], promoCode, bonusToUse, totals
├── chatStore.ts           # sessions[], currentMsg, isStreaming
└── uiStore.ts             # isMobileMenu, isSearchOpen, isCartDrawer, quickViewProductId

src/types/
├── product.ts             # Product, Category, Brand, Review, Filter
├── order.ts               # Order, OrderItem, OrderStatus, DeliveryMethod
├── user.ts                # User, SkinProfile, Address, BonusAccount
├── chat.ts                # ChatSession, ChatMessage, ChatMessageRole
└── api.ts                 # ApiResponse<T>, PaginatedResponse<T>, ApiError

src/hooks/
├── useDebounce.ts         # Задержка ввода (поиск, фильтры)
├── useMediaQuery.ts       # isMobile, isTablet, isDesktop
└── useIntersection.ts     # Lazy-load, бесконечная прокрутка
```

---

## 6. Atomic Design — пояснение

| Уровень | Папка | Примеры | Суть |
|---------|-------|---------|------|
| **Atoms** | `ui/` | Button, Input, Badge, Skeleton | Неделимые элементы без бизнес-логики |
| **Molecules** | `product/`, `cart/` | ProductCard, CartItem | Комбинации атомов с минимальной логикой |
| **Organisms** | `layout/`, `checkout/` | Header, CatalogFilters, ChatWidget | Блоки с собственным состоянием |
| **Templates** | `app/**/layout.tsx` | ShopLayout, AdminLayout | Скелеты страниц |
| **Pages** | `app/**/page.tsx` | Каталог, товар, чекаут | Маршруты с загрузкой данных |

Поток данных: **page -> organism -> molecule -> atom**.
Состояние: **Zustand** (корзина, UI) + **React Query** (серверные данные).
