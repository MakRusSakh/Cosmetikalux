# CLAUDE.md — Инструкции для ИИ-агентов

---

## Проект

**CosmetikaLux 2.0** — интернет-магазин корейской косметики премиум-класса.
Next.js 15, App Router, SSR/SSG. Регион: Южно-Сахалинск, доставка по России.
Каталог: ~200 SKU сейчас, рост до 1000. Целевая аудитория: женщины 25-45 лет.

---

## Технологический стек

### Frontend
- **Next.js 15** — App Router, SSR/SSG/ISR
- **React 19** — UI-библиотека
- **TypeScript** — строгая типизация
- **Tailwind CSS 4** — стили с дизайн-токенами
- **Zustand** — глобальный стейт (корзина, чат, UI)
- **React Query (TanStack)** — серверные данные и мутации
- **Framer Motion** — анимации
- **React Hook Form + Zod** — формы и валидация
- **Embla Carousel**, **Lucide Icons**

### Backend
- **Next.js API Routes** — эндпоинты
- **Prisma ORM** + **PostgreSQL 16** — база данных
- **Redis** — кэш остатков 1С, сессии, rate limiting
- **NextAuth.js v5** — аутентификация
- **Sharp** — оптимизация изображений

### Интеграции
- **1С** — синхронизация остатков и цен
- **ЮKassa** — приём платежей
- **СДЭК / Почта России** — доставка
- **GigaChat API** — ИИ-консультант (Фаза 8)
- **SMS.ru** — SMS, **Resend** — email

---

## Структура папок

```
src/
├── app/                  # App Router: страницы, layouts, API routes
│   ├── (shop)/           # Группа: каталог, товар, корзина, чекаут
│   ├── (auth)/           # Группа: вход, регистрация
│   ├── (account)/        # Группа: ЛК пользователя
│   ├── admin/            # Админ-панель
│   └── api/              # API routes
├── components/
│   ├── ui/               # Atoms: Button, Input, Badge, Modal
│   ├── layout/           # Header, Footer, Sidebar, Navigation
│   └── features/         # Organisms: ProductCard, CartDrawer, ChatWidget
├── lib/                  # Утилиты, API-клиенты, конфиги
├── stores/               # Zustand stores: cart, chat, ui
├── types/                # TypeScript типы и интерфейсы
└── hooks/                # Кастомные хуки
```

---

## Команды

```bash
npm run dev          # Запуск dev-сервера (localhost:3000)
npm run build        # Production-сборка
npm run lint         # ESLint проверка
npm run test         # Запуск тестов
npx prisma migrate dev    # Применить миграции БД
npx prisma db seed        # Заполнить тестовыми данными
npx prisma studio         # GUI для базы данных
```

---

## Coding Conventions

1. **TypeScript strict mode** — `any` запрещён, все типы явные
2. **Tailwind-first** — стили только через Tailwind, inline styles запрещены
3. **Atomic Design** — atoms (ui/) → molecules → organisms (features/)
4. **Server Components по умолчанию** — `'use client'` только при необходимости (хуки, события, браузерные API)
5. **React Query** — для серверных данных; **Zustand** — для клиентского стейта
6. **Zod** — валидация на всех границах (API, формы, env)
7. **Именование:**
   - `PascalCase` — компоненты и типы
   - `camelCase` — функции и переменные
   - `UPPER_SNAKE_CASE` — переменные окружения
   - `kebab-case` — файлы страниц и CSS
8. **Коммиты на русском языке** — `feat: добавить карточку товара`
9. **Импорты** — абсолютные через `@/` (`@/components/ui/Button`)
10. **Ошибки** — всегда обрабатывать, логировать через структурированные сообщения

---

## Ограничения агентов

- Максимум **300 строк кода** на одну задачу
- Задачи выполняются **последовательно** внутри фазы
- Каждая задача — самодостаточный, тестируемый результат
- Полный план задач: **AGENT_TASKS.md**
- ИИ-фундамент закладывается с Фазы 1, реализация ИИ — Фаза 8

---

## Безопасность

- `.env` **всегда** в `.gitignore` — коммитить только `.env.example`
- **Никогда** не хардкодить API-ключи, токены, пароли
- **Zod-валидация** всех входных данных (API inputs, query params, формы)
- Rate limiting на чувствительные эндпоинты (авторизация, оплата)
- Санитизация пользовательского ввода перед сохранением в БД

---

## Дизайн-система

**Стиль:** светлый, премиальный, K-beauty эстетика.

- **Основные цвета:** лавандовый (`#C8A2C8`), пыльная роза (`#E8C4C4`), приглушённое золото (`#C9A96E`)
- **Фоны:** тёплый белый (`#FDFBF9`), кремовый (`#F7F3EF`), персиковый дымок (`#FFF8F5`)
- **Шрифты:** Playfair Display (заголовки) + Inter/Nunito Sans (основной текст)
- **Принципы:** много воздуха, плавные формы, деликатные анимации, скруглённые углы

Подробности: **DESIGN_SYSTEM.md**

---

## Ключевые документы

| Файл | Описание |
|------|----------|
| `TECHNICAL_SPECIFICATION.md` | Полное ТЗ: стек, БД, API, все требования |
| `ARCHITECTURE.md` | Архитектура: рендеринг, стейт, структура |
| `DESIGN_SYSTEM.md` | Дизайн-токены: цвета, шрифты, компоненты |
| `AGENT_TASKS.md` | План задач для агентов по фазам |
| `AI_FOUNDATION.md` | ИИ-фундамент: что закладывать с первого дня |
| `HOMEPAGE_CONCEPT.md` | Концепт главной страницы |
| `CATALOG_TAXONOMY.md` | Структура каталога и категорий |
| `PRODUCT_DISPLAY_SPEC.md` | Спецификация карточки товара |
| `INSTRUCTION_PRODUCT_PAGES.md` | Инструкции по страницам товаров |
| `AUDIT_FINAL_REPORT.md` | Финальный аудит текущего сайта |
| `CLIENT_REPORT.md` | Отчёт для клиента |
