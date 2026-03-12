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
        freeMove: true,
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
    text: 'Архивный шум.',
    lat: 44.4949,
    lng: 11.3426,
    zoom: 9,
    task: {
      kind: 'empty',
      kicker: 'Архив Болоньи',
      title: 'Болонья: бумажный лабиринт',
      lore: 'Полки забиты бумагами, но почти все листы пустые. На одном клочке повторяется фраза: "сдвиг на 3 спасает от чужих глаз".',
      question: 'Вы перебираете архив и отмечаете повторяющиеся намеки.',
      info: 'Прямого правила нет, только след к шифру Цезаря и числу 3.'
    }
  },
  {
    id: 'verona',
    title: 'Верона',
    text: 'Слухи и версии.',
    lat: 45.4384,
    lng: 10.9916,
    zoom: 9,
    task: {
      kind: 'empty',
      kicker: 'Архив Вероны',
      title: 'Верона: город слухов',
      lore: 'Здесь каждый свидетель говорит по-своему. На полях чужой рукой: "собирай смысл блоками по три символа - так меньше шума".',
      question: 'Вы сверяете версии и отделяете факты от сплетен.',
      info: 'Доказательств нет, но прием "по тройкам" явно не случайный.'
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
      kicker: 'Архив Пизы',
      title: 'Пиза: наклоненный след',
      lore: 'След красивый, но кривой, как местная башня. В черновике совет: "иногда смысл прячется не в строке подряд, а в каждом третьем знаке".',
      question: 'Вы находите только фрагменты, но метод чтения становится узнаваемым.',
      info: 'Улик мало, зато становится понятнее логика шифровок.'
    }
  },
  {
    id: 'palermo',
    title: 'Палермо',
    text: 'Закрытый порт.',
    lat: 38.1157,
    lng: 13.3615,
    zoom: 9,
    task: {
      kind: 'empty',
      kicker: 'Палермо: закрытый порт',
      title: 'Палермо: оборванный канал',
      lore: 'Часть документов изъяли до вашего прибытия. Оставшаяся записка предупреждает: нейтральной территории больше нет, у стола есть скрытая сторона.',
      question: 'Вы фиксируете финальные штрихи досье перед публичным разбором.',
      info: 'Финальный намек: ищите не только правила, но и тех, кто меняет их в тени.'
    }
  }
];

const defaultTaskState = {
  kicker: 'Досье саммита',
  title: 'Выберите город',
  lore: 'Вы команда юных переговорщиков: нужно собрать правила саммита по фрагментам из разных городов.',
  question: 'Нажмите на точку на карте Италии, чтобы открыть локацию.'
};

const state = {
  selectedPointId: null,
  cityMode: false
};

const cardMap = document.querySelector('.card-map');
const completionNode = document.getElementById('completionBadge');
const resetMapBtn = document.getElementById('resetMapBtn');

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

const mapState = {
  map: null,
  markers: new Map(),
  visited: new Set(),
  solved: new Set(),
  sliderBoards: new Map(),
  caesarInputs: new Map(),
  matchLinks: new Map(),
  matchActiveFacts: new Map(),
  bounds: null
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

function setTaskPlaceholder() {
  taskKickerNode.textContent = defaultTaskState.kicker;
  taskTitleNode.textContent = defaultTaskState.title;
  setTaskLore(defaultTaskState.lore);
  taskQuestionNode.textContent = defaultTaskState.question;
  taskOptionsNode.innerHTML = '';
  setTaskResult('');
  setTaskAnswer('');
}

function markerStyle(pointId) {
  const point = pointsById.get(pointId);
  const isActive = state.selectedPointId === pointId;
  const isVisited = mapState.visited.has(pointId);
  const isSolved = mapState.solved.has(pointId);
  const isEmpty = point?.task.kind === 'empty';

  let fillColor = isEmpty ? '#4f93e6' : '#ff7a18';

  if (isVisited) {
    fillColor = isEmpty ? '#2d6ab4' : '#e26704';
  }

  if (isSolved) {
    fillColor = '#19a56f';
  }

  const strokeColor = isActive
    ? '#f2f7ff'
    : (isEmpty ? '#b9d4ff' : '#ffd9b5');

  return {
    radius: isActive ? 12 : 9,
    color: strokeColor,
    weight: isActive ? 3 : 2,
    fillColor,
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
    if (state.selectedPointId === point.id) {
      marker.bringToFront();
    }
  });
}

