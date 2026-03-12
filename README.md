# MiniApp

Отдельная песочница для Telegram Mini App (не связана с вашим рабочим ботом).

## Что внутри

- `server.js` - Node.js сервер, раздает сайт из `public/`
- `public/` - мобильный интерфейс mini app
- `miniapp_bot.py` - отдельный Telegram-бот с кнопкой открытия mini app

## Быстрый старт (локально)

```powershell
cd "c:\Users\pavel\Desktop\Новая папка\MiniApp"
npm install
npm run start
```

Сайт откроется на `http://localhost:3000`.

## Запуск отдельного mini app бота

```powershell
cd "c:\Users\pavel\Desktop\Новая папка\MiniApp"
$env:MINI_APP_BOT_TOKEN="ВАШ_ТОКЕН_БОТА"
$env:MINI_APP_URL="https://ВАШ_PUBLIC_HTTPS_URL"
python miniapp_bot.py
```

## Cloudflare Tunnel (когда будете готовы)

```powershell
cloudflared tunnel --url http://localhost:3000
```

В консоли появится `https://...trycloudflare.com` - подставьте этот URL в `MINI_APP_URL`.

## Реализовано в интерфейсе

- Нижняя навигация: `Карта` и `Игры`
- Карта с кликабельными точками
- Модальное окно с описанием задачи
- Игры:
  - перетаскивание плиток
  - выбор правильного варианта
  - сопоставление пар
  - ввод текстового ответа
- Mobile-first стиль: скругленные элементы, адаптация под телефон
