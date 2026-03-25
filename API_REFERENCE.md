# CosmetikaLux 2.0 — Справочник API

> Версия: 1.0 | Дата: 2026-03-25
> Базовый URL: `/api/`
> Формат: JSON | Авторизация: Bearer JWT | Валидация: Zod

---

## Общие правила

### Формат ответа

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

При ошибке:

```json
{
  "success": false,
  "data": null,
  "error": { "code": "VALIDATION_ERROR", "message": "Описание ошибки" }
}
```

### Пагинация

Параметры запроса: `page` (default 1), `limit` (default 20, max 100).
Ответ включает: `{ items: [...], total: 150, page: 1, limit: 20, totalPages: 8 }`.

### Авторизация

Заголовок `Authorization: Bearer <token>`. Эндпоинты, помеченные иконкой, требуют авторизации. Роли: `CUSTOMER`, `MANAGER`, `ADMIN`.

### Rate Limiting

| Тип | Лимит |
|-----|-------|
| Общий | 100 запросов / минута |
| Авторизация | 10 запросов / минута |
| ИИ-чат | 20 сообщений / минута |
| Вебхуки (1С, ЮKassa) | Без лимита (проверка подписи) |

---

## 1. Аутентификация `/api/auth/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/auth/register` | Регистрация нового пользователя | Нет |
| POST | `/api/auth/login` | Вход по телефону + пароль | Нет |
| POST | `/api/auth/logout` | Выход (инвалидация токена) | Да |
| GET  | `/api/auth/session` | Получить текущую сессию и данные пользователя | Да |

**POST /api/auth/register** — тело запроса:

```json
{ "phone": "+79001234567", "password": "min8chars", "firstName": "Мария" }
```

Ответ: `{ user: { id, phone, firstName, role }, token }`.

**POST /api/auth/login** — тело: `{ phone, password }`. Ответ: `{ user, token }`.

---

## 2. Каталог `/api/products/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| GET | `/api/products` | Список товаров с фильтрами и пагинацией | Нет |
| GET | `/api/products/[slug]` | Полная карточка товара по slug | Нет |
| GET | `/api/products/search?q=` | Полнотекстовый поиск по каталогу | Нет |
| GET | `/api/categories` | Дерево категорий (вложенная структура) | Нет |
| GET | `/api/brands` | Список всех активных брендов | Нет |

**GET /api/products** — параметры запроса:

| Параметр | Тип | Описание |
|----------|-----|----------|
| `category` | string | Slug категории |
| `brand` | string | Slug бренда |
| `price_min` | number | Минимальная цена |
| `price_max` | number | Максимальная цена |
| `skin_type` | string | Тип кожи: `DRY`, `OILY`, `COMBINATION`, `SENSITIVE`, `NORMAL` |
| `sort` | string | Сортировка: `price_asc`, `price_desc`, `new`, `popular`, `rating` |
| `is_hit` | boolean | Только хиты |
| `is_new` | boolean | Только новинки |
| `is_sale` | boolean | Только со скидкой |
| `page`, `limit` | number | Пагинация |

Ответ: `{ items: [Product], total, page, limit, totalPages }`.

**GET /api/products/[slug]** — ответ: `{ product, related: [Product] }`. Включает images, brand, categories, reviews (средний рейтинг).

---

## 3. Корзина `/api/cart/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| GET | `/api/cart` | Содержимое корзины текущего пользователя | Да |
| POST | `/api/cart/items` | Добавить товар в корзину | Да |
| PATCH | `/api/cart/items/[id]` | Изменить количество товара | Да |
| DELETE | `/api/cart/items/[id]` | Удалить товар из корзины | Да |

**POST /api/cart/items** — тело: `{ productId: "cuid", quantity: 1 }`.
Ответ: обновлённая корзина `{ items: [CartItem], subtotal, itemsCount }`.

**PATCH /api/cart/items/[id]** — тело: `{ quantity: 3 }`. Quantity = 0 удаляет позицию.

---

## 4. Заказы `/api/orders/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/orders` | Создать заказ из корзины | Да |
| GET  | `/api/orders` | Список заказов текущего пользователя | Да |
| GET  | `/api/orders/[id]` | Детали конкретного заказа | Да |

**POST /api/orders** — тело запроса:

```json
{
  "deliveryMethod": "CDEK_PVZ",
  "cdekPvzCode": "MSK-123",
  "addressId": "cuid",
  "paymentMethod": "CARD",
  "promoCode": "SPRING10",
  "bonusSpend": 500,
  "comment": "Позвонить за час"
}
```

Обработка: валидация Zod, проверка наличия, расчёт стоимости (товары + доставка - скидки - бонусы), создание платежа в ЮKassa.
Ответ: `{ order: Order, paymentUrl: "https://yookassa.ru/..." }`.

**GET /api/orders** — параметры: `page`, `limit`, `status`. Ответ: список заказов с пагинацией.

---

