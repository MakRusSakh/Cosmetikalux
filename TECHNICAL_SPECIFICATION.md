# CosmetikaLux 2.0 — Техническое задание

> Версия: 1.0
> Дата: 2026-03-18
> Платформа: Интернет-магазин корейской косметики премиум-класса

---

## 1. Общие сведения

### 1.1 Цель проекта

Разработка полнофункционального интернет-магазина корейской косметики с ИИ-консультантом, заменяющего текущий сайт на Nethouse (оценка 2.1/10).

### 1.2 Целевая аудитория

| Сегмент | Возраст | Описание |
|---------|---------|----------|
| Основной | 25-45 лет | Женщины, интересующиеся K-beauty, средний+ доход |
| Вторичный | 18-25 лет | Девушки, начинающие уход за кожей, ищут рекомендации |
| Третичный | 45+ | Женщины, ищущие anti-age решения премиум-класса |

### 1.3 География

- Основной регион: Южно-Сахалинск и Сахалинская область
- Доставка: вся Россия (СДЭК + Почта России)

### 1.4 Параметры каталога

| Параметр | Значение |
|----------|----------|
| Текущее количество SKU | ~200 |
| Планируемый рост | до 500-1000 SKU |
| Категории | 15-25 |
| Бренды | 20-40 |

---

## 2. Технологический стек

### 2.1 Frontend

| Технология | Назначение |
|------------|------------|
| **Next.js 15** | Фреймворк (App Router, SSR/SSG) |
| **React 19** | UI-библиотека |
| **TypeScript** | Типизация |
| **Tailwind CSS 4** | Стили (с токенами из дизайн-системы) |
| **Framer Motion** | Анимации |
| **React Query (TanStack)** | Кэширование данных, мутации |
| **Zustand** | Глобальный стейт (корзина, юзер, чат) |
| **React Hook Form + Zod** | Формы и валидация |
| **Embla Carousel** | Карусели товаров |
| **Lucide Icons** | Иконки |

### 2.2 Backend

| Технология | Назначение |
|------------|------------|
| **Next.js API Routes** | API-эндпоинты |
| **Prisma ORM** | Работа с БД |
| **PostgreSQL 16** | Основная база данных |
| **Redis** | Кэш (остатки 1С, сессии, rate limiting) |
| **NextAuth.js v5** | Аутентификация |
| **GigaChat API** | ИИ-консультант |
| **Sharp** | Оптимизация изображений |

### 2.3 Интеграции

| Сервис | Назначение |
|--------|------------|
| **1С** | Синхронизация остатков и цен |
| **ЮKassa** | Приём платежей |
| **СДЭК API** | Доставка + ПВЗ |
| **Почта России API** | Доставка |
| **GigaChat API** | ИИ-консультант |
| **SMS-сервис (SMS.ru)** | SMS-уведомления |
| **Email (Resend)** | Email-уведомления |

### 2.4 Инфраструктура

| Компонент | Решение |
|-----------|---------|
| Хостинг | VPS (Timeweb Cloud / Selectel) или Vercel |
| CDN | Встроенный Next.js Image Optimization + CloudFlare |
| CI/CD | GitHub Actions |
| Мониторинг | Sentry (ошибки) + Vercel Analytics |
| Бэкапы | Автоматические PostgreSQL бэкапы, ежедневно |

---

## 3. Архитектура базы данных

### 3.1 Схема (Prisma)

