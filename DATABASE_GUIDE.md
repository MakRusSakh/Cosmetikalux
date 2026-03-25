# CosmetikaLux --- База данных и Prisma-модели

## 1. Обзор

| Компонент    | Технология       | Назначение                              |
|--------------|------------------|-----------------------------------------|
| СУБД         | PostgreSQL 16    | Основное хранилище данных               |
| ORM          | Prisma 5.x       | Типизированный доступ к БД, миграции    |
| Кэш          | Redis 7          | Кэш остатков 1С, сессии, rate limiting  |
| ID           | CUID             | `@id @default(cuid())` во всех моделях  |

Схема: `prisma/schema.prisma`. Все модели создаются в Фазе 1, включая ИИ-таблицы (данные --- с Фазы 8).

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
`PaymentMethod` (CARD, SBP, YOOMONEY, INSTALLMENT), `PromotionType` (PERCENTAGE, FIXED, FREE_DELIVERY),
`PaymentStatus` (PENDING, SUCCEEDED, CANCELLED, REFUNDED),
`DeliveryMethod` (CDEK_PVZ, CDEK_COURIER, POST_RUSSIA, LOCAL_COURIER, PICKUP).

Оплата и доставка --- поля внутри Order (не отдельные таблицы): `paymentStatus`, `yukassaPaymentId` (ЮKassa), `deliveryMethod`, `cdekUuid`, `cdekPvzCode` (СДЭК).

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

**Unique:** User.phone, User.email, Product.slug, Product.sku, Product.externalId,
Category.slug, Brand.slug, BlogPost.slug, Order.orderNumber, BonusAccount.userId,
SkinProfile.userId, ChatSession.sessionToken, Promotion.code.

**Compound unique:** CartItem[userId, productId], Favorite[userId, productId],
Review[userId, productId], ProductRelation[productId, relatedId, type].

**Составной PK:** ProductCategory[productId, categoryId].

**Индексы фильтрации:** Product[brandId], Product[price], Product[isActive, isHit],
Product[isActive, isNew], Order[userId], Order[status], Review[productId, isPublished].

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

Порядок в seed.ts: категории (`upsert`) -> бренды (`upsert`) -> товары (`create` + images + categories) -> admin user (`upsert` с bcrypt-хешем).

---

## 6. Миграции

| Команда                                    | Когда                    |
|--------------------------------------------|--------------------------|
| `npx prisma migrate dev --name описание`   | Разработка: создать миграцию |
| `npx prisma migrate deploy`                | Продакшен: применить миграции |
| `npx prisma migrate reset`                 | Dev only: сбросить БД    |
| `npx prisma generate`                      | После изменения схемы    |

**Правила:** никогда не редактировать миграции вручную; одна миграция = одно логическое изменение;
проверять на staging перед деплоем; коммитить `prisma/migrations/` в git.

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
