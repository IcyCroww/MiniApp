const tg = window.Telegram?.WebApp;

function compareTelegramVersions(current = '0', target = '0') {
  const currentParts = String(current || '0').split('.').map((part) => Number(part) || 0);
  const targetParts = String(target || '0').split('.').map((part) => Number(part) || 0);
  const maxLength = Math.max(currentParts.length, targetParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const currentValue = currentParts[index] || 0;
    const targetValue = targetParts[index] || 0;

    if (currentValue > targetValue) {
      return 1;
    }

    if (currentValue < targetValue) {
      return -1;
    }
  }

  return 0;
}

function telegramVersionAtLeast(minVersion = '0') {
  if (!tg) {
    return false;
  }

  if (typeof tg.isVersionAtLeast === 'function') {
    try {
      return tg.isVersionAtLeast(minVersion);
    } catch (_) {
      // Fall back to local compare below.
    }
  }

  return compareTelegramVersions(tg.version || '0', minVersion) >= 0;
}

function canUseTelegramThemeColors() {
  return telegramVersionAtLeast('6.1');
}

function canUseTelegramHaptics() {
  return telegramVersionAtLeast('6.1') && Boolean(tg?.HapticFeedback);
}

function canUseTelegramAlert() {
  return telegramVersionAtLeast('6.2') && typeof tg?.showAlert === 'function';
}

if (tg) {
  tg.ready();
  tg.expand();

  if (canUseTelegramThemeColors()) {
    try {
      tg.setHeaderColor('#103026');
      tg.setBackgroundColor('#091615');
    } catch (_) {
      // Unsupported in some Telegram clients.
    }
  }
}

const DEFAULT_POINTS = [
  {
    id: 'vatican',
    title: 'Ватикан',
    text: 'Первый зал переговоров.',
    lat: 41.9029,
    lng: 12.4534,
    zoom: 10,
    task: {
      kind: 'slider',
      kicker: 'Досье Ватикана',
      title: 'Ватикан: первый зал',
      lore: 'Вы делегация школьного мирного совета. В архиве зала остался чертеж: кто восстановит форму стола, тот поймет, как строится вся рассадка саммита.',
      question: 'Соберите пятнашки 3x3: должен получиться замкнутый овал вокруг пустой клетки.',
      success: 'Печать зала совпала с архивом.',
      answerLabel: 'Ключ',
      answerText: 'Ключ 1: форма стола - ОВАЛ.',
      slider: {
        size: 3,
        freeMove: false,
        solved: [1, 2, 3, 4, 0, 5, 6, 7, 8],
        labels: {
          1: '◜',
          2: '◠',
          3: '◝',
          4: '(',
          5: ')',
          6: '◟',
          7: '◡',
          8: '◞'
        }
      }
    }
  },
  {
    id: 'rome',
    title: 'Рим',
    text: 'Протокол трибун.',
    lat: 41.9028,
    lng: 12.4964,
    zoom: 10,
    task: {
      kind: 'caesar',
      kicker: 'Досье Рима',
      title: 'Рим: протокол трибун',
      lore: 'На мраморе заметка писаря: "в столице важные фразы иногда прячут шифром Цезаря, сдвиг на 3". Эта привычка намекает: ключевую роль ищут не с краю.',
      question: 'Расшифруйте слово шифром Цезаря и введите ключ.',
      success: 'Протокол подтвержден.',
      answerLabel: 'Ключ',
      answerText: 'Ключ 2: главный сидит в ЦЕНТРЕ.',
      caesar: {
        alphabet: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
        cipherText: 'ЩИРХУ',
        targetWord: 'ЦЕНТР',
        expectedShift: 3
      }
    }
  },
  {
    id: 'venice',
    title: 'Венеция',
    text: 'Проверка обзора.',
    lat: 45.4408,
    lng: 12.3155,
    zoom: 10,
    task: {
      kind: 'quiz',
      kicker: 'Досье Венеции',
      title: 'Венеция: зал на воде',
      lore: 'В городе каналов говорят: кто контролирует вход, тот контролирует ситуацию. В дневнике рядом приписка: поздний вход во время речи считается плохим знаком.',
      question: 'Как правильно поставить кресло "Лидер" относительно входа?',
      options: ['Спиной к входу', 'Так, чтобы видеть вход', 'Боком к входу'],
      correct: 1,
      success: 'Наблюдение верное.',
      answerLabel: 'Ключ',
      answerText: 'Ключ 3: лидер должен видеть вход.'
    }
  },
  {
    id: 'milan',
    title: 'Милан',
    text: 'Деловой регламент.',
    lat: 45.4642,
    lng: 9.19,
    zoom: 9,
    task: {
      kind: 'quiz',
      kicker: 'Досье Милана',
      title: 'Милан: деловой регламент',
      lore: 'В квартале переговорщиков часы бьют строго по минутам. На табличке у входа: "когда речь началась, внезапные входы не приветствуются". Следующая подсказка ведет к максимально сдержанной манере речи.',
      question: 'Идет речь, кто-то входит позже. Какой вариант соответствует протоколу?',
      options: [
        'Это нормально, ничего не меняется',
        'Лучше разрядить ситуацию шуткой',
        'Опоздания и поздний вход не приветствуются'
      ],
      correct: 2,
      success: 'Регламент считан правильно.',
      answerLabel: 'Ключ',
      answerText: 'Ключ 4: поздний вход и опоздания нежелательны.'
    }
  },
  {
    id: 'turin',
    title: 'Турин',
    text: 'Зал овального стола.',
    lat: 45.0703,
    lng: 7.6869,
    zoom: 9,
    markerColor: '#b9822d',
    task: {
      kind: 'slider',
      kicker: 'Досье Турина',
      title: 'Турин: овальный зал',
      lore: 'В этом городе сохранился самый эффектный макет переговорного зала: полированное дерево, кольцо кресел и пустой центр для символа мира. Нужно собрать схему стола из фрагментов.',
      question: 'Соберите пятнашки 3x3 так, чтобы снова получился цельный овальный стол.',
      success: 'Макет восстановлен: зал снова читается как единая схема.',
      answerLabel: 'Ключ',
      answerText: 'Бонусная улика: овальный стол собран.',
      slider: {
        size: 3,
        freeMove: false,
        solved: [1, 2, 3, 4, 0, 5, 6, 7, 8],
        labels: {},
        image: {
          src: 'assets/slider/oval-table.svg'
        }
      }
    }
  },
  {
    id: 'florence',
    title: 'Флоренция',
    text: 'Стиль переговоров.',
    lat: 43.7696,
    lng: 11.2558,
    zoom: 9,
    task: {
      kind: 'caesar',
      kicker: 'Досье Флоренции',
      title: 'Флоренция: язык протокола',
      lore: 'Здесь фразы точные, как линии на чертеже: без шуток и без эмоциональных всплесков. В конце записки схема ролей: "Лидер - Союзник".',
      question: 'Раскройте кодовое слово через шифр Цезаря и введите ключ.',
      success: 'Стиль выбран точно.',
      answerLabel: 'Ключ',
      answerText: 'Ключ 5: юмор - нет, эмоции - нельзя.',
      caesar: {
        alphabet: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
        cipherText: 'ФХУСЖС',
        targetWord: 'СТРОГО',
        expectedShift: 3
      }
    }
  },
  {
    id: 'naples',
    title: 'Неаполь',
    text: 'Расстановка фигур.',
    lat: 40.8518,
    lng: 14.2681,
    zoom: 9,
    task: {
      kind: 'match',
      kicker: 'Досье Неаполя',
      title: 'Неаполь: портовая схема',
      lore: 'Портовая стража повторяет одно правило: лидер не остается без плеча союзников. После этой точки начинаются архивные участки, где подсказки спрятаны в шифрах и обрывках.',
      question: 'Соедините факты и правильные выводы (5 из 5).',
      success: 'Расстановка подтверждена.',
      answerLabel: 'Ключ',
      answerText: 'Ключ 6: Лидер - Союзник.',
      match: {
        facts: [
          { id: 'f1', text: 'Форма стола в главном зале' },
          { id: 'f2', text: 'Главное место на схеме' },
          { id: 'f3', text: 'Позиция кресла лидера' },
          { id: 'f4', text: 'Вход во время уже идущей речи' },
          { id: 'f5', text: 'Базовая рассадка вокруг лидера' }
        ],
        options: [
          { id: 'o1', text: 'Лидер должен видеть вход' },
          { id: 'o2', text: 'Опоздания и поздний вход нежелательны' },
          { id: 'o3', text: 'ОВАЛ' },
          { id: 'o4', text: 'Лидер - Союзник' },
          { id: 'o5', text: 'ЦЕНТР' }
        ],
        correct: {
          f1: 'o3',
          f2: 'o5',
          f3: 'o1',
          f4: 'o2',
          f5: 'o4'
        }
      }
    }
  },
  {
    id: 'bologna',
    title: 'Болонья',
    text: 'Схема комнаты архива.',
    lat: 44.4949,
    lng: 11.3426,
    zoom: 9,
    task: {
      kind: 'hotspot',
      kicker: 'Архив Болоньи',
      title: 'Болонья: комната с печатью',
      lore: 'В архиве осталась только схема переговорной комнаты. Кто-то отметил нужную зону едва заметным кругом: если попасть точно в неё, комната будет считаться проверенной.',
      question: 'Найдите на изображении правильную метку и нажмите точно в неё.',
      success: 'Печать архива найдена.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: вы нашли скрытую печать архива.',
      hotspot: {
        image: {
          src: 'assets/puzzles/bologna-room.svg',
          alt: 'Схема архивной комнаты'
        },
        target: {
          x: 74,
          y: 28,
          radius: 8,
          label: 'Печать архива'
        },
        missText: 'Пока мимо. Ищите отметку ближе к правой части комнаты.'
      }
    }
  },
  {
    id: 'verona',
    title: 'Верона',
    text: 'Сканирование архивного кадра.',
    lat: 45.4384,
    lng: 10.9916,
    zoom: 9,
    task: {
      kind: 'scanner',
      kicker: 'Архив Вероны',
      title: 'Верона: сканер следа',
      lore: 'Изображение зашумлено, но под ним спрятан короткий шифр. Передвигайте сканер по кадру, пока он не поймает участок с кодом.',
      question: 'Найдите шифр сканером и введите его без пробелов.',
      success: 'Шифр снят с кадра.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: код с кадра считан.',
      scanner: {
        image: {
          src: 'assets/puzzles/verona-scanner.svg',
          alt: 'Архивный снимок с помехами'
        },
        startX: 18,
        startY: 24,
        lensWidth: 24,
        lensHeight: 20,
        target: {
          x: 67,
          y: 19,
          width: 18,
          height: 18
        },
        revealText: 'SIGMA-314',
        targetCode: 'SIGMA-314'
      }
    }
  },
  {
    id: 'pisa',
    title: 'Пиза',
    text: 'Наклоненный след.',
    lat: 43.7228,
    lng: 10.4017,
    zoom: 9,
    task: {
      kind: 'empty',
      kicker: 'Досье Пизы',
      title: 'Пиза: карта города',
      lore: 'Полевой этап: в Пизе вы работаете уже на уровне улиц. Чем ближе масштаб, тем больше деталей: русло реки видно четко, а нужные точки можно проверить ногами.',
      question: 'Двигайтесь по карте города и отметьте 3 точки: пиццерия, кофейня, мэрия.',
      info: 'Это исследовательская точка без ключа: собираете ориентиры для очного этапа.',
      cityMap: {
        center: [43.7177, 10.4021],
        zoom: 14,
        minZoom: 13,
        maxZoom: 18,
        note: 'Масштаб города: перемещайте карту, увеличивайте и открывайте точки.',
        progressLabel: 'Отмечено точек',
        completeText: 'Маршрут Пизы собран. Можно выдавать следующую улику офлайн.',
        riverPath: [
          [43.7233, 10.3746],
          [43.7228, 10.3821],
          [43.7216, 10.3895],
          [43.7201, 10.3967],
          [43.7184, 10.4034],
          [43.7168, 10.4102],
          [43.7152, 10.4177]
        ],
        pois: [
          {
            id: 'pizzeria',
            title: 'Пиццерия',
            lat: 43.7171,
            lng: 10.3973,
            color: '#c87137',
            hint: 'Шумная точка: здесь любят быстрые решения, но в протоколе спешка часто ломает логику.'
          },
          {
            id: 'coffee',
            title: 'Кофейня',
            lat: 43.7189,
            lng: 10.4038,
            color: '#4f85bd',
            hint: 'Тихая точка: в блокноте бариста пометки идут короткими группами по 3 символа.'
          },
          {
            id: 'cityhall',
            title: 'Мэрия',
            lat: 43.7158,
            lng: 10.4015,
            color: '#9a6fb6',
            hint: 'Официальная точка: все формулировки сухие, как в ваших правилах саммита.'
          }
        ]
      }
    }
  },
  {
    id: 'palermo',
    title: 'Палермо',
    text: 'Дешифровщик символов.',
    lat: 38.1157,
    lng: 13.3615,
    zoom: 9,
    task: {
      kind: 'decoder',
      kicker: 'Палермо: дешифровщик порта',
      title: 'Палермо: код на знаках',
      lore: 'На доске порта спрятаны три активные метки. Сначала найдите их на снимке, откройте базовые значения знаков, а потом уже выставьте сдвиг на диске.',
      question: 'Найдите подсказки на снимке, затем поверните дешифровщик и введите верные числа.',
      success: 'Знаки переведены в числа.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: числовой код Палермо восстановлен.',
      decoder: {
        shiftHint: 'У кода Палермо три опоры: знак, взгляд и птица. Их число и задаёт сдвиг.',
        startOffset: 0,
        correctOffset: 3,
        scene: {
          image: {
            src: 'assets/puzzles/palermo-board.svg',
            alt: 'Доска улик Палермо'
          },
          clues: [
            {
              id: 'sun-clue',
              glyph: '𓇳',
              x: 23,
              y: 35,
              width: 14,
              height: 16,
              title: 'Метка на левом снимке',
              revealText: 'На клочке бумаги написано: 𓇳 при нулевом сдвиге = 2.'
            },
            {
              id: 'eye-clue',
              glyph: '𓂀',
              x: 50,
              y: 24,
              width: 14,
              height: 16,
              title: 'Метка на верхней карточке',
              revealText: 'В архивной рамке видно: 𓂀 при нулевом сдвиге = 5.'
            },
            {
              id: 'bird-clue',
              glyph: '𓅓',
              x: 73,
              y: 67,
              width: 14,
              height: 16,
              title: 'Метка на правом документе',
              revealText: 'На боковой записи отмечено: 𓅓 при нулевом сдвиге = 8.'
            }
          ]
        },
        symbols: [
          { id: 'sun', glyph: '𓇳', baseValue: 2 },
          { id: 'eye', glyph: '𓂀', baseValue: 5 },
          { id: 'bird', glyph: '𓅓', baseValue: 8 }
        ],
        cards: [
          { id: 'card1', glyph: '𓇳', answer: 5 },
          { id: 'card2', glyph: '𓂀', answer: 8 },
          { id: 'card3', glyph: '𓅓', answer: 1 }
        ]
      }
    }
  },
  {
    id: 'genoa_media',
    title: 'Генуя',
    text: 'Шахматная партия.',
    lat: 44.4056,
    lng: 8.9463,
    zoom: 9,
    markerColor: '#8f5bff',
    task: {
      kind: 'chess',
      kicker: 'Досье Генуи',
      title: 'Генуя: мат в один ход',
      lore: 'В позиции стало чуть больше фигур, но идея всё ещё короткая: у белых есть один чистый матующий удар. Любой другой легальный ход считается промахом.',
      question: 'Белые начинают. Найдите единственный мат в один ход.',
      success: 'Партия закрыта мгновенно.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: партия завершена точным ходом.',
      chess: {
        sideToMove: 'w',
        pieces: [
          { square: 'h8', type: 'k', color: 'b' },
          { square: 'g7', type: 'p', color: 'b' },
          { square: 'h7', type: 'p', color: 'b' },
          { square: 'f7', type: 'p', color: 'b' },
          { square: 'f8', type: 'r', color: 'b' },
          { square: 'e7', type: 'n', color: 'b' },
          { square: 'd3', type: 'b', color: 'w' },
          { square: 'h5', type: 'q', color: 'w' },
          { square: 'e1', type: 'r', color: 'w' },
          { square: 'c3', type: 'n', color: 'w' },
          { square: 'g1', type: 'k', color: 'w' }
        ]
      }
    }
  },
  {
    id: 'trieste',
    title: 'Триест',
    text: 'Кольца сигила.',
    lat: 45.6495,
    lng: 13.7768,
    zoom: 9,
    markerColor: '#cc5c78',
    task: {
      kind: 'rotor',
      kicker: 'Архив Триеста',
      title: 'Триест: вращающиеся кольца',
      lore: 'На этой схеме знак разбит на три кольца. Поверните каждое отдельно так, чтобы из фрагментов снова собрался цельный символ.',
      question: 'Крутите кольца, пока рисунок не станет цельным.',
      success: 'Сигил собран.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: знак Триеста восстановлен.',
      rotor: {
        note: 'Все три кольца вращаются отдельно. Нужна одна правильная комбинация.',
        solveByArcSizes: [3, 2, 1],
        rings: [
          {
            id: 'outer',
            label: 'Внешний обод',
            segments: 12,
            step: 30,
            start: 1,
            target: 3,
            size: 100,
            thickness: 28,
            colors: ['transparent', '#d73d2a', '#d73d2a', '#d73d2a', 'transparent', '#d73d2a', '#d73d2a', 'transparent', 'transparent', 'transparent', '#d73d2a', 'transparent']
          },
          {
            id: 'middle',
            label: 'Средний пояс',
            segments: 12,
            step: 30,
            start: 9,
            target: 4,
            size: 74,
            thickness: 24,
            colors: ['#d7c8c6', '#d7c8c6', '#d7c8c6', 'transparent', '#d7c8c6', '#d7c8c6', 'transparent', 'transparent', 'transparent', '#d7c8c6', 'transparent', 'transparent']
          },
          {
            id: 'inner',
            label: 'Внутренний круг',
            segments: 12,
            step: 30,
            start: 6,
            target: 2,
            size: 56,
            thickness: 22,
            colors: ['transparent', 'transparent', '#c94531', '#c94531', '#c94531', 'transparent', '#c94531', '#c94531', 'transparent', 'transparent', 'transparent', '#c94531']
          }
        ]
      }
    }
  },
  {
    id: 'siena',
    title: 'Сиена',
    text: 'Скрытая отметка в зале.',
    lat: 43.3188,
    lng: 11.3308,
    zoom: 9,
    markerColor: '#c06447',
    task: {
      kind: 'hotspot',
      kicker: 'Архив Сиены',
      title: 'Сиена: найти печать',
      lore: 'В схеме старого зала осталась только одна точная отметка, которая подтверждает подлинность плана. Найдите её на изображении.',
      question: 'Нажмите на скрытую печать на схеме комнаты.',
      success: 'Печать Сиены найдена.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: печать зала Сиены обнаружена.',
      hotspot: {
        image: {
          src: 'assets/puzzles/bologna-room.svg',
          alt: 'Схема комнаты Сиены'
        },
        target: {
          x: 24,
          y: 30,
          radius: 7
        },
        missText: 'Не та зона. Посмотрите ближе к левой стене и высоким шкафам.'
      }
    }
  },
  {
    id: 'ravenna',
    title: 'Равенна',
    text: 'Сканер архивного кадра.',
    lat: 44.4184,
    lng: 12.2035,
    zoom: 9,
    markerColor: '#b9567f',
    task: {
      kind: 'scanner',
      kicker: 'Архив Равенны',
      title: 'Равенна: поймать код',
      lore: 'Кадр почти уничтожен шумом, но внутри всё ещё спрятан служебный шифр. Подведите сканер к правильному фрагменту и считайте код.',
      question: 'Найдите код сканером и введите его.',
      success: 'Код Равенны считан.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: код с архива Равенны найден.',
      scanner: {
        image: {
          src: 'assets/puzzles/verona-scanner.svg',
          alt: 'Архивный снимок Равенны'
        },
        startX: 10,
        startY: 52,
        lensWidth: 22,
        lensHeight: 18,
        target: {
          x: 74,
          y: 30,
          width: 17,
          height: 18
        },
        revealText: 'DELTA-508',
        targetCode: 'DELTA-508'
      }
    }
  },
  {
    id: 'matera',
    title: 'Матера',
    text: 'Каменный сигил.',
    lat: 40.6663,
    lng: 16.6043,
    zoom: 9,
    markerColor: '#8d6ab8',
    task: {
      kind: 'rotor',
      kicker: 'Архив Матеры',
      title: 'Матера: кольца знака',
      lore: 'Знак на каменной плите разбит на три вращающихся кольца. Совместите все сегменты, чтобы рисунок снова стал цельным.',
      question: 'Поверните кольца и соберите знак.',
      success: 'Каменный знак Матеры собран.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: знак Матеры восстановлен.',
      rotor: {
        note: 'У каждого из трёх колец своё положение. Нужна точная комбинация.',
        solveByArcSizes: [3, 2, 1],
        rings: [
          {
            id: 'outer',
            label: 'Внешний обод',
            segments: 12,
            step: 30,
            start: 5,
            target: 0,
            size: 100,
            thickness: 28,
            colors: ['#b9402a', '#b9402a', '#b9402a', 'transparent', 'transparent', '#b9402a', '#b9402a', 'transparent', 'transparent', '#b9402a', 'transparent', 'transparent']
          },
          {
            id: 'middle',
            label: 'Средний пояс',
            segments: 12,
            step: 30,
            start: 9,
            target: 0,
            size: 74,
            thickness: 24,
            colors: ['transparent', 'transparent', '#d0c4b8', '#d0c4b8', '#d0c4b8', 'transparent', 'transparent', '#d0c4b8', '#d0c4b8', 'transparent', 'transparent', '#d0c4b8']
          },
          {
            id: 'inner',
            label: 'Внутренний круг',
            segments: 12,
            step: 30,
            start: 6,
            target: 0,
            size: 52,
            thickness: 18,
            colors: ['transparent', '#b9402a', '#b9402a', '#b9402a', 'transparent', 'transparent', '#b9402a', '#b9402a', 'transparent', 'transparent', '#b9402a', 'transparent']
          }
        ]
      }
    }
  },
  {
    id: 'bari',
    title: 'Бари',
    text: 'Шифровальный диск.',
    lat: 41.1171,
    lng: 16.8719,
    zoom: 9,
    markerColor: '#c34c34',
    task: {
      kind: 'decoder',
      kicker: 'Архив Бари',
      title: 'Бари: числовой диск',
      lore: 'На столе переговорщиков лежат три заметки с активными метками. Сначала найдите их на снимке и восстановите базовые значения, потом проверните диск и впишите новые числа.',
      question: 'Активируйте все метки на столе, затем поверните диск и введите числа.',
      success: 'Код Бари собран.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: код Бари переведен в числа.',
      decoder: {
        shiftHint: 'Сдвиг равен числу дней, после которых календарь снова начинает неделю.',
        startOffset: 6,
        correctOffset: 7,
        scene: {
          image: {
            src: 'assets/puzzles/bari-board.svg',
            alt: 'Стол переговорщиков в Бари'
          },
          clues: [
            {
              id: 'wave-clue',
              glyph: '≈',
              x: 26,
              y: 61,
              width: 14,
              height: 16,
              title: 'Метка на левой заметке',
              revealText: 'На помятой карточке видно: ≈ при нулевом сдвиге = 4.'
            },
            {
              id: 'triad-clue',
              glyph: '⋮',
              x: 49,
              y: 29,
              width: 14,
              height: 16,
              title: 'Метка на центральной карточке',
              revealText: 'Служебная запись говорит: ⋮ при нулевом сдвиге = 7.'
            },
            {
              id: 'star-clue',
              glyph: '✶',
              x: 74,
              y: 53,
              width: 14,
              height: 16,
              title: 'Метка на правой заметке',
              revealText: 'На красной метке отмечено: ✶ при нулевом сдвиге = 9.'
            }
          ]
        },
        symbols: [
          { id: 'wave', glyph: '≈', baseValue: 4 },
          { id: 'triad', glyph: '⋮', baseValue: 7 },
          { id: 'star', glyph: '✶', baseValue: 9 }
        ],
        cards: [
          { id: 'card1', glyph: '≈', answer: 1 },
          { id: 'card2', glyph: '⋮', answer: 4 },
          { id: 'card3', glyph: '✶', answer: 6 }
        ]
      }
    }
  },
  {
    id: 'cagliari',
    title: 'Кальяри',
    text: 'Шахматная концовка.',
    lat: 39.2238,
    lng: 9.1217,
    zoom: 9,
    markerColor: '#5f7fd6',
    task: {
      kind: 'chess',
      kicker: 'Досье Кальяри',
      title: 'Кальяри: мат в один',
      lore: 'Эта концовка тоже решается сразу, но уже не так пусто на доске. Если вы уверенно видите линии фигур, матующий ход считывается быстро.',
      question: 'Белые начинают. Найдите единственный мат в 1 ход.',
      success: 'Концовка Кальяри закрыта.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: партия в Кальяри завершена одним точным ходом.',
      chess: {
        sideToMove: 'w',
        pieces: [
          { square: 'g8', type: 'k', color: 'b' },
          { square: 'f7', type: 'p', color: 'b' },
          { square: 'g7', type: 'p', color: 'b' },
          { square: 'h7', type: 'p', color: 'b' },
          { square: 'e1', type: 'r', color: 'w' },
          { square: 'h5', type: 'q', color: 'w' },
          { square: 'c4', type: 'b', color: 'w' },
          { square: 'c3', type: 'n', color: 'w' },
          { square: 'g1', type: 'k', color: 'w' }
        ]
      }
    }
  }
];

const DEFAULT_SCENARIO_UI = {
  appTitle: 'Карта делегации',
  appSubtitle: 'Сценарий можно менять по государствам. Сейчас подготовлена база под Верону, карты подключим отдельно.',
  scenarioLabel: 'Сценарий: Италия',
  tabs: {
    answer: 'Команда',
    map: 'Карта',
    prototype: 'Черновик'
  },
  headings: {
    map: 'Карта',
    answer: 'Карта команды',
    prototype: 'Черновик карты'
  },
  mapAriaLabel: 'Карта',
  fallbackMapNote: 'Резервная схема: если фон карты не загрузился, нажимайте на точки здесь.',
  fallbackMapAlt: 'Резервная схема маршрута',
  teamMapNote: 'Основная карта команды отображается прямо в этом разделе.',
  prototypeNote: 'Эта вкладка грузится только при открытии, чтобы не тянуть лишний iframe на старте.',
  taskPlaceholder: {
    kicker: 'Досье саммита',
    title: 'Выберите локацию',
    lore: 'Вы команда юных переговорщиков: нужно собрать правила саммита по фрагментам из разных городов.',
    question: 'Нажмите на точку на карте, чтобы открыть локацию.'
  }
};

