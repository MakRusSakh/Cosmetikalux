# CosmetikaLux 2.0 — Структура проекта

> Полная карта директорий Next.js 15 / App Router

---

## 1. Корневые файлы

```
cosmetikalux/
├── next.config.ts            # Конфигурация Next.js (images, redirects, headers)
├── tailwind.config.ts        # Дизайн-токены: цвета, шрифты, отступы, тени
├── tsconfig.json             # TypeScript — strict mode, path aliases (@/*)
├── package.json              # Зависимости и скрипты (dev, build, seed, lint)
├── .env.example              # Все переменные окружения (БД, Redis, ЮKassa, СДЭК, GigaChat, SMS.ru, Resend)
├── .eslintrc.json            # Линтер
├── .prettierrc               # Форматирование
├── middleware.ts              # Защита маршрутов /account/*, /admin/*
├── docker-compose.yml        # PostgreSQL + Redis + Nginx (для VPS-деплоя)
├── Dockerfile                # Сборка приложения
└── sentry.client.config.ts   # Мониторинг ошибок
```

---

## 2. Prisma

```
prisma/
├── schema.prisma             # Все модели: User, Product, Order, Cart, Chat, Blog, Bonus...
├── seed.ts                   # Тестовые данные: 5 категорий, 3 бренда, 10 товаров
└── migrations/               # Автогенерируемые миграции Prisma
```

---

## 3. Public

```
public/
├── images/                   # Баннеры, промо-материалы, плейсхолдеры
│   └── products/             # Фото товаров (fallback, оптимизация через Sharp)
├── fonts/                    # Playfair Display, Inter (self-hosted)
└── icons/                    # Favicon, PWA-иконки, apple-touch-icon
```

---

## 4. Дерево src/

### 4.1 App Router — маршруты

