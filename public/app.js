const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor('#103026');
    tg.setBackgroundColor('#091615');
  } catch (_) {
    // Unsupported in some Telegram clients.
  }
}

const points = [
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
      lore: 'Портовая стража повторяет одно правило: лидер не остается без плеча союзников. После этой точки начинаются ложные архивы, где подсказки спрятаны в шифрах и обрывках.',
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
      lore: 'На полях досье лежит короткая шахматная запись: нужно сделать один точный ход, после которого партия заканчивается сразу. Любой другой легальный ход считается промахом.',
      question: 'Белые начинают. Найдите мат в один ход.',
      success: 'Партия закрыта мгновенно.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: партия завершена точным ходом.',
      chess: {
        sideToMove: 'w',
        pieces: [
          { square: 'h8', type: 'k', color: 'b' },
          { square: 'g7', type: 'p', color: 'b' },
          { square: 'h7', type: 'p', color: 'b' },
          { square: 'c3', type: 'b', color: 'w' },
          { square: 'g6', type: 'q', color: 'w' },
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
      lore: 'На этой схеме знак разбит на два кольца. Поверните каждое отдельно так, чтобы из фрагментов снова собрался цельный символ.',
      question: 'Крутите кольца, пока рисунок не станет цельным.',
      success: 'Сигил собран.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: знак Триеста восстановлен.',
      rotor: {
        note: 'Оба кольца вращаются отдельно. Нужна одна правильная комбинация.',
        rings: [
          {
            id: 'outer',
            label: 'Внешний обод',
            segments: 12,
            step: 30,
            start: 7,
            target: 0,
            size: 100,
            thickness: 28,
            colors: ['transparent', '#d73d2a', '#d73d2a', '#d73d2a', 'transparent', '#d73d2a', '#d73d2a', 'transparent', 'transparent', 'transparent', '#d73d2a', 'transparent']
          },
          {
            id: 'middle',
            label: 'Средний пояс',
            segments: 12,
            step: 30,
            start: 4,
            target: 0,
            size: 74,
            thickness: 24,
            colors: ['#d7c8c6', 'transparent', 'transparent', 'transparent', '#d7c8c6', 'transparent', 'transparent', '#d7c8c6', '#d7c8c6', '#d7c8c6', 'transparent', '#d7c8c6']
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
      lore: 'Знак на каменной плите разбит на два вращающихся кольца. Совместите все сегменты, чтобы рисунок снова стал цельным.',
      question: 'Поверните кольца и соберите знак.',
      success: 'Каменный знак Матеры собран.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: знак Матеры восстановлен.',
      rotor: {
        note: 'У каждого из двух колец своё положение. Нужна точная комбинация.',
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
            colors: ['transparent', '#b9402a', '#b9402a', 'transparent', '#b9402a', '#b9402a', 'transparent', 'transparent', '#b9402a', '#b9402a', '#b9402a', 'transparent']
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
            colors: ['#d0c4b8', '#d0c4b8', 'transparent', '#d0c4b8', 'transparent', 'transparent', '#d0c4b8', '#d0c4b8', 'transparent', '#d0c4b8', '#d0c4b8', '#d0c4b8']
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
      lore: 'На островной станции сохранилась короткая шахматная запись. Нужно найти единственный ход белых, который закрывает партию сразу.',
      question: 'Белые начинают. Найдите мат в 1 ход.',
      success: 'Концовка Кальяри закрыта.',
      answerLabel: 'Бонус',
      answerText: 'Бонус: партия в Кальяри завершена одним точным ходом.',
      chess: {
        sideToMove: 'w',
        pieces: [
          { square: 'h8', type: 'k', color: 'b' },
          { square: 'g7', type: 'p', color: 'b' },
          { square: 'h7', type: 'p', color: 'b' },
          { square: 'd7', type: 'q', color: 'w' },
          { square: 'g1', type: 'k', color: 'w' }
        ]
      }
    }
  }
];

const defaultTaskState = {
  kicker: 'Досье саммита',
  title: 'Выберите город',
  lore: 'Вы команда юных переговорщиков: нужно собрать правила саммита по фрагментам из разных городов.',
  question: 'Нажмите на точку на карте Италии, чтобы открыть локацию.'
};

const STORAGE_KEYS = {
  teamName: 'miniapp.teamName',
  sessionId: 'miniapp.sessionId',
  deviceId: 'miniapp.deviceId'
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
const viewMapNode = document.getElementById('view-map');
const viewAnswerNode = document.getElementById('view-answer');
const tabMapBtn = document.getElementById('tabMapBtn');
const tabAnswerBtn = document.getElementById('tabAnswerBtn');
const completionNode = document.getElementById('completionBadge');
const answerMoveBadgeNode = document.getElementById('answerMoveBadge');
const resetMapBtn = document.getElementById('resetMapBtn');
const changeTeamBtn = document.getElementById('changeTeamBtn');
const mapAttribNode = document.querySelector('.map-attrib');
const fallbackMapNode = document.getElementById('fallbackMap');
const fallbackMapNoteNode = document.getElementById('fallbackMapNote');
const fallbackMapPointsNode = document.getElementById('fallbackMapPoints');
const teamStripNode = document.getElementById('teamStrip');
const teamGateNode = document.getElementById('teamGate');
const teamSelectNode = document.getElementById('teamSelect');
const teamConfirmBtn = document.getElementById('teamConfirmBtn');
const teamGateStatusNode = document.getElementById('teamGateStatus');

const taskKickerNode = document.getElementById('taskKicker');
const taskTitleNode = document.getElementById('taskTitle');
const taskLoreNode = document.getElementById('taskLore');
const taskQuestionNode = document.getElementById('taskQuestion');
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

const mapState = {
  map: null,
  markers: new Map(),
  visited: new Set(),
  solved: new Set(),
  sliderBoards: new Map(),
  caesarInputs: new Map(),
  matchLinks: new Map(),
  matchActiveFacts: new Map(),
  scannerStates: new Map(),
  decoderOffsets: new Map(),
  decoderInputs: new Map(),
  decoderClues: new Map(),
  rotorAngles: new Map(),
  chessStates: new Map(),
  cityVisits: new Map(),
  cityHints: new Map(),
  cityOverlayLayer: null,
  cityOverlayPointId: null,
  cityPoiMarkers: new Map(),
  bounds: null,
  fallbackVisible: false
};

const fallbackPointPositions = {
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

const pointsById = new Map(points.map((point) => [point.id, point]));
const totalQuestCount = points.filter((point) => point.task.kind !== 'empty').length;

function triggerHaptic(type = 'light') {
  if (!tg?.HapticFeedback) {
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

function setActiveView(viewName = 'map') {
  state.activeView = viewName === 'answer' ? 'answer' : 'map';

  viewMapNode?.classList.toggle('is-active', state.activeView === 'map');
  viewAnswerNode?.classList.toggle('is-active', state.activeView === 'answer');
  tabMapBtn?.classList.toggle('is-active', state.activeView === 'map');
  tabAnswerBtn?.classList.toggle('is-active', state.activeView === 'answer');

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
    if (answerMoveBadgeNode) {
      answerMoveBadgeNode.textContent = 'Перемещения: 0';
    }
    return;
  }

  finalAnswerInputNode.disabled = false;
  submitFinalAnswerBtn.disabled = false;

  if (document.activeElement !== finalAnswerInputNode) {
    finalAnswerInputNode.value = state.finalAnswerDraft || '';
  }

  if (answerMoveBadgeNode) {
    answerMoveBadgeNode.textContent = `Перемещения: ${state.teamMoveCount}`;
  }

  if (state.finalAnswerText && state.finalAnswerAt) {
    finalAnswerStatusNode.textContent = `Ответ принят: ${formatUiDate(state.finalAnswerAt)} • Перемещения: ${state.finalAnswerMoveCount}`;
    finalAnswerLastTextNode.textContent = state.finalAnswerText;
    finalAnswerLastNode.hidden = false;
  } else {
    finalAnswerStatusNode.textContent = 'Итоговый ответ ещё не отправлен.';
    finalAnswerLastNode.hidden = true;
  }
}

function applyTeamStats(stats = {}) {
  const previousFinalAnswer = state.finalAnswerText;

  state.teamMoveCount = Number(stats?.moveCount || 0);
  state.finalAnswerText = String(stats?.finalAnswerText || '');
  state.finalAnswerAt = String(stats?.finalAnswerAt || '');
  state.finalAnswerMoveCount = Number(stats?.finalAnswerMoveCount || 0);

  if (!state.finalAnswerDraft || state.finalAnswerDraft === previousFinalAnswer || document.activeElement !== finalAnswerInputNode) {
    state.finalAnswerDraft = state.finalAnswerText;
  }

  updateBadge();
  renderFinalAnswerPanel();
}

function openTeamGate(text = '') {
  if (!teamGateNode) {
    return;
  }

  teamGateNode.hidden = false;
  setTeamGateStatus(text || 'Выберите команду и подтвердите вход.');
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

  if (tg?.showAlert) {
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

  if (state.teamName !== data.teamName) {
    state.shownTriggerIds = new Set();
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
    finalAnswerStatusNode.textContent = `Ответ принят: ${formatUiDate(state.finalAnswerAt)} • Перемещения: ${state.finalAnswerMoveCount}`;
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
  taskResultNode.textContent = text;
  taskResultNode.classList.remove('ok', 'bad', 'info');

  if (!text || !tone) {
    return;
  }

  taskResultNode.classList.add(tone);
}

function setTaskLore(text = '') {
  taskLoreNode.textContent = text;
  taskLoreNode.hidden = !text;
}

function setTaskAnswer(text = '', label = 'Ключ') {
  if (!text) {
    taskAnswerLabelNode.textContent = 'Ключ';
    taskAnswerTextNode.textContent = '';
    taskAnswerNode.hidden = true;
    return;
  }

  taskAnswerLabelNode.textContent = label;
  taskAnswerTextNode.textContent = text;
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
    mapState.map.setMinZoom(2);
    mapState.map.setMaxZoom(19);
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

function getPointPalette(pointId) {
  const point = pointsById.get(pointId);
  const isActive = state.selectedPointId === pointId;
  const isVisited = mapState.visited.has(pointId);
  const isSolved = mapState.solved.has(pointId);
  const isEmpty = point?.task.kind === 'empty';
  const customColor = point?.markerColor || '';

  let fillColor = customColor || (isEmpty ? '#4f93e6' : '#ff7a18');

  if (isVisited) {
    fillColor = customColor ? '#6e3de1' : (isEmpty ? '#2d6ab4' : '#e26704');
  }

  if (isSolved) {
    fillColor = '#19a56f';
  }

  const strokeColor = isActive
    ? '#f2f7ff'
    : (customColor ? '#ddcbff' : (isEmpty ? '#b9d4ff' : '#ffd9b5'));

  return {
    fillColor,
    strokeColor,
    radius: isActive ? 12 : 9,
    weight: isActive ? 3 : 2
  };
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
    const position = fallbackPointPositions[point.id];
    if (!position) {
      return;
    }

    const palette = getPointPalette(point.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'fallback-point';
    button.style.left = `${position.x}%`;
    button.style.top = `${position.y}%`;
    button.style.setProperty('--point-fill', palette.fillColor);
    button.style.setProperty('--point-stroke', palette.strokeColor);
    button.title = point.title;
    button.setAttribute('aria-label', point.title);
    button.classList.toggle('is-active', state.selectedPointId === point.id);

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
  taskTitleNode.textContent = defaultTaskState.title;
  setTaskLore(defaultTaskState.lore);
  taskQuestionNode.textContent = defaultTaskState.question;
  taskOptionsNode.innerHTML = '';
  setTaskResult('');
  setTaskAnswer('');
}

function markerStyle(pointId) {
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

  const palette = getPointPalette(pointId);

  return {
    radius: palette.radius,
    color: palette.strokeColor,
    weight: palette.weight,
    fillColor: palette.fillColor,
    fillOpacity: 0.96
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

    if (state.selectedPointId === point.id) {
      marker.bringToFront();
      marker.openTooltip();
    }
  });

  if (mapState.fallbackVisible) {
    renderFallbackMap();
  }
}

function updateBadge() {
  const moveCount = state.teamReady ? state.teamMoveCount : 0;
  completionNode.textContent = `Точки: ${mapState.visited.size}/${points.length} • Ключи: ${mapState.solved.size}/${totalQuestCount} • Перемещения: ${moveCount}`;
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

function setCityMode(enabled) {
  state.cityMode = enabled;

  cardMap.classList.toggle('has-task', enabled);
  const selectedPoint = pointsById.get(state.selectedPointId);
  const keepMapInteractive = !enabled || Boolean(selectedPoint?.task?.cityMap);
  setMapInteractionsEnabled(keepMapInteractive);

  window.setTimeout(() => {
    if (mapState.map) {
      mapState.map.invalidateSize();
    }
  }, 340);
}

function completeTask(point) {
  if (mapState.solved.has(point.id)) {
    return;
  }

  mapState.solved.add(point.id);
  updateBadge();
  refreshMarkers();
  triggerHaptic('success');
  void postTeamEvent('task-solved', point.id, { kind: point.task.kind });
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

  if (selectedIndex === point.task.correct) {
    selectedButton.classList.add('is-correct');
    optionButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add('is-locked');
    });

    completeTask(point);
    setTaskResult(point.task.success, 'ok');
    setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    return;
  }

  selectedButton.classList.add('is-wrong');

  const correctButton = optionButtons[point.task.correct];
  if (correctButton) {
    correctButton.classList.add('is-correct');
  }

  setTaskResult('Неверно. Проверьте деталь протокола и попробуйте снова.', 'bad');
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

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeCodeToken(raw = '') {
  return String(raw || '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .trim();
}

function renderHotspotTask(point) {
  const config = point.task.hotspot || {};
  const target = config.target || {};
  const isSolved = mapState.solved.has(point.id);

  const wrap = document.createElement('div');
  wrap.className = 'hotspot-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = 'На изображении спрятана одна правильная зона. Нажмите точно в неё.';
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
    const marker = document.createElement('span');
    marker.className = 'hotspot-hit';
    marker.style.left = `${Number(target.x) || 50}%`;
    marker.style.top = `${Number(target.y) || 50}%`;
    marker.style.width = `${(Number(target.radius) || 8) * 2}%`;
    marker.style.height = `${(Number(target.radius) || 8) * 2}%`;
    scene.appendChild(marker);
  }

  scene.addEventListener('click', (event) => {
    if (isSolved) {
      return;
    }

    const rect = scene.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const dx = x - (Number(target.x) || 50);
    const dy = y - (Number(target.y) || 50);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= (Number(target.radius) || 8)) {
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

function isRotorSolved(point, angles = getRotorAngles(point)) {
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
  const isSolved = mapState.solved.has(point.id);
  const angles = getRotorAngles(point);
  const previewSolved = isRotorSolved(point, angles);

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

function renderDecoderTask(point) {
  const config = point.task.decoder || {};
  const symbols = config.symbols || [];
  const cards = config.cards || [];
  const sceneConfig = config.scene || {};
  const clues = sceneConfig.clues || [];
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
    ? '1. Найдите на изображении все активные метки. 2. Каждая метка откроет базовое значение своего знака. 3. Потом крутите диск и вводите новые числа.'
    : '1. Поверните диск. 2. Смотрите число напротив того же символа. 3. Введите его в поле этой строки.';
  wrap.appendChild(note);

  const steps = document.createElement('div');
  steps.className = 'decoder-steps';
  (clues.length
    ? ['Найдите метки', 'Поверните диск', 'Введите код']
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
  dialTitle.textContent = 'Диск сдвига';
  dial.appendChild(dialTitle);

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
  dial.appendChild(dialWheel);

  const dialHint = document.createElement('p');
  dialHint.className = 'decoder-shift-label';
  dialHint.textContent = `Текущий сдвиг: ${offset}`;
  dial.appendChild(dialHint);
  dial.appendChild(dialActions);
  layout.appendChild(dial);

  const panel = document.createElement('div');
  panel.className = 'decoder-panel';

  const panelHead = document.createElement('p');
  panelHead.className = 'decoder-head';
  panelHead.textContent = 'Символы и значения';
  panel.appendChild(panelHead);

  const panelLead = document.createElement('p');
  panelLead.className = 'decoder-panel-lead';
  panelLead.textContent = allCluesFound
    ? 'В каждой карточке показан знак, число до сдвига и число после сдвига. Затем введите свой ответ.'
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
    cardNode.className = 'decoder-card';

    const glyph = document.createElement('span');
    glyph.className = 'decoder-card-glyph';
    glyph.textContent = card.glyph;
    cardNode.appendChild(glyph);

    const current = document.createElement('div');
    current.className = `decoder-card-current${clueFound ? '' : ' is-locked'}`;
    if (clueFound) {
      current.innerHTML = `
        <div class="decoder-flow-row">
          <span class="decoder-flow-chip decoder-flow-chip-base">${baseValue}</span>
          <span class="decoder-flow-arrow">→</span>
          <span class="decoder-flow-chip decoder-flow-chip-current">${currentValue}</span>
        </div>
      `;
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
  note.textContent = 'Сначала выберите белую фигуру, затем клетку назначения.';
  wrap.appendChild(note);

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
      offset: [0, -8]
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

  wrap.appendChild(poiList);
  taskOptionsNode.appendChild(wrap);

  updateCityMapTaskStatus(point, progressNode, statusNode, poiList);
}

function renderTaskMedia(point) {
  const items = Array.isArray(point.task?.media) ? point.task.media : [];
  if (items.length === 0) {
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'task-media';

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'task-media-card';

    const title = document.createElement('p');
    title.className = 'task-media-title';
    title.textContent = item.title || 'Медиа';
    card.appendChild(title);

    if (item.type === 'image') {
      const image = document.createElement('img');
      image.className = 'task-media-image';
      image.src = item.src;
      image.alt = item.alt || item.title || 'Изображение';
      image.loading = 'lazy';
      card.appendChild(image);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.className = 'task-media-video';
      video.src = item.src;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      card.appendChild(video);
    } else if (item.type === 'audio') {
      const audio = document.createElement('audio');
      audio.className = 'task-media-audio';
      audio.src = item.src;
      audio.controls = true;
      audio.preload = 'metadata';
      card.appendChild(audio);
    }

    wrap.appendChild(card);
  });

  taskOptionsNode.appendChild(wrap);
}

function renderTask(point) {
  taskKickerNode.textContent = point.task.kicker;
  taskTitleNode.textContent = point.task.title || `${point.title}: загадка`;
  setTaskLore(point.task.lore || '');
  taskQuestionNode.textContent = point.task.question || '';
  taskOptionsNode.innerHTML = '';
  setTaskResult('');
  setTaskAnswer('');

  if (point.task.kind === 'empty') {
    setTaskResult(point.task.info || 'В этой точке нет активной загадки.', 'info');
    renderTaskMedia(point);
    if (point.task.cityMap) {
      renderCityMapTask(point);
    }
    setTaskAnswer('');
    return;
  }

  if (point.task.kind === 'slider') {
    renderTaskMedia(point);
    renderSliderBoard(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'caesar') {
    renderTaskMedia(point);
    renderCaesarTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'match') {
    renderTaskMedia(point);
    renderMatchTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'hotspot') {
    renderTaskMedia(point);
    renderHotspotTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'scanner') {
    renderTaskMedia(point);
    renderScannerTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'rotor') {
    renderTaskMedia(point);
    renderRotorTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'decoder') {
    renderTaskMedia(point);
    renderDecoderTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'chess') {
    renderTaskMedia(point);
    renderChessTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  renderTaskMedia(point);
  point.task.options.forEach((optionText, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'task-option';
    button.textContent = optionText;

    if (mapState.solved.has(point.id)) {
      button.disabled = true;
      button.classList.add('is-locked');
      if (index === point.task.correct) {
        button.classList.add('is-correct');
      }
    }

    button.addEventListener('click', () => {
      checkTaskAnswer(point, index);
    });

    taskOptionsNode.appendChild(button);
  });

  if (mapState.solved.has(point.id)) {
    setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
    setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
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
  mapState.visited.add(point.id);

  const hasCityMap = Boolean(point.task.cityMap);
  const canUseLeafletMap = Boolean(mapState.map) && !mapState.fallbackVisible;

  if (hasCityMap && canUseLeafletMap) {
    activateCityOverlay(point);
  } else if (mapState.map) {
    mapState.map.flyTo([point.lat, point.lng], point.zoom, {
      animate: true,
      duration: 1.05,
      easeLinearity: 0.2
    });

    mapState.map.once('moveend', () => {
      mapState.map.setView([point.lat, point.lng], point.zoom, { animate: false });
    });
  }

  const marker = mapState.markers.get(point.id);
  if (marker) {
    marker.openTooltip();
  }

  updateBadge();
  refreshMarkers();
  renderTask(point);
  setCityMode(true);
  void postTeamEvent('travel', point.id, { source: hasCityMap && canUseLeafletMap ? 'city-entry' : 'point' });
}

function closeCityMode() {
  destroyCityTaskMap();
  state.selectedPointId = null;
  refreshMarkers();
  setCityMode(false);
  setTaskPlaceholder();
}

function resetMapView() {
  if (!mapState.map && !mapState.fallbackVisible) {
    return;
  }

  destroyCityTaskMap();
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

  closeCityMode();
}

function addBaseTileLayerWithFallback(map) {
  const providers = [
    {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: { subdomains: 'abc', maxZoom: 19 }
    },
    {
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      options: { subdomains: 'abc', maxZoom: 19 }
    },
    {
      url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      options: { subdomains: 'abcd', maxZoom: 19 }
    }
  ];

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
}

function initMap() {
  if (!window.L) {
    setTaskPlaceholder();
    showFallbackMap('Библиотека карты не загрузилась. Используйте резервную схему и нажимайте на точки.');
    setTaskResult('Карта не загрузилась. Включена резервная схема.', 'info');
    renderFallbackMap();
    return;
  }

  mapState.map = window.L.map('worldMap', {
    zoomControl: false,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 19,
    worldCopyJump: false
  });

  window.L.control.zoom({ position: 'topright' }).addTo(mapState.map);

  addBaseTileLayerWithFallback(mapState.map);

  mapState.map.setView([42.5, 12.5], 5);

  points.forEach((point) => {
    const marker = window.L.circleMarker([point.lat, point.lng], markerStyle(point.id));
    marker.addTo(mapState.map);
    marker.bindTooltip(point.title, {
      className: 'leaflet-label',
      direction: 'top',
      offset: [0, -8]
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

  resetMapBtn.addEventListener('click', () => {
    resetMapView();
    triggerHaptic('light');
  });

  changeTeamBtn.addEventListener('click', () => {
    if (state.teamName) {
      teamSelectNode.value = state.teamName;
    }
    openTeamGate('Смена команды сбросит только текущую сессию на этом телефоне.');
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
  });
}

async function init() {
  setActiveView('map');
  initMap();
  bindEvents();
  updateBadge();
  setTaskPlaceholder();
  renderFinalAnswerPanel();
  await initTeamState();
}

void init();