let defaultTaskState = {
  kicker: 'Досье саммита',
  title: 'Выберите локацию',
  lore: 'Вы команда юных переговорщиков: нужно собрать правила саммита по фрагментам из разных городов.',
  question: 'Нажмите на точку на карте, чтобы открыть локацию.'
};

const DEFAULT_SCENARIO_REGISTRY = {
  defaultScenarioId: 'campaign',
  scenarios: [
    {
      id: 'campaign',
      title: 'Общий сценарий',
      playable: true,
      src: './scenarios/campaign/scenario.json'
    },
    {
      id: 'italy',
      title: 'Италия',
      playable: true,
      src: './scenarios/italy/scenario.json'
    },
    {
      id: 'emirates-dune',
      title: 'Эмираты Дюны',
      playable: true,
      src: './scenarios/emirates-dune/scenario.json'
    },
    {
      id: 'verona',
      title: 'Государство Верона',
      playable: false,
      src: './scenarios/verona/scenario.json'
    },
    {
      id: 'eleon',
      title: 'Франц / Элеон',
      playable: true,
      src: './scenarios/eleon/scenario.json'
    },
    {
      id: 'argos',
      title: 'РФ / Аргос',
      playable: false,
      src: './scenarios/argos/scenario.json'
    },
    {
      id: 'pandoria',
      title: 'Анг / Пандория',
      playable: true,
      src: './scenarios/pandoria/scenario.json'
    }
  ]
};

const STORAGE_KEYS = {
  teamName: 'miniapp.teamName',
  sessionId: 'miniapp.sessionId',
  deviceId: 'miniapp.deviceId',
  theme: 'miniapp.theme'
};

const TEAM_NAME_ALIASES = {
  'Новое поколение': 'ОУИ'
};

const API_BASE = (() => {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get('api');
    if (!fromQuery) {
      return '';
    }
    return String(fromQuery).replace(/\/+$/, '');
  } catch (_) {
    return '';
  }
})();

const state = {
  activeView: 'map',
  selectedPointId: null,
  cityMode: false,
  teamReady: false,
  teamName: '',
  sessionId: '',
  deviceId: '',
  teamMoveCount: 0,
  finalAnswerText: '',
  finalAnswerAt: '',
  finalAnswerMoveCount: 0,
  finalAnswerDraft: '',
  teamList: [],
  shownTriggerIds: new Set(),
  teamPollTimer: null
};

const cardMap = document.querySelector('.card-map');
const rootNode = document.documentElement;
const appTitleNode = document.getElementById('appTitle');
const appSubtitleNode = document.getElementById('appSubtitle');
const scenarioStripNode = document.getElementById('scenarioStrip');
const viewMapNode = document.getElementById('view-map');
const viewAnswerNode = document.getElementById('view-answer');
const viewPrototypeNode = document.getElementById('view-prototype');
const tabMapBtn = document.getElementById('tabMapBtn');
const tabAnswerBtn = document.getElementById('tabAnswerBtn');
const tabPrototypeBtn = document.getElementById('tabPrototypeBtn');
const mapHeadingNode = document.getElementById('mapHeading');
const answerHeadingNode = document.getElementById('answerHeading');
const prototypeHeadingNode = document.getElementById('prototypeHeading');
const completionNode = document.getElementById('completionBadge');
const worldMapNode = document.getElementById('worldMap');
const mapSceneNode = document.querySelector('.map-scene');
const resetMapBtn = document.getElementById('resetMapBtn');
const changeTeamBtn = document.getElementById('changeTeamBtn');
const mapAttribNode = document.querySelector('.map-attrib');
const fallbackMapNode = document.getElementById('fallbackMap');
const fallbackMapNoteNode = document.getElementById('fallbackMapNote');
const fallbackMapImageNode = document.getElementById('fallbackMapImage');
const fallbackMapPointsNode = document.getElementById('fallbackMapPoints');
const teamStripNode = document.getElementById('teamStrip');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const teamGateNode = document.getElementById('teamGate');
const teamSelectNode = document.getElementById('teamSelect');
const teamConfirmBtn = document.getElementById('teamConfirmBtn');
const teamGateStatusNode = document.getElementById('teamGateStatus');

const taskKickerNode = document.getElementById('taskKicker');
const taskTitleNode = document.getElementById('taskTitle');
const taskLoreNode = document.getElementById('taskLore');
const taskQuestionNode = document.getElementById('taskQuestion');
const taskTextSkipBtn = document.getElementById('taskTextSkipBtn');
const taskOptionsNode = document.getElementById('taskOptions');
const taskResultNode = document.getElementById('taskResult');
const taskAnswerNode = document.getElementById('taskAnswer');
const taskAnswerLabelNode = document.getElementById('taskAnswerLabel');
const taskAnswerTextNode = document.getElementById('taskAnswerText');
const closeTaskBtn = document.getElementById('closeTaskBtn');
const finalAnswerPanelNode = document.getElementById('finalAnswerPanel');
const finalAnswerInputNode = document.getElementById('finalAnswerInput');
const submitFinalAnswerBtn = document.getElementById('submitFinalAnswerBtn');
const finalAnswerStatusNode = document.getElementById('finalAnswerStatus');
const finalAnswerLastNode = document.getElementById('finalAnswerLast');
const finalAnswerLastTextNode = document.getElementById('finalAnswerLastText');
const caseMapStatusNode = document.getElementById('caseMapStatus');
const caseMapViewportNode = document.getElementById('caseMapViewport');
const caseMapResetViewBtn = document.getElementById('caseMapResetViewBtn');
const caseMapChangeTeamBtn = document.getElementById('caseMapChangeTeamBtn');
const teamMapNoteNode = document.getElementById('teamMapNote');
const prototypeNoteNode = document.getElementById('prototypeNote');
const prototypeFrameNode = document.querySelector('.prototype-map-embed');
const themeColorMetaNode = document.querySelector('meta[name="theme-color"]');

const mapState = {
  map: null,
  tileController: null,
  markers: new Map(),
  visited: new Set(),
  solved: new Set(),
  sliderBoards: new Map(),
  caesarInputs: new Map(),
  matchLinks: new Map(),
  matchActiveFacts: new Map(),
  scannerStates: new Map(),
  anagramInputs: new Map(),
  decoderOffsets: new Map(),
  decoderInputs: new Map(),
  decoderClues: new Map(),
  rotorAngles: new Map(),
  chessStates: new Map(),
  taskOutcomes: new Map(),
  cityVisits: new Map(),
  cityHints: new Map(),
  cityOverlayLayer: null,
  cityOverlayPointId: null,
  cityPoiMarkers: new Map(),
  bounds: null,
  fallbackVisible: false,
  imageWidth: 0,
  imageHeight: 0,
  imageBaseZoom: 0,
  imageCityPointId: null,
  pendingFocusPointId: null,
  imageContrastSampler: null,
  imageContrastSource: '',
  imageGuardToken: ''
};

const caseMapState = {
  initialized: false,
  map: null,
  markers: new Map(),
  layer: null,
  image: null,
  width: 0,
  height: 0,
  baseZoom: 0,
  minZoom: -4.5,
  maxZoom: 0
};

const caseMapSourceState = {
  resolved: false,
  url: '',
  width: 0,
  height: 0
};

const INLINE_CITY_IMAGE_MAPS = {
  al_kasir: {
    title: 'Карта Аль-Касира',
    src: './assets/maps/Al-kasir.jpg',
    alt: 'Карта города Аль-Касир',
    note: 'Это локальная карта города. Дальше загадки по Аль-Касиру будем открывать уже из неё.'
  },
  zarak_mir: {
    title: 'Карта Зарак-Мира',
    src: './assets/maps/zarak.jpg',
    alt: 'Карта города Зарак-Мир',
    note: 'Это локальная карта Зарака. Позже можно будет открыть его внутренние точки уже с неё.'
  }
};

const THEME_MODES = {
  light: 'light',
  dark: 'dark'
};

const THEME_META_COLORS = {
  light: '#f3f6fa',
  dark: '#252b40'
};

const DEFAULT_FALLBACK_POINT_POSITIONS = {
  turin: { x: 39, y: 21 },
  genoa_media: { x: 42, y: 29 },
  milan: { x: 48, y: 22 },
  trieste: { x: 82, y: 18 },
  venice: { x: 71, y: 22 },
  verona: { x: 62, y: 24 },
  bologna: { x: 57, y: 31 },
  ravenna: { x: 65, y: 33 },
  vatican: { x: 57, y: 47 },
  rome: { x: 60, y: 50 },
  pisa: { x: 49, y: 43 },
  florence: { x: 54, y: 41 },
  siena: { x: 56, y: 47 },
  naples: { x: 66, y: 66 },
  matera: { x: 76, y: 65 },
  bari: { x: 82, y: 58 },
  palermo: { x: 63, y: 88 },
  cagliari: { x: 42, y: 84 }
};

let points = DEFAULT_POINTS;
let fallbackPointPositions = { ...DEFAULT_FALLBACK_POINT_POSITIONS };
let pointsById = new Map();
let totalQuestCount = 0;
const activeTextAnimations = new Map();
let textAnimationFrameId = 0;
const taskTextRenderCache = {
  loreKey: '',
  questionKey: ''
};
let prototypeFrameLoaded = false;

function enableSingleMapMode() {
  tabMapBtn && (tabMapBtn.textContent = 'Карта');

  if (tabAnswerBtn) {
    tabAnswerBtn.hidden = true;
  }
  if (tabPrototypeBtn) {
    tabPrototypeBtn.hidden = true;
  }
  if (viewAnswerNode) {
    viewAnswerNode.hidden = true;
  }
  if (viewPrototypeNode) {
    viewPrototypeNode.hidden = true;
  }
}

function rebuildPointIndexes() {
  pointsById = new Map(points.map((point) => [point.id, point]));
  totalQuestCount = points.filter((point) => point.task.kind !== 'empty').length;
}

function setActivePoints(nextPoints = DEFAULT_POINTS, nextFallbackPositions = DEFAULT_FALLBACK_POINT_POSITIONS) {
  points = Array.isArray(nextPoints) && nextPoints.length ? nextPoints : DEFAULT_POINTS;
  fallbackPointPositions = { ...(nextFallbackPositions && Object.keys(nextFallbackPositions).length ? nextFallbackPositions : DEFAULT_FALLBACK_POINT_POSITIONS) };
  rebuildPointIndexes();
}

rebuildPointIndexes();

const scenarioState = {
  registry: DEFAULT_SCENARIO_REGISTRY,
  activeId: DEFAULT_SCENARIO_REGISTRY.defaultScenarioId,
  activeTitle: 'Общий сценарий',
  activeConfig: null,
  routeMapMode: 'leaflet',
  routeMapImageSrc: './assets/maps/italy-schematic.svg'
};

function triggerHaptic(type = 'light') {
  if (!canUseTelegramHaptics()) {
    return;
  }

  if (type === 'success') {
    tg.HapticFeedback.notificationOccurred('success');
    return;
  }

  if (type === 'error') {
    tg.HapticFeedback.notificationOccurred('error');
    return;
  }

  tg.HapticFeedback.impactOccurred(type);
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key) || '';
  } catch (_) {
    return '';
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (_) {
    // No-op.
  }
}

function normalizeThemeName(raw = '') {
  return raw === THEME_MODES.dark ? THEME_MODES.dark : THEME_MODES.light;
}

function getStoredTheme() {
  return normalizeThemeName(safeStorageGet(STORAGE_KEYS.theme));
}

function getActiveTheme() {
  return normalizeThemeName(rootNode?.dataset.theme || document.body?.getAttribute('data-theme') || getStoredTheme());
}

function prefersReducedMotion() {
  try {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
  } catch (_) {
    return false;
  }
}

function updateTaskTextSkipButton() {
  if (!taskTextSkipBtn) {
    return;
  }

  taskTextSkipBtn.hidden = activeTextAnimations.size === 0;
}

function clearTextAnimationFrame() {
  if (!textAnimationFrameId) {
    return;
  }

  window.cancelAnimationFrame(textAnimationFrameId);
  textAnimationFrameId = 0;
}

function clearTextAnimation(node, revealFullText = false) {
  if (!node) {
    return;
  }

  const animation = activeTextAnimations.get(node);
  if (!animation) {
    return;
  }

  if (revealFullText) {
    node.textContent = animation.fullText;
  }

  activeTextAnimations.delete(node);

  if (activeTextAnimations.size === 0) {
    clearTextAnimationFrame();
  }

  updateTaskTextSkipButton();
}

function flushAnimatedTaskText() {
  if (!activeTextAnimations.size) {
    return;
  }

  [...activeTextAnimations.keys()].forEach((node) => {
    clearTextAnimation(node, true);
  });
}

function stepTextAnimations(timestamp = performance.now()) {
  let hasRunningAnimations = false;

  activeTextAnimations.forEach((animation, node) => {
    if (!node?.isConnected) {
      activeTextAnimations.delete(node);
      return;
    }

    const elapsed = Math.max(0, timestamp - animation.startedAt);
    const nextChunk = Math.max(animation.currentLength, Math.floor(elapsed / animation.msPerChar));

    if (nextChunk >= animation.fullText.length) {
      node.textContent = animation.fullText;
      activeTextAnimations.delete(node);
      return;
    }

    animation.currentLength = nextChunk;
    node.textContent = animation.fullText.slice(0, animation.currentLength);
    hasRunningAnimations = true;
  });

  updateTaskTextSkipButton();

  if (!hasRunningAnimations || activeTextAnimations.size === 0) {
    clearTextAnimationFrame();
    return;
  }

  textAnimationFrameId = window.requestAnimationFrame(stepTextAnimations);
}

function animateTextNode(node, text = '', options = {}) {
  if (!node) {
    return;
  }

  const {
    hideWhenEmpty = false,
    msPerChar = 18,
    instant = false
  } = options;

  clearTextAnimation(node, false);

  const preparedText = String(text || '');

  if (hideWhenEmpty) {
    node.hidden = !preparedText;
  }

  if (!preparedText) {
    node.textContent = '';
    updateTaskTextSkipButton();
    return;
  }

  const shouldAnimate = !instant && !prefersReducedMotion() && preparedText.length > 8;

  if (!shouldAnimate) {
    node.textContent = preparedText;
    updateTaskTextSkipButton();
    return;
  }

  node.textContent = '';
  activeTextAnimations.set(node, {
    fullText: preparedText,
    currentLength: 0,
    startedAt: performance.now(),
    msPerChar
  });

  updateTaskTextSkipButton();

  if (!textAnimationFrameId) {
    textAnimationFrameId = window.requestAnimationFrame(stepTextAnimations);
  }
}

function setTaskQuestion(text = '', options = {}) {
  const {
    pointId = '',
    skipIfSame = false,
    ...animationOptions
  } = options || {};
  const preparedText = String(text || '');
  const cacheKey = `${String(pointId || '').trim()}::${preparedText}`;

  if (skipIfSame && taskTextRenderCache.questionKey === cacheKey) {
    return;
  }

  taskTextRenderCache.questionKey = cacheKey;
  animateTextNode(taskQuestionNode, preparedText, { hideWhenEmpty: true, msPerChar: 16, ...animationOptions });
}