```prisma
// ═══════════════════════════════════════════
// ПОЛЬЗОВАТЕЛИ
// ═══════════════════════════════════════════

model User {
  id              String    @id @default(cuid())
  email           String?   @unique
  phone           String    @unique
  passwordHash    String
  firstName       String
  lastName        String?
  role            UserRole  @default(CUSTOMER)
  emailVerified   Boolean   @default(false)
  phoneVerified   Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  skinProfile     SkinProfile?
  addresses       Address[]
  orders          Order[]
  reviews         Review[]
  favorites       Favorite[]
  bonusAccount    BonusAccount?
  chatSessions    ChatSession[]
  cartItems       CartItem[]
  subscriptions   ProductSubscription[]
  notifications   Notification[]
}

enum UserRole {
  CUSTOMER
  ADMIN
  MANAGER
}

model SkinProfile {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  skinType        SkinType
  age             Int?
  concerns        String[]    // ["морщины", "акне", "пигментация"]
  allergies       String[]    // ["ретинол", "парабены"]
  preferences     Json?       // { brands: [], textures: [], fragrances: [] }
  updatedAt       DateTime    @updatedAt
}

enum SkinType {
  DRY
  OILY
  COMBINATION
  SENSITIVE
  NORMAL
}

model Address {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  title           String    // "Дом", "Работа"
  fullName        String
  phone           String
  city            String
  street          String
  house           String
  apartment       String?
  postalCode      String
  isDefault       Boolean   @default(false)
  createdAt       DateTime  @default(now())
}

// ═══════════════════════════════════════════
// КАТАЛОГ
// ═══════════════════════════════════════════

model Category {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  description     String?
  image           String?
  parentId        String?
  parent          Category?   @relation("CategoryTree", fields: [parentId], references: [id])
  children        Category[]  @relation("CategoryTree")
  sortOrder       Int         @default(0)
  isActive        Boolean     @default(true)
  seoTitle        String?
  seoDescription  String?
  products        ProductCategory[]
  createdAt       DateTime    @default(now())
}

model Brand {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  description     String?
  logo            String?
  country         String?
  website         String?
  isActive        Boolean   @default(true)
  seoTitle        String?
  seoDescription  String?
  products        Product[]
  sortOrder       Int       @default(0)
}

model Product {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  sku             String    @unique    // артикул
  externalId      String?   @unique    // ID в 1С
  brandId         String
  brand           Brand     @relation(fields: [brandId], references: [id])

  // Описания
  shortDescription  String?
  fullDescription   String?   @db.Text
  composition       String?   @db.Text  // INCI состав
  application       String?   @db.Text  // Способ применения

  // Цены (из 1С)
  price           Decimal   @db.Decimal(10, 2)
  oldPrice        Decimal?  @db.Decimal(10, 2)
  costPrice       Decimal?  @db.Decimal(10, 2)

  // Склад (из 1С)
  stock           Int       @default(0)
  reserved        Int       @default(0)

  // Характеристики
  volume          String?   // "50ml", "100ml"
  skinTypes       SkinType[]
  concerns        String[]  // ["морщины", "увлажнение"]
  ageGroups       String[]  // ["25-35", "35-45"]
  spf             Int?

  // SEO
  seoTitle        String?
  seoDescription  String?
  seoKeywords     String[]

  // Статус
  isActive        Boolean   @default(true)
  isHit           Boolean   @default(false)
  isNew           Boolean   @default(false)
  isSale          Boolean   @default(false)

  // Связи
  images          ProductImage[]
  categories      ProductCategory[]
  reviews         Review[]
  favorites       Favorite[]
  cartItems       CartItem[]
  orderItems      OrderItem[]
  relatedProducts ProductRelation[] @relation("ProductRelations")
  relatedTo       ProductRelation[] @relation("RelatedProducts")
  subscriptions   ProductSubscription[]

  // Даты
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastSyncAt      DateTime? // последняя синхронизация с 1С

  @@index([brandId])
  @@index([price])
  @@index([isActive, isHit])
  @@index([isActive, isNew])
}

model ProductImage {
  id              String    @id @default(cuid())
  productId       String
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  url             String
  alt             String
  sortOrder       Int       @default(0)
  isMain          Boolean   @default(false)
}

model ProductCategory {
  productId       String
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  categoryId      String
  category        Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([productId, categoryId])
}

model ProductRelation {
  id              String          @id @default(cuid())
  productId       String
  product         Product         @relation("ProductRelations", fields: [productId], references: [id])
  relatedId       String
  related         Product         @relation("RelatedProducts", fields: [relatedId], references: [id])
  type            RelationType

  @@unique([productId, relatedId, type])
}

enum RelationType {
  SIMILAR        // Похожие товары
  COMPLEMENTARY  // Дополняющие (сыворотка + крем)
  UPSELL         // Апсейл (более дорогой вариант)
}

// ═══════════════════════════════════════════
// КОРЗИНА И ЗАКАЗЫ
// ═══════════════════════════════════════════

model CartItem {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  productId       String
  product         Product   @relation(fields: [productId], references: [id])
  quantity        Int       @default(1)
  addedAt         DateTime  @default(now())

  @@unique([userId, productId])
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique  // CLX-2026-00001
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  externalId      String?       // ID в 1С

  // Стоимость
  subtotal        Decimal       @db.Decimal(10, 2)
  deliveryPrice   Decimal       @db.Decimal(10, 2) @default(0)
  discount        Decimal       @db.Decimal(10, 2) @default(0)
  bonusUsed       Decimal       @db.Decimal(10, 2) @default(0)
  total           Decimal       @db.Decimal(10, 2)

  // Статус
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   PaymentMethod

  // Доставка
  deliveryMethod  DeliveryMethod
  deliveryAddress Json            // снапшот адреса на момент заказа
  trackingNumber  String?
  cdekUuid        String?         // UUID заказа в СДЭК
  cdekPvzCode     String?         // код ПВЗ СДЭК

  // Оплата
  yukassaPaymentId String?        // ID платежа ЮKassa

  // Промокод
  promoCode       String?
  promoDiscount   Decimal?        @db.Decimal(10, 2)

  // Комментарий
  comment         String?

  // Позиции
  items           OrderItem[]

  // Даты
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  cancelledAt     DateTime?

  @@index([userId])
  @@index([status])
  @@index([orderNumber])
}

model OrderItem {
  id              String    @id @default(cuid())
  orderId         String
  order           Order     @relation(fields: [orderId], references: [id])
  productId       String
  product         Product   @relation(fields: [productId], references: [id])
  quantity        Int
  price           Decimal   @db.Decimal(10, 2) // цена на момент заказа
  total           Decimal   @db.Decimal(10, 2)
}

enum OrderStatus {
  PENDING         // Ожидает оплаты
  PAID            // Оплачен
  PROCESSING      // В обработке
  SHIPPED         // Отправлен
  DELIVERED       // Доставлен
  CANCELLED       // Отменён
  RETURNED        // Возвращён
}

enum PaymentStatus {
  PENDING         // Ожидает
  SUCCEEDED       // Успешно
  CANCELLED       // Отменён
  REFUNDED        // Возвращён
}

enum PaymentMethod {
  CARD            // Банковская карта
  SBP             // СБП
  YOOMONEY        // ЮMoney
  INSTALLMENT     // Рассрочка
}

enum DeliveryMethod {
  CDEK_PVZ        // СДЭК пункт выдачи
  CDEK_COURIER    // СДЭК курьер
  POST_RUSSIA     // Почта России
  LOCAL_COURIER   // Местный курьер (Южно-Сахалинск)
  PICKUP          // Самовывоз
}

// ═══════════════════════════════════════════
// ОТЗЫВЫ
// ═══════════════════════════════════════════

model Review {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  productId       String
  product         Product   @relation(fields: [productId], references: [id])
  rating          Int       // 1-5
  title           String?
  text            String    @db.Text
  pros            String?
  cons            String?
  photos          String[]
  isVerified      Boolean   @default(false) // подтверждённая покупка
  isPublished     Boolean   @default(false)
  createdAt       DateTime  @default(now())

  @@unique([userId, productId])
  @@index([productId, isPublished])
}

// ═══════════════════════════════════════════
// ИЗБРАННОЕ
// ═══════════════════════════════════════════

model Favorite {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  productId       String
  product         Product   @relation(fields: [productId], references: [id])
  createdAt       DateTime  @default(now())

  @@unique([userId, productId])
}

// ═══════════════════════════════════════════
// БОНУСНАЯ ПРОГРАММА
// ═══════════════════════════════════════════

model BonusAccount {
  id              String              @id @default(cuid())
  userId          String              @unique
  user            User                @relation(fields: [userId], references: [id])
  balance         Decimal             @db.Decimal(10, 2) @default(0)
  level           BonusLevel          @default(BRONZE)
  totalSpent      Decimal             @db.Decimal(10, 2) @default(0)
  transactions    BonusTransaction[]
}

enum BonusLevel {
  BRONZE          // 0₽+ — 3% кэшбэк
  SILVER          // 15 000₽+ — 5% кэшбэк
  GOLD            // 50 000₽+ — 7% кэшбэк
  PLATINUM        // 150 000₽+ — 10% кэшбэк
}

model BonusTransaction {
  id              String    @id @default(cuid())
  accountId       String
  account         BonusAccount @relation(fields: [accountId], references: [id])
  amount          Decimal   @db.Decimal(10, 2)
  type            BonusType
  description     String
  orderId         String?
  expiresAt       DateTime?
  createdAt       DateTime  @default(now())
}

enum BonusType {
  EARN            // Начисление
  SPEND           // Списание
  EXPIRE          // Сгорание
  MANUAL          // Ручное (админ)
}

// ═══════════════════════════════════════════
// ИИ-КОНСУЛЬТАНТ
// ═══════════════════════════════════════════

model ChatSession {
  id              String          @id @default(cuid())
  userId          String?
  user            User?           @relation(fields: [userId], references: [id])
  sessionToken    String          @unique  // для неавторизованных
  messages        ChatMessage[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model ChatMessage {
  id              String    @id @default(cuid())
  sessionId       String
  session         ChatSession @relation(fields: [sessionId], references: [id])
  role            ChatRole
  content         String    @db.Text
  metadata        Json?     // рекомендованные товары, кнопки
  createdAt       DateTime  @default(now())
}

enum ChatRole {
  USER
  ASSISTANT
  SYSTEM
}

// ═══════════════════════════════════════════
// ПОДПИСКИ НА АВТОЗАКАЗ
// ═══════════════════════════════════════════

model ProductSubscription {
  id              String                @id @default(cuid())
  userId          String
  user            User                  @relation(fields: [userId], references: [id])
  productId       String
  product         Product               @relation(fields: [productId], references: [id])
  intervalDays    Int                   // 30, 60, 90
  status          SubscriptionStatus    @default(ACTIVE)
  nextOrderDate   DateTime
  createdAt       DateTime              @default(now())
}

enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
}

// ═══════════════════════════════════════════
// АКЦИИ И ПРОМОКОДЫ
// ═══════════════════════════════════════════

model Promotion {
  id              String          @id @default(cuid())
  code            String          @unique
  type            PromotionType
  value           Decimal         @db.Decimal(10, 2) // сумма или процент
  minOrderAmount  Decimal?        @db.Decimal(10, 2)
  maxUses         Int?
  usedCount       Int             @default(0)
  startsAt        DateTime
  endsAt          DateTime
  isActive        Boolean         @default(true)
  description     String?
}

enum PromotionType {
  PERCENTAGE      // Скидка в %
  FIXED           // Фиксированная сумма
  FREE_DELIVERY   // Бесплатная доставка
}

// ═══════════════════════════════════════════
// БЛОГ
// ═══════════════════════════════════════════

model BlogPost {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  excerpt         String?
  content         String    @db.Text
  coverImage      String?
  tags            String[]
  isPublished     Boolean   @default(false)
  publishedAt     DateTime?
  seoTitle        String?
  seoDescription  String?
  viewCount       Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// ═══════════════════════════════════════════
// УВЕДОМЛЕНИЯ
// ═══════════════════════════════════════════

model Notification {
  id              String            @id @default(cuid())
  userId          String
  user            User              @relation(fields: [userId], references: [id])
  type            NotificationType
  title           String
  message         String
  isRead          Boolean           @default(false)
  metadata        Json?
  createdAt       DateTime          @default(now())
}

enum NotificationType {
  ORDER_STATUS
  PRICE_DROP
  BACK_IN_STOCK
  BONUS_EARNED
  BONUS_EXPIRING
  PROMOTION
  NEW_PRODUCT
}

// ═══════════════════════════════════════════
// ЛОГ СИНХРОНИЗАЦИИ
// ═══════════════════════════════════════════

model SyncLog {
  id              String    @id @default(cuid())
  type            String    // "prices", "stock", "orders"
  status          String    // "success", "error"
  itemsProcessed  Int       @default(0)
  errors          Json?
  startedAt       DateTime  @default(now())
  completedAt     DateTime?
}
```

