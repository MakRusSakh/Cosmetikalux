# CosmetikaLux — Деплой и инфраструктура

---

## 1. Обзор инфраструктуры

```
Пользователь → Cloudflare CDN (SSL + WAF) → Next.js 15 (Vercel / VPS) → PostgreSQL 16 + Redis 7 + File Storage
```

Внешние сервисы: GigaChat API, ЮKassa, СДЭК API v2, Почта России API, SMS.ru, Resend, 1С.

---

## 2. Вариант 1: Vercel (рекомендуемый)

### Подключение

1. Импортировать GitHub-репозиторий в [Vercel Dashboard](https://vercel.com/new)
2. Framework Preset: **Next.js**
3. Root Directory: `.` (корень)
4. Build Command: `npx prisma generate && next build`

### Environment Variables

Добавить в **Settings → Environment Variables** все переменные из `.env`:

- `DATABASE_URL`, `REDIS_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `YUKASSA_SHOP_ID`, `YUKASSA_SECRET_KEY`, `CDEK_CLIENT_ID`, `CDEK_CLIENT_SECRET`
- `GIGACHAT_CLIENT_ID`, `GIGACHAT_CLIENT_SECRET`
- `RESEND_API_KEY`, `SMS_RU_API_KEY`, `SENTRY_DSN`
- `NEXT_PUBLIC_SITE_URL=https://cosmetikalux.ru`

### Деплой

- **Production:** автоматический деплой при push в `main`
- **Preview:** автоматический деплой для каждого Pull Request
- Откат: через Vercel Dashboard → Deployments → Redeploy предыдущей версии

### Ограничения

- Serverless functions timeout: 10 сек (Hobby) / 60 сек (Pro)
- Edge Runtime: ограниченный Node.js API (нет `fs`, `child_process`)
- Размер функции: 50 MB (в сжатом виде)

---

## 3. Вариант 2: VPS (альтернатива)

### Требования к серверу

- **ОС:** Ubuntu 22.04+
- **CPU:** 2 vCPU, **RAM:** 4 GB, **Диск:** 40 GB SSD
- **Хостинг:** Timeweb Cloud, Selectel, Reg.ru

### Docker Compose

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [postgres, redis]
    restart: always

  postgres:
    image: postgres:16
    volumes: ["pg_data:/var/lib/postgresql/data"]
    environment:
      POSTGRES_DB: cosmetikalux
      POSTGRES_USER: clx
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: always

  redis:
    image: redis:7-alpine
    volumes: ["redis_data:/data"]
    restart: always

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    restart: always
```

### Nginx + SSL

- Reverse proxy на `localhost:3000`
- Let's Encrypt через certbot: `certbot --nginx -d cosmetikalux.ru -d www.cosmetikalux.ru`
- Автообновление: `crontab -e` → `0 3 * * * certbot renew --quiet`

### PM2 (альтернатива Docker для app)

```bash
pm2 start npm --name "cosmetikalux" -- start
pm2 save && pm2 startup systemd
```

---

## 4. База данных (PostgreSQL 16)

| | Vercel-вариант | VPS-вариант |
|---|---|---|
| Сервис | Neon / Supabase | Docker PostgreSQL |
| Подключение | `DATABASE_URL` из дашборда | `postgresql://clx:pass@localhost:5432/cosmetikalux` |
| Миграции | `npx prisma migrate deploy` | `npx prisma migrate deploy` |

### Бэкапы

```bash
# Ежедневный дамп (cron: 0 2 * * *)
pg_dump -U clx cosmetikalux | gzip > /backups/db_$(date +%Y%m%d).sql.gz
# Удаление старше 30 дней
find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

---

## 5. Redis

| | Vercel-вариант | VPS-вариант |
|---|---|---|
| Сервис | Upstash Redis | Docker Redis 7 |
| URL | `REDIS_URL` из Upstash | `redis://localhost:6379` |

Используется для: кэш каталога, сессии, rate limiting, очередь синхронизации 1С.

---

## 6. Cloudflare

### DNS-записи для cosmetikalux.ru

| Тип | Имя | Значение | Proxy |
|---|---|---|---|
| A | @ | IP сервера (VPS) или CNAME Vercel | Да |
| CNAME | www | cosmetikalux.ru | Да |

### Настройки

- **SSL/TLS:** Full (strict)
- **WAF:** Rate limiting (100 req/min на IP), Bot Fight Mode включён
- **Page Rules:** `cosmetikalux.ru/_next/static/*` → Cache Level: Cache Everything, Edge TTL: 30 дней
- **Кэширование:** Browser Cache TTL: 4 часа для HTML, 30 дней для статики

---

## 7. CI/CD — GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25  # Vercel-вариант
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod
```

**Secrets в GitHub:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `DATABASE_URL`, `SENTRY_DSN`.

---

## 8. Мониторинг

| Что | Инструмент | Назначение |
|---|---|---|
| Web Vitals | Vercel Analytics | LCP, FID, CLS, TTFB |
| Ошибки | Sentry | JS-ошибки фронт + бэк, API latency |
| Uptime | UptimeRobot / Betterstack | Проверка доступности каждые 60 сек |
| БД | pgAdmin / Prisma Studio | Просмотр данных, медленные запросы |
| Платежи | ЮKassa Dashboard | Success/fail rate оплат |
| 1С-синхронизация | Custom Dashboard / логи | Статус обмена, ошибки |

---

## 9. Чеклист перед продакшеном

- [ ] Все environment variables заполнены (проверить `.env.example`)
- [ ] `npx prisma migrate deploy` — миграции применены
- [ ] Seed-данные загружены: категории, бренды, начальные товары
- [ ] SSL-сертификат активен (Cloudflare Full strict)
- [ ] Cloudflare DNS-записи настроены, proxy включён
- [ ] Бэкап БД настроен (ежедневно, хранение 30 дней)
- [ ] Sentry DSN подключён, тестовая ошибка отловлена
- [ ] UptimeRobot/Betterstack мониторит `https://cosmetikalux.ru`
- [ ] `robots.txt` разрешает индексацию
- [ ] `sitemap.xml` генерируется (каталог, категории, страницы)
- [ ] ЮKassa webhook URL указывает на production
- [ ] СДЭК и Почта России API — production-ключи
- [ ] Lighthouse Score > 90 на главной и каталоге
- [ ] WAF rate limiting протестирован