function syncThemeButton(themeName = THEME_MODES.light) {
  if (!themeToggleBtn) {
    return;
  }

  const isDark = themeName === THEME_MODES.dark;
  themeToggleBtn.textContent = `Тема: ${isDark ? 'Тёмная' : 'Светлая'}`;
  themeToggleBtn.setAttribute('aria-pressed', String(isDark));
  themeToggleBtn.setAttribute('aria-label', isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
}

function syncThemeMeta(themeName = THEME_MODES.light) {
  if (themeColorMetaNode) {
    themeColorMetaNode.setAttribute('content', THEME_META_COLORS[themeName] || THEME_META_COLORS.light);
  }

  if (!canUseTelegramThemeColors()) {
    return;
  }

  try {
    tg.setHeaderColor(THEME_META_COLORS[themeName] || THEME_META_COLORS.light);
    tg.setBackgroundColor(themeName === THEME_MODES.dark ? '#12151b' : '#f5f7fa');
  } catch (_) {
    // Ignore unsupported clients.
  }
}

function broadcastTheme(themeName = THEME_MODES.light) {
  document.querySelectorAll('.prototype-map-embed').forEach((frame) => {
    try {
      frame.contentWindow?.postMessage({ type: 'miniapp-theme', theme: themeName }, window.location.origin);
    } catch (_) {
      // Ignore cross-window sync issues.
    }
  });
}

function applyTheme(themeName = THEME_MODES.light, persist = true) {
  const normalizedTheme = normalizeThemeName(themeName);
  rootNode.dataset.theme = normalizedTheme;
  document.body?.setAttribute('data-theme', normalizedTheme);

  if (persist) {
    safeStorageSet(STORAGE_KEYS.theme, normalizedTheme);
  }

  syncThemeButton(normalizedTheme);
  syncThemeMeta(normalizedTheme);
  mapState.tileController?.refresh?.(normalizedTheme);
  broadcastTheme(normalizedTheme);
}

function toggleTheme() {
  const currentTheme = normalizeThemeName(rootNode.dataset.theme || getStoredTheme());
  applyTheme(currentTheme === THEME_MODES.dark ? THEME_MODES.light : THEME_MODES.dark);
}

function normalizeClientTeamName(raw = '') {
  const prepared = String(raw || '').trim();
  return TEAM_NAME_ALIASES[prepared] || prepared;
}

function getOrCreateDeviceId() {
  const stored = safeStorageGet(STORAGE_KEYS.deviceId);
  if (stored) {
    return stored;
  }

  let nextId = '';
  if (window.crypto?.randomUUID) {
    nextId = window.crypto.randomUUID();
  } else {
    nextId = `device-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  safeStorageSet(STORAGE_KEYS.deviceId, nextId);
  return nextId;
}

async function apiRequest(url, options = {}) {
  const targetUrl = API_BASE ? `${API_BASE}${url}` : url;
  const response = await fetch(targetUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    const reason = payload?.error || response.statusText || 'request_failed';
    throw new Error(reason);
  }

  return payload;
}

function setTeamStripText() {
  if (!teamStripNode) {
    return;
  }

  if (!state.teamReady) {
    teamStripNode.textContent = 'Команда: не выбрана';
    return;
  }

  teamStripNode.textContent = `Команда: ${state.teamName}`;
}

function setTeamGateStatus(text = '') {
  if (!teamGateStatusNode) {
    return;
  }

  teamGateStatusNode.textContent = text;
}

function getRequestedScenarioId() {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get('scenario');
    return String(fromQuery || '').trim().toLowerCase();
  } catch (_) {
    return '';
  }
}

function mergeScenarioUi(rawUi = {}) {
  return {
    ...DEFAULT_SCENARIO_UI,
    ...rawUi,
    tabs: {
      ...DEFAULT_SCENARIO_UI.tabs,
      ...(rawUi.tabs || {})
    },
    headings: {
      ...DEFAULT_SCENARIO_UI.headings,
      ...(rawUi.headings || {})
    },
    taskPlaceholder: {
      ...DEFAULT_SCENARIO_UI.taskPlaceholder,
      ...(rawUi.taskPlaceholder || {})
    }
  };
}

function applyScenarioUi(uiConfig = DEFAULT_SCENARIO_UI, scenarioEntry = null, scenarioData = null) {
  const scenarioTitle = String(scenarioData?.title || scenarioEntry?.title || scenarioState.activeTitle || 'Сценарий').trim();
  const scenarioLabel = String(uiConfig.scenarioLabel || `Сценарий: ${scenarioTitle}`).trim();

  appTitleNode && (appTitleNode.textContent = uiConfig.appTitle || DEFAULT_SCENARIO_UI.appTitle);
  appSubtitleNode && (appSubtitleNode.textContent = uiConfig.appSubtitle || DEFAULT_SCENARIO_UI.appSubtitle);
  scenarioStripNode && (scenarioStripNode.textContent = scenarioLabel);
  tabAnswerBtn && (tabAnswerBtn.textContent = uiConfig.tabs.answer || DEFAULT_SCENARIO_UI.tabs.answer);
  tabMapBtn && (tabMapBtn.textContent = uiConfig.tabs.map || DEFAULT_SCENARIO_UI.tabs.map);
  tabPrototypeBtn && (tabPrototypeBtn.textContent = uiConfig.tabs.prototype || DEFAULT_SCENARIO_UI.tabs.prototype);
  mapHeadingNode && (mapHeadingNode.textContent = uiConfig.headings.map || DEFAULT_SCENARIO_UI.headings.map);
  answerHeadingNode && (answerHeadingNode.textContent = uiConfig.headings.answer || DEFAULT_SCENARIO_UI.headings.answer);
  prototypeHeadingNode && (prototypeHeadingNode.textContent = uiConfig.headings.prototype || DEFAULT_SCENARIO_UI.headings.prototype);
  document.title = uiConfig.documentTitle || `${scenarioTitle} · MiniApp Quest`;

  if (viewMapNode?.querySelector('#worldMap')) {
    viewMapNode.querySelector('#worldMap').setAttribute('aria-label', uiConfig.mapAriaLabel || DEFAULT_SCENARIO_UI.mapAriaLabel);
  }

  if (fallbackMapImageNode) {
    fallbackMapImageNode.alt = uiConfig.fallbackMapAlt || DEFAULT_SCENARIO_UI.fallbackMapAlt;
  }

  teamMapNoteNode && (teamMapNoteNode.textContent = uiConfig.teamMapNote || DEFAULT_SCENARIO_UI.teamMapNote);
  prototypeNoteNode && (prototypeNoteNode.textContent = uiConfig.prototypeNote || DEFAULT_SCENARIO_UI.prototypeNote);

  defaultTaskState = {
    ...DEFAULT_SCENARIO_UI.taskPlaceholder,
    ...(uiConfig.taskPlaceholder || {})
  };

  setFallbackMapNote(uiConfig.fallbackMapNote || DEFAULT_SCENARIO_UI.fallbackMapNote);
}

function setFallbackMapImage(src = './assets/maps/italy-schematic.svg') {
  if (!fallbackMapImageNode) {
    return;
  }

  fallbackMapImageNode.src = src || './assets/maps/italy-schematic.svg';
}

function destroyWorldMap() {
  if (mapState.map) {
    try {
      mapState.map.off();
      mapState.map.remove();
    } catch (_) {
      // Ignore map teardown errors.
    }
  }

  mapState.map = null;
  mapState.tileController = null;
  mapState.markers.clear();
  mapState.bounds = null;
  mapState.imageWidth = 0;
  mapState.imageHeight = 0;
  mapState.imageBaseZoom = 0;
  mapState.imageCityPointId = null;
  mapState.imageContrastSampler = null;
  mapState.imageContrastSource = '';
  mapState.imageGuardToken = '';
}

function getImageMapLatLngFromPosition(position) {
  if (!position || !mapState.imageWidth || !mapState.imageHeight) {
    return null;
  }

  return [
    mapState.imageHeight * (position.y / 100),
    mapState.imageWidth * (position.x / 100)
  ];
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

function createImageContrastSampler(image) {
  if (!image?.naturalWidth || !image?.naturalHeight || !document?.createElement) {
    return null;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = Number(image.naturalWidth) || 1;
    canvas.height = Number(image.naturalHeight) || 1;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      return null;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return {
      width: canvas.width,
      height: canvas.height,
      sampleAt(position) {
        if (!position) {
          return {
            luminance: 0.5,
            foregroundTone: 'light'
          };
        }

        const centerX = clampNumber((Number(position.x) || 50) / 100, 0, 1);
        const centerY = clampNumber((Number(position.y) || 50) / 100, 0, 1);
        const px = Math.round(centerX * Math.max(canvas.width - 1, 1));
        const py = Math.round(centerY * Math.max(canvas.height - 1, 1));
        const radius = Math.max(6, Math.round(Math.min(canvas.width, canvas.height) * 0.012));
        const left = clampNumber(px - radius, 0, canvas.width - 1);
        const top = clampNumber(py - radius, 0, canvas.height - 1);
        const right = clampNumber(px + radius, 0, canvas.width - 1);
        const bottom = clampNumber(py + radius, 0, canvas.height - 1);
        const width = Math.max(1, right - left + 1);
        const height = Math.max(1, bottom - top + 1);
        const data = context.getImageData(left, top, width, height).data;

        let total = 0;
        let weight = 0;

        for (let index = 0; index < data.length; index += 4) {
          const alpha = (Number(data[index + 3]) || 0) / 255;
          if (alpha <= 0.08) {
            continue;
          }

          const red = (Number(data[index]) || 0) / 255;
          const green = (Number(data[index + 1]) || 0) / 255;
          const blue = (Number(data[index + 2]) || 0) / 255;
          const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
          total += luminance * alpha;
          weight += alpha;
        }

        const luminance = weight > 0 ? total / weight : 0.5;

        return {
          luminance,
          foregroundTone: luminance < 0.56 ? 'light' : 'dark'
        };
      }
    };
  } catch (_) {
    return null;
  }
}

function getForegroundToneForPosition(position, sampler = mapState.imageContrastSampler) {
  if (!sampler || typeof sampler.sampleAt !== 'function') {
    return 'light';
  }

  try {
    return sampler.sampleAt(position)?.foregroundTone === 'dark' ? 'dark' : 'light';
  } catch (_) {
    return 'light';
  }
}

function getMarkerPresentation(point, options = {}) {
  const isActive = options.isActive ?? (state.selectedPointId === point?.id);
  const isVisited = options.isVisited ?? mapState.visited.has(point?.id);
  const isSolved = options.isSolved ?? mapState.solved.has(point?.id);
  const isLocked = options.isLocked ?? isPointLocked(point);
  const foregroundTone = String(options.foregroundTone || 'light').trim().toLowerCase() === 'dark'
    ? 'dark'
    : 'light';

  const strokeColor = '#87a0bd';
  let fillColor = '#ffffff';
  if (isSolved) {
    fillColor = '#e5f9ef';
  } else if (isVisited) {
    fillColor = '#ecf4ff';
  }

  const markerClassTokens = ['route-map-marker'];
  if (isActive) {
    markerClassTokens.push('route-map-marker--active');
  }
  if (isVisited) {
    markerClassTokens.push('route-map-marker--visited');
  }
  if (isSolved) {
    markerClassTokens.push('route-map-marker--solved');
  }
  if (isLocked) {
    markerClassTokens.push('route-map-marker--locked');
  }

  return {
    fillColor,
    strokeColor,
    labelBg: foregroundTone === 'dark' ? 'rgba(255, 255, 255, 0.96)' : 'rgba(9, 16, 27, 0.9)',
    labelText: foregroundTone === 'dark' ? '#16202d' : '#f6fbff',
    labelBorder: foregroundTone === 'dark' ? 'rgba(22, 32, 45, 0.16)' : 'rgba(214, 226, 241, 0.32)',
    glowColor: 'rgba(172, 193, 219, 0.45)',
    tooltipTone: foregroundTone,
    radius: isActive ? 9.8 : 8.8,
    weight: 2.2,
    markerClassName: markerClassTokens.join(' ')
  };
}

function getPointImageMapLatLng(pointId) {
  return getImageMapLatLngFromPosition(fallbackPointPositions[pointId]);
}

function parseMapCoordinate(rawValue, fallback = Number.NaN, { clamp = false, min = 0, max = 100 } = {}) {
  const normalized = typeof rawValue === 'string'
    ? rawValue.replace(',', '.').trim()
    : rawValue;
  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  if (!clamp) {
    return parsed;
  }

  return Math.min(max, Math.max(min, parsed));
}

function useStrictScenarioPoints() {
  return Boolean(scenarioState.activeConfig?.features?.strictScenarioPoints);
}

function useAutoTourAgentPoints() {
  const featureFlag = scenarioState.activeConfig?.features?.autoTourAgentPoints;
  if (featureFlag === true) {
    return true;
  }
  if (useStrictScenarioPoints()) {
    return false;
  }
  return featureFlag !== false;
}

function normalizeScenarioAssetPath(rawPath = '') {
  const trimmed = String(rawPath || '').trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('./') || trimmed.startsWith('../') || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/public/')) {
    return `./${trimmed.slice('/public/'.length)}`;
  }

  if (trimmed.startsWith('public/')) {
    return `./${trimmed.slice('public/'.length)}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `./${trimmed}`;
}

function buildSyntheticCityImageMap(point, syntheticSrc = '') {
  const task = point?.task || {};
  const primaryLore = String(task.lore || task.text || point?.text || '').trim();
  const primaryQuestion = String(task.question || '').trim();
  const primaryInfo = String(task.info || '').trim();
  const primaryTitle = String(task.title || '').trim() || `${point.title}: заметки`;
  const primaryKicker = String(task.kicker || '').trim() || `Досье ${point.title}`;
  const mediaItems = Array.isArray(task.media) ? task.media.map((item) => ({ ...(item || {}) })) : [];

  return {
    title: `Локации ${point.title}`,
    src: syntheticSrc || '',
    alt: `Карта города ${point.title}`,
    note: syntheticSrc
      ? `Выберите точку на карте ${point.title} или кнопку из списка ниже.`
      : `Откройте сцену ${point.title} из списка ниже.`,
    sidebarTitle: point.title,
    sidebarText: primaryLore,
    points: [
      {
        id: 'main_scene',
        title: 'Главная точка',
        markerColor: String(point.markerColor || '#7f9c4d').trim() || '#7f9c4d',
        mapPosition: { x: 50, y: 50 },
        task: {
          kind: 'empty',
          kicker: primaryKicker,
          title: primaryTitle,
          lore: primaryLore,
          question: primaryQuestion,
          info: primaryInfo,
          media: mediaItems
        }
      }
    ]
  };
}

function getPointInlineCityImageMap(point) {
  if (!point) {
    return null;
  }

  if (point.parentCityId) {
    return null;
  }

  const scenarioCityMapSrc = normalizeScenarioAssetPath(
    scenarioState.activeConfig?.assets?.cityMaps?.[point.id] || ''
  );

  if (point.task?.cityImageMap) {
    const merged = { ...(point.task.cityImageMap || {}) };
    const directSrc = normalizeScenarioAssetPath(merged.src || '');
    if (directSrc) {
      merged.src = directSrc;
    }
    if (!merged.src && scenarioCityMapSrc) {
      merged.src = scenarioCityMapSrc;
    }
    return merged;
  }

  if (useAutoTourAgentPoints()) {
    const mediaItems = Array.isArray(point.task?.media) ? point.task.media : [];
    const primaryImage = mediaItems.find((item) => item?.type === 'image' && String(item.src || '').trim());
    const mediaImageSrc = normalizeScenarioAssetPath(primaryImage?.src || '');
    const effectiveSrc = scenarioCityMapSrc || mediaImageSrc;
    return buildSyntheticCityImageMap(point, effectiveSrc);
  }

  if (useStrictScenarioPoints()) {
    return null;
  }

  return INLINE_CITY_IMAGE_MAPS[point.id] || null;
}

function normalizeImageCityPoint(rawPoint = {}, parentPoint) {
  const normalized = normalizeScenarioPoint(rawPoint);
  const localId = String(rawPoint.id || '').trim() || `spot_${Math.random().toString(36).slice(2, 7)}`;

  return {
    ...normalized,
    id: `${parentPoint.id}.${localId}`,
    localId,
    parentCityId: parentPoint.id,
    parentCityTitle: parentPoint.title,
    markerColor: String(rawPoint.markerColor || parentPoint.markerColor || '#7f9c4d').trim(),
    mapPosition: {
      x: parseMapCoordinate(rawPoint?.mapPosition?.x, 50, { clamp: true }),
      y: parseMapCoordinate(rawPoint?.mapPosition?.y, 50, { clamp: true })
    }
  };
}

const TOUR_AGENT_CITY_GROUPS = {
  dune: new Set(['zarak', 'al_kasir', 'kadir', 'al_sahir', 'nuray', 'rashidar', 'al_fadir', 'kasra', 'samir']),
  verona: new Set(['bellavista', 'castello', 'monteria', 'santario', 'veronetta', 'portovero', 'lucario', 'valdoro', 'sant_fiore', 'rivante']),
  eleon: new Set(['valemor', 'sen_alden', 'bellerosh', 'montelier', 'verdal', 'sent_loren', 'lavier', 'ardenval', 'castreville']),
  argos: new Set([
    'belogorie',
    'novoargos',
    'moregrad',
    'tihorechye',
    'veligrad',
    'chernogorsk',
    'surozhsk',
    'ledogorsk',
    'yarovlad',
    'gradimir'
  ]),
  pandoria: new Set([
    'new_london',
    'northbridge',
    'stormport',
    'greyston',
    'ashford',
    'ravenwood',
    'whitehill',
    'ironport',
    'duncaster',
    'lakeshire'
  ])
};

const DEFAULT_TOUR_AGENT_LORE_BY_CITY = {
  bellavista: `Добро пожаловать в Беллависту, синьор!
У нас не любят лишних вопросов... но вы, я вижу, не просто турист.
Хотите понять, как здесь проходят встречи — смотрите не на людей, а на места.
Загляните в мэрию: там идут официальные заседания.
И не пропустите кофейни — у нас даже там ничего не бывает случайно.
Если этого покажется мало, значит, вы уже начинаете понимать Сантарио.
Здесь редко говорят прямо.
А за точными правилами лучше ехать в Кастелло.`,
  castello: `Добро пожаловать в Кастелло, синьор!
Здесь всё чётко: если есть правило — оно записано, без намёков и догадок.
Хотите понять, как рассаживают людей — идите в зал протокола.
А потом загляните в регистрационное бюро: там видно, как всё это работает вживую.
Но если вас интересуют не правила, а причины —
тогда вам уже в Монтерию.
Там смотрят не на форму, а на то, что за ней стоит.`,
  monteria: `Добро пожаловать в Монтерию, синьор!
Здесь не любят спешку: сначала читают, потом понимают.
Хотите разобраться — начните с архива текстов.
А потом загляните в библиотеку: один и тот же текст здесь может открыть совсем разный смысл.
Но если вам кажется, что всё лежит на поверхности — ох, нет.
В Монтерии важно не как выглядит, а что скрыто внутри.`,
  santario: `Добро пожаловать в Сантарио, синьор!
Здесь не любят говорить всё прямо — у нас больше наблюдают, чем объясняют.
Хотите понять, как проходят встречи, — начните с мэрии.
А потом обязательно загляните в кофейню: иногда простые привычки говорят больше, чем официальные слова.
И если почувствуете, что картина всё ещё неполная — поезжайте в Веронетту.
Там умеют замечать то, что в других местах ускользает.`,
  veronetta: `Добро пожаловать в Веронетту, синьор!
Здесь самое важное редко видно сразу — сначала нужно уметь смотреть.
Хотите разобраться, как тут работают с информацией, — начните с архива изображений.
А потом пройдитесь по внутреннему двору: иногда лучше всего детали видно со стороны.
И если вам покажется, что вы уже всё заметили — о-о, нет, всё только начинается.
Дальше вам в Портоверо.
Там дело уже не в тайнах, а в контроле.`,
  portovero: `Добро пожаловать в Портоверо, синьор!
Здесь всё просто: кто держит вход, тот держит порядок.
Для начала загляните в зал у воды.
А потом — в портовую службу: там сразу видно, как здесь всё движется и кто за этим следит.
Но, mamma mia, не все остаются только здесь.
Кто-то едет в Лукарио за старыми бумагами, кто-то в Вальдоро за точностью, кто-то в Сант-Фиоре за странными мыслями, а кто-то в Риванте — ловить след.
Главное решить одно:
вы пойдёте туда, где ответ ближе... или туда, где он красивее?`,
  lucario: `Добро пожаловать в Лукарио, синьор!
Здесь любят записи: что однажды зафиксировано, то просто так не теряет вес.
Если ищете ответы — начните с архива документов.
А потом загляните в читальный зал: иногда смысл приходит только со второго взгляда.
Но attenzione — не всё, что записано, ведёт туда, куда вам нужно.`,
  valdoro: `Добро пожаловать в Вальдоро, синьор!
Здесь всё любят считать точно: если есть данные, значит, найдётся и ответ.
Хотите разобраться — начните с зала расчётов.
А потом загляните в мастерскую схем: там из деталей пытаются собрать целую систему.
Но, eh, не каждая система приводит туда, куда вы ждёте.`,
  sant_fiore: `Добро пожаловать в Сант-Фиоре, синьор!
Здесь ищут не сами ответы, а их отражения.
Хотите разобраться — начните с галереи символов.
А потом загляните в зал интерпретаций: здесь у одного смысла может быть сразу несколько лиц.
Главное, caro mio, не потеряйтесь среди них.`,
  rivante: `Добро пожаловать в Риванте, синьор!
Здесь верят: у каждого следа есть свой ответ.
Хотите проверить — начните с зала маршрутов.
А потом пройдитесь по улице направлений: здесь путь меняется вместе с вашим выбором.
Но attenzione — не каждая дорога приводит туда, куда вы ждали.`
};

function resolveTourAgentCountryKey(parentPoint) {
  const cityId = String(parentPoint?.id || '').trim();
  if (!cityId) {
    return '';
  }

  if (scenarioState.activeId === 'campaign') {
    for (const [countryKey, citySet] of Object.entries(TOUR_AGENT_CITY_GROUPS)) {
      if (citySet.has(cityId)) {
        return countryKey;
      }
    }
    return '';
  }

  if (scenarioState.activeId === 'emirates-dune') {
    return 'dune';
  }

  if (scenarioState.activeId === 'eleon') {
    return 'eleon';
  }

  if (scenarioState.activeId === 'verona' || scenarioState.activeId === 'italy') {
    return 'verona';
  }

  if (scenarioState.activeId === 'argos') {
    return 'argos';
  }

  return String(scenarioState.activeId || '').trim().toLowerCase();
}

function getTourAgentMediaSrc(parentPoint) {
  const assets = scenarioState.activeConfig?.assets || {};
  const byCity = assets.tourAgentPhotosByCity || assets.tourAgentCityPhotos || assets.tourAgentCityImages || {};
  const byCountry = assets.tourAgentPhotosByCountry || assets.tourAgentCountryPhotos || assets.tourAgentCountryImages || {};
  const cityId = String(parentPoint?.id || '').trim();
  const countryKey = resolveTourAgentCountryKey(parentPoint);

  const candidateRaw = String(
    byCity?.[cityId]
      || byCountry?.[countryKey]
      || assets.tourAgentPhoto
      || assets.tourAgentImage
      || byCountry?.default
      || ''
  ).trim();

  return normalizeScenarioAssetPath(candidateRaw);
}

function getTourAgentLore(parentPoint) {
  const assets = scenarioState.activeConfig?.assets || {};
  const byCity = assets.tourAgentLoreByCity || assets.tourAgentTextByCity || assets.tourAgentByCity || {};
  const byCountry = assets.tourAgentLoreByCountry || assets.tourAgentTextByCountry || assets.tourAgentByCountry || {};
  const cityId = String(parentPoint?.id || '').trim();
  const countryKey = resolveTourAgentCountryKey(parentPoint);

  const candidate = String(
    byCity?.[cityId]
      || byCountry?.[countryKey]
      || DEFAULT_TOUR_AGENT_LORE_BY_CITY[cityId]
      || `Вы заходите в туристическое агентство ${parentPoint.title}. Агент коротко объясняет, какие точки в городе стоит пройти в первую очередь, и где искать рабочие улики.`
  ).trim();

  return candidate;
}

function getRoutePointById(pointId = '') {
  const normalizedId = String(pointId || '').trim();
  if (!normalizedId) {
    return null;
  }

  return points.find((point) => !point?.parentCityId && String(point.id || '').trim() === normalizedId) || null;
}

function normalizeUnlockTargetIds(rawIds = []) {
  return Array.isArray(rawIds)
    ? rawIds
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    : [];
}

function isTourAgentPointRuntime(point) {
  const localId = String(point?.localId || point?.id || '').trim().toLowerCase();
  const title = String(point?.title || point?.task?.title || '').trim().toLowerCase();

  if (
    localId === 'tour_agent'
    || localId === 'tour_agency'
    || localId === 'travel_agency'
    || localId === 'tourist_agency'
  ) {
    return true;
  }

  return title.includes('тур') && (title.includes('агент') || title.includes('агенств'));
}

function getTourAgentNextCityIds(parentPoint, rawPoints = [], activeLocalId = '') {
  const parentId = String(parentPoint?.id || '').trim();
  if (!parentId) {
    return [];
  }

  const nextIds = new Set();
  const routeOrder = new Map(
    points
      .filter((point) => !point?.parentCityId)
      .map((point, index) => [String(point.id || '').trim(), index])
  );

  normalizeUnlockTargetIds(parentPoint?.task?.unlockTargetIds).forEach((targetId) => {
    if (getRoutePointById(targetId) && targetId !== parentId) {
      nextIds.add(targetId);
    }
  });

  points.forEach((point) => {
    if (!point || point.parentCityId || String(point.id || '').trim() === parentId) {
      return;
    }

    const requiredIds = normalizeUnlockTargetIds(point.task?.lock?.requireVisitedAny);
    if (!requiredIds.length) {
      return;
    }

    const unlockedByParent = requiredIds.some((requiredId) => requiredId === parentId || requiredId.startsWith(`${parentId}.`));
    if (unlockedByParent) {
      nextIds.add(String(point.id || '').trim());
    }
  });

  const normalizedRawPoints = Array.isArray(rawPoints) ? rawPoints : [];
  const normalizedActiveLocalId = String(activeLocalId || '').trim().toLowerCase();
  const hasTourAgentInRawPoints = normalizedRawPoints.some((rawPoint) => isTourAgentLikePoint(rawPoint));

  normalizedRawPoints.forEach((rawPoint) => {
    const rawLocalId = String(rawPoint?.id || '').trim().toLowerCase();
    const useCurrentPoint = normalizedActiveLocalId
      ? rawLocalId === normalizedActiveLocalId
      : (hasTourAgentInRawPoints ? isTourAgentLikePoint(rawPoint) : true);

    if (!useCurrentPoint) {
      return;
    }

    normalizeUnlockTargetIds(rawPoint?.task?.unlockTargetIds).forEach((targetId) => {
      if (getRoutePointById(targetId) && targetId !== parentId) {
        nextIds.add(targetId);
      }
    });
  });

  return Array.from(nextIds).sort((leftId, rightId) => {
    return (routeOrder.get(leftId) ?? Number.MAX_SAFE_INTEGER) - (routeOrder.get(rightId) ?? Number.MAX_SAFE_INTEGER);
  });
}

function getFallbackTourAgentNextCityIds(parentPoint) {
  const parentId = String(parentPoint?.id || '').trim();
  if (!parentId) {
    return [];
  }

  const countryKey = resolveTourAgentCountryKey(parentPoint);
  const citySet = TOUR_AGENT_CITY_GROUPS[countryKey];
  if (!citySet?.size) {
    return [];
  }

  const orderedCountryCityIds = points
    .filter((point) => !point?.parentCityId)
    .map((point) => String(point?.id || '').trim())
    .filter((cityId) => cityId && citySet.has(cityId));

  const currentIndex = orderedCountryCityIds.indexOf(parentId);
  if (currentIndex < 0) {
    return [];
  }

  const forward = orderedCountryCityIds.slice(currentIndex + 1);
  const backward = orderedCountryCityIds.slice(0, currentIndex);
  const candidates = [...forward, ...backward].filter((cityId) => cityId && cityId !== parentId);
  if (!candidates.length) {
    return [];
  }

  const unresolved = candidates.filter((cityId) => !mapState.visited.has(cityId));
  const pool = unresolved.length ? unresolved : candidates;

  return pool.slice(0, 2);
}

function formatTourAgentRouteHint(parentPoint, rawPoints = [], activeLocalId = '') {
  const nextCityIds = getTourAgentNextCityIds(parentPoint, rawPoints, activeLocalId);
  const fallbackIds = !nextCityIds.length
    ? getFallbackTourAgentNextCityIds(parentPoint)
    : [];
  const targetCityIds = nextCityIds.length ? nextCityIds : fallbackIds;
  if (!targetCityIds.length) {
    return '';
  }

  const nextCityTitles = targetCityIds
    .map((cityId) => getRoutePointById(cityId)?.title || '')
    .map((title) => String(title || '').trim())
    .filter(Boolean);

  if (!nextCityTitles.length) {
    return '';
  }

  const formatCityList = (titles = []) => {
    if (titles.length <= 1) {
      return titles[0] || '';
    }
    if (titles.length === 2) {
      return `${titles[0]} и ${titles[1]}`;
    }
    return `${titles.slice(0, -1).join(', ')} и ${titles[titles.length - 1]}`;
  };

  const stableSeed = `${String(parentPoint?.id || '').trim()}|${nextCityTitles.join('|')}`;
  let hash = 0;
  for (let index = 0; index < stableSeed.length; index += 1) {
    hash = ((hash * 31) + stableSeed.charCodeAt(index)) >>> 0;
  }

  const singleTemplates = [
    (cityList) => `Я бы на вашем месте заглянул в ${cityList}.`,
    (cityList) => `Если идти по уму, следующая остановка — ${cityList}.`,
    (cityList) => `Для полной картины советую заехать в ${cityList}.`,
    (cityList) => `После этого лучше держать курс на ${cityList}.`
  ];

  const multiTemplates = [
    (cityList) => `Если собирать картину целиком, советую заглянуть в ${cityList}.`,
    (cityList) => `Дальше ниточка тянется к ${cityList}.`,
    (cityList) => `Я бы прошёл следующий отрезок через ${cityList}.`,
    (cityList) => `Следующие ответы обычно находят в ${cityList}.`
  ];

  const cityList = formatCityList(nextCityTitles);
  const templates = nextCityTitles.length === 1 ? singleTemplates : multiTemplates;
  const templateIndex = hash % templates.length;

  return templates[templateIndex](cityList);
}

function applyTourAgentGuidance(task, parentPoint, rawPoints = [], activeLocalId = '') {
  if (!task || typeof task !== 'object' || !parentPoint) {
    return;
  }

  const routeHint = formatTourAgentRouteHint(parentPoint, rawPoints, activeLocalId);
  if (!routeHint) {
    return;
  }

  const loreText = String(task.lore || task.text || '')
    .replace(/\n{0,2}Дальше по маршруту:[^\n]*\.?/g, '')
    .trim();
  if (!loreText) {
    task.lore = routeHint;
    return;
  }

  if (loreText.includes(routeHint)) {
    task.lore = loreText;
    return;
  }

  task.lore = `${loreText}\n\n${routeHint}`;
}

function isTourAgentLikePoint(rawPoint = {}) {
  const localId = String(rawPoint.id || '').trim().toLowerCase();
  const title = String(rawPoint.title || rawPoint.task?.title || '').trim().toLowerCase();

  if (
    localId === 'tour_agent'
    || localId === 'tour_agency'
    || localId === 'travel_agency'
    || localId === 'tourist_agency'
  ) {
    return true;
  }

  return title.includes('тур') && (title.includes('агент') || title.includes('агенств'));
}

function pickAutoTourAgentPosition(rawPoints = []) {
  const usedPositions = rawPoints
    .map((point) => ({
      x: parseMapCoordinate(point?.mapPosition?.x),
      y: parseMapCoordinate(point?.mapPosition?.y)
    }))
    .filter((position) => Number.isFinite(position.x) && Number.isFinite(position.y));

  const candidates = [
    { x: 16, y: 18 },
    { x: 20, y: 24 },
    { x: 80, y: 18 },
    { x: 18, y: 78 },
    { x: 82, y: 78 },
    { x: 52, y: 16 },
    { x: 52, y: 82 },
    { x: 28, y: 16 }
  ];

  if (!usedPositions.length) {
    return candidates[0];
  }

  const minDistance = 11;
  const farEnough = candidates.find((candidate) => {
    return usedPositions.every((used) => {
      const dx = used.x - candidate.x;
      const dy = used.y - candidate.y;
      return Math.sqrt((dx * dx) + (dy * dy)) >= minDistance;
    });
  });

  return farEnough || candidates[0];
}

function buildAutoTourAgentPoint(parentPoint, rawPoints = []) {
  const mediaSrc = getTourAgentMediaSrc(parentPoint);
  const position = pickAutoTourAgentPosition(rawPoints);
  const loreText = getTourAgentLore(parentPoint);

  const autoTask = {
    kind: 'empty',
    kicker: parentPoint.title,
    title: `${parentPoint.title}: тур-агент`,
    lore: loreText,
    question: '',
    info: ''
  };

  if (mediaSrc) {
    autoTask.media = [
      {
        type: 'image',
        title: `Тур-агент ${parentPoint.title}`,
        src: mediaSrc,
        alt: `Фото тур-агента для города ${parentPoint.title}`
      }
    ];
  }

  applyTourAgentGuidance(autoTask, parentPoint, rawPoints, 'tour_agent');

  return {
    id: 'tour_agent',
    title: 'Тур-агент',
    markerColor: '#f0b24d',
    mapPosition: position,
    task: autoTask
  };
}

function getImageCityPoints(point) {
  const config = getPointInlineCityImageMap(point);
  const basePoints = Array.isArray(config?.points) ? config.points : [];
  const hasTourAgentPoint = basePoints.some((item) => isTourAgentLikePoint(item));
  const shouldAutoInjectTourAgent = useAutoTourAgentPoints();
  const rawPoints = !shouldAutoInjectTourAgent || hasTourAgentPoint
    ? basePoints
    : [buildAutoTourAgentPoint(point, basePoints), ...basePoints];
  return rawPoints.map((item) => normalizeImageCityPoint(item, point)).filter((item) => item.id && item.task?.kind);
}

function getTaskMediaItems(point) {
  const items = Array.isArray(point.task?.media) ? point.task.media : [];
  const cityImage = getPointInlineCityImageMap(point);
  const normalizedItems = items.map((item) => {
    if (!item || typeof item !== 'object') {
      return item;
    }
    if (item.type !== 'image') {
      return { ...item };
    }
    return {
      ...item,
      src: normalizeScenarioAssetPath(item.src || '')
    };
  });

  if (!cityImage?.src) {
    return normalizedItems;
  }

  return normalizedItems.filter((item) => String(item?.src || '').trim() !== String(cityImage.src || '').trim());
}

function normalizeScenarioPoint(rawPoint = {}) {
  return {
    id: String(rawPoint.id || '').trim(),
    title: String(rawPoint.title || '').trim(),
    text: String(rawPoint.text || '').trim(),
    lat: Number(rawPoint.lat) || 0,
    lng: Number(rawPoint.lng) || 0,
    zoom: Number(rawPoint.zoom) || 6,
    markerColor: String(rawPoint.markerColor || '').trim(),
    task: {
      ...(rawPoint.task || {})
    }
  };
}

function applyScenarioRouteConfig(scenarioData = null) {
  const routeMap = scenarioData?.routeMap;

  if (!routeMap || !Array.isArray(routeMap.points) || routeMap.points.length === 0) {
    scenarioState.routeMapMode = 'leaflet';
    scenarioState.routeMapImageSrc = './assets/maps/italy-schematic.svg';
    mapSceneNode?.classList.remove('is-image-mode');
    setActivePoints(DEFAULT_POINTS, DEFAULT_FALLBACK_POINT_POSITIONS);
    setFallbackMapImage('./assets/maps/italy-schematic.svg');
    return;
  }

  const nextPoints = routeMap.points.map((point) => normalizeScenarioPoint(point)).filter((point) => point.id);
  const nextFallbackPositions = {};
  routeMap.points.forEach((point) => {
    const id = String(point?.id || '').trim();
    const x = parseMapCoordinate(point?.mapPosition?.x);
    const y = parseMapCoordinate(point?.mapPosition?.y);
    if (!id || Number.isNaN(x) || Number.isNaN(y)) {
      return;
    }
    nextFallbackPositions[id] = { x, y };
  });

  scenarioState.routeMapMode = String(routeMap.mode || 'image').trim().toLowerCase() || 'image';
  scenarioState.routeMapImageSrc = String(routeMap.imageSrc || './assets/maps/italy-schematic.svg').trim() || './assets/maps/italy-schematic.svg';
  mapSceneNode?.classList.toggle('is-image-mode', scenarioState.routeMapMode === 'image');
  setActivePoints(nextPoints, nextFallbackPositions);
  setFallbackMapImage(scenarioState.routeMapImageSrc);
}

const SCENARIO_FETCH_CACHE_BUSTER = String(Date.now());

function withCacheBuster(rawUrl = '') {
  try {
    const targetUrl = new URL(String(rawUrl || '').trim(), window.location.href);
    targetUrl.searchParams.set('cb', SCENARIO_FETCH_CACHE_BUSTER);
    return targetUrl.toString();
  } catch (_) {
    return rawUrl;
  }
}

async function fetchJsonSafely(url) {
  const response = await fetch(withCacheBuster(url), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`http_${response.status}`);
  }
  return response.json();
}

async function loadScenarioConfig() {
  let registry = DEFAULT_SCENARIO_REGISTRY;

  try {
    const payload = await fetchJsonSafely('./scenarios/index.json');
    if (payload && Array.isArray(payload.scenarios) && payload.scenarios.length > 0) {
      registry = payload;
    }
  } catch (_) {
    // Keep bundled registry fallback.
  }

  scenarioState.registry = registry;
  const requestedId = getRequestedScenarioId();
  const defaultId = String(registry.defaultScenarioId || DEFAULT_SCENARIO_REGISTRY.defaultScenarioId || 'campaign').trim().toLowerCase();
  const registryMap = new Map((registry.scenarios || []).map((entry) => [String(entry.id || '').trim().toLowerCase(), entry]));

  let selectedEntry = registryMap.get(requestedId) || registryMap.get(defaultId) || registry.scenarios[0] || DEFAULT_SCENARIO_REGISTRY.scenarios[0];

  if (selectedEntry && selectedEntry.playable === false) {
    selectedEntry = registryMap.get(defaultId) || DEFAULT_SCENARIO_REGISTRY.scenarios[0];
  }

  let scenarioData = null;
  if (selectedEntry?.src) {
    try {
      scenarioData = await fetchJsonSafely(selectedEntry.src);
    } catch (_) {
      scenarioData = null;
    }
  }

  scenarioState.activeId = String(selectedEntry?.id || defaultId || 'italy').trim().toLowerCase();
  scenarioState.activeTitle = String(scenarioData?.title || selectedEntry?.title || 'Сценарий').trim();
  scenarioState.activeConfig = scenarioData;

  applyScenarioUi(mergeScenarioUi(scenarioData?.ui || {}), selectedEntry, scenarioData);
  applyScenarioRouteConfig(scenarioData);
}

function ensureCaseMapPanelInitialized() {
  if (!caseMapState.initialized) {
    initCaseMapPanel();
  }
}

function ensurePrototypeFrameLoaded() {
  if (!prototypeFrameNode || prototypeFrameLoaded) {
    return;
  }

  const frameSrc = String(prototypeFrameNode.dataset.src || '').trim();
  if (!frameSrc) {
    return;
  }

  prototypeFrameNode.src = frameSrc;
  prototypeFrameLoaded = true;
}

function setActiveView(viewName = 'map') {
  state.activeView = 'map';

  viewMapNode?.classList.toggle('is-active', state.activeView === 'map');
  viewAnswerNode?.classList.toggle('is-active', state.activeView === 'answer');
  viewPrototypeNode?.classList.toggle('is-active', state.activeView === 'prototype');
  tabMapBtn?.classList.toggle('is-active', state.activeView === 'map');
  tabAnswerBtn?.classList.toggle('is-active', state.activeView === 'answer');
  tabPrototypeBtn?.classList.toggle('is-active', state.activeView === 'prototype');

  if (state.activeView === 'map' && mapState.map) {
    window.setTimeout(() => {
      mapState.map.invalidateSize();
    }, 120);
  }

}

function formatUiDate(value = '') {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('ru-RU');
}

function getLocalCaseMapFallbackUrl() {
  const host = String(window.location.hostname || '').toLowerCase();
  const isLocalRun = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  const baseSrc = scenarioState.routeMapMode === 'image' && scenarioState.routeMapImageSrc
    ? scenarioState.routeMapImageSrc
    : './assets/maps/team-map.png';
  return isLocalRun ? `${baseSrc}?v=${Date.now()}` : baseSrc;
}

async function getCaseMapSource() {
  if (caseMapSourceState.resolved && caseMapSourceState.url) {
    return {
      url: caseMapSourceState.url,
      width: caseMapSourceState.width,
      height: caseMapSourceState.height
    };
  }

  let resolved = {
    url: getLocalCaseMapFallbackUrl(),
    width: 0,
    height: 0
  };

  try {
    const response = await fetch('./api/map-source', { cache: 'no-store' });
    const payload = await response.json().catch(() => null);
    if (response.ok && payload?.ok && typeof payload.src === 'string' && payload.src.trim()) {
      resolved = {
        url: payload.src.trim(),
        width: Number(payload.width) || 0,
        height: Number(payload.height) || 0
      };
    }
  } catch (error) {
    // Keep local fallback when API is unavailable.
  }

  caseMapSourceState.url = resolved.url;
  caseMapSourceState.width = resolved.width;
  caseMapSourceState.height = resolved.height;
  caseMapSourceState.resolved = true;
  return resolved;
}

function resetCaseMap() {
  if (!caseMapState.map || !caseMapState.width || !caseMapState.height) {
    return;
  }

  const bounds = window.L.latLngBounds([0, 0], [caseMapState.height, caseMapState.width]);
  caseMapState.map.invalidateSize();
  caseMapState.map.fitBounds(bounds, { animate: false, padding: [0, 0] });
  caseMapState.baseZoom = caseMapState.map.getZoom();
  caseMapState.minZoom = caseMapState.baseZoom;
  caseMapState.maxZoom = caseMapState.baseZoom + 3.5;
  caseMapState.map.setMinZoom(caseMapState.minZoom);
  caseMapState.map.setMaxZoom(caseMapState.maxZoom);
}

function buildCaseMapOverlay(imageUrl, width, height) {
  caseMapState.width = Number(width) || 1;
  caseMapState.height = Number(height) || 1;
  caseMapViewportNode.style.aspectRatio = `${caseMapState.width} / ${caseMapState.height}`;

  const map = window.L.map(caseMapViewportNode, {
    crs: window.L.CRS.Simple,
    minZoom: caseMapState.minZoom,
    maxZoom: caseMapState.maxZoom,
    zoomSnap: 0.1,
    zoomDelta: 0.25,
    zoomControl: false,
    attributionControl: false,
    worldCopyJump: false,
    maxBoundsViscosity: 1,
    bounceAtZoomLimits: false,
    preferCanvas: true
  });

  const bounds = window.L.latLngBounds([0, 0], [caseMapState.height, caseMapState.width]);
  const overlay = window.L.imageOverlay(imageUrl, bounds, {
    interactive: false,
    className: 'case-map-image'
  });

  overlay.once('load', () => {
    caseMapStatusNode.textContent = 'Карта подключена.';
  });

  overlay.once('error', () => {
    caseMapState.initialized = false;
    caseMapStatusNode.textContent = 'Не удалось загрузить карту: проверьте файл public/assets/maps/team-map.png.';
  });

  overlay.addTo(map);
  caseMapState.layer = overlay;
  caseMapState.map = map;

  map.fitBounds(bounds, { animate: false, padding: [0, 0] });
  caseMapState.baseZoom = map.getZoom();
  caseMapState.minZoom = caseMapState.baseZoom;
  caseMapState.maxZoom = caseMapState.baseZoom + 3.5;
  map.setMinZoom(caseMapState.minZoom);
  map.setMaxZoom(caseMapState.maxZoom);
  map.setMaxBounds(bounds);
  resetCaseMap();
  renderCaseMapPoints();
}

function clearCaseMapPoints() {
  caseMapState.markers.forEach((marker) => {
    try {
      marker.remove();
    } catch (_) {
      // Ignore marker cleanup errors.
    }
  });
  caseMapState.markers.clear();
}

function refreshCaseMapPoints() {
  caseMapState.markers.forEach((marker, pointId) => {
    marker.setStyle(markerStyle(pointId));
  });
}

function renderCaseMapPoints() {
  clearCaseMapPoints();

  if (!caseMapState.map || scenarioState.routeMapMode !== 'image' || !caseMapState.width || !caseMapState.height) {
    return;
  }

  points.forEach((point) => {
    if (!isPointVisible(point)) {
      return;
    }

    const position = fallbackPointPositions[point.id];
    if (!position) {
      return;
    }

    const marker = window.L.circleMarker(
      [caseMapState.height * (position.y / 100), caseMapState.width * (position.x / 100)],
      markerStyle(point.id)
    );

    marker.addTo(caseMapState.map);
    marker.bindTooltip(point.title, {
      className: 'leaflet-label',
      direction: 'top',
      offset: [0, -10],
      permanent: true
    });
    marker.on('click', () => {
      setActiveView('map');
      focusPoint(point);
      triggerHaptic('light');
    });
    caseMapState.markers.set(point.id, marker);
  });
}

function initCaseMapPanel() {
  if (!caseMapStatusNode || !caseMapViewportNode) {
    return;
  }
  if (!window.L) {
    caseMapStatusNode.textContent = 'Не удалось загрузить карту: библиотека Leaflet недоступна.';
    return;
  }
  if (caseMapState.initialized) {
    return;
  }

  caseMapState.initialized = true;
  caseMapStatusNode.textContent = 'Загружаем карту...';

  void (async () => {
    const source = await getCaseMapSource();

    if (source.width > 0 && source.height > 0) {
      buildCaseMapOverlay(source.url, source.width, source.height);
      return;
    }

    const image = new window.Image();
    image.decoding = 'async';
    image.fetchPriority = 'high';
    image.onload = () => {
      caseMapState.image = image;
      buildCaseMapOverlay(source.url, Number(image.naturalWidth) || 1, Number(image.naturalHeight) || 1);
    };
    image.onerror = () => {
      caseMapState.initialized = false;
      caseMapStatusNode.textContent = 'Не удалось загрузить карту: проверьте файл public/assets/maps/team-map.png.';
    };
    image.src = source.url;
  })();
}

function renderFinalAnswerPanel() {
  if (!finalAnswerPanelNode || !finalAnswerInputNode || !submitFinalAnswerBtn) {
    return;
  }

  if (!state.teamReady) {
    finalAnswerInputNode.disabled = true;
    submitFinalAnswerBtn.disabled = true;
    finalAnswerStatusNode.textContent = 'Сначала выберите команду на вкладке карты.';
    finalAnswerLastNode.hidden = true;
    finalAnswerInputNode.value = state.finalAnswerDraft || '';
    return;
  }

  finalAnswerInputNode.disabled = false;
  submitFinalAnswerBtn.disabled = false;

  if (document.activeElement !== finalAnswerInputNode) {
    finalAnswerInputNode.value = state.finalAnswerDraft || '';
  }

  if (state.finalAnswerText && state.finalAnswerAt) {
    finalAnswerStatusNode.textContent = `Ответ принят: ${formatUiDate(state.finalAnswerAt)}`;
    finalAnswerLastTextNode.textContent = state.finalAnswerText;
    finalAnswerLastNode.hidden = false;
  } else {
    finalAnswerStatusNode.textContent = 'Итоговый ответ ещё не отправлен.';
    finalAnswerLastNode.hidden = true;
  }
}

function applyTeamStats(stats = {}) {
  const previousMoveCount = Number(state.teamMoveCount || 0);
  const previousFinalAnswer = state.finalAnswerText;

  state.teamMoveCount = Number(stats?.moveCount || 0);
  state.finalAnswerText = String(stats?.finalAnswerText || '');
  state.finalAnswerAt = String(stats?.finalAnswerAt || '');
  state.finalAnswerMoveCount = Number(stats?.finalAnswerMoveCount || 0);

  if (state.teamMoveCount === 0 && previousMoveCount > 0) {
    resetClientRouteProgress();
  }

  if (!state.finalAnswerDraft || state.finalAnswerDraft === previousFinalAnswer || document.activeElement !== finalAnswerInputNode) {
    state.finalAnswerDraft = state.finalAnswerText;
  }

  updateBadge();
  renderFinalAnswerPanel();
}

function resetClientRouteProgress() {
  mapState.visited.clear();
  mapState.solved.clear();
  mapState.sliderBoards.clear();
  mapState.caesarInputs.clear();
  mapState.matchLinks.clear();
  mapState.matchActiveFacts.clear();
  mapState.scannerStates.clear();
  mapState.anagramInputs.clear();
  mapState.decoderOffsets.clear();
  mapState.decoderInputs.clear();
  mapState.decoderClues.clear();
  mapState.rotorAngles.clear();
  mapState.chessStates.clear();
  mapState.taskOutcomes.clear();
  mapState.cityVisits.clear();
  mapState.cityHints.clear();
  mapState.pendingFocusPointId = null;
  mapState.imageCityPointId = null;

  destroyCityTaskMap();
  state.selectedPointId = null;
  state.cityMode = false;

  setTaskResult('');
  setTaskAnswer('');
  updateBadge();
  refreshMarkers();
  renderFallbackMap();

  if (scenarioState.routeMapMode === 'image') {
    initImageRouteMap();
    setTaskPlaceholder();
    setCityMode(false);
    return;
  }

  if (mapState.map) {
    if (mapState.bounds) {
      mapState.map.fitBounds(mapState.bounds.pad(0.28), { animate: false });
    } else {
      mapState.map.setView([42.5, 12.5], 5, { animate: false });
    }
  }

  setTaskPlaceholder();
  setCityMode(false);
}

function openTeamGate(text = '') {
  if (!teamGateNode) {
    return;
  }

  setActiveView('map');
  teamGateNode.hidden = false;
  setTeamGateStatus(text || 'Выберите команду и подтвердите вход.');
  window.setTimeout(() => {
    try {
      teamGateNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (_) {
      // Ignore unsupported scroll options.
    }
  }, 80);
}

function closeTeamGate() {
  if (!teamGateNode) {
    return;
  }

  teamGateNode.hidden = true;
  setTeamGateStatus('');
}

function renderTeamOptions(teams = []) {
  if (!teamSelectNode) {
    return;
  }

  teamSelectNode.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Выберите команду...';
  teamSelectNode.appendChild(placeholder);

  teams.forEach((teamName) => {
    const option = document.createElement('option');
    option.value = teamName;
    option.textContent = teamName;
    teamSelectNode.appendChild(option);
  });

  if (state.teamName) {
    teamSelectNode.value = state.teamName;
  }
}

function showTriggerNotice(triggers = []) {
  if (!Array.isArray(triggers) || triggers.length === 0) {
    return;
  }

  const fresh = triggers.filter((trigger) => {
    if (!trigger?.id) {
      return false;
    }

    if (state.shownTriggerIds.has(trigger.id)) {
      return false;
    }

    state.shownTriggerIds.add(trigger.id);
    return true;
  });

  if (fresh.length === 0) {
    return;
  }

  const latest = fresh[fresh.length - 1];
  const text = latest?.text || 'Новый триггер команды.';

  if (state.cityMode) {
    setTaskResult(`Триггер: ${text}`, 'info');
  }

  if (canUseTelegramAlert()) {
    try {
      tg.showAlert(text);
    } catch (_) {
      // Ignore unsupported clients.
    }
  }
}

async function registerTeam(teamName, existingSessionId = '') {
  const telegramUserId = tg?.initDataUnsafe?.user?.id || null;
  const normalizedTeamName = normalizeClientTeamName(teamName);
  const payload = {
    teamName: normalizedTeamName,
    sessionId: existingSessionId || undefined,
    deviceId: state.deviceId,
    telegramUserId
  };

  const data = await apiRequest('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  const teamChanged = state.teamName !== data.teamName;
  if (teamChanged) {
    state.shownTriggerIds = new Set();
    resetClientRouteProgress();
  }

  state.teamReady = true;
  state.teamName = data.teamName;
  state.sessionId = data.sessionId;

  safeStorageSet(STORAGE_KEYS.teamName, state.teamName);
  safeStorageSet(STORAGE_KEYS.sessionId, state.sessionId);

  setTeamStripText();
  applyTeamStats(data?.stats || {});
  closeTeamGate();
  showTriggerNotice(data.triggers || []);
}

function stopTeamPolling() {
  if (state.teamPollTimer) {
    window.clearInterval(state.teamPollTimer);
    state.teamPollTimer = null;
  }
}

async function syncTeamStatus() {
  if (!state.teamReady || !state.teamName) {
    return;
  }

  try {
    const data = await apiRequest(`/api/team/${encodeURIComponent(state.teamName)}/status`);
    applyTeamStats(data?.stats || {});
    showTriggerNotice(data.triggers || []);
  } catch (_) {
    // No-op: do not block UI if status call fails.
  }
}

function startTeamPolling() {
  stopTeamPolling();
  state.teamPollTimer = window.setInterval(() => {
    syncTeamStatus();
  }, 5000);
}

async function postTeamEvent(type, pointId = '', meta = {}) {
  if (!state.teamReady || !state.sessionId) {
    return;
  }

  try {
    const data = await apiRequest('/api/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: state.sessionId,
        teamName: state.teamName,
        deviceId: state.deviceId,
        telegramUserId: tg?.initDataUnsafe?.user?.id || null,
        type,
        pointId,
        meta
      })
    });

    applyTeamStats(data?.stats || {});
    showTriggerNotice(data.triggers || []);
  } catch (_) {
    // No-op.
  }
}

