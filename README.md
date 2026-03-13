# MiniApp

Отдельная песочница для Telegram Mini App (не связана с вашим рабочим ботом).

## Что внутри

- `server.js` - Node.js сервер, раздает сайт из `public/`
- `public/` - мобильный интерфейс mini app
- `public/admin.html` - админ-мониторинг команд и триггеров
- `miniapp_bot.py` - отдельный Telegram-бот с кнопкой открытия mini app

## Быстрый старт (локально)

```powershell
cd "c:\Users\pavel\Desktop\Новая папка\MiniApp"
npm install
npm run start
```

Сайт откроется на `http://localhost:3000`.

Админ-панель: `http://localhost:3000/admin`.

## Если фронт на Surge, а backend отдельно

Регистрация команд и синхронизация работают только через API (`/api/*`).
На чистом Surge (статический хостинг) API нет, поэтому нужно указать адрес backend сервера:

`https://miniapp-2uq.surge.sh/?api=https://ВАШ_BACKEND_ДОМЕН`

Пример:

`https://miniapp-2uq.surge.sh/?api=https://miniapp-backend.example.com`

## Запуск отдельного mini app бота

```powershell
cd "c:\Users\pavel\Desktop\Новая папка\MiniApp"
$env:MINI_APP_BOT_TOKEN="ВАШ_ТОКЕН_БОТА"
$env:MINI_APP_URL="https://ВАШ_PUBLIC_HTTPS_URL"
python miniapp_bot.py
```

## Деплой на Render (рекомендуется)

Этот проект больше не является чистой статикой: у него есть backend (`server.js`) и API (`/api/*`).
Поэтому `surge` для него не подходит как основной хостинг.

В репозиторий добавлен `render.yaml`, так что деплой делается как обычный Node Web Service.

Нужно:

1. Залить репозиторий на GitHub
2. В Render выбрать `New +` -> `Blueprint`
3. Подключить репозиторий
4. Подтвердить создание сервиса из `render.yaml`

После деплоя будет один URL и для фронта, и для backend API.

## Деплой на Surge (только для старой статики)

```powershell
cd "c:\Users\pavel\Desktop\Новая папка\MiniApp"
npm run deploy:surge
```

При первом запуске Surge попросит `email/password`.

После логина можно сразу задать домен:

```powershell
npx surge public miniapp-2uq.surge.sh
```

## Cloudflare Tunnel (опционально)

```powershell
cloudflared tunnel --url http://localhost:3000
```

В консоли появится `https://...trycloudflare.com` - подставьте этот URL в `MINI_APP_URL`.

## Реализовано в интерфейсе

- Командная регистрация (9 команд) прямо в mini app
- Синхронизация по команде: счетчик перемещений и триггеры
- Карта с кликабельными точками и городской режим Пизы на основной карте
- Игры:
  - перетаскивание плиток
  - выбор правильного варианта
  - сопоставление пар
  - ввод текстового ответа
- Админ-мониторинг `GET /api/admin/summary` и страница `/admin`
