# CosmetikaLux — План задач для ИИ-агентов

> Каждая задача ≤ 300 строк кода. Задачи выполняются последовательно внутри фазы.
> Основан на TECHNICAL_SPECIFICATION.md v1.1

---

## Фаза 1: Фундамент (14 задач)

### 1.1 Инициализация проекта
- `npx create-next-app@latest` с TypeScript, Tailwind, App Router
- Настройка `tsconfig.json`, `next.config.ts`
- Структура папок: `src/app`, `src/components`, `src/lib`, `src/types`, `src/stores`
- `.env.example` со всеми переменными из ТЗ (раздел 10)
- **~120 строк** (конфиги + структура)

### 1.2 Дизайн-токены и Tailwind-конфиг
- Токены из DESIGN_SYSTEM.md → `tailwind.config.ts`
- Цвета, типографика, отступы, скругления, тени
- CSS-переменные в `globals.css`
- **~150 строк**

### 1.3 Prisma — модели пользователей
- `schema.prisma`: User, SkinProfile, Address, UserRole, SkinType
- **~120 строк**

### 1.4 Prisma — модели каталога
- Product, ProductImage, ProductCategory, Category, Brand, ProductRelation
- Индексы
- **~200 строк**

### 1.5 Prisma — модели заказов и корзины
- Order, OrderItem, CartItem, OrderStatus enum
- PromoCode, OrderPromo
- **~180 строк**

### 1.6 Prisma — модели оплаты, доставки, бонусов
- Payment, PaymentStatus, DeliveryMethod
- BonusAccount, BonusTransaction
- Favorite, Review, ProductSubscription
- **~200 строк**

### 1.7 Prisma — модели чата, блога, уведомлений
- ChatSession, ChatMessage, ChatMessageRole
- BlogPost, BlogCategory
- Notification, NotificationType
- SyncLog
- **~200 строк**

### 1.8 Prisma — миграция и seed
- `npx prisma migrate dev`
- `seed.ts`: тестовые категории (5), бренды (3), товары (10)
- **~250 строк**

### 1.9 UI-компоненты: Button, Input, Badge
- `src/components/ui/Button.tsx` — варианты: primary, secondary, outline, ghost
- `src/components/ui/Input.tsx` — с лейблом, ошибкой, иконкой
- `src/components/ui/Badge.tsx` — хит, новинка, скидка
- **~250 строк** (3 файла)

### 1.10 UI-компоненты: Card, Modal, Skeleton
- `src/components/ui/Card.tsx` — обёртка
- `src/components/ui/Modal.tsx` — модальное окно с backdrop
- `src/components/ui/Skeleton.tsx` — загрузочные плейсхолдеры
- **~200 строк** (3 файла)

### 1.11 Layout: Header
- `src/components/layout/Header.tsx`
- Логотип, навигация, поиск, иконки (корзина, ЛК, избранное)
- Мобильное меню (бургер)
- **~250 строк**

### 1.12 Layout: Footer + общий Layout
- `src/components/layout/Footer.tsx` — контакты, навигация, соцсети
- `src/app/(shop)/layout.tsx` — Header + Footer обёртка
- **~200 строк** (2 файла)