async function submitFinalAnswer() {
  if (!state.teamReady || !state.sessionId) {
    setTeamGateStatus('Сначала подключите команду.');
    openTeamGate('Сначала выберите команду.');
    return;
  }

  const answer = String(state.finalAnswerDraft || '').trim();
  if (!answer) {
    finalAnswerStatusNode.textContent = 'Введите итоговый ответ перед отправкой.';
    triggerHaptic('error');
    return;
  }

  submitFinalAnswerBtn.disabled = true;
  finalAnswerStatusNode.textContent = 'Отправляем итоговый ответ...';

  try {
    const data = await apiRequest('/api/final-answer', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: state.sessionId,
        teamName: state.teamName,
        deviceId: state.deviceId,
        telegramUserId: tg?.initDataUnsafe?.user?.id || null,
        answer
      })
    });

    applyTeamStats(data?.stats || {});
    state.finalAnswerDraft = state.finalAnswerText;
    renderFinalAnswerPanel();
    finalAnswerStatusNode.textContent = `Ответ принят: ${formatUiDate(state.finalAnswerAt)}`;
    triggerHaptic('success');
  } catch (error) {
    const reason = String(error?.message || '');
    if (reason === 'final_answer_required') {
      finalAnswerStatusNode.textContent = 'Ответ пустой. Введите текст и повторите.';
    } else {
      finalAnswerStatusNode.textContent = `Не удалось отправить ответ: ${reason || 'unknown_error'}`;
    }
    triggerHaptic('error');
  } finally {
    submitFinalAnswerBtn.disabled = false;
  }
}

async function initTeamState() {
  state.deviceId = getOrCreateDeviceId();
  setTeamStripText();

  try {
    const config = await apiRequest('/api/config');
    state.teamList = config.teams || [];
  } catch (_) {
    state.teamList = [
      'Новый Вавилон',
      'Эльдорадо',
      'Счастливое государство',
      'Юксайленд',
      'Атлантида',
      'Ювента',
      'Орион',
      'Вика',
      'ОУИ'
    ];
  }

  renderTeamOptions(state.teamList);

  const storedTeam = normalizeClientTeamName(safeStorageGet(STORAGE_KEYS.teamName));
  const storedSessionId = safeStorageGet(STORAGE_KEYS.sessionId);

  if (!storedTeam) {
    openTeamGate('Сначала выберите команду.');
    return;
  }

  try {
    await registerTeam(storedTeam, storedSessionId);
    startTeamPolling();
    void syncTeamStatus();
  } catch (_) {
    state.teamReady = false;
    state.teamName = '';
    state.sessionId = '';
    state.teamMoveCount = 0;
    state.finalAnswerText = '';
    state.finalAnswerAt = '';
    state.finalAnswerMoveCount = 0;
    state.finalAnswerDraft = '';
    setTeamStripText();
    updateBadge();
    renderFinalAnswerPanel();
    openTeamGate('Сессия не восстановилась. Выберите команду снова.');
  }
}

function setTaskResult(text, tone = '') {
  animateTextNode(taskResultNode, text, { msPerChar: 14, instant: !tone });
  taskResultNode.classList.remove('ok', 'bad', 'info');

  if (!text || !tone) {
    return;
  }

  taskResultNode.classList.add(tone);
}

function setTaskLore(text = '', options = {}) {
  const {
    pointId = '',
    skipIfSame = false,
    ...animationOptions
  } = options || {};
  const preparedText = String(text || '');
  const cacheKey = `${String(pointId || '').trim()}::${preparedText}`;

  if (skipIfSame && taskTextRenderCache.loreKey === cacheKey) {
    return;
  }

  taskTextRenderCache.loreKey = cacheKey;
  animateTextNode(taskLoreNode, preparedText, { hideWhenEmpty: true, msPerChar: 17, ...animationOptions });
}

function setTaskAnswer(text = '', label = 'Ключ') {
  if (!text) {
    taskAnswerLabelNode.textContent = 'Ключ';
    animateTextNode(taskAnswerTextNode, '', { instant: true });
    taskAnswerNode.hidden = true;
    return;
  }

  taskAnswerLabelNode.textContent = label;
  animateTextNode(taskAnswerTextNode, text, { msPerChar: 15 });
  taskAnswerNode.hidden = false;
}

function destroyCityTaskMap() {
  if (mapState.cityOverlayLayer && mapState.map) {
    mapState.map.removeLayer(mapState.cityOverlayLayer);
  }

  mapState.cityOverlayLayer = null;
  mapState.cityOverlayPointId = null;
  mapState.cityPoiMarkers.clear();
  cardMap.classList.remove('city-focus');

  if (mapState.map) {
    if (scenarioState.routeMapMode === 'image') {
      const baseZoom = Number(mapState.imageBaseZoom) || mapState.map.getZoom();
      mapState.map.setMinZoom(baseZoom - 0.6);
      mapState.map.setMaxZoom(baseZoom + 4);
    } else {
      mapState.map.setMinZoom(2);
      mapState.map.setMaxZoom(19);
    }
  }
}

function getCityVisitSet(pointId) {
  let visitedSet = mapState.cityVisits.get(pointId);

  if (!visitedSet) {
    visitedSet = new Set();
    mapState.cityVisits.set(pointId, visitedSet);
  }

  return visitedSet;
}

function getPointPalette(pointId, options = {}) {
  const point = pointsById.get(pointId);
  const position = options.position || fallbackPointPositions[pointId] || null;
  const foregroundTone = options.foregroundTone || getForegroundToneForPosition(position);
  return getMarkerPresentation(point, { foregroundTone });
}

function setFallbackMapNote(text = '') {
  if (!fallbackMapNoteNode) {
    return;
  }

  fallbackMapNoteNode.textContent = text || 'Резервная схема: если фон карты не загрузился, нажимайте на точки здесь.';
}

function renderFallbackMap() {
  if (!fallbackMapPointsNode) {
    return;
  }

  fallbackMapPointsNode.innerHTML = '';

  points.forEach((point) => {
    if (!isPointVisible(point)) {
      return;
    }

    const position = fallbackPointPositions[point.id];
    if (!position) {
      return;
    }

    const palette = getPointPalette(point.id);
    const lockHint = getPointLockHint(point);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'fallback-point';
    button.style.left = `${position.x}%`;
    button.style.top = `${position.y}%`;
    button.style.setProperty('--point-fill', palette.fillColor);
    button.style.setProperty('--point-stroke', palette.strokeColor);
    button.style.setProperty('--point-glow', palette.glowColor);
    button.style.setProperty('--point-label-bg', palette.labelBg);
    button.style.setProperty('--point-label-text', palette.labelText);
    button.style.setProperty('--point-label-border', palette.labelBorder);
    button.title = lockHint ? `${point.title}. ${lockHint}` : point.title;
    button.setAttribute('aria-label', lockHint ? `${point.title}. ${lockHint}` : point.title);
    button.classList.toggle('is-active', state.selectedPointId === point.id);
    button.classList.toggle('is-locked', isPointLocked(point));

    const dot = document.createElement('span');
    dot.className = 'fallback-point-dot';
    button.appendChild(dot);

    const label = document.createElement('span');
    label.className = 'fallback-point-label';
    label.textContent = point.title;
    button.appendChild(label);

    button.addEventListener('click', () => {
      focusPoint(point);
      triggerHaptic('light');
    });

    fallbackMapPointsNode.appendChild(button);
  });
}

function showFallbackMap(note = '') {
  if (!fallbackMapNode) {
    return;
  }

  mapState.fallbackVisible = true;
  fallbackMapNode.hidden = false;
  fallbackMapNode.classList.add('is-visible');
  mapAttribNode && (mapAttribNode.hidden = true);
  setFallbackMapNote(note);
  renderFallbackMap();
}

function hideFallbackMap() {
  if (!fallbackMapNode) {
    return;
  }

  mapState.fallbackVisible = false;
  fallbackMapNode.classList.remove('is-visible');
  fallbackMapNode.hidden = true;
  mapAttribNode && (mapAttribNode.hidden = false);
}

function setTaskPlaceholder() {
  destroyCityTaskMap();
  taskKickerNode.textContent = defaultTaskState.kicker;
  taskKickerNode.hidden = false;
  taskTitleNode.textContent = defaultTaskState.title;
  taskTitleNode.hidden = false;
  setTaskLore(defaultTaskState.lore);
  setTaskQuestion(defaultTaskState.question);
  taskOptionsNode.innerHTML = '';
  setTaskResult('');
  setTaskAnswer('');
}

const SUPPORTED_TASK_KINDS = new Set([
  'empty',
  'choice',
  'slider',
  'caesar',
  'match',
  'hotspot',
  'scanner',
  'rotor',
  'decoder',
  'anagram',
  'chess'
]);

function normalizeChoiceToken(value = '') {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
    .replace(/Ё/g, 'Е');
}

function resolveTaskKind(task = {}) {
  const rawKind = String(task.kind || '').trim().toLowerCase();
  const rawMechanic = String(task.mechanic || '').trim().toLowerCase();

  if (SUPPORTED_TASK_KINDS.has(rawKind)) {
    return rawKind;
  }

  if (rawKind === 'hint' || rawKind === 'false') {
    return 'empty';
  }

  if (rawKind === 'puzzle') {
    if (rawMechanic === 'choice') {
      return 'choice';
    }
    if (rawMechanic === 'caesar_shift') {
      return 'caesar';
    }
    return Array.isArray(task.options) ? 'choice' : 'empty';
  }

  if (Array.isArray(task.options) && task.options.length > 0) {
    return 'choice';
  }

  return 'empty';
}

function ensureTaskCompatibility(point) {
  if (!point?.task || typeof point.task !== 'object') {
    return 'empty';
  }

  const task = point.task;
  const resolvedKind = resolveTaskKind(task);

  if (!String(task.kicker || '').trim() && point.parentCityTitle) {
    task.kicker = point.parentCityTitle;
  }
  if (!String(task.title || '').trim() && point.title) {
    task.title = point.title;
  }
  if (!String(task.lore || '').trim() && String(task.text || '').trim()) {
    task.lore = String(task.text || '').trim();
  }
  if (!String(task.question || '').trim() && String(task.prompt || '').trim()) {
    task.question = String(task.prompt || '').trim();
  }
  if (!String(task.info || '').trim() && String(task.reward || '').trim()) {
    task.info = String(task.reward || '').trim();
  }

  if (resolvedKind === 'choice') {
    const options = Array.isArray(task.options) ? task.options : [];
    const hasCorrect = Array.isArray(task.correct) || Number.isInteger(task.correct);
    if (!hasCorrect && options.length > 0) {
      const answerToken = normalizeChoiceToken(task.answer || task.answerText || '');
      if (answerToken) {
        const matchedIndex = options.findIndex((option) => normalizeChoiceToken(option) === answerToken);
        if (matchedIndex >= 0) {
          task.correct = matchedIndex;
        }
      }
    }
  }

  if (resolvedKind === 'caesar' && (!task.caesar || typeof task.caesar !== 'object')) {
    task.caesar = {
      cipherText: String(task.cipherText || '').trim(),
      expectedShift: Number(task.expectedShift) || 3,
      targetWord: String(task.answer || task.targetWord || '').trim()
    };
  }

  return resolvedKind;
}

function getPointLock(point) {
  if (!point?.task?.lock || typeof point.task.lock !== 'object') {
    return null;
  }

  return point.task.lock;
}

function isPointUnlocked(point) {
  const lock = getPointLock(point);
  if (!lock) {
    return true;
  }

  const requireVisitedAny = Array.isArray(lock.requireVisitedAny)
    ? lock.requireVisitedAny
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    : [];

  if (!requireVisitedAny.length) {
    return true;
  }

  return requireVisitedAny.some((pointId) => mapState.visited.has(pointId));
}

