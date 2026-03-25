# CosmetikaLux --- База данных и Prisma-модели

## 1. Обзор

| Компонент    | Технология       | Назначение                              |
|--------------|------------------|-----------------------------------------|
| СУБД         | PostgreSQL 16    | Основное хранилище данных               |
| ORM          | Prisma 5.x       | Типизированный доступ к БД, миграции    |
| Кэш          | Redis 7          | Кэш остатков 1С, сессии, rate limiting  |
| ID           | CUID             | `@id @default(cuid())` во всех моделях  |

Схема описана в `prisma/schema.prisma`. Все модели создаются в Фазе 1 ---
включая таблицы ИИ-консультанта (ChatSession, ChatMessage, SkinProfile),
которые наполняются данными только в Фазе 8.

---

## 2. ER-диаграмма (текстовая)

```
User ──┬── 1:1 ── SkinProfile
       ├── 1:N ── Address
       ├── 1:N ── Order ──┬── 1:N ── OrderItem ── N:1 ── Product
       │                   └── (Payment/Delivery --- JSON-поля)
       ├── 1:N ── CartItem ── N:1 ── Product
       ├── 1:N ── Favorite ── N:1 ── Product
       ├── 1:N ── Review ── N:1 ── Product
       ├── 1:1 ── BonusAccount ── 1:N ── BonusTransaction
       ├── 1:N ── ChatSession ── 1:N ── ChatMessage
       ├── 1:N ── ProductSubscription ── N:1 ── Product
       └── 1:N ── Notification

Product ──┬── 1:N ── ProductImage
          ├── N:M ── Category       (через ProductCategory pivot)
          ├── N:1 ── Brand
          ├── N:N ── ProductRelation (self-relation: SIMILAR/COMPLEMENTARY/UPSELL)
          └── 1:N ── Review, CartItem, OrderItem, Favorite, ProductSubscription

BlogPost          (независимая, без FK)
Promotion         (независимая, код промокода)
SyncLog           (лог синхронизации с 1С)
```

---

## 3. Модели

### Пользователи

| Модель        | Описание                                                       |
|---------------|----------------------------------------------------------------|
| **User**      | Основная модель пользователя. Авторизация по phone (unique) + password |
| **SkinProfile** | Профиль кожи (1:1 к User). Тип кожи, проблемы, аллергии, предпочтения |
| **Address**   | Адреса доставки. Поля: город, улица, дом, почтовый индекс      |

Enums: `UserRole` (CUSTOMER, ADMIN, MANAGER), `SkinType` (DRY, OILY, COMBINATION, SENSITIVE, NORMAL).

### Каталог

| Модель             | Описание                                                     |
|--------------------|--------------------------------------------------------------|
| **Product**        | Товар. Цены/остатки синхронизируются из 1С. Поля skinTypes[], concerns[] для фильтров и RAG |
| **ProductImage**   | Изображения товара с сортировкой и флагом isMain             |
| **Category**       | Дерево категорий (self-relation через parentId)              |
| **ProductCategory**| Pivot-таблица Product <-> Category (составной PK)            |
| **Brand**          | Бренд. Связь 1:N с Product                                  |
| **ProductRelation**| Связи между товарами: SIMILAR, COMPLEMENTARY, UPSELL        |

### Заказы и корзина

| Модель        | Описание                                                       |
|---------------|----------------------------------------------------------------|
| **Order**     | Заказ. Номер формата CLX-2026-XXXXX. Хранит снапшот адреса в JSON |
| **OrderItem** | Позиция заказа с ценой на момент оформления                    |
| **CartItem**  | Элемент корзины. Compound unique index [userId, productId]     |
| **Promotion** | Промокод (процент, фиксированная сумма или бесплатная доставка)|

Enums: `OrderStatus` (PENDING -> PAID -> PROCESSING -> SHIPPED -> DELIVERED | CANCELLED | RETURNED),
`PaymentMethod` (CARD, SBP, YOOMONEY, INSTALLMENT), `PromotionType` (PERCENTAGE, FIXED, FREE_DELIVERY).

### Оплата и доставка

Оплата и доставка --- поля внутри модели **Order** (не отдельные таблицы):
- `paymentStatus` (PaymentStatus enum), `yukassaPaymentId` --- интеграция с ЮKassa
- `deliveryMethod` (DeliveryMethod enum), `cdekUuid`, `cdekPvzCode` --- интеграция с СДЭК

Enums: `PaymentStatus` (PENDING, SUCCEEDED, CANCELLED, REFUNDED),
`DeliveryMethod` (CDEK_PVZ, CDEK_COURIER, POST_RUSSIA, LOCAL_COURIER, PICKUP).

### Бонусы и взаимодействие

| Модель                | Описание                                               |
|-----------------------|--------------------------------------------------------|
| **BonusAccount**      | Бонусный счёт (1:1 к User). Уровни: BRONZE/SILVER/GOLD/PLATINUM |
| **BonusTransaction**  | История начислений/списаний бонусов                    |
| **Favorite**          | Избранное. Unique [userId, productId]                  |
| **Review**            | Отзыв с рейтингом 1-5, фото, флагом isVerified        |
| **ProductSubscription** | Автозаказ с интервалом 30/60/90 дней                 |