```
src/app/
├── layout.tsx                # Корневой layout (шрифты, metadata, providers)
├── globals.css               # CSS-переменные, Tailwind-директивы
├── sitemap.ts                # Динамический sitemap (товары, категории, блог)
├── robots.ts                 # robots.txt
│
├── (shop)/                   # Группа — публичный магазин (Header + Footer)
│   ├── layout.tsx            # ShopLayout: Header, Footer, ChatWidget
│   ├── page.tsx              # Главная: Hero, хиты, новинки, бренды, преимущества
│   ├── catalog/
│   │   ├── page.tsx          # Каталог: сетка, фильтры, сортировка, пагинация
│   │   └── [categorySlug]/
│   │       ├── page.tsx      # Категория: товары + breadcrumbs
│   │       └── [productSlug]/
│   │           └── page.tsx  # Страница товара (SSR): галерея, табы, отзывы
│   ├── brands/
│   │   ├── page.tsx          # Список брендов с логотипами
│   │   └── [brandSlug]/
│   │       └── page.tsx      # Товары бренда
│   ├── cart/
│   │   └── page.tsx          # Корзина: товары, промокод, итоги
│   ├── checkout/
│   │   ├── page.tsx          # Чекаут: контакты → доставка → оплата
│   │   └── success/
│   │       └── page.tsx      # Успешная оплата
│   ├── blog/
│   │   ├── page.tsx          # Список статей
│   │   └── [slug]/
│   │       └── page.tsx      # Статья (SSG + ISR)
│   ├── about/page.tsx        # О нас
│   ├── delivery/page.tsx     # Доставка и оплата
│   ├── returns/page.tsx      # Возврат
│   ├── contacts/page.tsx     # Контакты + карта
│   ├── privacy/page.tsx      # Политика конфиденциальности
│   └── terms/page.tsx        # Пользовательское соглашение
│
├── (auth)/                   # Группа — аутентификация (минимальный layout)
│   ├── login/page.tsx        # Вход: телефон + пароль
│   ├── register/page.tsx     # Регистрация
│   └── forgot-password/page.tsx # Восстановление пароля
│
├── (account)/                # Группа — личный кабинет (боковое меню)
│   ├── layout.tsx            # AccountLayout: sidebar-навигация
│   └── account/
│       ├── page.tsx          # Дашборд: последние заказы, бонусы
│       ├── profile/page.tsx  # Профиль: имя, телефон, email, пароль
│       ├── skin-profile/page.tsx # Профиль кожи: тип, проблемы, аллергии
│       ├── addresses/page.tsx    # Адреса доставки (CRUD)
│       ├── orders/
│       │   ├── page.tsx      # История заказов
│       │   └── [orderId]/page.tsx # Детали заказа + трекинг
│       ├── favorites/page.tsx    # Избранные товары
│       ├── bonus/page.tsx        # Бонусный счёт + история
│       ├── subscriptions/page.tsx # Автозаказы (2/4/8 недель)
│       ├── notifications/page.tsx # Уведомления
│       ├── consultations/page.tsx # ИИ-консультации (фаза 8)
│       └── routine/page.tsx       # Рутина ухода (фаза 8)
│
├── admin/                    # Админ-панель (CSR, guard по роли ADMIN)
│   ├── layout.tsx            # AdminLayout: sidebar, top-bar
│   ├── page.tsx              # Дашборд: заказы, выручка, аналитика
│   ├── products/page.tsx     # CRUD товаров
│   ├── categories/page.tsx   # Управление категориями
│   ├── brands/page.tsx       # Управление брендами
│   ├── orders/page.tsx       # Заказы: таблица, смена статуса
│   ├── customers/page.tsx    # Список клиентов
│   ├── promotions/page.tsx   # CRUD промокодов
│   └── chat/
│       ├── page.tsx          # Просмотр чат-сессий
│       ├── system-prompt/page.tsx # Редактирование промпта «Лина»
│       └── analytics/page.tsx     # Метрики ИИ-чата
│
└── api/                      # API Route Handlers
    ├── auth/[...nextauth]/route.ts  # NextAuth v5 (Credentials: телефон + пароль)
    ├── products/
    │   ├── route.ts          # GET: список с фильтрами и пагинацией
    │   └── [slug]/
    │       ├── route.ts      # GET: товар по slug
    │       └── reviews/route.ts # GET, POST: отзывы
    ├── categories/route.ts   # GET: дерево категорий
    ├── brands/route.ts       # GET: список брендов
    ├── search/route.ts       # GET: полнотекстовый поиск (PostgreSQL)
    ├── cart/
    │   ├── route.ts          # GET, POST, DELETE
    │   └── [itemId]/route.ts # PATCH, DELETE
    ├── orders/route.ts       # GET (мои), POST (создание)
    ├── payment/
    │   ├── create/route.ts   # POST: создание платежа ЮKassa
    │   └── webhook/route.ts  # POST: webhook от ЮKassa
    ├── profile/
    │   ├── route.ts          # GET, PATCH
    │   └── skin/route.ts     # GET, PUT
    ├── addresses/route.ts    # CRUD адресов
    ├── favorites/route.ts    # GET, POST, DELETE
    ├── bonus/
    │   ├── route.ts          # GET баланс
    │   └── transactions/route.ts # GET история
    ├── promo/validate/route.ts   # POST проверка промокода
    ├── notifications/route.ts    # GET, PATCH (прочитано)
    ├── subscriptions/route.ts    # CRUD автозаказов
    ├── blog/
    │   ├── route.ts          # GET список
    │   └── [slug]/route.ts   # GET пост
    ├── chat/
    │   ├── message/route.ts  # POST: SSE-стриминг ответа GigaChat
    │   ├── session/route.ts  # POST создание, GET список
    │   └── history/route.ts  # GET история сессии
    ├── sync/
    │   ├── stock/route.ts    # POST от 1С: остатки и цены
    │   ├── products/route.ts # POST от 1С: товары
    │   ├── orders/
    │   │   ├── route.ts      # GET: заказы для 1С
    │   │   └── [orderId]/status/route.ts # PATCH: статус из 1С
    │   └── status/route.ts   # GET: мониторинг синхронизации
    └── admin/
        └── promotions/route.ts # CRUD промокодов (админ)
```