function isPointLocked(point) {
  return !isPointUnlocked(point);
}

function isPointVisible(point) {
  const lock = getPointLock(point);
  if (!lock) {
    return true;
  }

  if (lock.visible === false) {
    return isPointUnlocked(point);
  }

  return true;
}

function getPointLockHint(point) {
  const lock = getPointLock(point);
  if (!lock || !isPointLocked(point)) {
    return '';
  }

  return String(lock.hint || 'Сначала откройте этот маршрут в другом городе.').trim();
}

function getUnlockTargetPoints(point) {
  const targetIds = Array.isArray(point?.task?.unlockTargetIds)
    ? point.task.unlockTargetIds
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    : [];

  return targetIds
    .map((targetId) => pointsById.get(targetId))
    .filter(Boolean);
}

function markPointVisited(point) {
  const firstVisit = !mapState.visited.has(point.id);
  if (!firstVisit) {
    return {
      firstVisit: false,
      unlockNoticeText: ''
    };
  }

  mapState.visited.add(point.id);

  const unlockedTargets = getUnlockTargetPoints(point).filter((targetPoint) => isPointUnlocked(targetPoint));
  if (!unlockedTargets.length) {
    return {
      firstVisit: true,
      unlockNoticeText: ''
    };
  }

  const labels = unlockedTargets.map((targetPoint) => targetPoint.title).filter(Boolean);
  const baseText = String(point.task?.unlockSuccessText || '').trim();
  const unlockListText = labels.length ? `Открыты города: ${labels.join(', ')}.` : '';

  return {
    firstVisit: true,
    unlockNoticeText: [baseText, unlockListText].filter(Boolean).join(' ')
  };
}

function renderLockedPointState(point) {
  const lockHint = getPointLockHint(point);
  const parentPoint = point.parentCityId ? pointsById.get(point.parentCityId) : null;

  taskKickerNode.textContent = parentPoint ? `Маршрут закрыт: ${parentPoint.title}` : 'Маршрут закрыт';
  taskKickerNode.hidden = false;
  taskTitleNode.textContent = point.title || 'Закрытая точка';
  taskTitleNode.hidden = false;
  setTaskLore(point.task?.lore || point.text || '');
  setTaskQuestion(lockHint || 'Эта точка станет доступна позже по маршруту.');
  taskOptionsNode.innerHTML = '';
  setTaskResult(lockHint || 'Эта точка пока недоступна.', 'info');
  setTaskAnswer('');
}

function finalizePointFocus(point, travelMeta = null, visitMeta = null) {
  updateBadge();
  refreshMarkers();
  renderTask(point);
  if (visitMeta?.unlockNoticeText) {
    setTaskResult(visitMeta.unlockNoticeText, 'info');
  } else if (
    visitMeta?.firstVisit
    && resolveTaskKind(point.task) === 'empty'
    && !String(point.task?.info || point.task?.reward || '').trim()
    && String(point.localId || '').trim().toLowerCase() !== 'tour_agent'
    && !String(taskResultNode.textContent || '').trim()
  ) {
    setTaskResult('Точка отмечена в досье.', 'info');
  }
  setCityMode(true);

  if (travelMeta) {
    void postTeamEvent('travel', point.id, travelMeta);
  }
}

function markerStyle(pointId, options = {}) {
  if (mapState.cityOverlayPointId) {
    return {
      radius: 9,
      color: 'transparent',
      weight: 0,
      fillColor: '#000000',
      fillOpacity: 0,
      opacity: 0
    };
  }

  const palette = getPointPalette(pointId, options);

  return {
    radius: palette.radius,
    color: palette.strokeColor,
    weight: palette.weight,
    fillColor: palette.fillColor,
    fillOpacity: 0.98,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
    className: palette.markerClassName
  };
}

function refreshMarkers() {
  points.forEach((point) => {
    const marker = mapState.markers.get(point.id);
    if (!marker) {
      return;
    }

    marker.setStyle(markerStyle(point.id));
    marker.closeTooltip();

    if (mapState.cityOverlayPointId) {
      return;
    }

    marker.openTooltip();

    if (state.selectedPointId === point.id) {
      marker.bringToFront();
    }
  });

  if (mapState.fallbackVisible) {
    renderFallbackMap();
  }

  if (caseMapState.markers.size) {
    refreshCaseMapPoints();
  }
}

function updateBadge() {
  if (completionNode) {
    completionNode.hidden = true;
    completionNode.textContent = '';
  }
}

function setMapInteractionsEnabled(enabled) {
  if (!mapState.map) {
    return;
  }

  const map = mapState.map;
  const action = enabled ? 'enable' : 'disable';

  map.dragging?.[action]();
  map.touchZoom?.[action]();
  map.doubleClickZoom?.[action]();
  map.scrollWheelZoom?.[action]();
  map.boxZoom?.[action]();
  map.keyboard?.[action]();

  if (map.tap) {
    map.tap[action]();
  }
}

function updateMapButtonLabels() {
  if (resetMapBtn) {
    resetMapBtn.textContent = 'Вернуть карту';
  }

  if (caseMapResetViewBtn) {
    caseMapResetViewBtn.textContent = 'Вернуть карту';
  }
}

function setCityMode(enabled) {
  state.cityMode = enabled;

  cardMap.classList.toggle('has-task', enabled);
  const selectedPoint = pointsById.get(state.selectedPointId);
  const keepMapInteractive = !enabled
    || Boolean(selectedPoint?.task?.cityMap)
    || Boolean(getPointInlineCityImageMap(selectedPoint))
    || scenarioState.routeMapMode === 'image';
  setMapInteractionsEnabled(keepMapInteractive);

  window.setTimeout(() => {
    if (mapState.map) {
      mapState.map.invalidateSize();
    }
  }, 340);

  updateMapButtonLabels();
}

function getTaskOutcome(pointId) {
  return mapState.taskOutcomes.get(pointId) || null;
}

function rememberTaskOutcome(pointId, outcome = {}) {
  if (!pointId) {
    return null;
  }

  const nextOutcome = {
    ...(mapState.taskOutcomes.get(pointId) || {}),
    ...outcome
  };

  mapState.taskOutcomes.set(pointId, nextOutcome);
  return nextOutcome;
}

function getTaskCorrectIndexes(task = {}) {
  if (Array.isArray(task.correct)) {
    return task.correct
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value));
  }

  if (Number.isInteger(task.correct)) {
    return [task.correct];
  }

  return [];
}

function getTaskOptionOutcome(task = {}, selectedIndex) {
  if (!task.optionOutcomes || typeof task.optionOutcomes !== 'object') {
    return null;
  }

  return task.optionOutcomes[String(selectedIndex)] || task.optionOutcomes[selectedIndex] || null;
}

function showSolvedTaskState(point) {
  const outcome = getTaskOutcome(point.id) || {};
  setTaskResult(outcome.successText || point.task.success || 'Загадка уже решена.', 'ok');
  setTaskAnswer(
    outcome.answerText || point.task.answerText || '',
    outcome.answerLabel || point.task.answerLabel || 'Ключ'
  );
}

function grantTaskItemAwards(point, itemAwards = []) {
  if (!Array.isArray(itemAwards)) {
    return;
  }

  itemAwards.forEach((itemMeta) => {
    if (!itemMeta || typeof itemMeta !== 'object') {
      return;
    }

    void postTeamEvent('item-collected', point.id, {
      ...itemMeta,
      pointId: point.id
    });
  });
}

function completeTask(point, outcome = {}) {
  if (mapState.solved.has(point.id)) {
    return;
  }

  rememberTaskOutcome(point.id, outcome);
  mapState.solved.add(point.id);
  updateBadge();
  refreshMarkers();
  triggerHaptic('success');
  if (Array.isArray(outcome.itemAwards) && outcome.itemAwards.length > 0) {
    grantTaskItemAwards(point, outcome.itemAwards);
  }
  void postTeamEvent('task-solved', point.id, {
    kind: point.task.kind,
    selectedIndex: Number.isInteger(outcome.selectedIndex) ? outcome.selectedIndex : null
  });
}

function checkTaskAnswer(point, selectedIndex) {
  const optionButtons = Array.from(taskOptionsNode.querySelectorAll('.task-option'));
  optionButtons.forEach((button) => {
    button.classList.remove('is-selected', 'is-correct', 'is-wrong');
  });

  const selectedButton = optionButtons[selectedIndex];
  if (!selectedButton || mapState.solved.has(point.id)) {
    return;
  }

  selectedButton.classList.add('is-selected');

  const correctIndexes = getTaskCorrectIndexes(point.task);
  const isCorrect = correctIndexes.includes(selectedIndex);

  if (isCorrect) {
    const optionOutcome = getTaskOptionOutcome(point.task, selectedIndex) || {};
    selectedButton.classList.add('is-correct');
    optionButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add('is-locked');
    });

    completeTask(point, {
      selectedIndex,
      answerText: optionOutcome.answerText || point.task.answerText || '',
      answerLabel: optionOutcome.answerLabel || point.task.answerLabel || 'Ключ',
      successText: optionOutcome.successText || point.task.success || '',
      itemAwards: Array.isArray(optionOutcome.itemAwards)
        ? optionOutcome.itemAwards
        : (Array.isArray(point.task.itemAwards) ? point.task.itemAwards : [])
    });
    showSolvedTaskState(point);
    return;
  }

  selectedButton.classList.add('is-wrong');

  correctIndexes.forEach((correctIndex) => {
    const correctButton = optionButtons[correctIndex];
    if (correctButton) {
      correctButton.classList.add('is-correct');
    }
  });

  setTaskResult(point.task.wrongResultText || 'Неверно. Проверьте деталь протокола и попробуйте снова.', 'bad');
  setTaskAnswer('');
  triggerHaptic('error');
}

function areArraysEqual(first, second) {
  if (first.length !== second.length) {
    return false;
  }

  for (let i = 0; i < first.length; i += 1) {
    if (first[i] !== second[i]) {
      return false;
    }
  }

  return true;
}

function getNeighborIndexes(index, size) {
  const row = Math.floor(index / size);
  const col = index % size;
  const neighbors = [];

  if (row > 0) {
    neighbors.push(index - size);
  }
  if (row < size - 1) {
    neighbors.push(index + size);
  }
  if (col > 0) {
    neighbors.push(index - 1);
  }
  if (col < size - 1) {
    neighbors.push(index + 1);
  }

  return neighbors;
}

function createShuffledSliderBoard(solved, size) {
  const board = solved.slice();
  const mixMoves = 80;
  let prevEmptyIndex = -1;

  for (let move = 0; move < mixMoves; move += 1) {
    const emptyIndex = board.indexOf(0);
    const nextIndexes = getNeighborIndexes(emptyIndex, size).filter((idx) => idx !== prevEmptyIndex);
    const candidates = nextIndexes.length > 0 ? nextIndexes : getNeighborIndexes(emptyIndex, size);
    const targetIndex = candidates[Math.floor(Math.random() * candidates.length)];

    [board[emptyIndex], board[targetIndex]] = [board[targetIndex], board[emptyIndex]];
    prevEmptyIndex = emptyIndex;
  }

  if (areArraysEqual(board, solved)) {
    const emptyIndex = board.indexOf(0);
    const fallback = getNeighborIndexes(emptyIndex, size)[0];
    [board[emptyIndex], board[fallback]] = [board[fallback], board[emptyIndex]];
  }

  return board;
}

function getSliderBoard(point) {
  const existing = mapState.sliderBoards.get(point.id);
  if (existing) {
    return existing;
  }

  const solved = point.task.slider.solved;
  const size = point.task.slider.size;
  const nextBoard = createShuffledSliderBoard(solved, size);
  mapState.sliderBoards.set(point.id, nextBoard);
  return nextBoard;
}

function moveSliderTile(point, tileId) {
  const board = getSliderBoard(point).slice();
  const fromIndex = board.indexOf(tileId);
  const toIndex = board.indexOf(0);
  const size = point.task.slider.size;
  const freeMove = Boolean(point.task.slider.freeMove);
  const canMove = getNeighborIndexes(fromIndex, size).includes(toIndex);

  if (mapState.solved.has(point.id)) {
    return false;
  }

  if (!canMove && !freeMove) {
    return false;
  }

  [board[fromIndex], board[toIndex]] = [board[toIndex], board[fromIndex]];
  mapState.sliderBoards.set(point.id, board);

  const solvedNow = areArraysEqual(board, point.task.slider.solved);
  if (solvedNow) {
    completeTask(point);
  } else {
    triggerHaptic('light');
  }

  renderTask(point);
  return true;
}

function attachSliderDrag(tileButton, point, tileId, boardNode) {
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;

  const finishDrag = () => {
    if (!dragging) {
      return;
    }

    dragging = false;

    const emptyNode = boardNode.querySelector('.slider-empty');
    let moved = false;

    if (emptyNode) {
      const tileRect = tileButton.getBoundingClientRect();
      const emptyRect = emptyNode.getBoundingClientRect();
      const tileCenterX = tileRect.left + tileRect.width / 2;
      const tileCenterY = tileRect.top + tileRect.height / 2;
      const centerInsideEmpty = (
        tileCenterX >= emptyRect.left &&
        tileCenterX <= emptyRect.right &&
        tileCenterY >= emptyRect.top &&
        tileCenterY <= emptyRect.bottom
      );
      const overlapWidth = Math.max(0, Math.min(tileRect.right, emptyRect.right) - Math.max(tileRect.left, emptyRect.left));
      const overlapHeight = Math.max(0, Math.min(tileRect.bottom, emptyRect.bottom) - Math.max(tileRect.top, emptyRect.top));
      const overlapEnough = (
        overlapWidth >= emptyRect.width * 0.55 &&
        overlapHeight >= emptyRect.height * 0.55
      );

      if (centerInsideEmpty && overlapEnough) {
        moved = moveSliderTile(point, tileId);
      }
    }

    tileButton.style.transform = '';
    tileButton.classList.remove('is-dragging');

    if (pointerId !== null) {
      try {
        if (tileButton.hasPointerCapture(pointerId)) {
          tileButton.releasePointerCapture(pointerId);
        }
      } catch (_) {
        // No-op.
      }
    }

    pointerId = null;
  };

  tileButton.addEventListener('pointerdown', (event) => {
    if (tileButton.disabled || mapState.solved.has(point.id)) {
      return;
    }

    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    tileButton.classList.add('is-dragging');

    try {
      tileButton.setPointerCapture(pointerId);
    } catch (_) {
      // No-op.
    }

    event.preventDefault();
  });

  tileButton.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }

    const moveX = event.clientX - startX;
    const moveY = event.clientY - startY;
    tileButton.style.transform = `translate(${moveX}px, ${moveY}px)`;
    event.preventDefault();
  });

  tileButton.addEventListener('pointerup', (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    finishDrag();
  });

  tileButton.addEventListener('pointercancel', finishDrag);
}

function renderSliderBoard(point) {
  const board = getSliderBoard(point);
  const { size, labels, freeMove, image } = point.task.slider;
  const solvedOrder = point.task.slider.solved || [];

  const wrap = document.createElement('div');
  wrap.className = 'slider-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = freeMove
    ? 'Перетаскивайте любую плитку в пустую ячейку.'
    : 'Перетаскивайте только плитку рядом с пустой ячейкой.';
  wrap.appendChild(note);

  const boardNode = document.createElement('div');
  boardNode.className = 'slider-board';
  if (image?.src) {
    boardNode.classList.add('has-image');
  }
  boardNode.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;

  const emptyIndex = board.indexOf(0);

  board.forEach((tileId, index) => {
    if (tileId === 0) {
      const emptyNode = document.createElement('div');
      emptyNode.className = 'slider-empty';
      emptyNode.setAttribute('aria-hidden', 'true');
      boardNode.appendChild(emptyNode);
      return;
    }

    const isNeighbor = getNeighborIndexes(index, size).includes(emptyIndex);

    const tileButton = document.createElement('button');
    tileButton.type = 'button';
    tileButton.className = 'slider-tile';
    tileButton.textContent = labels[tileId] || String(tileId);
    tileButton.setAttribute('aria-label', `Фрагмент ${tileId}`);
    tileButton.disabled = mapState.solved.has(point.id);

    if (image?.src) {
      const solvedIndex = solvedOrder.indexOf(tileId);
      const solvedRow = Math.floor(solvedIndex / size);
      const solvedCol = solvedIndex % size;
      const xPercent = size > 1 ? (solvedCol / (size - 1)) * 100 : 0;
      const yPercent = size > 1 ? (solvedRow / (size - 1)) * 100 : 0;

      tileButton.classList.add('has-image');
      tileButton.textContent = '';
      tileButton.style.backgroundImage = `url("${image.src}")`;
      tileButton.style.backgroundSize = `${size * 100}% ${size * 100}%`;
      tileButton.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
      tileButton.style.backgroundRepeat = 'no-repeat';
    }

    if (!mapState.solved.has(point.id) && (freeMove || isNeighbor)) {
      tileButton.classList.add('is-movable');
      attachSliderDrag(tileButton, point, tileId, boardNode);
    }

    if (!freeMove && !isNeighbor && !mapState.solved.has(point.id)) {
      tileButton.classList.add('is-blocked');
    }

    if (mapState.solved.has(point.id)) {
      tileButton.classList.add('is-solved');
    }

    boardNode.appendChild(tileButton);
  });

  wrap.appendChild(boardNode);
  taskOptionsNode.appendChild(wrap);
}

function getCaesarInput(point) {
  return mapState.caesarInputs.get(point.id) || '';
}

function normalizeRuWord(raw = '') {
  return raw
    .toUpperCase()
    .replace(/Ё/g, 'Е')
    .replace(/[^А-Я]/g, '');
}

function getMatchLinks(point) {
  const existing = mapState.matchLinks.get(point.id);
  if (existing) {
    return { ...existing };
  }

  return {};
}

function setMatchLinks(point, links) {
  mapState.matchLinks.set(point.id, { ...links });
}

function setMatchLink(point, factId, optionId) {
  const links = getMatchLinks(point);

  Object.keys(links).forEach((key) => {
    if (links[key] === optionId && key !== factId) {
      delete links[key];
    }
  });

  if (links[factId] === optionId) {
    delete links[factId];
  } else {
    links[factId] = optionId;
  }

  setMatchLinks(point, links);
}

function clearMatchLinks(point) {
  mapState.matchLinks.set(point.id, {});
  mapState.matchActiveFacts.set(point.id, null);
}

function countCorrectMatchLinks(point) {
  const links = getMatchLinks(point);
  const correct = point.task.match.correct || {};
  let count = 0;

  Object.keys(correct).forEach((factId) => {
    if (links[factId] && links[factId] === correct[factId]) {
      count += 1;
    }
  });

  return count;
}

function isMatchSolved(point) {
  const links = getMatchLinks(point);
  const facts = point.task.match.facts || [];
  const correct = point.task.match.correct || {};

  if (facts.length === 0) {
    return false;
  }

  if (Object.keys(links).length !== facts.length) {
    return false;
  }

  return facts.every((fact) => links[fact.id] && links[fact.id] === correct[fact.id]);
}

function getMatchPairClass(point, factId) {
  const facts = point.task.match.facts || [];
  const pairIndex = facts.findIndex((fact) => fact.id === factId);
  if (pairIndex < 0) {
    return '';
  }

  return `match-pair-${pairIndex % 8}`;
}