---

## 4. API-эндпоинты

### 4.1 Каталог

```
GET    /api/products                    Список товаров (фильтры, сортировка, пагинация)
GET    /api/products/:slug              Товар по slug
GET    /api/products/:slug/reviews      Отзывы товара
GET    /api/products/:slug/related      Связанные товары

GET    /api/categories                  Дерево категорий
GET    /api/categories/:slug            Категория с товарами

GET    /api/brands                      Список брендов
GET    /api/brands/:slug                Бренд с товарами

GET    /api/search?q=                   Полнотекстовый поиск
GET    /api/search/suggest?q=           Автодополнение (top 5)
```

**Параметры фильтрации товаров:**

```
GET /api/products?
  category=uhod-za-licom            // slug категории
  brand=sulwhasoo,cosrx             // slug брендов (через запятую)
  skinType=DRY,COMBINATION          // типы кожи
  concern=морщины,увлажнение        // проблемы кожи
  ageGroup=25-35,35-45              // возрастные группы
  priceMin=1000                     // мин цена
  priceMax=10000                    // макс цена
  inStock=true                      // только в наличии
  isHit=true                        // хиты
  isNew=true                        // новинки
  isSale=true                       // со скидкой
  sort=price_asc|price_desc|popular|new|rating
  page=1
  limit=20
```

### 4.2 Аутентификация

```
POST   /api/auth/register              Регистрация (телефон + пароль)
POST   /api/auth/login                 Вход
POST   /api/auth/logout                Выход
POST   /api/auth/forgot-password       Восстановление пароля
POST   /api/auth/reset-password        Сброс пароля
POST   /api/auth/verify-phone          Подтверждение телефона (SMS-код)
GET    /api/auth/me                    Текущий пользователь
```

### 4.3 Личный кабинет

