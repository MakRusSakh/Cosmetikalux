# CosmetikaLux — ИИ-фундамент (AI Foundation Layer)

> Что закладывается с первого дня, чтобы Фаза 8 (ИИ-консультант)
> встала как плагин — без рефакторинга, без миграций, без переделок.

---

## Принцип

```
Фазы 1-7:  Строим дом, прокладываем проводку для «умных» розеток
Фаза 8:    Подключаем «умные» устройства — всё уже готово
```

ИИ-функционал **не реализуется** до Фазы 8, но **инфраструктура** создаётся параллельно с основной разработкой. Это добавляет ~5% к трудоёмкости Фаз 1-7, но экономит ~40% на Фазе 8.

---

## 1. База данных (Фаза 1)

### Модели, которые создаются сразу

Эти таблицы мигрируются вместе со всеми остальными, даже если данные появятся только в Фазе 8.

```prisma
// ✅ Создаётся в Фазе 1, используется в Фазе 8

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

model ChatSession {
  id              String          @id @default(cuid())
  userId          String?
  user            User?           @relation(fields: [userId], references: [id])
  sessionToken    String          @unique
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

enum SkinType {
  DRY
  OILY
  COMBINATION
  SENSITIVE
  NORMAL
}
```

### Поля на товарах (для RAG)

```prisma
// ✅ Эти поля на модели Product создаются в Фазе 1,
//    заполняются с Фазы 2 (при добавлении товаров),
//    используются для RAG-поиска в Фазе 8

model Product {
  // ... основные поля ...

  skinTypes       SkinType[]    // Для каких типов кожи подходит
  concerns        String[]      // Решаемые проблемы: ["увлажнение", "anti-age"]
  ageGroups       String[]      // Целевой возраст: ["25-35", "35-45"]
  composition     String?       // INCI состав — ИИ будет анализировать
  application     String?       // Способ применения — ИИ будет цитировать
}
```

**Важно:** При добавлении товаров через админку (Фаза 2) уже должны быть поля для `skinTypes`, `concerns`, `ageGroups`. Даже если ИИ пока нет — эти данные нужны для фильтров каталога И для будущего RAG.

---

## 2. TypeScript типы (Фаза 1)

### src/types/chat.ts

```typescript
// ✅ Создаётся в Фазе 1, пустой файл с типами

export type ChatRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  metadata?: ChatMessageMetadata;
  createdAt: Date;
}

export interface ChatMessageMetadata {
  /** ID рекомендованных товаров */
  recommendedProductIds?: string[];
  /** Быстрые кнопки для следующего шага */
  quickButtons?: QuickButton[];
  /** Была ли добавлена покупка из чата */
  addedToCart?: boolean;
}

export interface QuickButton {
  label: string;
  value: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SkinProfile {
  skinType: SkinType;
  age?: number;
  concerns: string[];
  allergies: string[];
  preferences?: SkinPreferences;
}

export type SkinType = 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE' | 'NORMAL';

export interface SkinPreferences {
  brands?: string[];
  textures?: string[];
  fragrances?: 'like' | 'neutral' | 'avoid';
}

/**
 * Интерфейс AI Provider — абстракция для замены LLM
 * Реализация появится в Фазе 8
 */
export interface AIProvider {
  /** Отправить сообщение и получить стрим */
  streamMessage(params: AIStreamParams): AsyncGenerator<string>;
  /** Проверить доступность сервиса */
  healthCheck(): Promise<boolean>;
}

export interface AIStreamParams {
  messages: Array<{ role: ChatRole; content: string }>;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Контекст для RAG — формируется из данных пользователя и каталога
 */
export interface AIContext {
  skinProfile?: SkinProfile;
  orderHistory?: Array<{ productName: string; date: Date }>;
  currentCart?: Array<{ productName: string; price: number }>;
  relevantProducts: AIProductContext[];
  activePromotions?: Array<{ code: string; description: string }>;
}

export interface AIProductContext {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  stock: number;
  skinTypes: SkinType[];
  concerns: string[];
  shortDescription?: string;
  rating?: number;
  reviewCount?: number;
}
```

---

## 3. Zustand Store (Фаза 1)

### src/stores/chatStore.ts

```typescript
// ✅ Создаётся в Фазе 1
// Логика стриминга добавляется в Фазе 8

import { create } from 'zustand';
import type { ChatMessage, ChatSession } from '@/types/chat';

interface ChatState {
  /** Чат открыт/закрыт */
  isOpen: boolean;
  /** Текущая сессия */
  currentSession: ChatSession | null;
  /** Идёт ли стриминг ответа */
  isStreaming: boolean;
  /** Контекст товара (если чат открыт с карточки товара) */
  productContext: string | null;

  // Действия
  open: (productContext?: string) => void;
  close: () => void;
  toggle: () => void;
  setStreaming: (isStreaming: boolean) => void;
  setSession: (session: ChatSession) => void;
  addMessage: (message: ChatMessage) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  currentSession: null,
  isStreaming: false,
  productContext: null,

  open: (productContext) => set({ isOpen: true, productContext: productContext ?? null }),
  close: () => set({ isOpen: false, productContext: null }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setSession: (session) => set({ currentSession: session }),
  addMessage: (message) =>
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, messages: [...state.currentSession.messages, message] }
        : null,
    })),
  reset: () => set({ currentSession: null, isStreaming: false, productContext: null }),
}));
```