function renderCaesarTask(point) {
  const config = point.task.caesar;
  const isSolved = mapState.solved.has(point.id);

  const wrap = document.createElement('div');
  wrap.className = 'caesar-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = 'Подсказка: используйте шифр Цезаря.';
  wrap.appendChild(note);

  const info = document.createElement('p');
  info.className = 'caesar-meta';
  info.textContent = `Шифртекст: ${config.cipherText}`;
  wrap.appendChild(info);

  const shiftMeta = document.createElement('p');
  shiftMeta.className = 'caesar-meta';
  shiftMeta.textContent = `Сдвиг: ${Number(config.expectedShift) || 3}`;
  wrap.appendChild(shiftMeta);

  const inputLabel = document.createElement('label');
  inputLabel.className = 'caesar-input-label';
  inputLabel.setAttribute('for', `caesarInput-${point.id}`);
  inputLabel.textContent = 'Введите слово-ключ:';
  wrap.appendChild(inputLabel);

  const input = document.createElement('input');
  input.type = 'text';
  input.id = `caesarInput-${point.id}`;
  input.className = 'caesar-input';
  input.placeholder = 'Введите слово';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.value = getCaesarInput(point);
  input.disabled = isSolved;
  input.addEventListener('input', () => {
    mapState.caesarInputs.set(point.id, input.value);
  });
  wrap.appendChild(input);

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'caesar-confirm';
  checkBtn.textContent = isSolved ? 'Ключ открыт' : 'Проверить слово';
  checkBtn.disabled = isSolved;
  checkBtn.addEventListener('click', () => {
    const typedWord = normalizeRuWord(getCaesarInput(point));
    const targetWord = normalizeRuWord(config.targetWord);

    const wordOk = typedWord.length > 0 && typedWord === targetWord;

    if (wordOk) {
      completeTask(point);
      setTaskResult(point.task.success, 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      renderTask(point);
      return;
    }

    setTaskResult('Слово неверное. Расшифруйте и введите правильный вариант.', 'bad');
    setTaskAnswer('');
    triggerHaptic('error');
  });
  wrap.appendChild(checkBtn);

  taskOptionsNode.appendChild(wrap);
}

function renderMatchTask(point) {
  const config = point.task.match;
  const facts = config.facts || [];
  const options = config.options || [];
  const links = getMatchLinks(point);
  const isSolved = mapState.solved.has(point.id);
  const activeFactId = mapState.matchActiveFacts.get(point.id) || null;

  const wrap = document.createElement('div');
  wrap.className = 'match-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = 'Шаг 1: выберите факт слева. Шаг 2: выберите соответствующий вывод справа.';
  wrap.appendChild(note);

  const colorHint = document.createElement('p');
  colorHint.className = 'match-color-hint';
  colorHint.textContent = 'Одинаковый цвет слева и справа = одна и та же связь.';
  wrap.appendChild(colorHint);

  const grid = document.createElement('div');
  grid.className = 'match-grid';

  const factsCol = document.createElement('div');
  factsCol.className = 'match-col match-col-facts';
  const factsHead = document.createElement('p');
  factsHead.className = 'match-head match-head-facts';
  factsHead.textContent = 'Факты';
  factsCol.appendChild(factsHead);

  facts.forEach((fact) => {
    const factBtn = document.createElement('button');
    factBtn.type = 'button';
    factBtn.className = 'match-item match-item-fact';
    factBtn.disabled = isSolved;
    factBtn.textContent = fact.text;

    if (links[fact.id]) {
      factBtn.classList.add('is-linked');
      const pairClass = getMatchPairClass(point, fact.id);
      if (pairClass) {
        factBtn.classList.add(pairClass);
      }
    }

    if (activeFactId === fact.id) {
      factBtn.classList.add('is-active');
    }

    factBtn.addEventListener('click', () => {
      const current = mapState.matchActiveFacts.get(point.id) || null;
      mapState.matchActiveFacts.set(point.id, current === fact.id ? null : fact.id);
      renderTask(point);
      triggerHaptic('light');
    });

    factsCol.appendChild(factBtn);
  });

  const optionsCol = document.createElement('div');
  optionsCol.className = 'match-col match-col-options';
  const optionsHead = document.createElement('p');
  optionsHead.className = 'match-head match-head-options';
  optionsHead.textContent = 'Выводы';
  optionsCol.appendChild(optionsHead);

  options.forEach((option) => {
    const optionBtn = document.createElement('button');
    optionBtn.type = 'button';
    optionBtn.className = 'match-item match-item-option';
    optionBtn.disabled = isSolved;
    optionBtn.textContent = option.text;

    const usedByFactId = Object.keys(links).find((factId) => links[factId] === option.id);
    if (usedByFactId) {
      optionBtn.classList.add('is-linked');
      const pairClass = getMatchPairClass(point, usedByFactId);
      if (pairClass) {
        optionBtn.classList.add(pairClass);
      }
    }

    if (activeFactId && links[activeFactId] === option.id) {
      optionBtn.classList.add('is-active');
    }

    optionBtn.addEventListener('click', () => {
      const factId = mapState.matchActiveFacts.get(point.id);
      if (!factId) {
        setTaskResult('Сначала выберите факт слева.', 'info');
        triggerHaptic('error');
        return;
      }

      setMatchLink(point, factId, option.id);
      mapState.matchActiveFacts.set(point.id, null);
      setTaskResult('', '');
      renderTask(point);
      triggerHaptic('light');
    });

    optionsCol.appendChild(optionBtn);
  });

  grid.appendChild(factsCol);
  grid.appendChild(optionsCol);
  wrap.appendChild(grid);

  const actions = document.createElement('div');
  actions.className = 'match-actions';

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'match-btn ghost';
  resetBtn.textContent = 'Сбросить связи';
  resetBtn.disabled = isSolved;
  resetBtn.addEventListener('click', () => {
    clearMatchLinks(point);
    setTaskResult('Связи очищены.', 'info');
    renderTask(point);
    triggerHaptic('light');
  });

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'match-btn primary';
  checkBtn.textContent = isSolved ? 'Пары подтверждены' : 'Проверить связи';
  checkBtn.disabled = isSolved;
  checkBtn.addEventListener('click', () => {
    const linkedCount = Object.keys(getMatchLinks(point)).length;
    if (linkedCount < facts.length) {
      setTaskResult(`Нужно соединить все пары: ${linkedCount}/${facts.length}.`, 'bad');
      triggerHaptic('error');
      return;
    }

    if (isMatchSolved(point)) {
      completeTask(point);
      setTaskResult(point.task.success, 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      renderTask(point);
      return;
    }

    const correctCount = countCorrectMatchLinks(point);
    setTaskResult(`Совпало ${correctCount}/${facts.length}. Проверьте пары.`, 'bad');
    triggerHaptic('error');
  });

  actions.appendChild(resetBtn);
  actions.appendChild(checkBtn);
  wrap.appendChild(actions);

  taskOptionsNode.appendChild(wrap);
}

function normalizeCodeToken(raw = '') {
  return String(raw || '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .trim();
}

function renderHotspotTask(point) {
  const config = point.task.hotspot || {};
  const targets = Array.isArray(config.targets) && config.targets.length
    ? config.targets
    : [config.target || {}];
  const isSolved = mapState.solved.has(point.id);

  const wrap = document.createElement('div');
  wrap.className = 'hotspot-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = targets.length > 1
    ? 'На изображении есть несколько правильных зон. Нажмите на одну из них.'
    : 'На изображении спрятана одна правильная зона. Нажмите точно в неё.';
  wrap.appendChild(note);

  const scene = document.createElement('button');
  scene.type = 'button';
  scene.className = 'hotspot-scene';
  scene.disabled = isSolved;

  const image = document.createElement('img');
  image.className = 'hotspot-image';
  image.src = config.image?.src || '';
  image.alt = config.image?.alt || point.title;
  scene.appendChild(image);

  if (isSolved) {
    targets.forEach((target) => {
      const marker = document.createElement('span');
      marker.className = 'hotspot-hit';
      marker.style.left = `${Number(target.x) || 50}%`;
      marker.style.top = `${Number(target.y) || 50}%`;
      marker.style.width = `${(Number(target.radius) || 8) * 2}%`;
      marker.style.height = `${(Number(target.radius) || 8) * 2}%`;
      scene.appendChild(marker);
    });
  }

  scene.addEventListener('click', (event) => {
    if (isSolved) {
      return;
    }

    const rect = scene.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const matchedTarget = targets.find((target) => {
      const dx = x - (Number(target.x) || 50);
      const dy = y - (Number(target.y) || 50);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= (Number(target.radius) || 8);
    });

    if (matchedTarget) {
      completeTask(point);
      setTaskResult(point.task.success || 'Точная зона найдена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      renderTask(point);
      triggerHaptic('success');
      return;
    }

    setTaskResult(config.missText || 'Пока мимо. Попробуйте еще раз.', 'bad');
    triggerHaptic('error');
  });

  wrap.appendChild(scene);
  taskOptionsNode.appendChild(wrap);
}

function getScannerState(point) {
  const existing = mapState.scannerStates.get(point.id);
  if (existing) {
    return existing;
  }

  const config = point.task.scanner || {};
  const initial = {
    x: Number(config.startX) || 18,
    y: Number(config.startY) || 24,
    input: '',
    detectedCode: ''
  };
  mapState.scannerStates.set(point.id, initial);
  return initial;
}

function getScannerOverlapRatio(state, config) {
  const lensLeft = Number(state.x) || 0;
  const lensTop = Number(state.y) || 0;
  const lensRight = lensLeft + (Number(config.lensWidth) || 24);
  const lensBottom = lensTop + (Number(config.lensHeight) || 20);
  const targetLeft = Number(config.target?.x) || 0;
  const targetTop = Number(config.target?.y) || 0;
  const targetRight = targetLeft + (Number(config.target?.width) || 18);
  const targetBottom = targetTop + (Number(config.target?.height) || 18);

  const overlapWidth = Math.max(0, Math.min(lensRight, targetRight) - Math.max(lensLeft, targetLeft));
  const overlapHeight = Math.max(0, Math.min(lensBottom, targetBottom) - Math.max(lensTop, targetTop));
  const overlapArea = overlapWidth * overlapHeight;
  const targetArea = (Number(config.target?.width) || 18) * (Number(config.target?.height) || 18);

  if (!targetArea) {
    return 0;
  }

  return overlapArea / targetArea;
}

function renderScannerTask(point) {
  const config = point.task.scanner || {};
  const state = getScannerState(point);
  const isSolved = mapState.solved.has(point.id);

  const wrap = document.createElement('div');
  wrap.className = 'scanner-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = 'Тяните рамку-сканер по изображению и ловите участок со шифром.';
  wrap.appendChild(note);

  const stage = document.createElement('div');
  stage.className = 'scanner-stage';

  const image = document.createElement('img');
  image.className = 'scanner-image';
  image.src = config.image?.src || '';
  image.alt = config.image?.alt || point.title;
  stage.appendChild(image);

  const lens = document.createElement('div');
  lens.className = 'scanner-lens';
  lens.style.width = `${Number(config.lensWidth) || 24}%`;
  lens.style.height = `${Number(config.lensHeight) || 20}%`;
  stage.appendChild(lens);

  const lensCode = document.createElement('span');
  lensCode.className = 'scanner-lens-code';
  lens.appendChild(lensCode);

  const readout = document.createElement('p');
  readout.className = 'scanner-readout';
  wrap.appendChild(stage);
  wrap.appendChild(readout);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'scanner-input';
  input.placeholder = 'Введите найденный шифр';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.value = state.input || '';
  input.disabled = isSolved;
  input.addEventListener('input', () => {
    state.input = input.value;
  });

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'scanner-confirm';
  checkBtn.textContent = isSolved ? 'Шифр считан' : 'Подтвердить шифр';
  checkBtn.disabled = isSolved;

  const updateScannerUi = () => {
    lens.style.left = `${state.x}%`;
    lens.style.top = `${state.y}%`;
    const detected = getScannerOverlapRatio(state, config) >= 0.42;
    if (detected) {
      state.detectedCode = config.revealText || '';
    }

    const codeText = state.detectedCode || '---';
    readout.textContent = `Сканер: ${codeText}`;
    lensCode.textContent = detected ? (config.revealText || '') : 'SCAN';
    lens.classList.toggle('is-detected', detected || Boolean(state.detectedCode));
  };

  if (!isSolved) {
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let originX = state.x;
    let originY = state.y;

    const finishDrag = () => {
      if (pointerId !== null) {
        try {
          lens.releasePointerCapture(pointerId);
        } catch (_) {
          // No-op.
        }
      }
      pointerId = null;
    };

    lens.addEventListener('pointerdown', (event) => {
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      originX = state.x;
      originY = state.y;
      lens.setPointerCapture(pointerId);
      event.preventDefault();
    });

    lens.addEventListener('pointermove', (event) => {
      if (pointerId === null || event.pointerId !== pointerId) {
        return;
      }

      const rect = stage.getBoundingClientRect();
      const deltaX = (event.clientX - startX) / rect.width * 100;
      const deltaY = (event.clientY - startY) / rect.height * 100;
      state.x = clampNumber(originX + deltaX, 0, 100 - (Number(config.lensWidth) || 24));
      state.y = clampNumber(originY + deltaY, 0, 100 - (Number(config.lensHeight) || 20));
      updateScannerUi();

      if (state.detectedCode) {
        setTaskResult('Сканер поймал шифр. Теперь введите его ниже.', 'info');
      }

      event.preventDefault();
    });

    lens.addEventListener('pointerup', finishDrag);
    lens.addEventListener('pointercancel', finishDrag);
  }

  updateScannerUi();

  checkBtn.addEventListener('click', () => {
    if (!state.detectedCode) {
      setTaskResult('Сначала найдите код сканером.', 'bad');
      triggerHaptic('error');
      return;
    }

    const typed = normalizeCodeToken(state.input);
    const target = normalizeCodeToken(config.targetCode || config.revealText || '');
    if (typed && typed === target) {
      completeTask(point);
      setTaskResult(point.task.success || 'Шифр подтвержден.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      renderTask(point);
      triggerHaptic('success');
      return;
    }

    setTaskResult('Шифр введен неверно. Проверьте символы и дефисы.', 'bad');
    triggerHaptic('error');
  });

  const actions = document.createElement('div');
  actions.className = 'scanner-actions';
  actions.appendChild(input);
  actions.appendChild(checkBtn);
  wrap.appendChild(actions);

  taskOptionsNode.appendChild(wrap);
}

function getRotorAngles(point) {
  const existing = mapState.rotorAngles.get(point.id);
  if (existing) {
    return existing.slice();
  }

  const initial = (point.task.rotor?.rings || []).map((ring) => Number(ring.start) || 0);
  mapState.rotorAngles.set(point.id, initial.slice());
  return initial;
}

function setRotorAngles(point, values) {
  mapState.rotorAngles.set(point.id, values.slice());
}

function getRotorArcLengthMap(ring) {
  const segments = Number(ring.segments) || (ring.colors || []).length || 1;
  const colors = Array.from({ length: segments }, (_, index) => ring.colors?.[index] || 'transparent');
  const active = colors.map((color) => color && color !== 'transparent');
  const result = Array(segments).fill(0);
  const visited = Array(segments).fill(false);

  for (let index = 0; index < segments; index += 1) {
    if (!active[index] || visited[index]) {
      continue;
    }

    const members = [];
    let cursor = index;

    while (active[cursor] && !visited[cursor]) {
      visited[cursor] = true;
      members.push(cursor);
      cursor = (cursor + 1) % segments;
    }

    members.forEach((memberIndex) => {
      result[memberIndex] = members.length;
    });
  }

  return result;
}

function rotateRotorMap(values, offset) {
  const size = values.length || 1;
  const normalized = ((Number(offset) || 0) % size + size) % size;
  const rotated = Array(size).fill(0);

  values.forEach((value, index) => {
    rotated[(index + normalized) % size] = value;
  });

  return rotated;
}

function isRotorSolvedByArcSizes(point, angles) {
  const config = point.task.rotor || {};
  const rings = config.rings || [];
  const requiredSizes = config.solveByArcSizes || [];

  if (!requiredSizes.length || !rings.length) {
    return false;
  }

  const rotatedMaps = rings.map((ring, index) => rotateRotorMap(getRotorArcLengthMap(ring), angles[index]));
  const segmentCount = rotatedMaps[0]?.length || 0;

  return requiredSizes.every((requiredSize) => {
    let matches = 0;

    for (let index = 0; index < segmentCount; index += 1) {
      if (rotatedMaps.every((map) => map[index] === requiredSize)) {
        matches += 1;
      }
    }

    return matches === requiredSize;
  });
}

function isRotorSolved(point, angles = getRotorAngles(point)) {
  if (point.task.rotor?.solveByArcSizes?.length) {
    return isRotorSolvedByArcSizes(point, angles);
  }

  const rings = point.task.rotor?.rings || [];
  return rings.every((ring, index) => {
    const segments = Number(ring.segments) || 1;
    const normalized = ((Number(angles[index]) || 0) % segments + segments) % segments;
    const targets = Array.isArray(ring.targets) && ring.targets.length
      ? ring.targets
      : [ring.target];
    return targets.some((targetValue) => {
      const target = ((Number(targetValue) || 0) % segments + segments) % segments;
      return normalized === target;
    });
  });
}

function buildRotorGradient(colors = []) {
  const segments = colors.length || 1;
  const step = 360 / segments;
  return `conic-gradient(${colors.map((color, index) => `${color} ${index * step}deg ${(index + 1) * step}deg`).join(', ')})`;
}

function renderRotorTask(point) {
  const config = point.task.rotor || {};
  const rings = config.rings || [];
  const angles = getRotorAngles(point);
  const previewSolved = isRotorSolved(point, angles);
  let isSolved = mapState.solved.has(point.id);

  if (previewSolved && !isSolved) {
    completeTask(point);
    isSolved = true;
  }

  const wrap = document.createElement('div');
  wrap.className = 'rotor-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = config.note || 'Поверните кольца, пока фрагменты не встанут в цельный знак.';
  wrap.appendChild(note);

  const stage = document.createElement('div');
  stage.className = `rotor-stage${previewSolved ? ' is-solved' : ''}`;

  const sizes = [100, 74, 48];
  const thicknesses = [28, 24, 20];

  rings.forEach((ring, index) => {
    const ringNode = document.createElement('div');
    ringNode.className = 'rotor-ring';
    const ringSize = Number(ring.size) || sizes[index] || 44;
    const ringThickness = Number(ring.thickness) || thicknesses[index] || 18;
    ringNode.style.width = `${ringSize}%`;
    ringNode.style.height = `${ringSize}%`;
    ringNode.style.setProperty('--ring-thickness', `${ringThickness}%`);
    ringNode.style.background = buildRotorGradient(ring.colors || []);
    ringNode.style.transform = `translate(-50%, -50%) rotate(${(Number(angles[index]) || 0) * (Number(ring.step) || (360 / (Number(ring.segments) || 1)))}deg)`;
    stage.appendChild(ringNode);
  });

  const core = document.createElement('div');
  core.className = 'rotor-core';
  stage.appendChild(core);

  if (previewSolved) {
    const badge = document.createElement('div');
    badge.className = 'rotor-stage-badge';
    badge.textContent = 'Собрано';
    stage.appendChild(badge);
  }

  wrap.appendChild(stage);

  const controls = document.createElement('div');
  controls.className = 'rotor-controls';

  rings.forEach((ring, index) => {
    const control = document.createElement('div');
    control.className = 'rotor-control';

    const label = document.createElement('span');
    label.className = 'rotor-control-label';
    label.textContent = ring.label || `Кольцо ${index + 1}`;
    control.appendChild(label);

    const leftBtn = document.createElement('button');
    leftBtn.type = 'button';
    leftBtn.className = 'rotor-btn';
    leftBtn.textContent = '⟲';
    leftBtn.disabled = isSolved;
    leftBtn.addEventListener('click', () => {
      const next = getRotorAngles(point);
      const total = Number(ring.segments) || 1;
      next[index] = (Number(next[index]) - 1 + total) % total;
      setRotorAngles(point, next);

      if (isRotorSolved(point, next)) {
        completeTask(point);
        setTaskResult(point.task.success || 'Рисунок собран.', 'ok');
        setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      }

      renderTask(point);
      triggerHaptic('light');
    });

    const rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'rotor-btn';
    rightBtn.textContent = '⟳';
    rightBtn.disabled = isSolved;
    rightBtn.addEventListener('click', () => {
      const next = getRotorAngles(point);
      const total = Number(ring.segments) || 1;
      next[index] = (Number(next[index]) + 1) % total;
      setRotorAngles(point, next);

      if (isRotorSolved(point, next)) {
        completeTask(point);
        setTaskResult(point.task.success || 'Рисунок собран.', 'ok');
        setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      }

      renderTask(point);
      triggerHaptic('light');
    });

    control.appendChild(leftBtn);
    control.appendChild(rightBtn);
    controls.appendChild(control);
  });

  wrap.appendChild(controls);
  taskOptionsNode.appendChild(wrap);
}

function getDecoderOffset(point) {
  if (mapState.decoderOffsets.has(point.id)) {
    return Number(mapState.decoderOffsets.get(point.id)) || 0;
  }

  const initial = Number(point.task.decoder?.startOffset) || 0;
  mapState.decoderOffsets.set(point.id, initial);
  return initial;
}

function getDecoderInputs(point) {
  const existing = mapState.decoderInputs.get(point.id);
  if (existing) {
    return { ...existing };
  }

  const initial = {};
  (point.task.decoder?.cards || []).forEach((card) => {
    initial[card.id] = '';
  });
  mapState.decoderInputs.set(point.id, { ...initial });
  return { ...initial };
}

function setDecoderInputs(point, nextInputs) {
  mapState.decoderInputs.set(point.id, { ...nextInputs });
}

function getDecoderClues(point) {
  const existing = mapState.decoderClues.get(point.id);
  if (existing) {
    return { ...existing };
  }

  const initial = {};
  (point.task.decoder?.scene?.clues || []).forEach((clue) => {
    initial[clue.id] = false;
  });
  mapState.decoderClues.set(point.id, { ...initial });
  return { ...initial };
}

function setDecoderClues(point, nextClues) {
  mapState.decoderClues.set(point.id, { ...nextClues });
}

function decoderValueFor(symbolConfig, offset) {
  return ((Number(symbolConfig.baseValue) || 0) + (Number(offset) || 0)) % 10;
}

function createDecoderMiniWheel(baseValue, currentValue) {
  const wheel = document.createElement('div');
  wheel.className = 'decoder-mini-wheel';

  const inner = document.createElement('div');
  inner.className = 'decoder-mini-wheel-inner';
  inner.textContent = String(currentValue);
  wheel.appendChild(inner);

  for (let value = 0; value < 10; value += 1) {
    const digit = document.createElement('span');
    digit.className = 'decoder-mini-wheel-digit';
    digit.textContent = String(value);
    const angle = (360 / 10) * value - 90;
    digit.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(0, -34px) rotate(${-angle}deg)`;
    if (value === Number(baseValue)) {
      digit.classList.add('is-base');
    }
    if (value === Number(currentValue)) {
      digit.classList.add('is-active');
    }
    wheel.appendChild(digit);
  }

  return wheel;
}

function renderDecoderTask(point) {
  const config = point.task.decoder || {};
  const symbols = config.symbols || [];
  const cards = config.cards || [];
  const sceneConfig = config.scene || {};
  const clues = sceneConfig.clues || [];
  const useSymbolDisks = config.dialMode === 'symbol-disks';
  const isSolved = mapState.solved.has(point.id);
  const offset = getDecoderOffset(point);
  const inputs = getDecoderInputs(point);
  const foundClues = getDecoderClues(point);
  const foundCount = clues.filter((clue) => foundClues[clue.id]).length;
  const allCluesFound = isSolved || !clues.length || foundCount === clues.length;

  const wrap = document.createElement('div');
  wrap.className = 'decoder-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = clues.length
    ? (useSymbolDisks
      ? '1. Найдите на изображении все активные метки. 2. Выберите общий сдвиг. 3. У каждого знака ниже свой мини-диск: он покажет, во что превратилось число.'
      : '1. Найдите на изображении все активные метки. 2. Каждая метка откроет базовое значение своего знака. 3. Потом крутите диск и вводите новые числа.')
    : '1. Поверните диск. 2. Смотрите число напротив того же символа. 3. Введите его в поле этой строки.';
  wrap.appendChild(note);

  if (config.shiftHint) {
    const shiftRiddle = document.createElement('div');
    shiftRiddle.className = 'decoder-shift-riddle';
    shiftRiddle.innerHTML = `<span class="decoder-shift-riddle-label">Подсказка на сдвиг</span><span>${config.shiftHint}</span>`;
    wrap.appendChild(shiftRiddle);
  }

  const steps = document.createElement('div');
  steps.className = 'decoder-steps';
  (clues.length
    ? (useSymbolDisks ? ['Найдите метки', 'Выберите сдвиг', 'Введите код'] : ['Найдите метки', 'Поверните диск', 'Введите код'])
    : ['Крутите диск', 'Смотрите число', 'Вводите код'])
    .forEach((label, index) => {
    const item = document.createElement('div');
    item.className = 'decoder-step';
    item.innerHTML = `<span class="decoder-step-index">${index + 1}</span><span>${label}</span>`;
    steps.appendChild(item);
    });
  wrap.appendChild(steps);

  if (clues.length) {
    const sceneCard = document.createElement('div');
    sceneCard.className = 'decoder-scene-card';

    const sceneHead = document.createElement('p');
    sceneHead.className = 'decoder-head';
    sceneHead.textContent = 'Сцена с уликами';
    sceneCard.appendChild(sceneHead);

    const sceneLead = document.createElement('p');
    sceneLead.className = 'decoder-panel-lead';
    sceneLead.textContent = `Найдите и активируйте все метки на снимке: ${foundCount}/${clues.length}.`;
    sceneCard.appendChild(sceneLead);

    const scene = document.createElement('div');
    scene.className = 'decoder-scene';

    const sceneImage = document.createElement('img');
    sceneImage.className = 'decoder-scene-image';
    sceneImage.src = sceneConfig.image?.src || '';
    sceneImage.alt = sceneConfig.image?.alt || point.title;
    scene.appendChild(sceneImage);

    clues.forEach((clue, index) => {
      const found = isSolved || Boolean(foundClues[clue.id]);
      const hotspot = document.createElement('button');
      hotspot.type = 'button';
      hotspot.className = `decoder-scene-hotspot${found ? ' is-found' : ''}`;
      hotspot.disabled = isSolved || found;
      hotspot.style.left = `${Number(clue.x) || 50}%`;
      hotspot.style.top = `${Number(clue.y) || 50}%`;
      hotspot.style.width = `${Number(clue.width) || 14}%`;
      hotspot.style.height = `${Number(clue.height) || 14}%`;
      hotspot.setAttribute('aria-label', clue.title || `Метка ${index + 1}`);
      hotspot.title = found ? (clue.revealText || clue.title || `Метка ${index + 1}`) : (clue.title || `Метка ${index + 1}`);
      hotspot.innerHTML = found
        ? `<span class="decoder-scene-hotspot-mark">${clue.glyph || index + 1}</span>`
        : '<span class="decoder-scene-hotspot-mark">+</span>';
      hotspot.addEventListener('click', () => {
        const nextClues = getDecoderClues(point);
        nextClues[clue.id] = true;
        setDecoderClues(point, nextClues);
        renderTask(point);
        setTaskResult(clue.revealText || 'Подсказка активирована.', 'info');
        triggerHaptic('light');
      });
      scene.appendChild(hotspot);
    });

    sceneCard.appendChild(scene);

    const clueStrip = document.createElement('div');
    clueStrip.className = 'decoder-clue-strip';
    clues.forEach((clue, index) => {
      const found = isSolved || Boolean(foundClues[clue.id]);
      const pill = document.createElement('div');
      pill.className = `decoder-clue-pill${found ? ' is-found' : ''}`;
      pill.innerHTML = found
        ? `<span class="decoder-clue-pill-glyph">${clue.glyph}</span><span>${clue.revealText}</span>`
        : `<span class="decoder-clue-pill-index">${index + 1}</span><span>Подсказка еще не активирована</span>`;
      clueStrip.appendChild(pill);
    });
    sceneCard.appendChild(clueStrip);
    wrap.appendChild(sceneCard);
  }

  const layout = document.createElement('div');
  layout.className = 'decoder-layout';

  const dial = document.createElement('div');
  dial.className = 'decoder-dial-card';

  const dialTitle = document.createElement('p');
  dialTitle.className = 'decoder-head';
  dialTitle.textContent = useSymbolDisks ? 'Общий сдвиг' : 'Диск сдвига';
  dial.appendChild(dialTitle);

  if (useSymbolDisks) {
    const dialLead = document.createElement('p');
    dialLead.className = 'decoder-panel-lead';
    dialLead.textContent = 'Выберите число сдвига. Все три мини-диска ниже повернутся вместе.';
    dial.appendChild(dialLead);

    const rail = document.createElement('div');
    rail.className = 'decoder-offset-rail';
    for (let value = 0; value < 10; value += 1) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `decoder-offset-chip${value === offset ? ' is-active' : ''}`;
      chip.textContent = String(value);
      chip.disabled = isSolved;
      chip.addEventListener('click', () => {
        mapState.decoderOffsets.set(point.id, value);
        renderTask(point);
        triggerHaptic('light');
      });
      rail.appendChild(chip);
    }
    dial.appendChild(rail);
  } else {
    const dialWheel = document.createElement('div');
    dialWheel.className = 'decoder-wheel';
    const wheelPointer = document.createElement('span');
    wheelPointer.className = 'decoder-wheel-pointer';
    dialWheel.appendChild(wheelPointer);
    const wheelInner = document.createElement('div');
    wheelInner.className = 'decoder-wheel-inner';
    wheelInner.textContent = String(offset);
    dialWheel.appendChild(wheelInner);

    for (let value = 0; value < 10; value += 1) {
      const digit = document.createElement('span');
      digit.className = 'decoder-wheel-digit';
      digit.textContent = String(value);
      const angle = (360 / 10) * value - 90;
      digit.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(0, -74px) rotate(${-angle}deg)`;
      if (value === offset) {
        digit.classList.add('is-active');
      }
      dialWheel.appendChild(digit);
    }

    dial.appendChild(dialWheel);
  }

  const dialActions = document.createElement('div');
  dialActions.className = 'decoder-dial-actions';

  const leftBtn = document.createElement('button');
  leftBtn.type = 'button';
  leftBtn.className = 'decoder-btn';
  leftBtn.textContent = '−';
  leftBtn.disabled = isSolved;
  leftBtn.addEventListener('click', () => {
    const next = (getDecoderOffset(point) + 9) % 10;
    mapState.decoderOffsets.set(point.id, next);
    renderTask(point);
    triggerHaptic('light');
  });

  const rightBtn = document.createElement('button');
  rightBtn.type = 'button';
  rightBtn.className = 'decoder-btn';
  rightBtn.textContent = '+';
  rightBtn.disabled = isSolved;
  rightBtn.addEventListener('click', () => {
    const next = (getDecoderOffset(point) + 1) % 10;
    mapState.decoderOffsets.set(point.id, next);
    renderTask(point);
    triggerHaptic('light');
  });

  dialActions.appendChild(leftBtn);
  dialActions.appendChild(rightBtn);

  const dialHint = document.createElement('p');
  dialHint.className = 'decoder-shift-label';
  dialHint.textContent = useSymbolDisks ? `Текущий общий сдвиг: ${offset}` : `Текущий сдвиг: ${offset}`;
  dial.appendChild(dialHint);
  dial.appendChild(dialActions);
  layout.appendChild(dial);

  const panel = document.createElement('div');
  panel.className = 'decoder-panel';

  const panelHead = document.createElement('p');
  panelHead.className = 'decoder-head';
  panelHead.textContent = useSymbolDisks ? 'Символы и мини-диски' : 'Символы и значения';
  panel.appendChild(panelHead);

  const panelLead = document.createElement('p');
  panelLead.className = 'decoder-panel-lead';
  panelLead.textContent = allCluesFound
    ? (useSymbolDisks
      ? 'У каждого знака свой мини-диск: светлая метка показывает базовое число, яркая — текущее после сдвига. Затем введите ответ.'
      : 'В каждой карточке показан знак, число до сдвига и число после сдвига. Затем введите свой ответ.')
    : 'Сначала найдите все метки на изображении. После этого здесь откроются значения знаков.';
  panel.appendChild(panelLead);

  const cardsWrap = document.createElement('div');
  cardsWrap.className = 'decoder-cards';
  cards.forEach((card) => {
    const symbolConfig = symbols.find((item) => item.glyph === card.glyph) || null;
    const clue = clues.find((item) => item.glyph === card.glyph) || null;
    const clueFound = isSolved || !clues.length || !clue || Boolean(foundClues[clue.id]);
    const currentValue = clueFound && symbolConfig ? decoderValueFor(symbolConfig, offset) : '?';
    const baseValue = clueFound && symbolConfig ? Number(symbolConfig.baseValue) : '?';

    const cardNode = document.createElement('div');
    cardNode.className = `decoder-card${useSymbolDisks ? ' is-symbol-disk' : ''}`;

    const glyph = document.createElement('span');
    glyph.className = 'decoder-card-glyph';
    glyph.textContent = card.glyph;
    cardNode.appendChild(glyph);

    const current = document.createElement('div');
    current.className = `decoder-card-current${clueFound ? '' : ' is-locked'}${useSymbolDisks ? ' is-symbol-disk' : ''}`;
    if (clueFound) {
      if (useSymbolDisks) {
        current.appendChild(createDecoderMiniWheel(baseValue, currentValue));
        const flow = document.createElement('div');
        flow.className = 'decoder-flow-row decoder-flow-row-compact';
        flow.innerHTML = `
          <span class="decoder-flow-chip decoder-flow-chip-base">${baseValue}</span>
          <span class="decoder-flow-arrow">→</span>
          <span class="decoder-flow-chip decoder-flow-chip-current">${currentValue}</span>
        `;
        current.appendChild(flow);
      } else {
        current.innerHTML = `
          <div class="decoder-flow-row">
            <span class="decoder-flow-chip decoder-flow-chip-base">${baseValue}</span>
            <span class="decoder-flow-arrow">→</span>
            <span class="decoder-flow-chip decoder-flow-chip-current">${currentValue}</span>
          </div>
        `;
      }
    } else {
      current.innerHTML = `
        <span class="decoder-card-current-label">Подсказка</span>
        <span class="decoder-card-current-locked">Найдите метку на снимке</span>
      `;
    }
    cardNode.appendChild(current);

    const arrow = document.createElement('span');
    arrow.className = 'decoder-card-arrow';
    arrow.textContent = '→';
    cardNode.appendChild(arrow);

    const inputWrap = document.createElement('label');
    inputWrap.className = 'decoder-card-entry';

    const inputLabel = document.createElement('span');
    inputLabel.className = 'decoder-card-entry-label';
    inputLabel.textContent = 'Ответ';
    inputWrap.appendChild(inputLabel);

    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.maxLength = 2;
    input.className = 'decoder-card-input';
    input.value = inputs[card.id] || '';
    input.disabled = isSolved || !clueFound;
    input.placeholder = clueFound ? 'Введите число' : 'Сначала метка';
    input.addEventListener('input', () => {
      const nextInputs = getDecoderInputs(point);
      nextInputs[card.id] = input.value.replace(/\D+/g, '').slice(0, 2);
      setDecoderInputs(point, nextInputs);
    });
    inputWrap.appendChild(input);
    cardNode.appendChild(inputWrap);

    cardsWrap.appendChild(cardNode);
  });
  panel.appendChild(cardsWrap);

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'decoder-confirm';
  checkBtn.textContent = isSolved ? 'Код подтвержден' : 'Проверить числа';
  checkBtn.disabled = isSolved;
  checkBtn.addEventListener('click', () => {
    if (!allCluesFound) {
      setTaskResult('Сначала активируйте все подсказки на снимке.', 'info');
      triggerHaptic('error');
      return;
    }

    const typed = getDecoderInputs(point);
    const offsetOk = getDecoderOffset(point) === (Number(config.correctOffset) || 0);
    const numbersOk = cards.every((card) => String(card.answer) === String(typed[card.id] || '').trim());

    if (offsetOk && numbersOk) {
      completeTask(point);
      setTaskResult(point.task.success || 'Числа совпали.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      renderTask(point);
      triggerHaptic('success');
      return;
    }

    setTaskResult('Пока не сходится. Проверьте положение диска и значения всех знаков.', 'bad');
    triggerHaptic('error');
  });
  panel.appendChild(checkBtn);

  layout.appendChild(panel);
  wrap.appendChild(layout);
  taskOptionsNode.appendChild(wrap);
}

const CHESS_FILES = 'abcdefgh';
const CHESS_GLYPHS = {
  wk: '♔',
  wq: '♕',
  wr: '♖',
  wb: '♗',
  wn: '♘',
  wp: '♙',
  bk: '♚',
  bq: '♛',
  br: '♜',
  bb: '♝',
  bn: '♞',
  bp: '♟'
};

function squareToCoords(square) {
  const file = CHESS_FILES.indexOf(String(square || '').charAt(0));
  const rank = Number(String(square || '').charAt(1));
  return {
    x: file,
    y: 8 - rank
  };
}

function coordsToSquare(x, y) {
  return `${CHESS_FILES[x]}${8 - y}`;
}

function isInsideChessBoard(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function cloneChessBoard(board = {}) {
  const copy = {};
  Object.keys(board).forEach((square) => {
    copy[square] = { ...board[square] };
  });
  return copy;
}

function buildChessBoard(pieces = []) {
  const board = {};
  pieces.forEach((piece) => {
    board[piece.square] = {
      type: piece.type,
      color: piece.color
    };
  });
  return board;
}

function createInitialChessState(point) {
  return {
    board: buildChessBoard(point.task.chess?.pieces || []),
    selectedSquare: '',
    sideToMove: point.task.chess?.sideToMove || 'w'
  };
}

function getChessState(point) {
  const existing = mapState.chessStates.get(point.id);
  if (existing) {
    return existing;
  }

  const initial = createInitialChessState(point);
  mapState.chessStates.set(point.id, initial);
  return initial;
}

function resetChessState(point) {
  mapState.chessStates.set(point.id, createInitialChessState(point));
}

function getChessPiece(board, square) {
  return board[square] || null;
}

function oppositeColor(color) {
  return color === 'w' ? 'b' : 'w';
}

function pushSlidingMoves(board, piece, x, y, directions, moves, attacksOnly = false) {
  directions.forEach(([dx, dy]) => {
    let nextX = x + dx;
    let nextY = y + dy;

    while (isInsideChessBoard(nextX, nextY)) {
      const nextSquare = coordsToSquare(nextX, nextY);
      const occupant = getChessPiece(board, nextSquare);

      if (!occupant) {
        if (!attacksOnly) {
          moves.push(nextSquare);
        }
        nextX += dx;
        nextY += dy;
        continue;
      }

      if (occupant.color !== piece.color) {
        moves.push(nextSquare);
      }
      break;
    }
  });
}

function generateChessPseudoMoves(board, square, piece, attacksOnly = false) {
  const { x, y } = squareToCoords(square);
  const moves = [];

  if (!isInsideChessBoard(x, y)) {
    return moves;
  }

  if (piece.type === 'p') {
    const direction = piece.color === 'w' ? -1 : 1;
    const startRank = piece.color === 'w' ? 6 : 1;
    const attackOffsets = [[-1, direction], [1, direction]];

    attackOffsets.forEach(([dx, dy]) => {
      const nextX = x + dx;
      const nextY = y + dy;
      if (!isInsideChessBoard(nextX, nextY)) {
        return;
      }

      const nextSquare = coordsToSquare(nextX, nextY);
      const occupant = getChessPiece(board, nextSquare);
      if (attacksOnly || (occupant && occupant.color !== piece.color)) {
        moves.push(nextSquare);
      }
    });

    if (attacksOnly) {
      return moves;
    }

    const oneStepY = y + direction;
    if (isInsideChessBoard(x, oneStepY)) {
      const oneStepSquare = coordsToSquare(x, oneStepY);
      if (!getChessPiece(board, oneStepSquare)) {
        moves.push(oneStepSquare);

        const twoStepY = y + direction * 2;
        if (y === startRank && isInsideChessBoard(x, twoStepY)) {
          const twoStepSquare = coordsToSquare(x, twoStepY);
          if (!getChessPiece(board, twoStepSquare)) {
            moves.push(twoStepSquare);
          }
        }
      }
    }

    return moves;
  }

  if (piece.type === 'n') {
    [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]].forEach(([dx, dy]) => {
      const nextX = x + dx;
      const nextY = y + dy;
      if (!isInsideChessBoard(nextX, nextY)) {
        return;
      }
      const nextSquare = coordsToSquare(nextX, nextY);
      const occupant = getChessPiece(board, nextSquare);
      if (!occupant || occupant.color !== piece.color) {
        moves.push(nextSquare);
      }
    });
    return moves;
  }

  if (piece.type === 'b') {
    pushSlidingMoves(board, piece, x, y, [[1, 1], [1, -1], [-1, 1], [-1, -1]], moves, attacksOnly);
    return moves;
  }

  if (piece.type === 'r') {
    pushSlidingMoves(board, piece, x, y, [[1, 0], [-1, 0], [0, 1], [0, -1]], moves, attacksOnly);
    return moves;
  }

  if (piece.type === 'q') {
    pushSlidingMoves(board, piece, x, y, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], moves, attacksOnly);
    return moves;
  }

  if (piece.type === 'k') {
    [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dx, dy]) => {
      const nextX = x + dx;
      const nextY = y + dy;
      if (!isInsideChessBoard(nextX, nextY)) {
        return;
      }
      const nextSquare = coordsToSquare(nextX, nextY);
      const occupant = getChessPiece(board, nextSquare);
      if (!occupant || occupant.color !== piece.color) {
        moves.push(nextSquare);
      }
    });
  }

  return moves;
}

function findKingSquare(board, color) {
  return Object.keys(board).find((square) => board[square]?.type === 'k' && board[square]?.color === color) || '';
}

function applyChessMove(board, from, to) {
  const next = cloneChessBoard(board);
  next[to] = { ...next[from] };
  delete next[from];
  return next;
}

function isSquareAttacked(board, square, byColor) {
  return Object.keys(board).some((fromSquare) => {
    const piece = board[fromSquare];
    if (!piece || piece.color !== byColor) {
      return false;
    }
    return generateChessPseudoMoves(board, fromSquare, piece, true).includes(square);
  });
}

function isKingInCheck(board, color) {
  const kingSquare = findKingSquare(board, color);
  if (!kingSquare) {
    return false;
  }
  return isSquareAttacked(board, kingSquare, oppositeColor(color));
}

function getLegalChessMovesForSquare(board, square) {
  const piece = getChessPiece(board, square);
  if (!piece) {
    return [];
  }

  return generateChessPseudoMoves(board, square, piece, false).filter((targetSquare) => {
    const nextBoard = applyChessMove(board, square, targetSquare);
    return !isKingInCheck(nextBoard, piece.color);
  });
}

function getAllLegalChessMoves(board, color) {
  const moves = [];
  Object.keys(board).forEach((square) => {
    const piece = board[square];
    if (!piece || piece.color !== color) {
      return;
    }

    getLegalChessMovesForSquare(board, square).forEach((targetSquare) => {
      moves.push({ from: square, to: targetSquare });
    });
  });
  return moves;
}

function isCheckmate(board, color) {
  return isKingInCheck(board, color) && getAllLegalChessMoves(board, color).length === 0;
}

function chessGlyph(piece) {
  return CHESS_GLYPHS[`${piece.color}${piece.type}`] || '';
}

function renderChessTask(point) {
  const chess = getChessState(point);
  const isSolved = mapState.solved.has(point.id);

  const wrap = document.createElement('div');
  wrap.className = 'chess-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = 'Белые играют светлыми фигурами, черные тёмными. Сначала выберите белую фигуру, затем клетку назначения.';
  wrap.appendChild(note);

  const legend = document.createElement('div');
  legend.className = 'chess-legend';

  [
    { color: 'white', glyph: CHESS_GLYPHS.wk, label: 'Белые' },
    { color: 'black', glyph: CHESS_GLYPHS.bk, label: 'Черные' }
  ].forEach((item) => {
    const legendItem = document.createElement('div');
    legendItem.className = 'chess-legend-item';

    const legendGlyph = document.createElement('span');
    legendGlyph.className = `chess-piece ${item.color} is-sample`;
    legendGlyph.textContent = item.glyph;
    legendGlyph.setAttribute('aria-hidden', 'true');

    const legendLabel = document.createElement('span');
    legendLabel.className = 'chess-legend-label';
    legendLabel.textContent = item.label;

    legendItem.appendChild(legendGlyph);
    legendItem.appendChild(legendLabel);
    legend.appendChild(legendItem);
  });

  wrap.appendChild(legend);

  const boardNode = document.createElement('div');
  boardNode.className = 'chess-board';

  const selectedSquare = chess.selectedSquare || '';
  const legalTargets = selectedSquare ? getLegalChessMovesForSquare(chess.board, selectedSquare) : [];

  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const square = coordsToSquare(x, y);
      const piece = getChessPiece(chess.board, square);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `chess-cell ${(x + y) % 2 === 0 ? 'light' : 'dark'}`;
      cell.disabled = isSolved;
      cell.dataset.square = square;

      if (selectedSquare === square) {
        cell.classList.add('is-selected');
      }

      if (legalTargets.includes(square)) {
        cell.classList.add('is-target');
      }

      if (piece) {
        const glyph = document.createElement('span');
        glyph.className = `chess-piece ${piece.color === 'w' ? 'white' : 'black'}`;
        glyph.textContent = chessGlyph(piece);
        cell.appendChild(glyph);
      }

      if (y === 7) {
        const fileLabel = document.createElement('span');
        fileLabel.className = 'chess-file';
        fileLabel.textContent = CHESS_FILES[x];
        cell.appendChild(fileLabel);
      }

      if (x === 0) {
        const rankLabel = document.createElement('span');
        rankLabel.className = 'chess-rank';
        rankLabel.textContent = String(8 - y);
        cell.appendChild(rankLabel);
      }

      cell.addEventListener('click', () => {
        const clickedPiece = getChessPiece(chess.board, square);

        if (!selectedSquare) {
          if (clickedPiece && clickedPiece.color === chess.sideToMove) {
            chess.selectedSquare = square;
            renderTask(point);
            triggerHaptic('light');
            return;
          }

          setTaskResult('Сначала выберите белую фигуру.', 'info');
          triggerHaptic('error');
          return;
        }

        if (selectedSquare === square) {
          chess.selectedSquare = '';
          renderTask(point);
          triggerHaptic('light');
          return;
        }

        const allowedMoves = getLegalChessMovesForSquare(chess.board, selectedSquare);
        if (allowedMoves.includes(square)) {
          const nextBoard = applyChessMove(chess.board, selectedSquare, square);
          chess.board = nextBoard;
          chess.selectedSquare = '';

          if (isCheckmate(nextBoard, oppositeColor(chess.sideToMove))) {
            completeTask(point);
            setTaskResult(point.task.success || 'Мат поставлен.', 'ok');
            setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
            renderTask(point);
            triggerHaptic('success');
            return;
          }

          resetChessState(point);
          renderTask(point);
          setTaskResult('Ход легальный, но мгновенной победы нет. Позиция сброшена.', 'bad');
          triggerHaptic('error');
          return;
        }

        if (clickedPiece && clickedPiece.color === chess.sideToMove) {
          chess.selectedSquare = square;
          renderTask(point);
          triggerHaptic('light');
          return;
        }

        setTaskResult('Такой ход сейчас не проходит.', 'bad');
        triggerHaptic('error');
      });

      boardNode.appendChild(cell);
    }
  }

  wrap.appendChild(boardNode);

  const actions = document.createElement('div');
  actions.className = 'chess-actions';

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'chess-reset';
  resetBtn.textContent = 'Сбросить позицию';
  resetBtn.disabled = isSolved;
  resetBtn.addEventListener('click', () => {
    resetChessState(point);
    renderTask(point);
    setTaskResult('Позиция сброшена.', 'info');
    triggerHaptic('light');
  });

  actions.appendChild(resetBtn);
  wrap.appendChild(actions);
  taskOptionsNode.appendChild(wrap);
}