```
GET    /api/profile                    Профиль пользователя
PUT    /api/profile                    Обновление профиля
GET    /api/profile/skin               Профиль кожи
PUT    /api/profile/skin               Обновление профиля кожи

GET    /api/addresses                  Адреса доставки
POST   /api/addresses                  Добавить адрес
PUT    /api/addresses/:id              Обновить адрес
DELETE /api/addresses/:id              Удалить адрес

GET    /api/favorites                  Избранное
POST   /api/favorites/:productId       Добавить в избранное
DELETE /api/favorites/:productId       Удалить из избранного

GET    /api/notifications              Уведомления
PUT    /api/notifications/:id/read     Отметить прочитанным
PUT    /api/notifications/read-all     Отметить все прочитанными
```

### 4.4 Корзина

```
GET    /api/cart                       Содержимое корзины
POST   /api/cart                       Добавить товар
PUT    /api/cart/:itemId               Изменить количество
DELETE /api/cart/:itemId               Удалить товар
DELETE /api/cart                       Очистить корзину
POST   /api/cart/promo                 Применить промокод
DELETE /api/cart/promo                 Убрать промокод
```

### 4.5 Заказы

```
POST   /api/orders                     Создать заказ
GET    /api/orders                     Мои заказы
GET    /api/orders/:id                 Детали заказа
POST   /api/orders/:id/cancel          Отменить заказ
POST   /api/orders/:id/repeat          Повторить заказ (в корзину)
```

### 4.6 Оплата (ЮKassa)

```
POST   /api/payment/create             Создать платёж
POST   /api/payment/webhook            Webhook от ЮKassa (подтверждение/отмена)
GET    /api/payment/:id/status         Статус платежа
```

### 4.7 Доставка

```
POST   /api/delivery/calculate         Расчёт стоимости доставки
GET    /api/delivery/cdek/pvz          Список ПВЗ СДЭК (по городу)
GET    /api/delivery/tracking/:orderId Трекинг заказа
```

### 4.8 ИИ-консультант

```
POST   /api/chat/session               Создать/получить сессию
POST   /api/chat/message               Отправить сообщение (streaming SSE)
GET    /api/chat/history                История диалогов
GET    /api/chat/session/:id            Конкретная сессия с сообщениями
```

### 4.9 Бонусы

```
GET    /api/bonus                      Бонусный счёт
GET    /api/bonus/transactions          История бонусов
GET    /api/bonus/calculate?amount=     Расчёт бонусов для заказа
```

### 4.10 Блог

```
GET    /api/blog                       Список статей
GET    /api/blog/:slug                 Статья по slug
GET    /api/blog/tags                  Список тегов
```

### 4.11 Синхронизация с 1С

```
POST   /api/sync/prices                Обновление цен (от 1С)
POST   /api/sync/stock                 Обновление остатков (от 1С)
POST   /api/sync/products              Создание/обновление товаров (от 1С)
POST   /api/sync/order-status          Обновление статуса заказа (от 1С)
GET    /api/sync/orders/new            Новые заказы для 1С (pull)
GET    /api/sync/log                   Лог синхронизации (админ)
```

**Авторизация 1С:**
- API-ключ в заголовке `X-Api-Key`
- IP-whitelist
- Rate limiting: 100 req/min

### 4.12 Админ API

```
// Товары
GET    /api/admin/products             Список (расширенный)
POST   /api/admin/products             Создать товар
PUT    /api/admin/products/:id         Обновить товар
DELETE /api/admin/products/:id         Удалить товар
POST   /api/admin/products/import      Массовый импорт (CSV/1С)

// Заказы
GET    /api/admin/orders               Все заказы (фильтры)
PUT    /api/admin/orders/:id/status    Изменить статус
GET    /api/admin/orders/export        Экспорт заказов

// Клиенты
GET    /api/admin/customers            Список клиентов
GET    /api/admin/customers/:id        Детали клиента

// Акции
GET    /api/admin/promotions           Список акций
POST   /api/admin/promotions           Создать акцию
PUT    /api/admin/promotions/:id       Обновить
DELETE /api/admin/promotions/:id       Удалить

// Аналитика
GET    /api/admin/analytics/dashboard  Дашборд (продажи, визиты)
GET    /api/admin/analytics/products   Топ товаров
GET    /api/admin/analytics/customers  Аналитика клиентов

// Блог
POST   /api/admin/blog                 Создать статью
PUT    /api/admin/blog/:id             Обновить
DELETE /api/admin/blog/:id             Удалить

// Настройки
GET    /api/admin/settings             Все настройки
PUT    /api/admin/settings             Обновить настройки

// ИИ
GET    /api/admin/chat/sessions        Все чат-сессии
PUT    /api/admin/chat/system-prompt   Обновить системный промпт
GET    /api/admin/chat/analytics       Аналитика чата
```

---

## 5. Страницы и маршруты

### 5.1 Публичные страницы

```
/                                   Главная
/catalog                            Каталог (все товары)
/catalog/:categorySlug              Категория
/product/:productSlug               Страница товара
/brands                             Все бренды
/brands/:brandSlug                  Страница бренда
/search?q=                          Поиск
/sale                               Акции и скидки
/new                                Новинки
/blog                               Блог
/blog/:postSlug                     Статья блога
/about                              О магазине
/delivery                           Доставка и оплата
/returns                            Возврат и обмен
/contacts                           Контакты
/privacy                            Политика конфиденциальности
/terms                              Пользовательское соглашение
```

### 5.2 Личный кабинет (авторизация)

```
/auth/login                         Вход
/auth/register                      Регистрация
/auth/forgot-password               Восстановление пароля
/auth/reset-password                Сброс пароля

/account                            Дашборд ЛК
/account/profile                    Профиль
/account/skin-profile               Профиль кожи
/account/orders                     Мои заказы
/account/orders/:id                 Детали заказа
/account/favorites                  Избранное
/account/addresses                  Адреса
/account/bonus                      Бонусная программа
/account/subscriptions              Подписки на автозаказ
/account/consultations              Мои консультации
/account/routine                    Моя рутина ухода
/account/notifications              Уведомления
```

### 5.3 Оформление заказа