---

## 4. API-заглушки (Фаза 1)

### src/app/api/chat/message/route.ts

```typescript
// ✅ Создаётся в Фазе 1 — заглушка
// Реальная реализация с GigaChat в Фазе 8

import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Фаза 8 — подключить GigaChat + RAG
  return NextResponse.json(
    {
      message: 'ИИ-консультант скоро заработает! Следите за обновлениями.',
      available: false,
    },
    { status: 503 }
  );
}
```

### src/app/api/chat/session/route.ts

```typescript
// ✅ Создаётся в Фазе 1 — заглушка

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ available: false }, { status: 503 });
}

export async function GET() {
  return NextResponse.json({ sessions: [], available: false });
}
```

---

## 5. Абстракция AI Provider (Фаза 1)

### src/lib/ai/provider.ts

```typescript
// ✅ Интерфейс создаётся в Фазе 1
// Реализация GigaChatProvider — в Фазе 8

import type { AIProvider, AIStreamParams, ChatRole } from '@/types/chat';

/**
 * Абстрактный AI Provider
 * Позволяет заменить GigaChat на любую другую LLM без изменения бизнес-логики
 */
export abstract class BaseAIProvider implements AIProvider {
  abstract streamMessage(params: AIStreamParams): AsyncGenerator<string>;
  abstract healthCheck(): Promise<boolean>;
}

/**
 * Заглушка — используется до подключения реального провайдера
 */
export class StubAIProvider extends BaseAIProvider {
  async *streamMessage(): AsyncGenerator<string> {
    yield 'ИИ-консультант скоро заработает! 🌸';
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// В Фазе 8 здесь появится:
// export class GigaChatProvider extends BaseAIProvider { ... }

/**
 * Фабрика — возвращает активного провайдера
 * В Фазе 8 будет проверять env и возвращать GigaChatProvider
 */
export function getAIProvider(): AIProvider {
  // TODO: Фаза 8
  // if (process.env.GIGACHAT_CLIENT_ID) {
  //   return new GigaChatProvider();
  // }
  return new StubAIProvider();
}
```

### src/lib/ai/context-builder.ts

```typescript
// ✅ Создаётся в Фазе 1 — интерфейс
// Реализация наполняется по мере готовности модулей

import type { AIContext, AIProductContext, SkinProfile } from '@/types/chat';

/**
 * Собирает контекст для ИИ из данных пользователя и каталога
 * Методы добавляются по мере разработки:
 * - Фаза 2: getRelevantProducts (поиск по каталогу)
 * - Фаза 4: getSkinProfile
 * - Фаза 5: getActivePromotions
 * - Фаза 8: полная сборка контекста
 */
export class AIContextBuilder {
  private userId?: string;

  constructor(userId?: string) {
    this.userId = userId;
  }

  /**
   * Поиск товаров по ключевым словам — используется RAG в Фазе 8
   * Сам SQL-запрос реализуется в Фазе 2 (для фильтров каталога),
   * здесь он будет переиспользован
   */
  async getRelevantProducts(_query: string): Promise<AIProductContext[]> {
    // TODO: Фаза 8 — подключить к поисковому сервису из Фазы 2
    return [];
  }

  async getSkinProfile(): Promise<SkinProfile | null> {
    // TODO: Фаза 8 — загрузить из БД (модель уже есть с Фазы 1)
    return null;
  }

  async buildContext(_userMessage: string): Promise<AIContext> {
    // TODO: Фаза 8 — полная сборка
    return { relevantProducts: [] };
  }
}
```

---

## 6. UI-заглушки

### Кнопка чата (Фаза 7 — перед запуском)

```tsx
// src/components/chat/ChatWidgetStub.tsx
// ✅ Отображается до Фазы 8

'use client';

import { Sparkles } from 'lucide-react';

export function ChatWidgetStub() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Кнопка */}
      <button
        className="group relative flex h-14 w-14 items-center justify-center
                   rounded-full bg-gradient-to-br from-accent-lavender to-accent-rose
                   text-white shadow-glow transition-all hover:scale-110"
        onClick={() => {
          // TODO: Фаза 8 — useChatStore().open()
          alert('Персональный beauty-консультант скоро заработает! 🌸');
        }}
      >
        <Sparkles className="h-6 w-6" />

        {/* Пульсация */}
        <span className="absolute inset-0 animate-ping rounded-full
                         bg-accent-lavender opacity-20" />
      </button>

      {/* Подсказка */}
      <div className="absolute bottom-16 right-0 w-48 rounded-lg bg-white
                      p-3 text-center text-sm shadow-lg opacity-0
                      group-hover:opacity-100 transition-opacity">
        <p className="font-playfair text-text-secondary">
          Скоро здесь появится ваш персональный beauty-консультант
        </p>
      </div>
    </div>
  );
}
```