### 1.13 NextAuth — аутентификация
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth.ts` — провайдер Credentials (телефон + пароль)
- `src/middleware.ts` — защита маршрутов /account/*, /admin/*
- **~200 строк** (3 файла)

### 1.14 ИИ-фундамент: типы, store, env
- `src/types/chat.ts` — интерфейсы ChatSession, ChatMessage, etc.
- `src/stores/chatStore.ts` — Zustand store (пустой, интерфейс готов)
- Переменные GIGACHAT_* в `.env.example`
- **~150 строк** (2 файла)

---

## Фаза 2: Каталог (12 задач)

### 2.1 API: список товаров
- `src/app/api/products/route.ts` — GET с пагинацией, фильтрами (категория, бренд, цена, skinType)
- `src/lib/products.ts` — функция getProducts() с Prisma
- **~200 строк** (2 файла)

### 2.2 API: товар по slug + категории + бренды
- `src/app/api/products/[slug]/route.ts` — GET одного товара
- `src/app/api/categories/route.ts` — GET дерево категорий
- `src/app/api/brands/route.ts` — GET список брендов
- **~200 строк** (3 файла)

### 2.3 API: поиск
- `src/app/api/search/route.ts` — полнотекстовый поиск PostgreSQL
- Поиск по name, description, composition
- Подсказки (autocomplete)
- **~150 строк**

### 2.4 Компонент: ProductCard
- `src/components/product/ProductCard.tsx`
- Изображение, название, бренд, цена/старая цена, бейджи (хит/новинка/скидка)
- Кнопки: в корзину, в избранное
- **~200 строк**

### 2.5 Страница: каталог
- `src/app/(shop)/catalog/page.tsx`
- Сетка товаров, сайдбар с фильтрами
- Сортировка (цена, популярность, новизна)
- Пагинация
- **~280 строк**

### 2.6 Компонент: фильтры каталога
- `src/components/catalog/CatalogFilters.tsx`
- Фильтры: категория, бренд, цена (range), тип кожи, объём
- Мобильная версия (выезжающая панель)
- **~280 строк**

### 2.7 Страница: категория
- `src/app/(shop)/catalog/[categorySlug]/page.tsx`
- SSR, breadcrumbs, описание категории, товары с фильтрами
- **~200 строк**

### 2.8 Страница: товар — основная часть
- `src/app/(shop)/product/[productSlug]/page.tsx`
- Галерея изображений, название, цена, описание, кнопка «В корзину»
- SSR + метаданные
- **~280 строк**

### 2.9 Страница: товар — табы и доп. секции
- `src/components/product/ProductTabs.tsx` — состав, применение, отзывы
- `src/components/product/RelatedProducts.tsx` — похожие товары (карусель)
- **~250 строк** (2 файла)

### 2.10 Страницы: бренды
- `src/app/(shop)/brands/page.tsx` — список брендов с логотипами
- `src/app/(shop)/brands/[brandSlug]/page.tsx` — товары бренда
- **~200 строк** (2 файла)

### 2.11 SEO: meta, Schema.org
- `src/lib/seo.ts` — генерация метаданных для товаров, категорий, брендов
- JSON-LD: Product, BreadcrumbList, Organization
- **~200 строк**

### 2.12 SEO: sitemap + robots
- `src/app/sitemap.ts` — динамический sitemap (товары, категории, бренды, блог)
- `src/app/robots.ts`
- **~120 строк** (2 файла)

---

## Фаза 3: Покупка (14 задач)

### 3.1 Store: корзина (Zustand)
- `src/stores/cartStore.ts`
- Действия: add, remove, updateQty, clear
- Персистенция в localStorage
- Расчёт итогов (сумма, количество, скидка)
- **~150 строк**

### 3.2 API: корзина
- `src/app/api/cart/route.ts` — GET, POST, DELETE
- `src/app/api/cart/[itemId]/route.ts` — PATCH (количество), DELETE
- Проверка остатков при добавлении
- **~200 строк** (2 файла)

### 3.3 Страница: корзина
- `src/app/(shop)/cart/page.tsx`
- Список товаров, изменение количества, удаление
- Итоговая сумма, кнопка «Оформить заказ»
- Промокод (поле ввода)
- **~280 строк**

### 3.4 Компоненты корзины
- `src/components/cart/CartItem.tsx` — строка товара
- `src/components/cart/CartSummary.tsx` — итоги
- `src/components/cart/MiniCart.tsx` — выпадающая мини-корзина в Header
- **~280 строк** (3 файла)

### 3.5 Страница: чекаут — форма контактов
- `src/app/(shop)/checkout/page.tsx` — layout чекаута
- `src/components/checkout/ContactForm.tsx` — имя, телефон, email
- React Hook Form + Zod валидация
- **~250 строк** (2 файла)

### 3.6 Чекаут: выбор доставки
- `src/components/checkout/DeliveryForm.tsx`
- Варианты: самовывоз, СДЭК (ПВЗ/курьер), Почта России
- Расчёт стоимости
- **~280 строк**

### 3.7 Чекаут: выбор оплаты и подтверждение
- `src/components/checkout/PaymentForm.tsx` — онлайн / при получении
- `src/components/checkout/OrderConfirm.tsx` — итоговая сводка
- **~200 строк** (2 файла)

### 3.8 API: создание заказа
- `src/app/api/orders/route.ts` — POST создание заказа
- Валидация, проверка остатков, резервирование
- Генерация номера заказа
- **~250 строк**

### 3.9 API: ЮKassa — создание платежа
- `src/app/api/payment/create/route.ts` — создание платежа в ЮKassa
- `src/lib/yokassa.ts` — клиент ЮKassa API
- **~200 строк** (2 файла)

### 3.10 API: ЮKassa — webhook
- `src/app/api/payment/webhook/route.ts`
- Обработка уведомлений: payment.succeeded, payment.canceled
- Обновление статуса заказа
- Верификация подписи
- **~200 строк**

### 3.11 Страница: успешная оплата
- `src/app/(shop)/checkout/success/page.tsx`
- Номер заказа, статус, кнопка «В личный кабинет»
- **~100 строк**

### 3.12 API: СДЭК
- `src/lib/cdek.ts` — клиент СДЭК API
- Расчёт стоимости, список ПВЗ, создание заявки
- **~250 строк**

### 3.13 API: Почта России
- `src/lib/pochta.ts` — клиент Почта России API
- Расчёт стоимости, отслеживание
- **~200 строк**

### 3.14 Уведомления: email + SMS
- `src/lib/notifications/email.ts` — Resend: подтверждение заказа, смена статуса
- `src/lib/notifications/sms.ts` — SMS.ru: код подтверждения, статус заказа
- **~200 строк** (2 файла)

---

## Фаза 4: Личный кабинет (10 задач)

### 4.1 Layout ЛК + дашборд
- `src/app/(account)/layout.tsx` — боковое меню ЛК
- `src/app/(account)/account/page.tsx` — обзор: последние заказы, бонусы
- **~200 строк** (2 файла)

### 4.2 Профиль пользователя
- `src/app/(account)/account/profile/page.tsx`
- `src/app/api/profile/route.ts` — GET, PATCH
- Редактирование: имя, телефон, email, пароль
- **~250 строк** (2 файла)

### 4.3 Профиль кожи (SkinProfile)
- `src/app/(account)/account/skin-profile/page.tsx`
- `src/app/api/profile/skin/route.ts` — GET, PUT
- Форма: тип кожи, возраст, проблемы, аллергии
- **~280 строк** (2 файла)

### 4.4 Адреса доставки
- `src/app/(account)/account/addresses/page.tsx`
- `src/app/api/addresses/route.ts` — CRUD
- Список адресов, добавление/редактирование, адрес по умолчанию
- **~280 строк** (2 файла)

### 4.5 История заказов — список
- `src/app/(account)/account/orders/page.tsx`
- Список заказов с фильтрацией по статусу
- `src/app/api/orders/route.ts` — GET (мои заказы)
- **~200 строк** (2 файла)

### 4.6 История заказов — детали
- `src/app/(account)/account/orders/[orderId]/page.tsx`
- Состав заказа, статус, трекинг, повторить заказ
- **~250 строк**

### 4.7 Избранное
- `src/app/(account)/account/favorites/page.tsx`
- `src/app/api/favorites/route.ts` — GET, POST, DELETE
- Сетка товаров с кнопкой «В корзину»
- **~200 строк** (2 файла)

### 4.8 Уведомления
- `src/app/(account)/account/notifications/page.tsx`
- `src/app/api/notifications/route.ts` — GET, PATCH (прочитано)
- Список уведомлений с пометкой прочитано/непрочитано
- **~200 строк** (2 файла)

### 4.9 ИИ-заглушки
- `src/app/(account)/account/consultations/page.tsx` — «Скоро: персональные консультации»
- `src/app/(account)/account/routine/page.tsx` — «Скоро: ваша рутина ухода»
- **~80 строк** (2 файла)

### 4.10 Авторизация: страницы
- `src/app/(auth)/login/page.tsx` — вход по телефону + пароль
- `src/app/(auth)/register/page.tsx` — регистрация
- `src/app/(auth)/forgot-password/page.tsx` — восстановление
- **~300 строк** (3 файла)

---

## Фаза 5: Бизнес-логика (6 задач)

### 5.1 Бонусная программа — API
- `src/app/api/bonus/route.ts` — GET баланс
- `src/app/api/bonus/transactions/route.ts` — GET история
- `src/lib/bonus.ts` — начисление (5% от заказа), списание, логика уровней
- **~250 строк** (3 файла)

### 5.2 Бонусная программа — UI
- `src/app/(account)/account/bonus/page.tsx`
- Баланс, уровень, история транзакций
- Интеграция в чекаут (списание бонусов)
- **~250 строк**

### 5.3 Промокоды — API
- `src/app/api/promo/validate/route.ts` — проверка промокода
- `src/lib/promo.ts` — логика: скидка %, скидка руб., бесплатная доставка
- **~200 строк** (2 файла)

### 5.4 Промокоды — админ
- `src/app/admin/promotions/page.tsx` — CRUD промокодов
- `src/app/api/admin/promotions/route.ts` — API
- **~280 строк** (2 файла)

### 5.5 Подписки на автозаказ
- `src/app/(account)/account/subscriptions/page.tsx`
- `src/app/api/subscriptions/route.ts` — CRUD
- Периодичность: 2/4/8 недель
- **~250 строк** (2 файла)

### 5.6 Отзывы
- `src/components/product/ReviewForm.tsx` — форма отзыва (рейтинг + текст)
- `src/app/api/products/[slug]/reviews/route.ts` — GET, POST
- Модерация: флаг isApproved
- **~250 строк** (2 файла)

---

## Фаза 6: Интеграция с 1С (5 задач)

### 6.1 API: синхронизация остатков и цен
- `src/app/api/sync/stock/route.ts` — POST от 1С (массив {externalId, stock, price})
- Валидация API-ключом
- Batch update в БД
- **~200 строк**

### 6.2 API: синхронизация товаров
- `src/app/api/sync/products/route.ts` — POST от 1С (новые товары, обновления)
- Создание/обновление товаров по externalId
- **~250 строк**

### 6.3 API: передача заказов в 1С
- `src/app/api/sync/orders/route.ts` — GET (новые заказы для 1С)
- `src/app/api/sync/orders/[orderId]/status/route.ts` — PATCH (статус из 1С)
- Идемпотентность по orderNumber
- **~200 строк** (2 файла)

### 6.4 Redis-кэширование
- `src/lib/redis.ts` — подключение к Redis
- Кэширование остатков (TTL 5 мин)
- Кэширование цен (TTL 5 мин)
- Инвалидация при синхронизации
- **~150 строк**

### 6.5 Мониторинг синхронизации
- `src/app/api/sync/status/route.ts` — GET статус последних синхронизаций
- `src/lib/sync-monitor.ts` — логирование в SyncLog, алерты при ошибках
- **~200 строк** (2 файла)

---

## Фаза 7: Контент и запуск (10 задач)

### 7.1 Блог — API
- `src/app/api/blog/route.ts` — GET список постов (пагинация, категория)
- `src/app/api/blog/[slug]/route.ts` — GET один пост
- **~150 строк** (2 файла)

### 7.2 Блог — страницы
- `src/app/(shop)/blog/page.tsx` — список статей
- `src/app/(shop)/blog/[slug]/page.tsx` — статья + SEO
- **~250 строк** (2 файла)

### 7.3 Статические страницы
- `src/app/(shop)/about/page.tsx` — О нас
- `src/app/(shop)/delivery/page.tsx` — Доставка и оплата
- `src/app/(shop)/returns/page.tsx` — Возврат
- `src/app/(shop)/contacts/page.tsx` — Контакты (карта + форма)
- **~300 строк** (4 файла)

### 7.4 Страницы: политика и условия
- `src/app/(shop)/privacy/page.tsx` — Политика конфиденциальности
- `src/app/(shop)/terms/page.tsx` — Пользовательское соглашение
- **~150 строк** (2 файла)

### 7.5 Главная страница — hero + промо
- `src/app/(shop)/page.tsx` — Hero-баннер (карусель)
- `src/components/home/HeroBanner.tsx`
- `src/components/home/PromoSection.tsx` — акции
- **~280 строк** (3 файла)

### 7.6 Главная страница — секции товаров
- `src/components/home/HitProducts.tsx` — хиты продаж (карусель)
- `src/components/home/NewProducts.tsx` — новинки
- `src/components/home/SaleProducts.tsx` — распродажа
- **~250 строк** (3 файла)

### 7.7 Главная страница — бренды + преимущества
- `src/components/home/BrandShowcase.tsx` — логотипы брендов
- `src/components/home/Benefits.tsx` — преимущества (доставка, гарантия, etc.)
- `src/components/home/Newsletter.tsx` — подписка на рассылку
- **~200 строк** (3 файла)

### 7.8 Админ-панель: дашборд + навигация
- `src/app/admin/layout.tsx` — layout админки
- `src/app/admin/page.tsx` — дашборд (заказы сегодня, выручка, товары)
- **~280 строк** (2 файла)

### 7.9 Админ-панель: управление каталогом
- `src/app/admin/products/page.tsx` — таблица товаров + CRUD
- `src/app/admin/categories/page.tsx` — управление категориями
- `src/app/admin/brands/page.tsx` — управление брендами
- **~300 строк** (3 файла)

### 7.10 Админ-панель: заказы и клиенты
- `src/app/admin/orders/page.tsx` — таблица заказов, смена статуса
- `src/app/admin/customers/page.tsx` — список клиентов
- **~280 строк** (2 файла)

---

## Фаза 8: ИИ Beauty-консультант (10 задач)

> Выполняется ПОСЛЕ запуска основного сайта

### 8.1 GigaChat: аутентификация
- `src/lib/ai/gigachat.ts` — OAuth2 токен, кэш в Redis, auto-refresh
- `src/lib/ai/provider.ts` — абстрактный AIProvider интерфейс
- **~200 строк** (2 файла)

### 8.2 GigaChat: генерация ответов
- `src/lib/ai/generate.ts` — SSE-стриминг, обработка ошибок, retry
- `src/lib/ai/prompts.ts` — системный промпт «Лина», шаблоны
- **~250 строк** (2 файла)

### 8.3 RAG-пайплайн
- `src/lib/ai/rag.ts` — извлечение ключевых слов → SQL-поиск → top 10 товаров
- Формирование контекста для промпта
- **~200 строк**

### 8.4 API: чат
- `src/app/api/chat/message/route.ts` — POST (SSE streaming)
- `src/app/api/chat/session/route.ts` — POST создание, GET список
- `src/app/api/chat/history/route.ts` — GET история сессии
- Rate limiting: 10 msg/min
- **~300 строк** (3 файла)

### 8.5 Чат: виджет
- `src/components/chat/ChatWidget.tsx` — плавающая кнопка + выезжающая панель
- Состояния: свёрнут, развёрнут, fullscreen (мобайл)
- **~250 строк**

### 8.6 Чат: сообщения и ввод
- `src/components/chat/ChatMessage.tsx` — bubble с markdown-рендерингом
- `src/components/chat/ChatInput.tsx` — поле ввода + отправка
- `src/components/chat/QuickButtons.tsx` — быстрые вопросы
- **~280 строк** (3 файла)

### 8.7 Чат: карточки товаров
- `src/components/chat/ChatProductCard.tsx` — мини-карточка товара в чате
- Кнопка «В корзину» прямо из чата
- SSE-стриминг: анимация печати
- **~200 строк**

### 8.8 Персонализация
- Подключение SkinProfile к контексту GigaChat
- Подключение истории заказов к контексту
- `src/app/(account)/account/consultations/page.tsx` — замена заглушки
- **~250 строк**

### 8.9 Рутина ухода
- `src/app/(account)/account/routine/page.tsx` — замена заглушки
- API: генерация рутины из купленных товаров
- Утро / вечер, шаги ухода
- **~280 строк**

### 8.10 Админка ИИ
- `src/app/admin/chat/page.tsx` — просмотр сессий
- `src/app/admin/chat/system-prompt/page.tsx` — редактирование промпта
- `src/app/admin/chat/analytics/page.tsx` — метрики
- **~300 строк** (3 файла)

---

## Сводка

| Фаза | Задач | Описание |
|-------|-------|----------|
| 1. Фундамент | 14 | Проект, БД, UI-kit, Layout, Auth |
| 2. Каталог | 12 | Товары, фильтры, поиск, SEO |
| 3. Покупка | 14 | Корзина, чекаут, оплата, доставка |
| 4. ЛК | 10 | Профиль, заказы, избранное |
| 5. Бизнес | 6 | Бонусы, промо, подписки |
| 6. 1С | 5 | Синхронизация, Redis, мониторинг |
| 7. Контент | 10 | Блог, главная, админка |
| 8. ИИ | 10 | GigaChat, чат, персонализация |
| **Итого** | **81** | **~300 строк max на задачу** |

### Правила для агентов

1. **Одна задача = один агент** — агент получает номер задачи и выполняет её
2. **≤ 300 строк нового кода** — если задача разрастается, разбить на подзадачи
3. **Зависимости** — задачи внутри фазы выполняются последовательно (если не указано иное)
4. **Параллельность** — задачи из РАЗНЫХ файлов внутри одной фазы можно параллелить
5. **Тесты** — каждая задача включает базовые тесты (не считаются в лимит 300 строк)
6. **Коммит** — каждая задача = отдельный коммит с сообщением `[Фаза X.Y] Описание`