```
/cart                               Корзина
/checkout                           Оформление заказа
/checkout/success                   Успешный заказ
/checkout/fail                      Ошибка оплаты
```

### 5.4 Админ-панель

```
/admin                              Дашборд
/admin/products                     Управление товарами
/admin/products/new                 Создание товара
/admin/products/:id/edit            Редактирование товара
/admin/categories                   Категории
/admin/brands                       Бренды
/admin/orders                       Заказы
/admin/orders/:id                   Детали заказа
/admin/customers                    Клиенты
/admin/customers/:id                Клиент
/admin/promotions                   Акции и промокоды
/admin/bonus                        Бонусная программа
/admin/blog                         Блог
/admin/blog/new                     Создание статьи
/admin/blog/:id/edit                Редактирование статьи
/admin/chat                         ИИ-консультант
/admin/analytics                    Аналитика
/admin/sync                         Синхронизация 1С
/admin/settings                     Настройки
```

---

## 6. Детальные требования по модулям

### 6.1 Модуль: Каталог и товары

#### Карточка товара (страница /product/:slug)

**Секции:**

1. **Галерея** (слева, 50% ширины)
   - Главное фото — крупное, zoom при hover
   - Миниатюры снизу (до 10 фото)
   - Навигация стрелками и свайпом
   - Полноэкранный режим по клику

2. **Информация** (справа, 50% ширины)
   - Хлебные крошки
   - Бренд (ссылка)
   - Название товара (H1)
   - Рейтинг (звёзды + количество отзывов, ссылка)
   - Цена (текущая + старая если скидка + процент скидки)
   - Наличие (в наличии / мало / нет — из 1С)
   - Объём (если несколько вариантов — переключатель)
   - Кнопка «В корзину» (с количеством)
   - Кнопка «В избранное»
   - Кнопка «Спросить консультанта» → открывает чат ИИ с контекстом товара
   - Доставка: СДЭК от X₽ / Почта от Y₽ / Бесплатно от Z₽
   - Промо: «До бесплатной доставки осталось N₽»

3. **Табы** (под галереей и информацией)
   - Описание (полный текст)
   - Состав (INCI с пояснениями)
   - Применение (пошаговая инструкция)
   - Отзывы (с фото, рейтинг, фильтр по звёздам)

4. **Связанные товары**
   - «С этим товаром покупают» (карусель)
   - «Похожие товары» (карусель)
   - «Полная рутина» (если товар часть рутины)

#### Список товаров (страница /catalog)

- Сетка: 4 столбца (десктоп), 2 (планшет), 1-2 (мобайл)
- Переключатель вида: сетка / список
- Фильтры в сайдбаре (десктоп) / выдвижная панель (мобайл)
- Faceted search — счётчики в каждом фильтре
- Бесконечный скролл или пагинация (настраивается)
- Быстрый просмотр товара (модалка по кнопке «Быстрый просмотр»)
- SEO: канонические URL, meta-теги, Schema.org Product

### 6.2 Модуль: ИИ Beauty-консультант (GigaChat)

#### Системный промпт

```
Ты — Лина, персональный beauty-консультант интернет-магазина CosmetikaLux,
специализирующегося на корейской косметике премиум-класса.

РОЛЬ:
- Ты эксперт по корейскому уходу за кожей с 10-летним опытом
- Ты знаешь весь ассортимент магазина, составы, совместимость средств
- Ты общаешься дружелюбно, профессионально, с заботой
- Ты всегда рекомендуешь товары из каталога магазина

ПРАВИЛА:
1. Всегда задавай уточняющие вопросы: тип кожи, возраст, проблемы, бюджет
2. Рекомендуй 2-5 товаров, не больше, с кратким пояснением почему
3. Учитывай наличие на складе — не рекомендуй то, чего нет
4. При возможности предлагай комплекс/рутину, а не один товар
5. Упоминай текущие акции и скидки
6. Если покупатель сомневается — расскажи о составе и результатах
7. Никогда не рекомендуй товары конкурентов
8. Если вопрос не про косметику — вежливо верни к теме
9. Отвечай на русском языке
10. Используй структурированные ответы с карточками товаров

КОНТЕКСТ ПОКУПАТЕЛЯ:
{skinProfile}
{orderHistory}
{currentCart}

ДОСТУПНЫЕ ТОВАРЫ (релевантные запросу):
{relevantProducts}

ТЕКУЩИЕ АКЦИИ:
{activePromotions}
```

#### RAG (Retrieval-Augmented Generation)

Для поиска релевантных товаров по запросу:

1. Запрос покупателя анализируется
2. Извлекаются ключевые слова: тип кожи, проблема, бренд, категория
3. По ключевым словам делается SQL-запрос к базе товаров (полнотекстовый поиск + фильтры)
4. Топ-10 релевантных товаров добавляются в контекст GigaChat
5. GigaChat формирует ответ с рекомендациями

**Формат товара в контексте:**
```json
{
  "id": "product_123",
  "name": "Sulwhasoo Essential Balancing Emulsion EX",
  "brand": "Sulwhasoo",
  "price": 4500,
  "oldPrice": 5200,
  "stock": 12,
  "skinTypes": ["DRY", "NORMAL"],
  "concerns": ["увлажнение", "питание", "anti-age"],
  "ageGroups": ["30-40", "40-50"],
  "shortDescription": "Балансирующая эмульсия...",
  "rating": 4.8,
  "reviewCount": 24
}
```

#### Streaming ответов

- Используем Server-Sent Events (SSE) для потокового вывода
- Ответ GigaChat стримится по токенам
- Карточки товаров вставляются после завершения рекомендации
- Индикатор «печатает...» во время генерации

#### Хранение контекста

- Последние 20 сообщений хранятся в сессии
- При авторизации — сессия привязывается к пользователю
- История сохраняется в БД для повторного просмотра
- Профиль кожи автоматически подгружается в контекст

### 6.3 Модуль: Корзина и оформление заказа

#### Корзина (/cart)

