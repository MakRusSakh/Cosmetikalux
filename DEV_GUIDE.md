# CosmetikaLux 2.0 — Руководство разработчика

---

## 1. Требования

| Компонент       | Минимальная версия | Рекомендуемая      |
|-----------------|--------------------|--------------------|
| Node.js         | 20.x LTS          | 20.x LTS          |
| npm             | 10+                | 10+                |
| PostgreSQL      | 16                 | 16.x               |
| Redis           | 7.0+               | 7.2+               |
| Git             | 2.40+              | последняя           |

> Рекомендуется использовать **nvm** для управления версиями Node.js.

---

## 2. Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone git@github.com:your-org/cosmetikalux.git && cd cosmetikalux

# 2. Скопировать пример конфигурации
cp .env.example .env

# 3. Установить зависимости
npm install

# 4. Поднять PostgreSQL и Redis (если ещё не запущены)
#    Вариант через Docker:
#    docker compose up -d postgres redis

# 5. Применить миграции и заполнить БД
npx prisma migrate dev
npx prisma db seed

# 6. Запустить dev-сервер
npm run dev
```

Приложение будет доступно по адресу **http://localhost:3000**.

---

## 3. Переменные окружения

Создайте файл `.env` на основе `.env.example`. Полный список переменных:

### База данных и кэш

| Переменная     | Описание                                | Пример                                             |
|----------------|-----------------------------------------|----------------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string            | `postgresql://user:pass@localhost:5432/cosmetikalux`|
| `REDIS_URL`    | Redis connection string                 | `redis://localhost:6379`                            |

### Аутентификация (NextAuth.js v5)

| Переменная        | Описание                        | Пример                          |
|-------------------|---------------------------------|---------------------------------|
| `NEXTAUTH_SECRET` | Секретный ключ для JWT/сессий   | `openssl rand -base64 32`      |
| `NEXTAUTH_URL`    | URL приложения                  | `http://localhost:3000`         |

### Платёжная система (ЮKassa)

| Переменная            | Описание           |
|-----------------------|--------------------|
| `YOOKASSA_SHOP_ID`    | ID магазина        |
| `YOOKASSA_SECRET_KEY` | Секретный ключ API |

### Доставка

| Переменная            | Описание                  |
|-----------------------|---------------------------|
| `CDEK_CLIENT_ID`      | Client ID для СДЭК API v2|
| `CDEK_CLIENT_SECRET`  | Client Secret СДЭК       |
| `POCHTA_TOKEN`        | Токен API Почты России    |
| `POCHTA_LOGIN`        | Логин Почты России        |
| `POCHTA_PASSWORD`     | Пароль Почты России       |

### ИИ-консультант (GigaChat)

| Переменная              | Описание               |
|-------------------------|------------------------|
| `GIGACHAT_CLIENT_ID`    | Client ID GigaChat API |
| `GIGACHAT_CLIENT_SECRET`| Client Secret GigaChat |

### Уведомления

| Переменная      | Описание              |
|-----------------|-----------------------|
| `SMSRU_API_KEY` | API-ключ SMS.ru       |
| `RESEND_API_KEY`| API-ключ Resend email |

### Интеграция с 1С

| Переменная      | Описание                   | Пример                             |
|-----------------|----------------------------|-------------------------------------|
| `ONEC_API_URL`  | URL HTTP-сервиса 1С       | `https://1c.example.com/api/v1`    |
| `ONEC_API_TOKEN`| Токен авторизации 1С      | —                                   |

### Публичные переменные

| Переменная             | Описание            | Пример                        |
|------------------------|---------------------|-------------------------------|
| `NEXT_PUBLIC_SITE_URL` | Публичный URL сайта | `https://cosmetikalux.ru`     |

---

## 4. Скрипты npm

| Команда               | Описание                                      |
|-----------------------|-----------------------------------------------|
| `npm run dev`         | Запуск dev-сервера (Next.js, hot reload)      |
| `npm run build`       | Production-сборка                             |
| `npm run start`       | Запуск production-сервера                     |
| `npm run lint`        | Проверка кода (ESLint)                        |
| `npm run lint:fix`    | Автоисправление линтинга                      |
| `npm run test`        | Запуск unit-тестов (Vitest)                   |
| `npm run test:e2e`    | Запуск E2E-тестов (Playwright)                |
| `npm run prisma:migrate` | Применить миграции (`prisma migrate dev`)  |
| `npm run prisma:seed` | Заполнить БД тестовыми данными                |
| `npm run prisma:studio`| Открыть Prisma Studio (GUI для БД)           |

---

## 5. Линтинг и форматирование

Проект использует **ESLint** + **Prettier** с единой конфигурацией.

- **ESLint** — проверка качества кода, правила для React/Next.js/TypeScript.
- **Prettier** — автоформатирование (отступы, кавычки, точки с запятой).

### Pre-commit hooks

Настроены через **Husky** + **lint-staged**:

```
При каждом коммите автоматически запускаются:
  1. prettier --write  — форматирование изменённых файлов
  2. eslint --fix      — исправление ошибок линтинга
  3. tsc --noEmit      — проверка типов TypeScript
```

Чтобы установить хуки после клонирования:

```bash
npx husky install
```

---

## 6. Тестирование

### Unit-тесты (Vitest)

```bash
npm run test              # однократный запуск
npm run test -- --watch   # режим наблюдения
npm run test -- --coverage # с отчётом о покрытии
```

- Расположение: `__tests__/` рядом с тестируемым модулем или `src/**/*.test.ts`.
- Минимальное покрытие: **80%** (lines, branches, functions).

### E2E-тесты (Playwright)

```bash
npm run test:e2e                     # запуск всех E2E
npx playwright test --ui             # интерактивный режим
npx playwright show-report           # HTML-отчёт
```

- Расположение: `e2e/` в корне проекта.
- Тестируются основные сценарии: каталог, корзина, оформление заказа, личный кабинет.

---

## 7. Git workflow

### Ветвление

```
main           — production-код, всегда стабилен
  └── develop  — интеграционная ветка
       └── feature/название-фичи
       └── fix/описание-бага
       └── refactor/что-рефакторим
```

### Правила коммитов

Сообщения коммитов пишутся **на русском языке**:

```
feat: добавить фильтрацию каталога по типу кожи
fix: исправить расчёт бонусов при частичном возврате
refactor: вынести логику доставки в отдельный сервис
docs: обновить документацию API
test: добавить тесты для корзины
```

### Pull Request

1. Создать ветку от `develop`.
2. Написать код, покрыть тестами.
3. Убедиться, что `npm run lint` и `npm run test` проходят без ошибок.
4. Открыть PR в `develop`, заполнить описание.
5. Дождаться ревью (минимум 1 approve).
6. Смёрджить через **Squash and Merge**.

---

## 8. Полезные команды

```bash
# Prisma
npx prisma studio            # GUI для просмотра и редактирования данных
npx prisma format            # форматирование schema.prisma
npx prisma generate          # перегенерация Prisma Client
npx prisma migrate reset     # сброс БД и повторное применение миграций

# Next.js
npx next lint                # линтинг Next.js-специфичных правил
npx next info                # информация о среде (для баг-репортов)

# Отладка
NEXT_DEBUG=true npm run dev  # расширенный дебаг Next.js
```

---

> **Стек:** Next.js 15 / React 19 / TypeScript / Tailwind CSS 4 / Prisma / PostgreSQL 16 / Redis
> **CI/CD:** GitHub Actions | **Мониторинг:** Sentry + Vercel Analytics