function cityPoiMarkerStyle(poi, isVisited) {
  if (isVisited) {
    return {
      radius: 9,
      color: '#ffffff',
      weight: 2,
      fillColor: poi.color || '#4f85bd',
      fillOpacity: 0.95
    };
  }

  return {
    radius: 8,
    color: poi.color || '#4f85bd',
    weight: 2,
    fillColor: '#ffffff',
    fillOpacity: 0.86
  };
}

function refreshCityPoiMarkers(point) {
  const config = point.task.cityMap || {};
  const pois = config.pois || [];
  const visitedSet = getCityVisitSet(point.id);

  mapState.cityPoiMarkers.forEach((marker, poiId) => {
    const poi = pois.find((item) => item.id === poiId);
    if (!poi) {
      return;
    }
    marker.setStyle(cityPoiMarkerStyle(poi, visitedSet.has(poiId)));
  });
}

function visitCityPoi(point, poi) {
  const visitedSet = getCityVisitSet(point.id);
  const wasVisited = visitedSet.has(poi.id);

  if (!wasVisited) {
    visitedSet.add(poi.id);
  }

  mapState.cityHints.set(point.id, poi.hint || `Отмечена точка: ${poi.title}.`);
  refreshCityPoiMarkers(point);
  renderTask(point);

  if (!wasVisited) {
    void postTeamEvent('city-poi', point.id, { poiId: poi.id });
  }

  return !wasVisited;
}

function activateCityOverlay(point) {
  const config = point.task.cityMap || {};
  if (!mapState.map || mapState.fallbackVisible) {
    return;
  }

  destroyCityTaskMap();
  cardMap.classList.add('city-focus');

  const layer = window.L.layerGroup().addTo(mapState.map);
  mapState.cityOverlayLayer = layer;
  mapState.cityOverlayPointId = point.id;
  refreshMarkers();

  const visitedSet = getCityVisitSet(point.id);
  const pois = config.pois || [];

  pois.forEach((poi) => {
    const marker = window.L.circleMarker([poi.lat, poi.lng], cityPoiMarkerStyle(poi, visitedSet.has(poi.id)));
    marker.addTo(layer);
    marker.bindTooltip(poi.title, {
      className: 'leaflet-label',
      direction: 'top',
      offset: [0, -8],
      permanent: true
    });

    marker.on('click', () => {
      if (visitCityPoi(point, poi)) {
        triggerHaptic('light');
      }
    });

    mapState.cityPoiMarkers.set(poi.id, marker);
  });

  const center = config.center || [point.lat, point.lng];
  const zoom = Number(config.zoom) || 14;
  mapState.map.setMinZoom(Number(config.minZoom) || 12);
  mapState.map.setMaxZoom(Number(config.maxZoom) || 19);
  mapState.map.flyTo(center, zoom, {
    animate: true,
    duration: 0.8
  });
}

function updateCityMapTaskStatus(point, progressNode, statusNode, listNode) {
  const config = point.task.cityMap || {};
  const pois = config.pois || [];
  const visitedSet = getCityVisitSet(point.id);
  const progressLabel = config.progressLabel || 'Отмечено точек';
  const completeText = config.completeText || 'Все точки города отмечены.';

  progressNode.textContent = `${progressLabel}: ${visitedSet.size}/${pois.length}`;

  listNode.querySelectorAll('[data-poi-id]').forEach((itemNode) => {
    const poiId = itemNode.dataset.poiId;
    const isVisited = visitedSet.has(poiId);
    itemNode.classList.toggle('is-visited', isVisited);
  });

  if (pois.length > 0 && visitedSet.size >= pois.length) {
    statusNode.textContent = completeText;
    statusNode.classList.add('is-complete');
    setTaskResult(completeText, 'info');
    return;
  }

  statusNode.classList.remove('is-complete');
  statusNode.textContent = mapState.cityHints.get(point.id) || 'Нажмите на метку на карте или кнопку в списке.';
}

function createPoiDisclosure(titleText = 'Локации города', leadText = '') {
  const details = document.createElement('details');
  details.className = 'city-poi-disclosure';
  details.open = true;

  const summary = document.createElement('summary');
  summary.className = 'city-poi-summary';
  summary.textContent = titleText;
  details.appendChild(summary);

  const body = document.createElement('div');
  body.className = 'city-poi-disclosure-body';

  const trimmedLead = String(leadText || '').trim();
  if (trimmedLead) {
    const lead = document.createElement('p');
    lead.className = 'task-mini-note city-poi-note';
    lead.textContent = trimmedLead;
    body.appendChild(lead);
  }

  details.appendChild(body);

  return {
    details,
    body
  };
}

function renderCityMapTask(point) {
  const config = point.task.cityMap || {};
  const pois = config.pois || [];
  const useInteractiveMap = Boolean(mapState.map) && !mapState.fallbackVisible;

  if (useInteractiveMap && mapState.cityOverlayPointId !== point.id) {
    activateCityOverlay(point);
  }

  const wrap = document.createElement('div');
  wrap.className = 'city-task-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = useInteractiveMap
    ? (config.note || 'Карта города открыта сверху: перемещайтесь и отмечайте точки.')
    : 'Основная карта недоступна: отмечайте точки списком ниже.';
  wrap.appendChild(note);

  const progressNode = document.createElement('p');
  progressNode.className = 'city-task-progress';
  wrap.appendChild(progressNode);

  const statusNode = document.createElement('p');
  statusNode.className = 'city-task-status';
  wrap.appendChild(statusNode);

  const poiList = document.createElement('div');
  poiList.className = 'city-poi-list';

  pois.forEach((poi) => {
    const poiBtn = document.createElement('button');
    poiBtn.type = 'button';
    poiBtn.className = 'city-poi-chip';
    poiBtn.dataset.poiId = poi.id;
    poiBtn.textContent = poi.title;
    poiBtn.addEventListener('click', () => {
      if (!useInteractiveMap) {
        if (visitCityPoi(point, poi)) {
          triggerHaptic('light');
        }
        return;
      }

      if (!mapState.map || mapState.cityOverlayPointId !== point.id) {
        return;
      }

      const marker = mapState.cityPoiMarkers.get(poi.id);
      if (!marker) {
        return;
      }

      mapState.map.flyTo([poi.lat, poi.lng], Math.max(mapState.map.getZoom(), 15), {
        animate: true,
        duration: 0.45
      });
      marker.fire('click');
      triggerHaptic('light');
    });
    poiList.appendChild(poiBtn);
  });

  const disclosure = createPoiDisclosure('Список локаций', 'Список можно свернуть, если он мешает карте.');
  disclosure.body.appendChild(poiList);
  wrap.appendChild(disclosure.details);
  taskOptionsNode.appendChild(wrap);

  updateCityMapTaskStatus(point, progressNode, statusNode, poiList);
}

function renderTaskMedia(point) {
  const items = getTaskMediaItems(point);
  if (items.length === 0) {
    return;
  }
  const isTourAgentMedia = isTourAgentPointRuntime(point);

  const wrap = document.createElement('div');
  wrap.className = 'task-media';
  if (isTourAgentMedia) {
    wrap.classList.add('is-tour-agent');
  }

  const cleanupEmptyWrap = () => {
    if (!wrap.children.length) {
      wrap.remove();
    }
  };

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'task-media-card';
    if (isTourAgentMedia) {
      card.classList.add('is-tour-agent');
    }

    if (!isTourAgentMedia) {
      const title = document.createElement('p');
      title.className = 'task-media-title';
      title.textContent = item.title || 'Медиа';
      card.appendChild(title);
    }

    if (item.type === 'image') {
      const image = document.createElement('img');
      image.className = 'task-media-image';
      if (isTourAgentMedia) {
        image.classList.add('is-tour-agent');
      }
      image.src = item.src;
      image.alt = item.alt || item.title || 'Изображение';
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        card.remove();
        cleanupEmptyWrap();
      });
      card.appendChild(image);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.className = 'task-media-video';
      video.src = item.src;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.addEventListener('error', () => {
        card.remove();
        cleanupEmptyWrap();
      });
      card.appendChild(video);
    } else if (item.type === 'audio') {
      const audio = document.createElement('audio');
      audio.className = 'task-media-audio';
      audio.src = item.src;
      audio.controls = true;
      audio.preload = 'metadata';
      audio.addEventListener('error', () => {
        card.remove();
        cleanupEmptyWrap();
      });
      card.appendChild(audio);
    }

    wrap.appendChild(card);
  });

  if (wrap.children.length) {
    taskOptionsNode.appendChild(wrap);
  }
}