### Кнопка на карточке товара (Фаза 7)

```tsx
// В компоненте ProductInfo.tsx — кнопка «Спросить консультанта»

<button
  className="flex items-center gap-2 text-sm text-accent-lavender
             hover:text-accent-lavender-hover transition-colors"
  onClick={() => {
    // Фаза 8: useChatStore().open(product.slug)
    alert('Beauty-консультант скоро подскажет всё об этом товаре! 🌸');
  }}
>
  <Sparkles className="h-4 w-4" />
  Спросить консультанта
</button>
```

### Заглушка в ЛК (Фаза 4)

```tsx
// src/app/(account)/account/consultations/page.tsx

export default function ConsultationsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Sparkles className="h-12 w-12 text-accent-lavender mb-4" />
      <h2 className="font-playfair text-h4 text-text-primary mb-2">
        Beauty-консультант
      </h2>
      <p className="font-playfair text-text-tertiary max-w-md">
        Скоро здесь появится ваш персональный ИИ-консультант,
        который подберёт идеальный уход именно для вашей кожи.
      </p>
      <div className="mt-6 rounded-full bg-accent-lavender-light
                      px-6 py-2 text-sm text-accent-lavender font-playfair">
        Уже скоро
      </div>
    </div>
  );
}
```

---

## 7. Переменные окружения (Фаза 1)

### .env.example

```env
# ═══════════════════════════════════════════
# ИИ-консультант (Фаза 8)
# Оставить пустыми до подключения GigaChat
# ═══════════════════════════════════════════

# GigaChat API
GIGACHAT_CLIENT_ID=
GIGACHAT_CLIENT_SECRET=
GIGACHAT_SCOPE=GIGACHAT_API_PERS
GIGACHAT_MODEL=GigaChat-Pro

# ИИ-настройки
AI_ENABLED=false
AI_MAX_MESSAGES_PER_SESSION=50
AI_RATE_LIMIT_PER_MINUTE=10
AI_MAX_TOKENS=1024
AI_TEMPERATURE=0.7
```

**`AI_ENABLED=false`** — главный переключатель. В коде проверяем:

```typescript
// Везде, где есть ИИ-логика:
const isAIEnabled = process.env.AI_ENABLED === 'true';

// В ChatWidgetStub — если true, рендерим полный ChatWidget
// В API — если false, возвращаем 503
// В навигации — если false, скрываем «Мои консультации»
```

---

## 8. Feature Flag: AI_ENABLED

### Где проверяется

| Место | Поведение при `false` | Поведение при `true` |
|-------|-----------------------|----------------------|
| Кнопка чата (floating) | ChatWidgetStub (тизер) | ChatWidget (полный) |
| Карточка товара | «Скоро» alert | Открывает чат с контекстом |
| /account/consultations | Заглушка | Список консультаций |
| /account/routine | Заглушка | Генератор рутины |
| POST /api/chat/message | 503 | Стриминг ответа |
| Главная (рекомендации) | Скрыта секция | «Подобрано для вас» |
| Админка /admin/chat | Скрыта в меню | Управление ИИ |
| Header навигация | Без пункта «Консультант» | Пункт «Консультант» |

---

## 9. Что переиспользуется из Фаз 1-7

| Компонент из ранних фаз | Как используется в Фазе 8 |
|--------------------------|---------------------------|
| Поиск товаров (Фаза 2) | RAG: поиск релевантных товаров по запросу |
| ProductCard (Фаза 2) | Компактная версия внутри чата |
| SkinProfile форма (Фаза 4) | Данные подгружаются в контекст GigaChat |
| Корзина store (Фаза 3) | Кнопка «В корзину» прямо из чата |
| Акции/промокоды (Фаза 5) | ИИ знает про активные акции |
| Redis кэш (Фаза 6) | Кэш токенов GigaChat, кэш частых ответов |

---

## 10. Чеклист: готовность к Фазе 8

Перед началом Фазы 8, убедиться что:

- [ ] Таблицы ChatSession, ChatMessage, SkinProfile существуют в БД
- [ ] Файл src/types/chat.ts содержит все типы
- [ ] chatStore.ts в Zustand инициализирован
- [ ] API-заглушки /api/chat/* отвечают 503
- [ ] src/lib/ai/provider.ts содержит интерфейс AIProvider
- [ ] src/lib/ai/context-builder.ts содержит каркас AIContextBuilder
- [ ] .env.example содержит GigaChat переменные
- [ ] AI_ENABLED=false работает как feature flag
- [ ] Товары в каталоге имеют заполненные concerns[], skinTypes[]
- [ ] Поиск товаров по характеристикам работает (Фаза 2)
- [ ] ChatWidgetStub отображается на сайте
- [ ] Профиль кожи можно заполнить в ЛК
- [ ] GigaChat API ключи получены от Сбера

---

> **Итого доп. трудоёмкость фундамента:** ~30-40 часов (5% от общего объёма)
> **Экономия на Фазе 8:** ~60-80 часов (нет рефакторинга, миграций, переделок UI)
> **Время подключения ИИ после готовности фундамента:** 2-3 недели