## 5. Оплата `/api/payments/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/payments/create` | Создать платёж через ЮKassa | Да |
| POST | `/api/payments/webhook` | Callback от ЮKassa (payment.succeeded / cancelled) | Подпись |

**POST /api/payments/create** — тело: `{ orderId: "cuid", returnUrl: "https://..." }`.
Ответ: `{ paymentId, confirmationUrl }`.

**POST /api/payments/webhook** — входящий JSON от ЮKassa. Проверяется IP + подпись.
При `payment.succeeded`: обновление статуса заказа на `PAID`, начисление бонусов, отправка в 1С, создание отправления СДЭК, SMS + Email покупателю.

---

## 6. Доставка `/api/delivery/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/delivery/calculate` | Расчёт стоимости и сроков доставки | Нет |
| GET  | `/api/delivery/pvz?city=` | Список ПВЗ СДЭК в городе | Нет |

**POST /api/delivery/calculate** — тело:

```json
{ "city": "Москва", "postalCode": "101000", "weight": 350, "method": "CDEK_PVZ" }
```

Ответ: `{ price: 350, minDays: 3, maxDays: 5, method: "CDEK_PVZ" }`.

**GET /api/delivery/pvz?city=Москва** — ответ: `{ pvzList: [{ code, address, workTime, phone, lat, lng }] }`.

---

## 7. ИИ-консультант `/api/chat/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/chat/message` | Отправить сообщение ИИ-консультанту | Нет* |
| GET  | `/api/chat/history` | История текущей сессии чата | Нет* |

*Неавторизованные пользователи идентифицируются по `sessionToken`.

**POST /api/chat/message** — тело: `{ message: "Посоветуй крем для сухой кожи", sessionToken?: "uuid" }`.
Ответ: SSE-стрим. Формат событий:

```
data: {"type":"text","content":"Рекомендую..."}
data: {"type":"products","items":[{id,name,price,image}]}
data: {"type":"actions","buttons":[{"label":"В корзину","productId":"..."}]}
data: {"type":"done"}
```

Модель: GigaChat-Pro. Flow: определение намерения, обогащение контекста (профиль кожи, корзина, акции), RAG-поиск товаров, генерация ответа.

**GET /api/chat/history** — параметры: `sessionToken`, `limit` (default 20). Ответ: `{ messages: [ChatMessage] }`.

---

## 8. Синхронизация 1С `/api/sync/`

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/sync/products` | Push остатков и цен из 1С | API-ключ |
| POST | `/api/sync/orders` | Синхронизация заказов (push статусов из 1С, pull новых заказов) | API-ключ |

Авторизация через заголовок `X-API-Key`. Формат обмена: REST JSON. 1С выступает клиентом API.

**POST /api/sync/products** — тело:

```json
{ "products": [{ "externalId": "1c-001", "stock": 15, "price": 2490.00, "oldPrice": null }] }
```

Идемпотентность по `externalId`. При недоступности 1С — Redis-кэш, retry через 5 мин, уведомление админу.

**POST /api/sync/orders** — тело: `{ orders: [{ orderNumber: "CLX-2026-00001", externalId: "1c-ord-123", status: "SHIPPED", trackingNumber: "..." }] }`.

---

## 9. Админ-панель `/api/admin/`

Все эндпоинты требуют роль `ADMIN` или `MANAGER`.

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/admin/products` | Список товаров (расширенный, с costPrice) |
| POST | `/api/admin/products` | Создать товар |
| PATCH | `/api/admin/products/[id]` | Обновить товар |
| DELETE | `/api/admin/products/[id]` | Удалить / деактивировать товар |
| GET | `/api/admin/orders` | Все заказы с фильтрацией по статусу |
| PATCH | `/api/admin/orders/[id]` | Обновить статус заказа |
| GET | `/api/admin/users` | Список пользователей |
| PATCH | `/api/admin/users/[id]` | Изменить роль / заблокировать |
| GET | `/api/admin/promo-codes` | Список промокодов |
| POST | `/api/admin/promo-codes` | Создать промокод |
| PATCH | `/api/admin/promo-codes/[id]` | Обновить промокод |
| DELETE | `/api/admin/promo-codes/[id]` | Удалить промокод |
| GET | `/api/admin/analytics` | Сводная аналитика (выручка, заказы, конверсия) |

---

## 10. Коды ошибок

| Код | HTTP | Описание |
|-----|------|----------|
| `VALIDATION_ERROR` | 400 | Ошибка валидации входных данных |
| `UNAUTHORIZED` | 401 | Требуется авторизация |
| `FORBIDDEN` | 403 | Недостаточно прав (роль) |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `CONFLICT` | 409 | Конфликт (например, дубль email/phone) |
| `OUT_OF_STOCK` | 422 | Товар закончился на складе |
| `RATE_LIMITED` | 429 | Превышен лимит запросов |
| `PAYMENT_FAILED` | 502 | Ошибка платёжного шлюза |
| `SYNC_ERROR` | 503 | Ошибка синхронизации с 1С |