function normalizeAnagramWord(value = '') {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

function renderAnagramTask(point) {
  const config = point.task.anagram || {};
  const isSolved = mapState.solved.has(point.id);
  const wrap = document.createElement('div');
  wrap.className = 'anagram-wrap';

  const lead = document.createElement('p');
  lead.className = 'task-mini-note';
  lead.textContent = 'Соберите слово из подсказанных букв и введите его без пробелов.';
  wrap.appendChild(lead);

  const letters = document.createElement('div');
  letters.className = 'anagram-letters';
  (config.letters || []).forEach((letter) => {
    const chip = document.createElement('span');
    chip.className = 'anagram-chip';
    chip.textContent = letter;
    letters.appendChild(chip);
  });
  wrap.appendChild(letters);

  const input = document.createElement('input');
  input.className = 'anagram-input';
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.placeholder = config.placeholder || 'Введите слово';
  input.value = mapState.anagramInputs.get(point.id) || '';
  input.disabled = isSolved;
  input.addEventListener('input', (event) => {
    mapState.anagramInputs.set(point.id, event.target.value);
  });
  wrap.appendChild(input);

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'anagram-confirm';
  checkBtn.textContent = isSolved ? 'Слово подтверждено' : 'Проверить слово';
  checkBtn.disabled = isSolved;
  checkBtn.addEventListener('click', () => {
    const typed = normalizeAnagramWord(input.value);
    const target = normalizeAnagramWord(config.targetWord || '');

    if (typed && typed === target) {
      mapState.anagramInputs.set(point.id, target);
      completeTask(point);
      setTaskResult(point.task.success || 'Слово собрано.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
      renderTask(point);
      return;
    }

    setTaskResult('Слово пока не сходится. Проверьте буквы и порядок.', 'bad');
    triggerHaptic('error');
  });
  wrap.appendChild(checkBtn);

  taskOptionsNode.appendChild(wrap);
}

function appendCityPointList(container, point, leadText = '') {
  const cityPoints = getImageCityPoints(point).filter((cityPoint) => isPointVisible(cityPoint));
  if (!cityPoints.length) {
    return false;
  }

  const disclosure = createPoiDisclosure('Список локаций', leadText);

  const pointList = document.createElement('div');
  pointList.className = 'city-poi-list';

  cityPoints.forEach((cityPoint) => {
    const cityPointLocked = isPointLocked(cityPoint);
    const pointBtn = document.createElement('button');
    pointBtn.type = 'button';
    pointBtn.className = 'city-poi-chip';
    pointBtn.textContent = cityPoint.title;
    pointBtn.classList.toggle('is-locked', cityPointLocked);
    pointBtn.title = cityPointLocked ? getPointLockHint(cityPoint) : cityPoint.title;

    if (mapState.solved.has(cityPoint.id)) {
      pointBtn.classList.add('is-visited');
    }

    pointBtn.addEventListener('click', () => {
      focusPoint(cityPoint);
      triggerHaptic('light');
    });

    pointList.appendChild(pointBtn);
  });

  disclosure.body.appendChild(pointList);
  container.appendChild(disclosure.details);
  return true;
}

function buildCityNarrativePanel(point, config) {
  const rawText = String(
    config?.sidebarText
      || point.task?.lore
      || point.text
      || ''
  ).trim();

  if (!rawText) {
    return null;
  }

  const panel = document.createElement('div');
  panel.className = 'city-image-copy';

  const titleText = String(config?.sidebarTitle || point.title || '').trim();
  if (titleText) {
    const panelTitle = document.createElement('p');
    panelTitle.className = 'city-image-copy-title';
    panelTitle.textContent = titleText;
    panel.appendChild(panelTitle);
  }

  rawText
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .forEach((chunk) => {
      const paragraph = document.createElement('p');
      paragraph.className = 'city-image-copy-text';
      paragraph.textContent = chunk;
      panel.appendChild(paragraph);
    });

  return panel;
}

function renderCityImageTask(point) {
  const config = getPointInlineCityImageMap(point);
  if (!config) {
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'city-image-wrap';

  const title = document.createElement('p');
  title.className = 'city-image-title';
  title.textContent = config.title || `Карта ${point.title}`;
  wrap.appendChild(title);

  const isOpenedInMainMap = scenarioState.routeMapMode === 'image'
    && mapState.imageCityPointId === point.id
    && Boolean(config.src);

  if (config.note) {
    const note = document.createElement('p');
    note.className = 'city-image-note';
    note.textContent = isOpenedInMainMap
      ? 'Карта города открыта слева. Здесь останется только логика и загадки по этой локации.'
      : config.note;
    wrap.appendChild(note);
  }

  if (isOpenedInMainMap) {
    appendCityPointList(wrap, point, 'Выберите точку на карте города или кнопку ниже.');

    taskOptionsNode.appendChild(wrap);
    return;
  }

  if (config.src) {
    const frame = document.createElement('div');
    frame.className = 'city-image-frame';

    const image = document.createElement('img');
    image.className = 'city-image-map';
    image.src = config.src;
    image.alt = config.alt || config.title || `Карта ${point.title}`;
    image.loading = 'lazy';
    frame.appendChild(image);
    wrap.appendChild(frame);
  } else {
    const textLayout = document.createElement('div');
    textLayout.className = 'city-image-text-layout';

    const pointPanel = document.createElement('div');
    pointPanel.className = 'city-image-panel';

    const hasPointList = appendCityPointList(pointPanel, point, 'Откройте нужную сцену из списка.');
    if (!hasPointList) {
      const placeholder = document.createElement('p');
      placeholder.className = 'city-image-copy-text';
      placeholder.textContent = 'Для этого города пока не добавлены отдельные точки маршрута.';
      pointPanel.appendChild(placeholder);
    }

    textLayout.appendChild(pointPanel);

    const narrativePanel = buildCityNarrativePanel(point, config);
    if (narrativePanel) {
      textLayout.appendChild(narrativePanel);
    } else {
      const fallbackPanel = document.createElement('div');
      fallbackPanel.className = 'city-image-copy';

      const fallbackText = document.createElement('p');
      fallbackText.className = 'city-image-copy-text';
      fallbackText.textContent = 'Для этого города используем текстовый режим вместо карты.';
      fallbackPanel.appendChild(fallbackText);

      textLayout.appendChild(fallbackPanel);
    }

    wrap.appendChild(textLayout);
  }

  taskOptionsNode.appendChild(wrap);
}

function renderReturnToCityButton(point) {
  const parentId = String(point.parentCityId || '').trim();
  if (!parentId) {
    return;
  }

  if (scenarioState.routeMapMode !== 'image' || String(mapState.imageCityPointId || '').trim() !== parentId) {
    return;
  }

  const parentPoint = pointsById.get(parentId);
  if (!parentPoint) {
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'task-inline-actions';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'city-poi-chip task-back-chip';
  button.textContent = 'Назад к точкам города';
  button.addEventListener('click', () => {
    state.selectedPointId = parentPoint.id;
    mapState.pendingFocusPointId = null;
    setTaskResult('');
    setTaskAnswer('');

    if (scenarioState.routeMapMode === 'image' && getPointInlineCityImageMap(parentPoint)?.src) {
      initImageRouteMap(parentPoint);
    }

    updateBadge();
    refreshMarkers();
    setCityMode(true);
    renderTask(parentPoint);
    triggerHaptic('light');
  });
  wrap.appendChild(button);

  taskOptionsNode.appendChild(wrap);
}

function renderTask(point) {
  const taskKind = ensureTaskCompatibility(point);
  const isTourAgentTask = Boolean(point.parentCityId && isTourAgentPointRuntime(point));
  if (isTourAgentTask) {
    const parentPoint = pointsById.get(point.parentCityId);
    if (parentPoint) {
      const parentConfig = getPointInlineCityImageMap(parentPoint);
      const parentRawPoints = Array.isArray(parentConfig?.points) ? parentConfig.points : [];
      applyTourAgentGuidance(point.task, parentPoint, parentRawPoints, String(point.localId || '').trim().toLowerCase());
    }
  }
  const kickerText = String(point.task.kicker || point.parentCityTitle || '').trim();
  const titleText = String(point.task.title || point.title || '').trim();

  taskKickerNode.textContent = kickerText;
  taskKickerNode.hidden = !kickerText;
  taskTitleNode.textContent = titleText;
  taskTitleNode.hidden = !titleText;
  const loreText = isTourAgentTask ? '' : (point.task.lore || point.task.text || '');
  const questionText = isTourAgentTask ? '' : (point.task.question || point.task.prompt || '');
  setTaskLore(loreText, { pointId: point.id, skipIfSame: true });
  setTaskQuestion(questionText, { pointId: point.id, skipIfSame: true });
  taskOptionsNode.innerHTML = '';
  setTaskResult('');
  setTaskAnswer('');

  if (taskKind === 'empty') {
    if (isTourAgentTask) {
      renderTaskMedia(point);
      return;
    }

    const infoText = String(point.task.info || point.task.reward || '').trim();
    if (infoText) {
      setTaskResult(infoText, 'info');
    }
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    if (point.task.cityMap) {
      renderCityMapTask(point);
    }
    setTaskAnswer('');
    return;
  }

  if (taskKind === 'slider') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderSliderBoard(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'caesar') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderCaesarTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'match') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderMatchTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'hotspot') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderHotspotTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'scanner') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderScannerTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'rotor') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderRotorTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'decoder') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderDecoderTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'anagram') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderAnagramTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  if (taskKind === 'chess') {
    renderCityImageTask(point);
    renderReturnToCityButton(point);
    renderTaskMedia(point);
    renderChessTask(point);
    if (mapState.solved.has(point.id)) {
      showSolvedTaskState(point);
    }
    return;
  }

  renderCityImageTask(point);
  renderReturnToCityButton(point);
  renderTaskMedia(point);
  const options = Array.isArray(point.task.options) ? point.task.options : [];
  if (!options.length) {
    const fallbackText = String(point.task.info || point.task.reward || '').trim() || 'Точка открыта и отмечена в досье.';
    setTaskResult(fallbackText, 'info');
    return;
  }
  const correctIndexes = getTaskCorrectIndexes(point.task);
  const solvedOutcome = getTaskOutcome(point.id);
  options.forEach((optionText, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'task-option';
    button.textContent = optionText;

    if (mapState.solved.has(point.id)) {
      button.disabled = true;
      button.classList.add('is-locked');
      if (Number.isInteger(solvedOutcome?.selectedIndex)) {
        if (index === solvedOutcome.selectedIndex) {
          button.classList.add('is-correct');
        }
      } else if (correctIndexes.includes(index)) {
        button.classList.add('is-correct');
      }
    }

    button.addEventListener('click', () => {
      checkTaskAnswer(point, index);
    });

    taskOptionsNode.appendChild(button);
  });

  if (mapState.solved.has(point.id)) {
    showSolvedTaskState(point);
  }
}

function focusPoint(point) {
  if (!mapState.map && !mapState.fallbackVisible) {
    return;
  }

  if (!state.teamReady) {
    openTeamGate('Сначала выберите команду, затем начинайте маршрут.');
    return;
  }

  destroyCityTaskMap();
  setActiveView('map');
  state.selectedPointId = point.id;

  if (isPointLocked(point)) {
    updateBadge();
    refreshMarkers();
    renderLockedPointState(point);
    setCityMode(true);
    triggerHaptic('error');
    return;
  }

  const visitMeta = markPointVisited(point);

  const isImageCitySubpoint = Boolean(point.parentCityId);
  const isInsideMatchingImageCity = scenarioState.routeMapMode === 'image'
    && isImageCitySubpoint
    && String(mapState.imageCityPointId || '').trim() === String(point.parentCityId || '').trim();

  if (isInsideMatchingImageCity) {
    const imageLatLng = getImageMapLatLngFromPosition(point.mapPosition);
    if (imageLatLng && mapState.map) {
      mapState.map.flyTo(imageLatLng, mapState.map.getZoom(), {
        animate: true,
        duration: 0.35,
        easeLinearity: 0.2
      });
    }

    finalizePointFocus(point, {
      source: 'image-city-point',
      parentCityId: point.parentCityId || ''
    }, visitMeta);
    return;
  }

  const hasCityMap = Boolean(point.task.cityMap);
  const canUseLeafletGeoMap = Boolean(mapState.map) && !mapState.fallbackVisible && scenarioState.routeMapMode !== 'image';
  const cityImageMap = getPointInlineCityImageMap(point);
  const canUseRouteImageCityMap = scenarioState.routeMapMode === 'image' && Boolean(cityImageMap?.src);
  const isInsideImageCityMap = scenarioState.routeMapMode === 'image' && Boolean(mapState.imageCityPointId);

  if (hasCityMap && canUseLeafletGeoMap) {
    activateCityOverlay(point);
  } else if (canUseRouteImageCityMap) {
    initImageRouteMap(point);
  } else if (isInsideImageCityMap) {
    mapState.pendingFocusPointId = point.id;
    initImageRouteMap();
  } else if (mapState.map) {
    if (scenarioState.routeMapMode === 'image') {
      const imageLatLng = getPointImageMapLatLng(point.id);
      if (imageLatLng) {
        const nextZoom = Math.max(mapState.imageBaseZoom + 1.1, mapState.map.getZoom());
        mapState.map.flyTo(imageLatLng, nextZoom, {
          animate: true,
          duration: 1.05,
          easeLinearity: 0.2
        });
      }
    } else {
      mapState.map.flyTo([point.lat, point.lng], point.zoom, {
        animate: true,
        duration: 1.05,
        easeLinearity: 0.2
      });

      mapState.map.once('moveend', () => {
        mapState.map.setView([point.lat, point.lng], point.zoom, { animate: false });
      });
    }
  }

  const marker = mapState.markers.get(point.id);
  if (marker) {
    marker.openTooltip();
  }

  finalizePointFocus(point, {
    source: hasCityMap && canUseLeafletGeoMap
      ? 'city-entry'
      : (canUseRouteImageCityMap ? 'image-city-entry' : 'point')
  }, visitMeta);
}

function closeCityMode() {
  destroyCityTaskMap();
  if (scenarioState.routeMapMode === 'image' && mapState.imageCityPointId) {
    initImageRouteMap();
  }
  state.selectedPointId = null;
  refreshMarkers();
  setCityMode(false);
  setTaskPlaceholder();
  updateMapButtonLabels();
}

function openTeamSwitcher() {
  if (state.teamName) {
    teamSelectNode.value = state.teamName;
  }
  openTeamGate('Смена команды сбросит только текущую сессию на этом телефоне.');
}

function resetMapView() {
  if (!mapState.map && !mapState.fallbackVisible) {
    return;
  }

  const isImageRouteMap = scenarioState.routeMapMode === 'image';
  const isImageCityMap = isImageRouteMap && Boolean(mapState.imageCityPointId);
  destroyCityTaskMap();

  if (isImageCityMap) {
    state.selectedPointId = null;
    mapState.imageCityPointId = null;
    mapState.pendingFocusPointId = null;
    setCityMode(false);
    setTaskPlaceholder();
    initImageRouteMap();
    return;
  }

  if (isImageRouteMap) {
    initImageRouteMap();
    return;
  }

  state.selectedPointId = null;

  refreshMarkers();

  if (!mapState.map) {
    setCityMode(false);
    setTaskPlaceholder();
    return;
  }

  if (mapState.bounds) {
    mapState.map.flyToBounds(mapState.bounds.pad(0.28), {
      animate: true,
      duration: 0.9,
      easeLinearity: 0.22
    });
  } else {
    mapState.map.flyTo([42.5, 12.5], 5, {
      animate: true,
      duration: 0.9,
      easeLinearity: 0.22
    });
  }

  setCityMode(false);
  setTaskPlaceholder();
}

function getBaseTileProviders(themeName = THEME_MODES.light) {
  const normalizedTheme = normalizeThemeName(themeName);
  const primaryUrl = normalizedTheme === THEME_MODES.dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
  const sharedOptions = {
    updateWhenIdle: true,
    keepBuffer: 2
  };

  return [
    {
      url: primaryUrl,
      options: { ...sharedOptions, subdomains: 'abcd', maxZoom: 20 }
    },
    {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: { ...sharedOptions, subdomains: 'abc', maxZoom: 19, detectRetina: true }
    },
    {
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      options: { ...sharedOptions, subdomains: 'abc', maxZoom: 19, detectRetina: true }
    }
  ];
}

function addBaseTileLayerWithFallback(map, themeName = THEME_MODES.light) {
  let providers = getBaseTileProviders(themeName);
  let providerIndex = -1;
  let activeLayer = null;
  let errorCount = 0;
  let successCount = 0;
  let fallbackTimer = null;

  const clearFallbackTimer = () => {
    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  };

  const switchProvider = () => {
    providerIndex += 1;
    clearFallbackTimer();

    if (activeLayer) {
      activeLayer.off('tileerror');
      activeLayer.off('tileload');
      map.removeLayer(activeLayer);
      activeLayer = null;
    }

    if (providerIndex >= providers.length) {
      showFallbackMap('Основная карта не загрузилась. Используйте резервную схему и нажимайте на точки.');
      setTaskResult('Подложка карты не загрузилась. Включена резервная схема карты.', 'info');
      return;
    }

    const current = providers[providerIndex];
    errorCount = 0;
    successCount = 0;
    activeLayer = window.L.tileLayer(current.url, current.options).addTo(map);
    fallbackTimer = window.setTimeout(() => {
      if (successCount === 0) {
        showFallbackMap('Фон карты тормозит или заблокирован. Пока можно работать по резервной схеме.');
      }
    }, 1800);

    activeLayer.on('tileload', () => {
      successCount += 1;
      clearFallbackTimer();
      if (successCount > 0) {
        hideFallbackMap();
      }
    });

    activeLayer.on('tileerror', () => {
      errorCount += 1;
      if (errorCount >= 6 && successCount === 0) {
        switchProvider();
      }
    });
  };

  switchProvider();

  return {
    refresh(nextTheme = THEME_MODES.light) {
      providers = getBaseTileProviders(nextTheme);
      providerIndex = -1;
      switchProvider();
    }
  };
}

function getImageMarkerStyle(point, options = {}) {
  const position = options.position || point?.mapPosition || null;
  const foregroundTone = options.foregroundTone || getForegroundToneForPosition(position, options.sampler);
  const palette = getMarkerPresentation(point, { foregroundTone });

  return {
    radius: palette.radius,
    color: palette.strokeColor,
    weight: palette.weight,
    fillColor: palette.fillColor,
    fillOpacity: 0.98,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
    className: palette.markerClassName
  };
}

function getLeafletLabelClassName(foregroundTone = 'light') {
  return 'leaflet-label leaflet-label--dark';
}

function buildRouteImageMap(imageUrl, width, height, options = {}) {
  worldMapNode && (worldMapNode.hidden = false);
  hideFallbackMap();
  mapAttribNode && (mapAttribNode.hidden = true);

  mapState.imageWidth = Number(width) || 1;
  mapState.imageHeight = Number(height) || 1;

  const map = window.L.map('worldMap', {
    crs: window.L.CRS.Simple,
    minZoom: -4.5,
    maxZoom: 4,
    zoomSnap: 0.1,
    zoomDelta: 0.25,
    zoomControl: false,
    attributionControl: false,
    worldCopyJump: false,
    maxBoundsViscosity: 1,
    bounceAtZoomLimits: false,
    preferCanvas: true
  });

  window.L.control.zoom({ position: 'topright' }).addTo(map);

  const bounds = window.L.latLngBounds([0, 0], [mapState.imageHeight, mapState.imageWidth]);
  const overlay = window.L.imageOverlay(imageUrl, bounds, {
    interactive: false,
    className: 'route-map-image'
  });

  overlay.once('error', () => {
    destroyWorldMap();
    showFallbackMap('Файл основной карты не загрузился. Пока можно работать по резервной схеме.');
    renderFallbackMap();
    setTaskResult('Не удалось загрузить основную карту маршрута. Включена резервная схема.', 'info');
  });

  overlay.addTo(map);

  mapState.map = map;
  mapState.tileController = null;
  mapState.bounds = bounds;
  mapState.imageCityPointId = String(options.cityPointId || '').trim() || null;

  const renderedPoints = Array.isArray(options.points) && options.points.length ? options.points : points;
  const isCityImageMap = Boolean(String(options.cityPointId || '').trim());

  map.fitBounds(bounds, {
    animate: false,
    padding: isCityImageMap ? [24, 24] : [0, 0]
  });
  mapState.imageBaseZoom = map.getZoom();
  map.setMinZoom(mapState.imageBaseZoom - (isCityImageMap ? 1.85 : 0.6));
  map.setMaxZoom(mapState.imageBaseZoom + 4);
  map.setMaxBounds(bounds);

  if (options.showPoints !== false) {
    renderedPoints.forEach((point) => {
      try {
        if (!isPointVisible(point)) {
          return;
        }

        const latLng = options.points
          ? getImageMapLatLngFromPosition(point.mapPosition)
          : getPointImageMapLatLng(point.id);
        if (!latLng) {
          return;
        }

        const contrastPosition = options.points
          ? point.mapPosition
          : (fallbackPointPositions[point.id] || null);
        const foregroundTone = getForegroundToneForPosition(
          contrastPosition,
          options.contrastSampler || mapState.imageContrastSampler
        );
        const localPointStyle = options.points
          ? getImageMarkerStyle(point, {
              position: point.mapPosition,
              sampler: options.contrastSampler || mapState.imageContrastSampler,
              foregroundTone
            })
          : markerStyle(point.id, {
              position: contrastPosition,
              foregroundTone
            });

        const marker = window.L.circleMarker(latLng, localPointStyle);
        marker.addTo(map);
        marker.bindTooltip(point.title, {
          className: getLeafletLabelClassName(foregroundTone),
          direction: 'top',
          offset: [0, -10],
          permanent: true
        });
        marker.on('click', () => {
          if (typeof options.onPointClick === 'function') {
            options.onPointClick(point);
          } else {
            focusPoint(point);
          }
          triggerHaptic('light');
        });
        if (!options.points) {
          mapState.markers.set(point.id, marker);
        }
      } catch (error) {
        console.warn('Route image marker render failed', point?.id || 'unknown_point', error);
      }
    });
  }

  const pendingFocusPointId = String(mapState.pendingFocusPointId || '').trim();
  if (options.showPoints !== false && pendingFocusPointId) {
    mapState.pendingFocusPointId = null;
    window.setTimeout(() => {
      const pendingPoint = pointsById.get(pendingFocusPointId);
      if (pendingPoint) {
        focusPoint(pendingPoint);
      }
    }, 80);
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 120);
}

function initImageRouteMap(point = null) {
  if (!window.L) {
    setTaskPlaceholder();
    showFallbackMap('Библиотека карты не загрузилась. Используйте резервную схему и нажимайте на точки.');
    setTaskResult('Карта не загрузилась. Включена резервная схема.', 'info');
    renderFallbackMap();
    return;
  }

  destroyWorldMap();

  const cityImage = point ? getPointInlineCityImageMap(point) : null;
  const useCityImage = Boolean(cityImage?.src);
  const cityPoints = useCityImage ? getImageCityPoints(point) : [];
  const imageUrl = useCityImage
    ? String(cityImage.src || '').trim()
    : (scenarioState.routeMapImageSrc || './assets/maps/team-map.png');
  const guardToken = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  mapState.imageGuardToken = guardToken;
  mapState.imageCityPointId = useCityImage ? point.id : null;

  const image = new window.Image();
  image.decoding = 'async';
  image.fetchPriority = 'high';
  image.onload = () => {
    try {
      mapState.imageContrastSampler = createImageContrastSampler(image);
      mapState.imageContrastSource = imageUrl;
      buildRouteImageMap(imageUrl, Number(image.naturalWidth) || 1, Number(image.naturalHeight) || 1, {
        showPoints: useCityImage ? cityPoints.length > 0 : true,
        cityPointId: useCityImage ? point.id : '',
        points: useCityImage ? cityPoints : null,
        contrastSampler: mapState.imageContrastSampler,
        onPointClick: useCityImage
          ? (cityPoint) => {
            focusPoint(cityPoint);
          }
        : null
      });

      window.setTimeout(() => {
        if (mapState.imageGuardToken !== guardToken || scenarioState.routeMapMode !== 'image' || mapState.fallbackVisible) {
          return;
        }

        const worldMapLooksEmpty = !useCityImage && mapState.markers.size === 0;
        const cityMapLooksBroken = useCityImage && cityPoints.length > 0 && !mapState.map;
        if (!mapState.map && !worldMapLooksEmpty && !cityMapLooksBroken) {
          return;
        }

        if (!mapState.map || worldMapLooksEmpty || cityMapLooksBroken) {
          console.warn('Image route map guard activated', {
            useCityImage,
            markerCount: mapState.markers.size,
            hasMap: Boolean(mapState.map),
            cityPointCount: cityPoints.length
          });
          destroyWorldMap();
          showFallbackMap('Основная карта не дорисовалась. Используйте резервную схему с точками.');
          setTaskResult('Основная карта открылась не полностью. Включена резервная схема.', 'info');
          renderFallbackMap();
        }
      }, useCityImage ? 1600 : 2600);
    } catch (error) {
      console.error('Image route map build failed', error);
      mapState.imageContrastSampler = null;
      mapState.imageContrastSource = '';

      if (useCityImage) {
        mapState.imageCityPointId = null;
        initImageRouteMap();
        setTaskResult('Карта города временно не открылась. Возвращаем общую карту.', 'info');
        return;
      }

      destroyWorldMap();
      showFallbackMap('Основная карта временно не открылась. Используйте резервную схему с точками.');
      setTaskResult('Основная карта не собралась в браузере. Включена резервная схема.', 'info');
      renderFallbackMap();
    }
  };
  image.onerror = () => {
    mapState.imageContrastSampler = null;
    mapState.imageContrastSource = '';
    if (useCityImage) {
      mapState.imageCityPointId = null;
      initImageRouteMap();
      setTaskResult('Карта города не загрузилась. Возвращаем основную карту.', 'info');
      return;
    }

    showFallbackMap('Файл основной карты не загрузился. Пока можно работать по резервной схеме.');
    setTaskResult('Не удалось загрузить основную карту маршрута. Включена резервная схема.', 'info');
    renderFallbackMap();
  };
  image.src = imageUrl;
}

function initMap() {
  destroyWorldMap();

  if (scenarioState.routeMapMode === 'image') {
    setTaskPlaceholder();
    initImageRouteMap();
    return;
  }

  if (!window.L) {
    setTaskPlaceholder();
    showFallbackMap('Библиотека карты не загрузилась. Используйте резервную схему и нажимайте на точки.');
    setTaskResult('Карта не загрузилась. Включена резервная схема.', 'info');
    renderFallbackMap();
    return;
  }

  worldMapNode && (worldMapNode.hidden = false);
  hideFallbackMap();
  mapState.map = window.L.map('worldMap', {
    zoomControl: false,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 19,
    worldCopyJump: false,
    preferCanvas: true
  });

  window.L.control.zoom({ position: 'topright' }).addTo(mapState.map);

  mapState.tileController = addBaseTileLayerWithFallback(mapState.map, getActiveTheme());

  mapState.map.setView([42.5, 12.5], 5);

  points.forEach((point) => {
    if (!isPointVisible(point)) {
      return;
    }

    const marker = window.L.circleMarker([point.lat, point.lng], markerStyle(point.id));
    marker.addTo(mapState.map);
    marker.bindTooltip(point.title, {
      className: 'leaflet-label',
      direction: 'top',
      offset: [0, -10],
      permanent: true
    });
    marker.on('click', () => {
      focusPoint(point);
      triggerHaptic('light');
    });
    mapState.markers.set(point.id, marker);
  });

  mapState.bounds = window.L.latLngBounds(points.map((point) => [point.lat, point.lng]));
  mapState.map.fitBounds(mapState.bounds.pad(0.28), { animate: false });

  setTimeout(() => {
    mapState.map.invalidateSize();
  }, 120);

  renderFallbackMap();
}

function bindEvents() {
  tabMapBtn?.addEventListener('click', () => {
    setActiveView('map');
    triggerHaptic('light');
  });

  tabAnswerBtn?.addEventListener('click', () => {
    setActiveView('answer');
    triggerHaptic('light');
  });

  tabPrototypeBtn?.addEventListener('click', () => {
    setActiveView('prototype');
    triggerHaptic('light');
  });

  resetMapBtn.addEventListener('click', () => {
    resetMapView();
    triggerHaptic('light');
  });

  changeTeamBtn.addEventListener('click', () => {
    openTeamSwitcher();
    triggerHaptic('light');
  });

  caseMapResetViewBtn?.addEventListener('click', () => {
    resetCaseMap();
    triggerHaptic('light');
  });

  caseMapChangeTeamBtn?.addEventListener('click', () => {
    openTeamSwitcher();
    triggerHaptic('light');
  });

  themeToggleBtn?.addEventListener('click', () => {
    toggleTheme();
    triggerHaptic('light');
  });

  teamConfirmBtn.addEventListener('click', async () => {
    const selectedTeam = String(teamSelectNode.value || '').trim();
    if (!selectedTeam) {
      setTeamGateStatus('Выберите команду из списка.');
      triggerHaptic('error');
      return;
    }

    teamConfirmBtn.disabled = true;
    setTeamGateStatus('Подключаем команду...');
    try {
      await registerTeam(selectedTeam);
      startTeamPolling();
      void syncTeamStatus();
      setTeamGateStatus('Команда подключена.');
      triggerHaptic('success');
    } catch (error) {
      state.teamReady = false;
      state.teamName = '';
      state.sessionId = '';
      state.teamMoveCount = 0;
      state.finalAnswerText = '';
      state.finalAnswerAt = '';
      state.finalAnswerMoveCount = 0;
      state.finalAnswerDraft = '';
      setTeamStripText();
      updateBadge();
      renderFinalAnswerPanel();
      const reason = String(error?.message || '');
      if (reason === 'unknown_team') {
        setTeamGateStatus('Команда не найдена в базе. Проверьте список.');
      } else if (reason === 'team_required' || reason === 'missing_fields') {
        setTeamGateStatus('Некорректные данные регистрации. Повторите вход.');
      } else if (reason.includes('Failed to fetch')) {
        setTeamGateStatus('Сервер недоступен: проверьте backend URL (?api=...) и интернет.');
      } else {
        setTeamGateStatus(`Не удалось подключить команду: ${reason || 'unknown_error'}.`);
      }
      triggerHaptic('error');
    } finally {
      teamConfirmBtn.disabled = false;
    }
  });

  closeTaskBtn.addEventListener('click', () => {
    closeCityMode();
    triggerHaptic('light');
  });

  taskTextSkipBtn?.addEventListener('click', () => {
    flushAnimatedTaskText();
    triggerHaptic('light');
  });

  finalAnswerInputNode?.addEventListener('input', () => {
    state.finalAnswerDraft = finalAnswerInputNode.value;
  });

  submitFinalAnswerBtn?.addEventListener('click', () => {
    submitFinalAnswer();
  });

  window.addEventListener('resize', () => {
    if (mapState.map) {
      mapState.map.invalidateSize();
    }
    if (caseMapState.map) {
      caseMapState.map.invalidateSize();
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEYS.theme) {
      return;
    }

    applyTheme(normalizeThemeName(event.newValue || THEME_MODES.light), false);
  });
}

async function init() {
  await loadScenarioConfig();
  enableSingleMapMode();
  applyTheme(getStoredTheme(), false);
  setActiveView('map');
  initMap();
  bindEvents();
  updateBadge();
  setTaskPlaceholder();
  renderFinalAnswerPanel();
  await initTeamState();
}

void init();