### 4.2 Компоненты

```
src/components/
├── ui/                       # Атомы — базовые элементы
│   ├── Button.tsx            # primary, secondary, outline, ghost
│   ├── Input.tsx             # Лейбл, ошибка, иконка
│   ├── Badge.tsx             # Хит, новинка, скидка, тип кожи
│   ├── Card.tsx              # Универсальная обёртка
│   ├── Modal.tsx             # Модальное окно + backdrop
│   ├── Skeleton.tsx          # Загрузочные плейсхолдеры
│   ├── PriceDisplay.tsx      # Цена + старая цена + скидка% + ₽/мл
│   ├── StarRating.tsx        # Звёзды + кол-во отзывов
│   └── CountryFlag.tsx       # Флаг страны + «Оригинал»
├── layout/                   # Структурные компоненты
│   ├── Header.tsx            # Лого, навигация, поиск, корзина, ЛК
│   ├── Footer.tsx            # Контакты, навигация, соцсети
│   ├── MobileMenu.tsx        # Бургер-меню (Framer Motion)
│   └── Breadcrumbs.tsx       # Хлебные крошки
├── home/                     # Секции главной страницы
│   ├── HeroBanner.tsx        # Карусель баннеров (Embla)
│   ├── PromoSection.tsx      # Акции
│   ├── HitProducts.tsx       # Хиты продаж (карусель)
│   ├── NewProducts.tsx       # Новинки
│   ├── SaleProducts.tsx      # Распродажа
│   ├── BrandShowcase.tsx     # Логотипы брендов
│   ├── Benefits.tsx          # Преимущества магазина
│   └── Newsletter.tsx        # Подписка на рассылку
├── catalog/                  # Каталог
│   └── CatalogFilters.tsx    # Фильтры: категория, бренд, цена, тип кожи
├── product/                  # Товар
│   ├── ProductCard.tsx       # Карточка в каталоге (molecule)
│   ├── ProductQuickView.tsx  # Модалка быстрого просмотра
│   ├── ProductGallery.tsx    # Галерея: зум, свайп, видео
│   ├── ProductInfo.tsx       # Инфо-блок справа от галереи
│   ├── ProductTabs.tsx       # Табы: состав, применение, отзывы
│   ├── IngredientList.tsx    # 3-5 ингредиентов + скрытый INCI
│   ├── RoutineStep.tsx       # Шаги рутины (визуальная цепочка)
│   ├── RoutineBuilder.tsx    # «Собери рутину» — кросс-селл
│   ├── RelatedProducts.tsx   # Похожие товары (карусель)
│   ├── ReviewSummary.tsx     # Рейтинг-бар + мини-отзывы
│   └── ReviewForm.tsx        # Форма отзыва: рейтинг + текст
├── cart/                     # Корзина
│   ├── CartItem.tsx          # Строка товара
│   ├── CartSummary.tsx       # Итоги (сумма, скидки, бонусы)
│   └── MiniCart.tsx          # Мини-корзина в Header
├── checkout/                 # Оформление заказа
│   ├── ContactForm.tsx       # Имя, телефон, email
│   ├── DeliveryForm.tsx      # Самовывоз / СДЭК / Почта
│   ├── PaymentForm.tsx       # Онлайн / при получении
│   └── OrderConfirm.tsx      # Итоговая сводка
└── chat/                     # ИИ-консультант «Лина» (фаза 8)
    ├── ChatWidget.tsx        # Плавающая кнопка + выезжающая панель
    ├── ChatMessage.tsx       # Bubble с markdown-рендерингом
    ├── ChatInput.tsx         # Поле ввода + отправка
    ├── ChatProductCard.tsx   # Мини-карточка товара в чате
    └── QuickButtons.tsx      # Быстрые вопросы
```

