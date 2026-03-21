# MiniApp

Отдельная песочница для Telegram Mini App (не связана с вашим рабочим ботом).

## Что внутри

- `server.js` - Node.js сервер, раздает сайт из `public/`
- `public/` - мобильный интерфейс mini app
- `public/admin.html` - админ-мониторинг команд и триггеров
- `miniapp_bot.py` - отдельный Telegram-бот с кнопкой открытия mini app

## Сценарии

Подготовленный пакет под государство Верона:

- `public/scenarios/verona/scenario.json` - структурированные города, механики, предметы и тексты
- `public/scenarios/verona/assets/PLACE-MAPS-HERE.txt` - слоты под будущие карты и портрет советника
- `docs/verona-scenario.md` - человеческая сводка по маршруту, уликам и городам
- `public/scenarios/index.json` - реестр сценариев, который говорит приложению, какой сюжет доступен и какой включён по умолчанию

Подготовленный пакет под Эмираты Дюны:

- `public/scenarios/emirates-dune/scenario.json` - сценарий ОАЭ/Дюны по Excel-наработкам
- `public/scenarios/emirates-dune/assets/PLACE-ASSETS-HERE.txt` - слоты под карты, персонажей и предметы
- `docs/emirates-dune-scenario.md` - сводка по маршруту, уликам и уже понятным пропсам

### Как теперь переключаются сюжеты

Логика сценариев вынесена в отдельные JSON-файлы.

Чтобы добавить новый сюжет:

1. Создайте папку `public/scenarios/<scenario-id>/`
2. Положите туда `scenario.json`
3. Добавьте запись в `public/scenarios/index.json`
4. Когда сценарий готов к запуску, поставьте `"playable": true`

Сайт сам подхватит заголовки, описания и тексты интерфейса из файла сценария.

Для разработческой проверки можно открывать сайт так:

`http://localhost:3000/?scenario=italy`

Когда Верона будет готова к реальному запуску, достаточно будет:

- включить `"playable": true` в её записи,
- подложить карты,
- открыть `?scenario=verona`

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

## Нагрузочное тестирование

В репозиторий добавлен полный `k6`-сценарий mini app:

- `load-tests/miniapp-full-scenario.js`

Что он делает:

- открывает оболочку mini app и основные локальные ресурсы
- загружает `/health`, `/api/config`, `/api/map-source` и сам файл карты
- регистрирует команду
- проходит все основные точки маршрута через `/api/event`
- для Пизы отдельно отправляет `city-poi`
- отправляет итоговый ответ через `/api/final-answer`
- повторно проверяет статус команды

Важно:

- сценарий не "бьет сайт", а имитирует реальный путь пользователя
- сценарий пишет реальные события в backend, поэтому гонять его лучше локально или на staging
- если запускать его по боевой базе, он будет менять прогресс команд и итоговый ответ

Пример запуска на локальном сервере:

```powershell
cd "c:\Users\pavel\Desktop\Новая папка\MiniApp"
npm run start
```

В другом окне:

```powershell
k6 run -e BASE_URL=http://localhost:3000 -e TARGET_VUS=80 .\load-tests\miniapp-full-scenario.js
```

Более мягкий прогон:

```powershell
k6 run -e BASE_URL=http://localhost:3000 -e TARGET_VUS=20 -e HOLD_FOR=1m .\load-tests\miniapp-full-scenario.js
```

Полезные параметры:

- `BASE_URL` - адрес тестируемого сервера
- `TARGET_VUS` - сколько одновременных пользователей держать
- `START_VUS` - стартовое количество пользователей
- `RAMP_UP` - время разгона
- `HOLD_FOR` - сколько держать целевую нагрузку
- `RAMP_DOWN` - время плавного завершения
- `TEAM_NAME` - принудительно использовать одну конкретную команду
- `FINAL_ANSWER` - текст итогового ответа для теста