- Список товаров с фото, названием, ценой, количеством
- Изменение количества (+/- и ручной ввод)
- Удаление товара (с подтверждением)
- Проверка наличия в реальном времени (Redis кэш из 1С)
- Промокод (поле + кнопка «Применить»)
- Подсчёт: подытог, скидка, бонусы, доставка (предварительно), итого
- Рекомендации: «Добавьте ещё на X₽ для бесплатной доставки»
- Кнопка «Оформить заказ»
- Хранение: авторизованные — в БД, неавторизованные — localStorage + мерж при логине

#### Оформление (/checkout)

**Шаг 1 — Контактные данные** (если не авторизован)
- Имя, телефон, email
- Предложение войти / зарегистрироваться

**Шаг 2 — Доставка**
- Выбор способа: СДЭК ПВЗ / СДЭК курьер / Почта России / Местный курьер / Самовывоз
- СДЭК ПВЗ: виджет с картой ПВЗ
- СДЭК курьер: адрес из ЛК или ввод нового
- Почта: адрес + индекс
- Расчёт стоимости через API (по весу товаров)
- Выбор даты/времени (для курьера)

**Шаг 3 — Оплата**
- Выбор способа: Карта / СБП / ЮMoney
- Использование бонусов (слайдер или ввод суммы)
- Промокод (если не применён в корзине)
- Итоговая сумма
- Согласие с офертой

**Шаг 4 — Подтверждение**
- Сводка заказа
- Кнопка «Оплатить»
- Редирект на ЮKassa

**После оплаты:**
- Webhook от ЮKassa → обновление статуса
- Отправка заказа в 1С
- SMS + email с подтверждением
- Начисление бонусов
- Страница «Спасибо за заказ» с номером и трекингом

### 6.4 Модуль: Интеграция с 1С

#### Направление: 1С → Сайт

**Остатки и цены (каждые 5-15 минут):**
```
1С вызывает POST /api/sync/stock с массивом:
[
  { "externalId": "1c_123", "stock": 15, "price": 4500, "oldPrice": 5200 },
  { "externalId": "1c_456", "stock": 0, "price": 3200, "oldPrice": null },
  ...
]
```

**Новые товары (по событию):**
```
1С вызывает POST /api/sync/products с данными товара:
{
  "externalId": "1c_789",
  "name": "Sulwhasoo Essential Cream",
  "sku": "SLW-EC-50",
  "brand": "Sulwhasoo",
  "price": 6800,
  "stock": 8,
  "volume": "50ml",
  ...
}
```

**Статус заказа (по событию):**
```
POST /api/sync/order-status
{
  "orderNumber": "CLX-2026-00042",
  "status": "SHIPPED",
  "trackingNumber": "1234567890"
}
```

#### Направление: Сайт → 1С

**Новые заказы (мгновенно по webhook или pull каждые 2 мин):**
```
GET /api/sync/orders/new
→ Возвращает новые заказы в формате, понятном 1С
```

#### Кэширование

- Redis хранит кэш остатков (TTL: 5 мин)
- При запросе товара — сначала Redis, потом БД
- При обновлении из 1С — Redis инвалидируется
- Если 1С недоступна > 30 мин — уведомление админу

### 6.5 Модуль: Оплата (ЮKassa)

#### Создание платежа

```javascript
// POST /api/payment/create
{
  orderId: "CLX-2026-00042",
  amount: 8500.00,
  currency: "RUB",
  description: "Заказ CLX-2026-00042 в CosmetikaLux",
  paymentMethod: "bank_card", // или "sbp", "yoo_money"
  returnUrl: "https://cosmetikalux.ru/checkout/success?order=CLX-2026-00042",
  metadata: { orderId: "..." }
}
```

#### Webhook обработка

```
POST /api/payment/webhook
- Проверка IP ЮKassa
- Проверка подписи
- payment.succeeded → OrderStatus.PAID, начисление бонусов
- payment.canceled → OrderStatus.CANCELLED
- refund.succeeded → OrderStatus.RETURNED, возврат бонусов
```

#### Безопасность

- Webhook только с IP ЮKassa
- Идемпотентность (дубли webhook игнорируются)
- Сверка суммы платежа с суммой заказа
- Логирование всех операций

### 6.6 Модуль: Доставка

#### СДЭК

**Расчёт стоимости:**
```
POST /api/delivery/calculate
{
  cityTo: "Москва",
  weight: 350,     // граммы
  length: 20,      // см
  width: 15,
  height: 10
}
→ { cdekPvz: 350, cdekCourier: 550, postRussia: 280 }
```

**Выбор ПВЗ:**
- Виджет СДЭК (официальный JS-виджет) на странице чекаута
- Поиск по городу → список ПВЗ на карте
- Возврат: код ПВЗ, адрес, режим работы

**Создание заказа в СДЭК:**
- Автоматически после оплаты
- API v2 СДЭК: создание заказа → получение UUID → трекинг

#### Почта России

**Расчёт:**
- API Почты России (тариф 1 класса / посылки)
- По индексу назначения и весу

**Создание:**
- Автоматическое создание отправления
- Получение трек-номера
- Трекинг через API

### 6.7 Модуль: Бонусная программа

#### Уровни

| Уровень | Накопления | Кэшбэк | Привилегии |
|---------|-----------|---------|------------|
| Бронза | 0₽ | 3% | Базовые |
| Серебро | от 15 000₽ | 5% | Ранний доступ к акциям |
| Золото | от 50 000₽ | 7% | + бесплатная доставка от 3000₽ |
| Платина | от 150 000₽ | 10% | + персональные скидки, подарки |

#### Правила

- 1 бонус = 1 рубль
- Начисление после доставки заказа (не сразу)
- Списание: до 30% от суммы заказа
- Сгорание: через 365 дней с момента начисления
- Уведомление: за 30 дней до сгорания

### 6.8 Модуль: SEO

#### Автоматическое SEO

Для каждой страницы автоматически генерируются:

**Товар:**
```html
<title>{Бренд} {Название} — купить в CosmetikaLux | {Цена}₽</title>
<meta name="description" content="Купить {Название} от {Бренд}. {Короткое описание}. Цена {Цена}₽. Бесплатная доставка от {N}₽. Оригинальная корейская косметика.">
```