### 4.3 Библиотеки, хуки, сторы, типы

```
src/lib/                      # Серверные утилиты и клиенты
├── prisma.ts                 # Singleton PrismaClient
├── redis.ts                  # Подключение к Redis + кэш остатков/цен
├── auth.ts                   # Конфигурация NextAuth v5
├── utils.ts                  # Форматирование цен, дат, pluralize
├── seo.ts                    # Генерация metadata + JSON-LD (Product, BreadcrumbList)
├── yokassa.ts                # Клиент ЮKassa API
├── cdek.ts                   # Клиент СДЭК API: тарифы, ПВЗ, заявки
├── pochta.ts                 # Клиент Почта России API
├── bonus.ts                  # Начисление/списание бонусов, уровни
├── promo.ts                  # Валидация промокодов
├── products.ts               # getProducts(), getProductBySlug()
├── sync-monitor.ts           # Логирование синхронизации, алерты
├── validators/               # Zod-схемы
│   ├── auth.ts               # loginSchema, registerSchema
│   ├── order.ts              # createOrderSchema
│   ├── product.ts            # productFilterSchema
│   └── profile.ts            # updateProfileSchema, skinProfileSchema
├── notifications/
│   ├── email.ts              # Resend: подтверждение, статус заказа
│   └── sms.ts                # SMS.ru: код, статус заказа
└── ai/                       # ИИ-модуль (фаза 8)
    ├── gigachat.ts           # OAuth2 токен, кэш Redis, auto-refresh
    ├── provider.ts           # Абстрактный AIProvider интерфейс
    ├── generate.ts           # SSE-стриминг, retry, обработка ошибок
    ├── prompts.ts            # Системный промпт «Лина», шаблоны
    └── rag.ts                # Ключевые слова → SQL-поиск → top 10 товаров

src/stores/                   # Zustand — клиентский стейт
├── cartStore.ts              # items[], promoCode, bonusToUse, totals
├── chatStore.ts              # sessions[], currentMsg, isStreaming
└── uiStore.ts                # isMobileMenu, isSearchOpen, isCartDrawer, quickViewProductId

src/types/                    # TypeScript-интерфейсы
├── product.ts                # Product, Category, Brand, Review, Filter
├── order.ts                  # Order, OrderItem, OrderStatus, DeliveryMethod
├── user.ts                   # User, SkinProfile, Address, BonusAccount
├── chat.ts                   # ChatSession, ChatMessage, ChatMessageRole
└── api.ts                    # ApiResponse<T>, PaginatedResponse<T>, ApiError

src/hooks/                    # Кастомные React-хуки
├── useDebounce.ts            # Задержка ввода (поиск, фильтры)
├── useMediaQuery.ts          # Адаптив: isMobile, isTablet, isDesktop
└── useIntersection.ts        # Lazy-load, бесконечная прокрутка
```

---

## 5. Atomic Design — пояснение

Проект использует упрощённую модель Atomic Design:

| Уровень | Папка | Примеры | Суть |
|---------|-------|---------|------|
| **Atoms** | `components/ui/` | Button, Input, Badge, Skeleton | Неделимые элементы без бизнес-логики |
| **Molecules** | `components/product/`, `components/cart/` | ProductCard, CartItem, SearchBar | Комбинации атомов с минимальной логикой |
| **Organisms** | `components/layout/`, `components/checkout/` | Header, Footer, CatalogFilters, ChatWidget | Самостоятельные блоки с собственным состоянием |
| **Templates** | `app/**/layout.tsx` | ShopLayout, AccountLayout, AdminLayout | Скелеты страниц (Header + контент + Footer) |
| **Pages** | `app/**/page.tsx` | Каталог, товар, корзина, чекаут | Конечные маршруты с загрузкой данных |

Данные текут сверху вниз: **page → organism → molecule → atom**.
Состояние: **Zustand** (корзина, UI) + **React Query** (серверные данные).
