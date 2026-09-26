# FutureMinds — MVP

AI-платформа для поступления: университеты, гранты, олимпиады, Skill Gap, 12-Month Roadmap, AI Assistant.

## Технологии
Next.js 14 (App Router) + TypeScript, Tailwind CSS, Supabase (Postgres + Auth), OpenAI API.

## 1. Установка

```bash
npm install
cp .env.example .env
```

Открой `.env` и заполни (см. разделы 2–3 ниже):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
DEMO_AI_MODE=true
```

## 2. Подключить Supabase

1. Зарегистрируйся на supabase.com → **New Project**.
2. **SQL Editor** → вставь содержимое `supabase/schema.sql` → **Run**.
3. **Project Settings → API** → скопируй `Project URL` и `anon public key` в `.env`.

## 3. Подключить OpenAI

1. platform.openai.com → **API Keys** → **Create new secret key** → вставь в `.env` как `OPENAI_API_KEY`.
2. **Billing** → привяжи карту (без этого API не отвечает).
3. Поставь `DEMO_AI_MODE=false`, чтобы включить настоящий AI.

## 4. Demo Mode (без ключа OpenAI)

Оставь `DEMO_AI_MODE=true` (или не задавай `OPENAI_API_KEY`) — все 4 AI-роута (`/api/ai-assistant`, `/api/essay-analyze`, `/api/document-check`, `/api/translate`) автоматически переключатся на упрощённые правило-based ответы и вернут `demo: true`. Сайт при этом полностью рабочий.

## 5. Запуск

```bash
npm run dev
```
Открой http://localhost:3000

## 6. Проверка функций

| Функция | Как проверить |
|---|---|
| Регистрация | `/register` → заполни имя/email/пароль → должен перейти на `/profile` |
| Профиль | `/profile` → заполни поля → «Сохранено ✓» появляется после сабмита |
| Universities | `/universities` → открой любой университет → появляется % Match (если профиль заполнен) |
| Skill Gap | `/skill-gap` → бары должны меняться при смене счётчиков в профиле |
| Roadmap | `/roadmap` → 12 карточек-месяцев, кнопка «+ Календарь» на каждой задаче |
| AI Assistant | `/ai-assistant` → напиши вопрос → в Demo Mode придёт rule-based ответ, с ключом — настоящий GPT-ответ |
| Essay/Document/Translate | Вызываются через `fetch('/api/essay-analyze' | 'document-check' | 'translate')` — можно проверить через `curl` (см. ниже) |

Проверка API напрямую:
```bash
curl -X POST http://localhost:3000/api/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Привет"}],"profile":{}}'
```

## 7. Данные

`data/universities.json` (31 запись) и `data/opportunities.json` (75 записей) — демо-данные, честно помечены как демо. Реальные дедлайны/требования нужно сверять с официальными сайтами вузов и организаторов. Чтобы добавить больше записей — просто дополни эти JSON-файлы тем же форматом (можно сгенерировать через Excel/Google Sheets → экспорт в JSON, или попросить AI-агента написать скрипт-парсер под конкретный источник).

## 8. Деплой онлайн

1. Запушь проект на GitHub:
   ```bash
   git init && git add . && git commit -m "FutureMinds MVP"
   git remote add origin <URL твоего репозитория>
   git push -u origin main
   ```
2. На vercel.com → **Add New Project** → выбери репозиторий.
3. В **Environment Variables** добавь те же переменные, что в `.env`.
4. **Deploy** — через пару минут получишь ссылку вида `futureminds.vercel.app`.

## 9. Что реализовано полностью, а что — по тому же паттерну

Полностью рабочие страницы: лендинг, регистрация/вход, dashboard, profile, universities (список + детали + match), skill-gap, roadmap, ai-assistant + все 4 API-роута.

Остальные разделы из полной спецификации (Portfolio, Calendar, Opportunities/Scholarships/Internships/Olympiads/Competitions/Startups/Hackathons, Applications, Saved, Essay Analyzer UI, Document Checker UI, Translator UI, Settings) используют **тот же паттерн**, что уже показан в готовых страницах:
1. `'use client'` компонент с `useEffect` → `supabase.from(...).select()`
2. Форма/список → `supabase.from(...).insert()/upsert()`
3. Для AI-функций — `fetch('/api/...')` на уже готовые роуты essay-analyze / document-check / translate

Таблицы для Calendar, Applications, Saved и Portfolio уже есть в `supabase/schema.sql` — фронтенд для них достраивается по образцу `app/roadmap/page.tsx` (тот же вызов `supabase.from('calendar_events').insert(...)`, который используется в кнопке «+ Календарь»).