**Категория:**
```html
<title>{Категория} — корейская косметика | CosmetikaLux</title>
<meta name="description" content="{Категория} — {N} товаров. {Описание категории}. Бесплатная доставка. Бонусы за покупки.">
```

#### Schema.org

```json
// Товар
{
  "@type": "Product",
  "name": "...",
  "brand": { "@type": "Brand", "name": "..." },
  "offers": {
    "@type": "Offer",
    "price": "4500",
    "priceCurrency": "RUB",
    "availability": "InStock",
    "seller": { "@type": "Organization", "name": "CosmetikaLux" }
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "24" }
}

// Организация (на всех страницах)
{
  "@type": "LocalBusiness",
  "name": "CosmetikaLux",
  "address": { ... },
  "telephone": "...",
  "openingHours": "..."
}

// Хлебные крошки
{
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

#### Sitemap

- Автогенерация при изменении каталога
- Секции: страницы, товары, категории, бренды, блог
- lastmod из updatedAt
- Приоритеты: главная 1.0, категории 0.8, товары 0.7, блог 0.6

---

## 7. Безопасность

### 7.1 Аутентификация

- JWT токены (access 15 мин + refresh 30 дней)
- HttpOnly cookies для refresh token
- Хеширование паролей: bcrypt (salt rounds: 12)
- Rate limiting: 5 попыток логина / 15 мин
- SMS-верификация при регистрации

### 7.2 Защита API

- CORS: только домен cosmetikalux.ru
- CSRF-токены для мутаций
- Rate limiting: 60 req/min (общий), 10 req/min (чат ИИ)
- Валидация всех входных данных (Zod)
- SQL-инъекции: Prisma ORM (параметризованные запросы)
- XSS: санитизация HTML, Content-Security-Policy
- 1С API: API-ключ + IP whitelist

### 7.3 Данные

- Пароли: bcrypt
- Платёжные данные: не хранятся (ЮKassa обрабатывает)
- Персональные данные: шифрование в БД
- HTTPS everywhere
- Бэкапы БД: ежедневно, хранение 30 дней
- Соответствие 152-ФЗ (персональные данные)

---

## 8. Производительность

### 8.1 Целевые метрики

| Метрика | Цель |
|---------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTFB (Time to First Byte) | < 600ms |
| Lighthouse Score | > 90 |

### 8.2 Оптимизации

- SSG для статических страниц (главная, about, блог)
- ISR для каталога (revalidate: 60s)
- SSR для страницы товара (актуальные остатки)
- Image optimization: Next.js Image (WebP/AVIF, lazy loading)
- Bundle splitting (dynamic imports для модалок, чата)
- Redis кэш для частых запросов
- CDN для статики
- Шрифты: font-display: swap, preload

---

## 9. Структура файлов проекта

```
cosmetikalux/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
│   ├── fonts/
│   ├── images/
│   ├── icons/
│   └── robots.txt
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (shop)/                   # Группа: магазин
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Главная
│   │   │   ├── catalog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [categorySlug]/
│   │   │   │       └── page.tsx
│   │   │   ├── product/
│   │   │   │   └── [productSlug]/
│   │   │   │       └── page.tsx
│   │   │   ├── brands/
│   │   │   ├── search/
│   │   │   ├── sale/
│   │   │   ├── new/
│   │   │   ├── blog/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── about/
│   │   │   ├── delivery/
│   │   │   ├── returns/
│   │   │   ├── contacts/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   │
│   │   ├── (auth)/                   # Группа: авторизация
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   │
│   │   ├── (account)/                # Группа: ЛК
│   │   │   ├── layout.tsx
│   │   │   └── account/
│   │   │       ├── page.tsx
│   │   │       ├── profile/
│   │   │       ├── skin-profile/
│   │   │       ├── orders/
│   │   │       ├── favorites/
│   │   │       ├── addresses/
│   │   │       ├── bonus/
│   │   │       ├── subscriptions/
│   │   │       ├── consultations/
│   │   │       ├── routine/
│   │   │       └── notifications/
│   │   │
│   │   ├── admin/                    # Админ-панель
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Дашборд
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── brands/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── promotions/
│   │   │   ├── bonus/
│   │   │   ├── blog/
│   │   │   ├── chat/
│   │   │   ├── analytics/
│   │   │   ├── sync/
│   │   │   └── settings/
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── brands/
│   │   │   ├── search/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── payment/
│   │   │   ├── delivery/
│   │   │   ├── chat/
│   │   │   ├── profile/
│   │   │   ├── favorites/
│   │   │   ├── addresses/
│   │   │   ├── bonus/
│   │   │   ├── notifications/
│   │   │   ├── blog/
│   │   │   ├── sync/
│   │   │   └── admin/
│   │   │
│   │   ├── sitemap.ts                # Динамический sitemap
│   │   ├── robots.ts                 # robots.txt
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # Базовые UI-компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Rating.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                   # Структурные
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── CategoryNav.tsx
│   │   │   └── SearchBar.tsx
│   │   │
│   │   ├── product/                  # Товар
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── ProductTabs.tsx
│   │   │   ├── ProductCarousel.tsx
│   │   │   ├── QuickView.tsx
│   │   │   └── FilterSidebar.tsx
│   │   │
│   │   ├── cart/                     # Корзина
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── PromoCode.tsx
│   │   │
│   │   ├── checkout/                 # Чекаут
│   │   │   ├── CheckoutSteps.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── DeliverySelector.tsx
│   │   │   ├── CdekWidget.tsx
│   │   │   ├── PaymentSelector.tsx
│   │   │   └── OrderSummary.tsx
│   │   │
│   │   ├── chat/                     # ИИ-чат
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatProductCard.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── QuickButtons.tsx
│   │   │
│   │   ├── account/                  # ЛК
│   │   │   ├── AccountSidebar.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── SkinProfileForm.tsx
│   │   │   ├── RoutineBuilder.tsx
│   │   │   └── BonusCard.tsx
│   │   │
│   │   ├── home/                     # Главная
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── Benefits.tsx
│   │   │   ├── BestSellers.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── BrandSlider.tsx
│   │   │   ├── AiPromo.tsx
│   │   │   ├── NewArrivals.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   └── Newsletter.tsx
│   │   │
│   │   └── admin/                    # Админка
│   │       ├── AdminSidebar.tsx
│   │       ├── DataTable.tsx
│   │       ├── Charts.tsx
│   │       ├── ProductForm.tsx
│   │       └── ...
│   │
│   ├── lib/                          # Утилиты и сервисы
│   │   ├── prisma.ts                 # Prisma client
│   │   ├── redis.ts                  # Redis client
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── gigachat.ts               # GigaChat API client
│   │   ├── yukassa.ts                # ЮKassa client
│   │   ├── cdek.ts                   # СДЭК API client
│   │   ├── post-russia.ts            # Почта России client
│   │   ├── sms.ts                    # SMS service
│   │   ├── email.ts                  # Email service
│   │   ├── sync.ts                   # 1С sync logic
│   │   ├── bonus.ts                  # Bonus calculations
│   │   ├── search.ts                 # Full-text search
│   │   ├── seo.ts                    # SEO helpers
│   │   ├── utils.ts                  # Общие утилиты
│   │   └── validations.ts            # Zod schemas
│   │
│   ├── hooks/                        # React hooks
│   │   ├── useCart.ts
│   │   ├── useChat.ts
│   │   ├── useFavorites.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useIntersection.ts
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── cartStore.ts
│   │   ├── chatStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/                        # TypeScript types
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   ├── chat.ts
│   │   └── api.ts
│   │
│   └── styles/
│       └── globals.css               # Tailwind + custom styles
│
├── .env.local                        # Переменные окружения
├── .env.example                      # Пример .env
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 10. Переменные окружения