Enums: `BonusLevel` (BRONZE 3%, SILVER 5%, GOLD 7%, PLATINUM 10%),
`BonusType` (EARN, SPEND, EXPIRE, MANUAL), `SubscriptionStatus` (ACTIVE, PAUSED, CANCELLED).

### ИИ-консультант

| Модель          | Описание                                                   |
|-----------------|------------------------------------------------------------|
| **ChatSession** | Сессия чата. sessionToken (unique) для неавторизованных     |
| **ChatMessage** | Сообщение. metadata (Json) хранит рекомендованные товары, кнопки |

Enum: `ChatRole` (USER, ASSISTANT, SYSTEM).

### Контент и служебные

| Модель           | Описание                                                  |
|------------------|-----------------------------------------------------------|
| **BlogPost**     | Статья блога. slug unique, теги, SEO-поля, счётчик просмотров |
| **Notification** | Уведомление пользователю (статус заказа, снижение цены и др.) |
| **SyncLog**      | Лог синхронизации с 1С: тип, статус, кол-во обработанных записей |

Enum: `NotificationType` (ORDER_STATUS, PRICE_DROP, BACK_IN_STOCK, BONUS_EARNED, BONUS_EXPIRING, PROMOTION, NEW_PRODUCT).

---

## 4. Ключевые индексы

```prisma
// Unique-индексы
User.phone              @unique
User.email              @unique
Product.slug            @unique
Product.sku             @unique
Product.externalId      @unique
Category.slug           @unique
Brand.slug              @unique
BlogPost.slug           @unique
Order.orderNumber       @unique
BonusAccount.userId     @unique
SkinProfile.userId      @unique
ChatSession.sessionToken @unique
Promotion.code          @unique

// Compound unique
CartItem     @@unique([userId, productId])
Favorite     @@unique([userId, productId])
Review       @@unique([userId, productId])
ProductRelation @@unique([productId, relatedId, type])

// Составной PK
ProductCategory @@id([productId, categoryId])

// Индексы для фильтрации/сортировки
Product  @@index([brandId])
Product  @@index([price])
Product  @@index([isActive, isHit])
Product  @@index([isActive, isNew])
Order    @@index([userId])
Order    @@index([status])
Order    @@index([orderNumber])
Review   @@index([productId, isPublished])
```

---

## 5. Seed-данные

Файл: `prisma/seed.ts`. Запуск: `npx prisma db seed`.

Начальные данные:

| Сущность   | Кол-во | Примеры                                                |
|------------|--------|--------------------------------------------------------|
| Категории  | 5      | Увлажнение, Очищение, Антивозрастной уход, Защита от солнца, Сыворотки |
| Бренды     | 3      | La Roche-Posay, CeraVe, The Ordinary                  |
| Товары     | 10     | По 3-4 товара на бренд с заполненными skinTypes/concerns |
| Admin user | 1      | admin@cosmetikalux.ru / role: ADMIN                    |

Формат seed.ts:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Категории  — prisma.category.upsert(...)
  // 2. Бренды     — prisma.brand.upsert(...)
  // 3. Товары     — prisma.product.create(...) + images + categories
  // 4. Admin      — prisma.user.upsert(...) с bcrypt-хешем пароля
}

main().finally(() => prisma.$disconnect());
```

---

## 6. Миграции

```bash
# Разработка --- создать и применить миграцию
npx prisma migrate dev --name описание_изменений

# Продакшен --- применить все непримененные миграции
npx prisma migrate deploy

# Сбросить БД и применить все миграции заново (только dev!)
npx prisma migrate reset

# Сгенерировать Prisma Client после изменения схемы
npx prisma generate
```

**Правила:**
- Никогда не редактировать файлы миграций вручную после их создания
- Одна миграция = одно логическое изменение (не мешать разные фичи)
- Перед деплоем проверять миграции на staging-окружении
- Миграции коммитятся в git (`prisma/migrations/`)

---

## 7. Redis

Подключение: `ioredis`, конфигурация в `src/lib/redis.ts`.

| Ключ                        | TTL    | Назначение                          |
|-----------------------------|--------|-------------------------------------|
| `product:stock:{productId}` | 5 min  | Остатки из 1С (кэш между синхронизациями) |
| `product:price:{productId}` | 5 min  | Цены из 1С                          |
| `session:{token}`           | 24h    | Данные сессии пользователя          |
| `rate:{ip}:{endpoint}`      | 1 min  | Счётчик запросов для rate limiting   |
| `otp:{phone}`               | 5 min  | Код подтверждения SMS               |
| `gigachat:token`            | 30 min | Access token GigaChat API (Фаза 8)  |

Стратегия инвалидации: при получении данных из 1С (webhook/cron) ---
удаляем соответствующие ключи `product:stock:*` и `product:price:*`.