function updateBadge() {
  completionNode.textContent = `Точки: ${mapState.visited.size}/${points.length} • Ключи: ${mapState.solved.size}/${totalQuestCount}`;
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
  setMapInteractionsEnabled(!enabled);

  if (mapState.map) {
    window.setTimeout(() => {
      mapState.map.invalidateSize();
    }, 340);
  }
}

function completeTask(point) {
  if (mapState.solved.has(point.id)) {
    return;
  }

  mapState.solved.add(point.id);
  updateBadge();
  refreshMarkers();
  triggerHaptic('success');
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
      const deltaX = (tileRect.left + tileRect.width / 2) - (emptyRect.left + emptyRect.width / 2);
      const deltaY = (tileRect.top + tileRect.height / 2) - (emptyRect.top + emptyRect.height / 2);
      const distance = Math.hypot(deltaX, deltaY);
      const threshold = Math.max(emptyRect.width, emptyRect.height) * 0.72;

      if (distance <= threshold) {
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
  const { size, labels, freeMove } = point.task.slider;

  const wrap = document.createElement('div');
  wrap.className = 'slider-wrap';

  const note = document.createElement('p');
  note.className = 'task-mini-note';
  note.textContent = freeMove
    ? 'Перетаскивайте любую плитку в пустую ячейку.'
    : 'Перетаскивайте только зеленые плитки в пустую ячейку.';
  wrap.appendChild(note);

  const boardNode = document.createElement('div');
  boardNode.className = 'slider-board';
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
    tileButton.disabled = mapState.solved.has(point.id);

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
    setTaskAnswer('');
    return;
  }

  if (point.task.kind === 'slider') {
    renderSliderBoard(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'caesar') {
    renderCaesarTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

  if (point.task.kind === 'match') {
    renderMatchTask(point);
    if (mapState.solved.has(point.id)) {
      setTaskResult(point.task.success || 'Загадка уже решена.', 'ok');
      setTaskAnswer(point.task.answerText, point.task.answerLabel || 'Ключ');
    }
    return;
  }

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
  if (!mapState.map) {
    return;
  }

  state.selectedPointId = point.id;
  mapState.visited.add(point.id);

  mapState.map.flyTo([point.lat, point.lng], point.zoom, {
    animate: true,
    duration: 1.05,
    easeLinearity: 0.2
  });

  mapState.map.once('moveend', () => {
    mapState.map.setView([point.lat, point.lng], point.zoom, { animate: false });
  });

  const marker = mapState.markers.get(point.id);
  if (marker) {
    marker.openTooltip();
  }

  updateBadge();
  refreshMarkers();
  renderTask(point);
  setCityMode(true);
}

function closeCityMode() {
  state.selectedPointId = null;
  refreshMarkers();
  setCityMode(false);
  setTaskPlaceholder();
}

function resetMapView() {
  if (!mapState.map) {
    return;
  }

  state.selectedPointId = null;
  refreshMarkers();

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

function initMap() {
  if (!window.L) {
    setTaskPlaceholder();
    setTaskResult('Карта не загрузилась. Проверьте интернет.', 'bad');
    return;
  }

  mapState.map = window.L.map('worldMap', {
    zoomControl: false,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 12,
    worldCopyJump: false
  });

  window.L.control.zoom({ position: 'topright' }).addTo(mapState.map);

  window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapState.map);

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
}

function bindEvents() {
  resetMapBtn.addEventListener('click', () => {
    resetMapView();
    triggerHaptic('light');
  });

  closeTaskBtn.addEventListener('click', () => {
    closeCityMode();
    triggerHaptic('light');
  });

  window.addEventListener('resize', () => {
    if (mapState.map) {
      mapState.map.invalidateSize();
    }
  });
}

function init() {
  initMap();
  bindEvents();
  updateBadge();
  setTaskPlaceholder();
}

init();