```env
# База данных
DATABASE_URL=postgresql://user:pass@localhost:5432/cosmetikalux
REDIS_URL=redis://localhost:6379

# Аутентификация
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://cosmetikalux.ru

# GigaChat
GIGACHAT_CLIENT_ID=...
GIGACHAT_CLIENT_SECRET=...
GIGACHAT_SCOPE=GIGACHAT_API_PERS

# ЮKassa
YUKASSA_SHOP_ID=...
YUKASSA_SECRET_KEY=...
YUKASSA_WEBHOOK_SECRET=...

# СДЭК
CDEK_CLIENT_ID=...
CDEK_CLIENT_SECRET=...
CDEK_API_URL=https://api.cdek.ru/v2

# Почта России
POST_RUSSIA_TOKEN=...
POST_RUSSIA_API_URL=https://otpravka-api.pochta.ru

# SMS
SMS_RU_API_KEY=...

# Email
RESEND_API_KEY=...
EMAIL_FROM=noreply@cosmetikalux.ru

# 1С Sync
SYNC_1C_API_KEY=...
SYNC_1C_ALLOWED_IPS=192.168.1.100,10.0.0.50

# Общее
NEXT_PUBLIC_SITE_URL=https://cosmetikalux.ru
NEXT_PUBLIC_SITE_NAME=CosmetikaLux
```

---

## 11. Этапы разработки

### Фаза 1: Фундамент (2 недели)

- [ ] Инициализация Next.js проекта
- [ ] Настройка Tailwind с дизайн-токенами
- [ ] Подключение PostgreSQL + Prisma
- [ ] Модели данных + миграции
- [ ] Базовые UI-компоненты (кнопки, инпуты, карточки)
- [ ] Layout: Header + Footer + навигация
- [ ] Аутентификация (NextAuth)

### Фаза 2: Каталог (2 недели)

- [ ] CRUD товаров (админ)
- [ ] Страница каталога с фильтрами
- [ ] Страница товара (галерея, описание, табы)
- [ ] Категории и бренды
- [ ] Поиск (полнотекстовый)
- [ ] SEO (meta, Schema.org, sitemap)

### Фаза 3: Покупка (2 недели)

- [ ] Корзина
- [ ] Оформление заказа (чекаут)
- [ ] Интеграция ЮKassa
- [ ] Интеграция СДЭК + Почта России
- [ ] Управление заказами (ЛК + админ)
- [ ] Email/SMS уведомления

### Фаза 4: ИИ и ЛК (2 недели)

- [ ] Интеграция GigaChat
- [ ] Чат-виджет (UI + SSE streaming)
- [ ] RAG: поиск товаров по запросу
- [ ] Профиль кожи
- [ ] Рутина ухода
- [ ] Избранное

### Фаза 5: Бизнес-логика (1 неделя)

- [ ] Бонусная программа
- [ ] Промокоды и акции
- [ ] Подписки на автозаказ
- [ ] Уведомления

### Фаза 6: Интеграция 1С (1 неделя)

- [ ] API синхронизации остатков
- [ ] API синхронизации цен
- [ ] Передача заказов в 1С
- [ ] Кэширование Redis
- [ ] Мониторинг синхронизации

### Фаза 7: Контент и запуск (1 неделя)

- [ ] Блог
- [ ] Статические страницы (о нас, доставка, возврат)
- [ ] Наполнение каталога
- [ ] Тестирование (E2E, интеграционное)
- [ ] Оптимизация производительности
- [ ] Деплой на production

---

## 12. Критерии приёмки

### Функциональные

- [ ] Покупатель может найти товар, добавить в корзину, оплатить
- [ ] ИИ-консультант подбирает товары по запросу
- [ ] Синхронизация с 1С работает (остатки, цены, заказы)
- [ ] Доставка СДЭК/Почта рассчитывается и оформляется
- [ ] Бонусная программа начисляет и списывает бонусы
- [ ] Админ может управлять каталогом, заказами, акциями

### Технические

- [ ] Lighthouse Score > 90
- [ ] Время загрузки < 3 секунды
- [ ] Адаптивность: мобайл, планшет, десктоп
- [ ] SEO: все страницы индексируются, Schema.org на месте
- [ ] Безопасность: HTTPS, защита от XSS/CSRF/SQL-injection
- [ ] 99.5% uptime

---

> **Статус:** ТЗ v1.0 — готово к рецензии.
> **Следующий шаг:** Утверждение и начало разработки (Фаза 1).
