const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const { Pool } = require('pg');

const app = express();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'miniapp-db.json');
const MAX_EVENTS = 10000;
const DATABASE_URL = String(process.env.DATABASE_URL || '').trim();
const DATABASE_SSL = ['1', 'true', 'yes'].includes(String(process.env.DATABASE_SSL || '').trim().toLowerCase());
const MAINTENANCE_MODE = ['1', 'true', 'yes', 'on'].includes(String(process.env.MAINTENANCE_MODE || '').trim().toLowerCase());
const MAINTENANCE_TITLE = String(process.env.MAINTENANCE_TITLE || '\u0422\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0440\u0430\u0431\u043e\u0442\u044b').trim();
const MAINTENANCE_MESSAGE = String(
  process.env.MAINTENANCE_MESSAGE ||
  '\u0421\u0430\u0439\u0442 \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u043e\u0442\u043a\u043b\u044e\u0447\u0451\u043d. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0437\u0430\u0439\u0442\u0438 \u0447\u0443\u0442\u044c \u043f\u043e\u0437\u0436\u0435.'
).trim();
const USE_POSTGRES = Boolean(DATABASE_URL);
const pool = USE_POSTGRES
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_SSL ? { rejectUnauthorized: false } : false
    })
  : null;
let storageInitPromise = null;

const TEAM_NAMES = [
  'Новый Вавилон',
  'Эльдорадо',
  'Счастливое государство',
  'Юксайленд',
  'Атлантида',
  'Ювента',
  'Орион',
  'ОУИ 1',
  'ОУИ 2',
  'МПЦ'
];

const TEAM_CODES = {
  'Новый Вавилон': '10101',
  'Эльдорадо': '10202',
  'Счастливое государство': '10303',
  'Юксайленд': '10404',
  'Атлантида': '10505',
  'Ювента': '10606',
  'Орион': '10707',
  'ОУИ 1': '10808',
  'ОУИ 2': '10909',
  'МПЦ': '11010'
};

const TEAM_NAME_ALIASES = {};


const POINT_LABELS = {
  vatican: 'Ватикан',
  rome: 'Рим',
  venice: 'Венеция',
  milan: 'Милан',
  turin: 'Турин',
  florence: 'Флоренция',
  naples: 'Неаполь',
  bologna: 'Болонья',
  verona: 'Верона',
  trieste: 'Триест',
  siena: 'Сиена',
  ravenna: 'Равенна',
  matera: 'Матера',
  bari: 'Бари',
  cagliari: 'Кальяри',
  pisa: 'Пиза',
  palermo: 'Палермо',
  genoa_media: 'Генуя',
  al_kasir: 'Аль-Касир',
  zarak_mir: 'Зарак-Мир',
  zarif: 'Зариф'
};

const PISA_POI_LABELS = {
  pizzeria: 'Пиццерия',
  coffee: 'Кофейня',
  cityhall: 'Мэрия'
};

const POINT_CLUE_NUMBERS = {
  vatican: 1,
  rome: 2,
  venice: 3,
  milan: 4,
  florence: 5,
  naples: 6
};

const DELIVERY_CLUES = {
  clue_vatican: {
    clueNumber: 1,
    actionLabel: 'Выдать улику №1'
  },
  clue_rome: {
    clueNumber: 2,
    actionLabel: 'Выдать улику №2'
  },
  clue_venice: {
    clueNumber: 3,
    actionLabel: 'Выдать улику №3'
  },
  clue_milan: {
    clueNumber: 4,
    actionLabel: 'Выдать улику №4'
  },
  clue_florence: {
    clueNumber: 5,
    actionLabel: 'Выдать улику №5'
  },
  clue_naples: {
    clueNumber: 6,
    actionLabel: 'Выдать улику №6'
  }
};

const LEGACY_TRIGGER_IDS = new Set(['clue_after_naples']);

app.use(express.json({ limit: '1mb' }));

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

app.use((req, res, next) => {
  if (!MAINTENANCE_MODE) {
    next();
    return;
  }

  const wantsJson = req.path.startsWith('/api/') || String(req.headers.accept || '').includes('application/json');
  const title = escapeHtml(MAINTENANCE_TITLE);
  const message = escapeHtml(MAINTENANCE_MESSAGE);

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (wantsJson) {
    res.status(503).json({
      ok: false,
      error: 'maintenance_mode',
      title: MAINTENANCE_TITLE,
      message: MAINTENANCE_MESSAGE
    });
    return;
  }

  res
    .status(503)
    .type('html')
    .send(`<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      font-family: "Segoe UI", system-ui, sans-serif;
      background:
        radial-gradient(circle at top, rgba(80, 112, 255, 0.16), transparent 38%),
        linear-gradient(180deg, #121923 0%, #0c1118 100%);
      color: #ecf3ff;
    }
    .card {
      width: min(520px, 100%);
      padding: 28px;
      border-radius: 20px;
      background: rgba(19, 28, 40, 0.9);
      border: 1px solid rgba(140, 170, 214, 0.25);
      box-shadow: 0 22px 60px rgba(0, 0, 0, 0.35);
    }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(28px, 4vw, 38px);
      line-height: 1.05;
    }
    p {
      margin: 0;
      font-size: 16px;
      line-height: 1.6;
      color: #c3d3ee;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </main>
</body>
</html>`);
});

const PUBLIC_DIR = path.join(__dirname, 'public');
const SCENARIOS_DIR = path.join(PUBLIC_DIR, 'scenarios');
const MAP_SOURCE_CANDIDATES = [
  { fileName: 'team-map.avif', mimeType: 'image/avif' },
  { fileName: 'team-map.webp', mimeType: 'image/webp' },
  { fileName: 'team-map.jpg', mimeType: 'image/jpeg' },
  { fileName: 'team-map.jpeg', mimeType: 'image/jpeg' },
  { fileName: 'team-map.png', mimeType: 'image/png' }
];

function collectScenarioPointLabels(points, labels, parentPath = '', parentTitle = '') {
  if (!Array.isArray(points)) {
    return;
  }

  points.forEach((point) => {
    if (!point || typeof point !== 'object') {
      return;
    }

    const rawId = String(point.id || '').trim();
    const rawTitle = String(point.title || point.task?.title || '').trim();
    const fullId = parentPath && rawId ? `${parentPath}.${rawId}` : rawId;
    const fullTitle = parentTitle && rawTitle ? `${parentTitle} -> ${rawTitle}` : rawTitle;

    if (fullId && fullTitle && !labels[fullId]) {
      labels[fullId] = fullTitle;
    }

    if (rawId && rawTitle && !labels[rawId]) {
      labels[rawId] = rawTitle;
    }

    const nestedPoints = Array.isArray(point.points)
      ? point.points
      : Array.isArray(point.task?.cityImageMap?.points)
        ? point.task.cityImageMap.points
        : [];

    collectScenarioPointLabels(nestedPoints, labels, fullId || parentPath, rawTitle || parentTitle);
  });
}

function buildScenarioPointLabels() {
  const labels = {};

  if (!fs.existsSync(SCENARIOS_DIR)) {
    return labels;
  }

  const scenarioFiles = fs.readdirSync(SCENARIOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(SCENARIOS_DIR, entry.name, 'scenario.json'))
    .filter((filePath) => fs.existsSync(filePath));

  scenarioFiles.forEach((filePath) => {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const scenario = JSON.parse(raw);
      collectScenarioPointLabels(scenario.routeMap?.points || scenario.points || [], labels);
    } catch (error) {
      console.warn(`Failed to load scenario labels from ${filePath}:`, error.message);
    }
  });

  return labels;
}

const SCENARIO_POINT_LABELS = buildScenarioPointLabels();

function setNoCacheHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

function readImageHeader(filePath, length = 65536) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(length);
    const bytesRead = fs.readSync(fd, buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    fs.closeSync(fd);
  }
}

function getPngSize(buffer) {
  if (buffer.length < 24) {
    return null;
  }

  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function getJpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;

    if (marker === 0xd8 || marker === 0xd9) {
      continue;
    }

    if (offset + 2 > buffer.length) {
      break;
    }

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) {
      break;
    }

    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isStartOfFrame && offset + 7 < buffer.length) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5)
      };
    }

    offset += segmentLength;
  }

  return null;
}

function getWebpSize(buffer) {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }

  const chunkType = buffer.toString('ascii', 12, 16);

  if (chunkType === 'VP8X' && buffer.length >= 30) {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { width, height };
  }

  if (chunkType === 'VP8 ' && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff
    };
  }

  if (chunkType === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1
    };
  }

  return null;
}

function getImageSize(filePath, fileName) {
  const lowerName = String(fileName || '').toLowerCase();
  const header = readImageHeader(filePath);

  if (lowerName.endsWith('.png')) {
    return getPngSize(header);
  }

  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
    return getJpegSize(header);
  }

  if (lowerName.endsWith('.webp')) {
    return getWebpSize(header);
  }

  return null;
}

function normalizePublicAssetPath(filePath) {
  return path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
}

function setStaticCacheHeaders(res, filePath) {
  const assetPath = normalizePublicAssetPath(filePath);
  const isHtml = assetPath.endsWith('.html');
  const isMapAsset = assetPath.startsWith('assets/maps/');
  const isCoreUiFile = assetPath === 'app.js' || assetPath === 'styles.css';

  // Telegram WebView can aggressively cache; UI shell must refresh immediately after deploy.
  if (isHtml || isCoreUiFile) {
    setNoCacheHeaders(res);
    return;
  }

  if (isMapAsset) {
    // Map files are versioned via query string from /api/map-source, safe to cache aggressively.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=86400');
}

app.use(express.static(PUBLIC_DIR, {
  etag: true,
  lastModified: true,
  setHeaders: setStaticCacheHeaders
}));

function nowIso() {
  return new Date().toISOString();
}

function normalizeTeamName(raw) {
  const prepared = String(raw || '').trim();
  return TEAM_NAMES.find((team) => team.toLowerCase() === prepared.toLowerCase()) || null;
}

function createDefaultDb() {
  return {
    version: 1,
    createdAt: nowIso(),
    teams: TEAM_NAMES.slice(),
    sessions: {},
    statsByTeam: {},
    events: []
  };
}

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = createDefaultDb();
    fs.writeFileSync(DB_FILE, `${JSON.stringify(initial)}\n`, 'utf8');
  }
}

function normalizeDb(rawDb) {
  const parsed = rawDb && typeof rawDb === 'object'
    ? rawDb
    : createDefaultDb();

  if (!parsed.sessions || typeof parsed.sessions !== 'object') {
    parsed.sessions = {};
  }
  if (!parsed.statsByTeam || typeof parsed.statsByTeam !== 'object') {
    parsed.statsByTeam = {};
  }
  if (!Array.isArray(parsed.events)) {
    parsed.events = [];
  }
  if (!Array.isArray(parsed.teams) || parsed.teams.length === 0) {
    parsed.teams = TEAM_NAMES.slice();
  }
  Object.values(parsed.statsByTeam).forEach((stats) => {
    if (!Array.isArray(stats.uniquePointIds)) {
      stats.uniquePointIds = [];
    }
    if (!Array.isArray(stats.solvedPointIds)) {
      stats.solvedPointIds = [];
    }
    if (!Array.isArray(stats.collectedClueNumbers)) {
      stats.collectedClueNumbers = [];
    }
    if (!Array.isArray(stats.issuedClueNumbers)) {
      stats.issuedClueNumbers = [];
    }
    if (!Array.isArray(stats.collectedItems)) {
      stats.collectedItems = [];
    }
    if (typeof stats.finalAnswerText !== 'string') {
      stats.finalAnswerText = '';
    }
    if (typeof stats.finalAnswerAt !== 'string') {
      stats.finalAnswerAt = '';
    }
    if (typeof stats.finalAnswerMoveCount !== 'number') {
      stats.finalAnswerMoveCount = 0;
    }
    stats.solvedPointIds.forEach((pointId) => {
      const clueNumber = POINT_CLUE_NUMBERS[pointId];
      if (clueNumber) {
        ensureUniquePush(stats.collectedClueNumbers, clueNumber);
      }
    });
    stats.collectedClueNumbers.sort((a, b) => Number(a) - Number(b));
    if (!stats.poiVisitsByPoint || typeof stats.poiVisitsByPoint !== 'object') {
      stats.poiVisitsByPoint = {};
    }
    if (!Array.isArray(stats.triggersFired)) {
      stats.triggersFired = [];
    }
    if (!Array.isArray(stats.triggerLog)) {
      stats.triggerLog = [];
    }
    stats.triggerLog = stats.triggerLog.filter((item) => !LEGACY_TRIGGER_IDS.has(item.id));
    if (!Array.isArray(stats.deliveredTriggerIds)) {
      stats.deliveredTriggerIds = [];
    }
    stats.deliveredTriggerIds = stats.deliveredTriggerIds.filter((id) => !LEGACY_TRIGGER_IDS.has(id));
    if (!Array.isArray(stats.triggersFired)) {
      stats.triggersFired = [];
    }
    stats.triggersFired = stats.triggersFired.filter((id) => !LEGACY_TRIGGER_IDS.has(id));
    const deliveredIds = new Set(stats.deliveredTriggerIds);
    stats.triggerLog.forEach((item) => {
      if (!deliveredIds.has(item.id)) {
        return;
      }

      const clueNumber = item.clueNumber || DELIVERY_CLUES[item.id]?.clueNumber || null;
      if (clueNumber) {
        ensureUniquePush(stats.issuedClueNumbers, clueNumber);
      }
    });
    stats.issuedClueNumbers = stats.issuedClueNumbers.filter((number) => Number(number) !== 7);
    stats.issuedClueNumbers.sort((a, b) => Number(a) - Number(b));
    stats.collectedItems = stats.collectedItems
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id || '').trim(),
        label: String(item.label || item.id || '').trim(),
        variant: String(item.variant || '').trim(),
        pointId: String(item.pointId || '').trim(),
        at: String(item.at || '').trim() || nowIso()
      }))
      .filter((item) => item.id);
    if (!Array.isArray(stats.routeLog)) {
      stats.routeLog = [];
    }
    if (typeof stats.currentPointId !== 'string') {
      stats.currentPointId = '';
    }
  });

  return parsed;
}

function parseJsonUtf8(raw) {
  const text = typeof raw === 'string' ? raw.replace(/^\uFEFF/, '') : String(raw || '');
  return JSON.parse(text);
}

function readFileDb() {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return normalizeDb(parseJsonUtf8(raw));
  } catch (error) {
    console.error('[miniapp-db] read/parse failed, recreating empty database file', error);
    const initial = createDefaultDb();
    fs.writeFileSync(DB_FILE, `${JSON.stringify(initial)}\n`, 'utf8');
    return initial;
  }
}

function writeFileDb(db) {
  db.updatedAt = nowIso();
  fs.writeFileSync(DB_FILE, `${JSON.stringify(db)}\n`, 'utf8');
}

async function initStorage() {
  if (storageInitPromise) {
    return storageInitPromise;
  }

  storageInitPromise = (async () => {
    if (!USE_POSTGRES) {
      ensureDbExists();
      return;
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_state (
        id INTEGER PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const existing = await pool.query('SELECT data FROM app_state WHERE id = 1');
    if (existing.rowCount === 0) {
      let seed = createDefaultDb();

      if (fs.existsSync(DB_FILE)) {
        try {
          seed = normalizeDb(parseJsonUtf8(fs.readFileSync(DB_FILE, 'utf8')));
        } catch (_) {
          seed = createDefaultDb();
        }
      }

      await pool.query(
        'INSERT INTO app_state (id, data, updated_at) VALUES (1, $1::jsonb, NOW())',
        [seed]
      );
      return;
    }

    const normalized = normalizeDb(existing.rows[0].data);
    await pool.query(
      'UPDATE app_state SET data = $1::jsonb, updated_at = NOW() WHERE id = 1',
      [normalized]
    );
  })();

  return storageInitPromise;
}

async function readDb() {
  await initStorage();

  if (!USE_POSTGRES) {
    return readFileDb();
  }

  const result = await pool.query('SELECT data FROM app_state WHERE id = 1');
  return normalizeDb(result.rows[0]?.data);
}

async function writeDb(db) {
  db.updatedAt = nowIso();
  await initStorage();

  if (!USE_POSTGRES) {
    writeFileDb(db);
    return;
  }

  await pool.query(
    'UPDATE app_state SET data = $1::jsonb, updated_at = NOW() WHERE id = 1',
    [db]
  );
}

async function mutateDb(mutator) {
  await initStorage();

  if (!USE_POSTGRES) {
    const db = readFileDb();
    const result = await mutator(db);
    writeFileDb(db);
    return result;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const locked = await client.query('SELECT data FROM app_state WHERE id = 1 FOR UPDATE');
    const db = normalizeDb(locked.rows[0]?.data);
    const result = await mutator(db);
    db.updatedAt = nowIso();
    await client.query(
      'UPDATE app_state SET data = $1::jsonb, updated_at = NOW() WHERE id = 1',
      [db]
    );
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function ensureTeamStats(db, teamName) {
  if (!db.statsByTeam[teamName]) {
    db.statsByTeam[teamName] = {
      teamName,
      moveCount: 0,
      uniquePointIds: [],
      solvedPointIds: [],
      collectedClueNumbers: [],
      issuedClueNumbers: [],
      collectedItems: [],
      finalAnswerText: '',
      finalAnswerAt: '',
      finalAnswerMoveCount: 0,
      poiVisitsByPoint: {},
      triggersFired: [],
      triggerLog: [],
      deliveredTriggerIds: [],
      routeLog: [],
      currentPointId: '',
      updatedAt: nowIso()
    };
  }

  return db.statsByTeam[teamName];
}

function ensureUniquePush(items, value) {
  if (!value) {
    return;
  }
  if (!items.includes(value)) {
    items.push(value);
  }
}

function pointLabel(pointId) {
  const key = String(pointId || '').trim();
  return POINT_LABELS[key] || SCENARIO_POINT_LABELS[key] || key || '';
}

function describeRouteEvent(eventType, pointId, meta = {}) {
  const city = pointLabel(pointId);

  if (eventType === 'travel') {
    return `Переход: ${city}`;
  }

  if (eventType === 'task-solved') {
    return `Решили точку: ${city}`;
  }

  if (eventType === 'city-poi') {
    const poiLabel = PISA_POI_LABELS[meta.poiId] || meta.poiId || 'точка города';
    return `${city}: ${poiLabel}`;
  }

  return city || eventType;
}

function appendRouteLog(stats, eventType, pointId, meta = {}) {
  const label = describeRouteEvent(eventType, pointId, meta);
  if (!label) {
    return;
  }

  stats.routeLog.push({
    id: crypto.randomUUID(),
    type: eventType,
    pointId,
    label,
    at: nowIso()
  });

  if (stats.routeLog.length > 120) {
    stats.routeLog.splice(0, stats.routeLog.length - 120);
  }

  if (pointId) {
    stats.currentPointId = pointId;
  }
}

function collectClueForPoint(stats, pointId) {
  const clueNumber = POINT_CLUE_NUMBERS[pointId];
  if (!clueNumber) {
    return;
  }

  if (!Array.isArray(stats.collectedClueNumbers)) {
    stats.collectedClueNumbers = [];
  }

  ensureUniquePush(stats.collectedClueNumbers, clueNumber);
  stats.collectedClueNumbers.sort((a, b) => Number(a) - Number(b));
}

function collectIssuedClue(stats, clueNumber) {
  if (!clueNumber) {
    return;
  }

  if (!Array.isArray(stats.issuedClueNumbers)) {
    stats.issuedClueNumbers = [];
  }

  ensureUniquePush(stats.issuedClueNumbers, clueNumber);
  stats.issuedClueNumbers.sort((a, b) => Number(a) - Number(b));
}

function collectTeamItem(stats, itemMeta = {}, pointId = '') {
  const itemId = String(itemMeta.itemId || itemMeta.id || '').trim();
  if (!itemId) {
    return null;
  }

  if (!Array.isArray(stats.collectedItems)) {
    stats.collectedItems = [];
  }

  const nextItem = {
    id: itemId,
    label: String(itemMeta.itemLabel || itemMeta.label || itemId).trim(),
    variant: String(itemMeta.variant || itemMeta.variantLabel || '').trim(),
    pointId: String(pointId || itemMeta.pointId || '').trim(),
    at: nowIso()
  };

  const existingIndex = stats.collectedItems.findIndex((item) => item.id === itemId);
  if (existingIndex >= 0) {
    stats.collectedItems[existingIndex] = nextItem;
  } else {
    stats.collectedItems.push(nextItem);
  }

  return nextItem;
}

function enrichTriggerItem(item) {
  const delivery = DELIVERY_CLUES[item.id] || null;
  return {
    ...item,
    clueNumber: item.clueNumber || delivery?.clueNumber || null,
    actionLabel: item.actionLabel || delivery?.actionLabel || item.text,
    doneLabel: item.doneLabel || null
  };
}

function fireTrigger(stats, triggerId, text, out, options = {}) {
  if (stats.triggersFired.includes(triggerId)) {
    return;
  }

  const item = {
    id: triggerId,
    text,
    at: nowIso(),
    requiresDelivery: Boolean(options.requiresDelivery),
    clueNumber: options.clueNumber || null,
    actionLabel: options.actionLabel || null,
    doneLabel: options.doneLabel || null
  };

  stats.triggersFired.push(triggerId);
  stats.triggerLog.push(item);
  out.push(enrichTriggerItem(item));
}

function collectPoiCount(stats, pointId) {
  const list = stats.poiVisitsByPoint[pointId] || [];
  return list.length;
}

function getPendingTriggers(stats) {
  const delivered = new Set(stats.deliveredTriggerIds || []);
  return (stats.triggerLog || [])
    .filter((item) => item.requiresDelivery && !delivered.has(item.id))
    .map((item) => enrichTriggerItem(item));
}

function getIssuedTriggers(stats) {
  const delivered = new Set(stats.deliveredTriggerIds || []);
  return (stats.triggerLog || [])
    .filter((item) => item.requiresDelivery && delivered.has(item.id))
    .map((item) => enrichTriggerItem(item))
    .map((item) => ({
      ...item,
      deliveredAt: item.deliveredAt || item.at,
      doneLabel: item.doneLabel || (item.clueNumber ? `Улика №${item.clueNumber} выдана` : 'Отмечено')
    }))
    .sort((left, right) => String(right.deliveredAt).localeCompare(String(left.deliveredAt)));
}

function buildItemDeliveryTrigger(item = {}) {
  const itemId = String(item.id || '').trim();
  const itemLabel = String(item.label || itemId).trim();
  const variant = String(item.variant || '').trim();
  const displayLabel = variant ? `${itemLabel}: ${variant}` : itemLabel;

  if (!itemId || !displayLabel) {
    return null;
  }

  return {
    id: `item_${itemId}`,
    text: `\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u0430 \u0443\u043b\u0438\u043a\u0443 \u00ab${displayLabel}\u00bb. \u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u044c\u0442\u0435 \u0435\u0451 \u043a \u0432\u044b\u0434\u0430\u0447\u0435 \u0432 \u043a\u0430\u0431\u0438\u043d\u0435\u0442\u0435 \u0414\u0432\u0438\u0436\u0435\u043d\u0438\u044f \u041f\u0435\u0440\u0432\u044b\u0445, \u043f\u0435\u0440\u0432\u044b\u0439 \u0437\u0430\u043b \u043d\u0430 \u0442\u0440\u0435\u0442\u044c\u0435\u043c \u044d\u0442\u0430\u0436\u0435.`,
    actionLabel: `\u0412\u044b\u0434\u0430\u0442\u044c \u0443\u043b\u0438\u043a\u0443 \u00ab${displayLabel}\u00bb`,
    doneLabel: `\u0423\u043b\u0438\u043a\u0430 \u00ab${displayLabel}\u00bb \u0432\u044b\u0434\u0430\u043d\u0430`
  };
}

function evaluateTriggers(stats) {
  const fresh = [];

  if (stats.moveCount >= 1) {
    fireTrigger(stats, 'route_started', 'Команда вышла на маршрут.', fresh);
  }
  if (stats.moveCount >= 5) {
    fireTrigger(stats, 'moves_5', '5 перемещений: можно готовить промежуточную улику.', fresh);
  }
  if (stats.moveCount >= 12) {
    fireTrigger(stats, 'moves_12', '12 перемещений: команда активно продвигается по делу.', fresh);
  }

  if ((stats.uniquePointIds || []).length >= 3) {
    fireTrigger(stats, 'cities_3', 'Команда прошла 3 города. Готовьте новый пакет улик.', fresh);
  }

  if (collectPoiCount(stats, 'pisa') >= 3) {
    fireTrigger(stats, 'pisa_citymap_done', 'Пиза закрыта: отмечены все точки города.', fresh);
  }

  (stats.collectedItems || []).forEach((item) => {
    const trigger = buildItemDeliveryTrigger(item);
    if (!trigger) {
      return;
    }

    fireTrigger(stats, trigger.id, trigger.text, fresh, {
      requiresDelivery: true,
      actionLabel: trigger.actionLabel,
      doneLabel: trigger.doneLabel
    });
  });

  (stats.solvedPointIds || []).forEach((pointId) => {
    const clueNumber = POINT_CLUE_NUMBERS[pointId];
    if (!clueNumber) {
      return;
    }

    fireTrigger(
      stats,
      `clue_${pointId}`,
      `После точки ${pointLabel(pointId)} нужно выдать улику №${clueNumber}.`,
      fresh,
      {
        requiresDelivery: true,
        clueNumber,
        actionLabel: `Выдать улику №${clueNumber}`
      }
    );
  });

  return fresh;
}

function adminStats(stats) {
  return {
    teamName: stats.teamName,
    moveCount: Number(stats.moveCount) || 0,
    uniquePointCount: Array.isArray(stats.uniquePointIds) ? stats.uniquePointIds.length : 0,
    solvedCount: Array.isArray(stats.solvedPointIds) ? stats.solvedPointIds.length : 0,
    collectedClueNumbers: Array.isArray(stats.collectedClueNumbers) ? stats.collectedClueNumbers.slice() : [],
    issuedClueNumbers: Array.isArray(stats.issuedClueNumbers) ? stats.issuedClueNumbers.slice() : [],
    collectedItems: Array.isArray(stats.collectedItems) ? stats.collectedItems.slice() : [],
    finalAnswerText: typeof stats.finalAnswerText === 'string' ? stats.finalAnswerText : '',
    finalAnswerAt: typeof stats.finalAnswerAt === 'string' ? stats.finalAnswerAt : '',
    finalAnswerMoveCount: Number(stats.finalAnswerMoveCount) || 0,
    pisaPoiCount: collectPoiCount(stats, 'pisa'),
    currentPointId: stats.currentPointId || '',
    currentPointLabel: pointLabel(stats.currentPointId || ''),
    updatedAt: stats.updatedAt || nowIso()
  };
}

function participantStats(stats) {
  const uniquePointIds = Array.isArray(stats.uniquePointIds)
    ? stats.uniquePointIds
        .map((pointId) => String(pointId || '').trim())
        .filter(Boolean)
    : [];
  const solvedPointIds = Array.isArray(stats.solvedPointIds)
    ? stats.solvedPointIds
        .map((pointId) => String(pointId || '').trim())
        .filter(Boolean)
    : [];

  return {
    teamName: stats.teamName,
    moveCount: Number(stats.moveCount) || 0,
    uniquePointIds,
    solvedPointIds,
    currentPointId: String(stats.currentPointId || '').trim(),
    finalAnswerText: typeof stats.finalAnswerText === 'string' ? stats.finalAnswerText : '',
    finalAnswerAt: typeof stats.finalAnswerAt === 'string' ? stats.finalAnswerAt : '',
    finalAnswerMoveCount: Number(stats.finalAnswerMoveCount) || 0,
    collectedItems: Array.isArray(stats.collectedItems) ? stats.collectedItems.slice() : [],
    updatedAt: stats.updatedAt || nowIso()
  };
}

function pushEvent(db, event) {
  db.events.push(event);
  if (db.events.length > MAX_EVENTS) {
    db.events.splice(0, db.events.length - MAX_EVENTS);
  }
}

function buildAdminRows(db) {
  let dirty = false;
  const rows = TEAM_NAMES.map((teamName) => {
    const stats = ensureTeamStats(db, teamName);
    const fresh = evaluateTriggers(stats);
    if (fresh.length > 0) {
      dirty = true;
    }
    const latestTrigger = (stats.triggerLog || [])[stats.triggerLog.length - 1] || null;
    return {
      teamName,
      ...adminStats(stats),
      recentRoute: (stats.routeLog || []).slice(-8).reverse(),
      pendingTriggers: getPendingTriggers(stats),
      issuedTriggers: getIssuedTriggers(stats),
      latestTrigger
    };
  });

  return { rows, dirty };
}

function buildFinalAnswers(rows) {
  return rows
    .filter((team) => team.finalAnswerText && team.finalAnswerAt)
    .map((team) => ({
      teamName: team.teamName,
      answer: team.finalAnswerText,
      answeredAt: team.finalAnswerAt,
      moveCountAtAnswer: Number(team.finalAnswerMoveCount) || 0
    }))
    .sort((left, right) => String(right.answeredAt).localeCompare(String(left.answeredAt)));
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function makeCsv(headers, rows) {
  const headerLine = headers.map((header) => csvEscape(header)).join(';');
  const rowLines = rows.map((row) => row.map((cell) => csvEscape(cell)).join(';'));
  return `\uFEFF${headerLine}\r\n${rowLines.join('\r\n')}`;
}

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'miniapp', timestamp: nowIso() });
});

app.get('/api/config', (_, res) => {
  res.json({
    ok: true,
    teams: TEAM_NAMES,
    timestamp: nowIso()
  });
});

function resolveCaseMapSource() {
  const mapsDir = path.join(PUBLIC_DIR, 'assets', 'maps');

  for (const candidate of MAP_SOURCE_CANDIDATES) {
    const absolutePath = path.join(mapsDir, candidate.fileName);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const stat = fs.statSync(absolutePath);
    const version = String(Math.trunc(Number(stat.mtimeMs) || Date.now()));
    const size = getImageSize(absolutePath, candidate.fileName);

    return {
      src: `./assets/maps/${candidate.fileName}?v=${version}`,
      fileName: candidate.fileName,
      mimeType: candidate.mimeType,
      size: Number(stat.size) || 0,
      width: Number(size?.width) || 0,
      height: Number(size?.height) || 0,
      updatedAt: new Date(Number(stat.mtimeMs) || Date.now()).toISOString()
    };
  }

  return null;
}

app.get('/api/map-source', (_, res) => {
  setNoCacheHeaders(res);

  const source = resolveCaseMapSource();
  if (!source) {
    res.status(404).json({ ok: false, error: 'map_not_found' });
    return;
  }

  res.json({
    ok: true,
    ...source,
    timestamp: nowIso()
  });
});

app.post('/api/register', async (req, res) => {
  try {
    const result = await mutateDb(async (db) => {
      const code = String(req.body?.code || '').trim();
      const sessionId = String(req.body?.sessionId || '').trim();
      const telegramUserId = req.body?.telegramUserId ? String(req.body.telegramUserId) : null;
      const deviceId = req.body?.deviceId ? String(req.body.deviceId) : null;

      let teamName = null;

      // Если есть sessionId, пытаемся восстановить сессию
      if (sessionId && db.sessions[sessionId]) {
        teamName = db.sessions[sessionId].teamName;
      } else {
        // Иначе проверяем код
        if (!code) {
          return { error: 'code_required', status: 400 };
        }

        // Находим команду по коду
        teamName = Object.keys(TEAM_CODES).find(name => TEAM_CODES[name] === code);
        
        if (!teamName) {
          return { error: 'invalid_code', status: 401 };
        }
      }

      const finalSessionId = sessionId || crypto.randomUUID();

      db.sessions[finalSessionId] = {
        sessionId: finalSessionId,
        teamName,
        telegramUserId,
        deviceId,
        updatedAt: nowIso(),
        createdAt: db.sessions[finalSessionId]?.createdAt || nowIso()
      };

      const stats = ensureTeamStats(db, teamName);
      stats.updatedAt = nowIso();

      return {
        ok: true,
        sessionId: finalSessionId,
        teamName,
        stats: participantStats(stats),
        triggers: (stats.triggerLog || []).slice(-5)
      };
    });

    if (result?.error) {
      res.status(result.status || 400).json({ ok: false, error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('[api/register] Error:', error);
    res.status(500).json({ ok: false, error: 'register_failed', detail: String(error?.message || error) });
  }
});

app.post('/api/event', async (req, res) => {
  try {
    const result = await mutateDb(async (db) => {
      const body = req.body || {};
      const sessionId = String(body.sessionId || '').trim();
      const eventType = String(body.type || '').trim();
      const pointId = String(body.pointId || '').trim();
      const meta = body.meta && typeof body.meta === 'object' ? body.meta : {};

      if (!sessionId || !eventType) {
        return { error: 'missing_fields', status: 400 };
      }

      const existingSession = db.sessions[sessionId] || null;
      const teamName = normalizeTeamName(body.teamName || existingSession?.teamName);
      if (!teamName) {
        return { error: 'team_required', status: 400 };
      }

      db.sessions[sessionId] = {
        sessionId,
        teamName,
        telegramUserId: existingSession?.telegramUserId || (body.telegramUserId ? String(body.telegramUserId) : null),
        deviceId: existingSession?.deviceId || (body.deviceId ? String(body.deviceId) : null),
        updatedAt: nowIso(),
        createdAt: existingSession?.createdAt || nowIso()
      };

      const stats = ensureTeamStats(db, teamName);
      stats.updatedAt = nowIso();

      if (eventType === 'travel') {
        stats.moveCount += 1;
      }

      if (pointId) {
        ensureUniquePush(stats.uniquePointIds, pointId);
      }

      if (eventType === 'task-solved' && pointId) {
        ensureUniquePush(stats.solvedPointIds, pointId);
        collectClueForPoint(stats, pointId);
      }

      if (meta.poiId && pointId) {
        if (!Array.isArray(stats.poiVisitsByPoint[pointId])) {
          stats.poiVisitsByPoint[pointId] = [];
        }
        ensureUniquePush(stats.poiVisitsByPoint[pointId], String(meta.poiId));
      }

      if (eventType === 'item-collected') {
        collectTeamItem(stats, meta, pointId);
      }

      if (pointId && (eventType === 'travel' || eventType === 'task-solved' || eventType === 'city-poi')) {
        appendRouteLog(stats, eventType, pointId, meta);
      }

      const event = {
        id: crypto.randomUUID(),
        sessionId,
        teamName,
        type: eventType,
        pointId,
        meta,
        at: nowIso()
      };

      pushEvent(db, event);
      const freshTriggers = evaluateTriggers(stats);

      return {
        ok: true,
        event,
        stats: participantStats(stats),
        triggers: freshTriggers
      };
    });

    if (result?.error) {
      res.status(result.status || 400).json({ ok: false, error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('[api/event] Error:', error);
    res.status(500).json({ ok: false, error: 'event_failed', detail: String(error?.message || error) });
  }
});

app.post('/api/final-answer', async (req, res) => {
  try {
    const result = await mutateDb(async (db) => {
      const body = req.body || {};
      const sessionId = String(body.sessionId || '').trim();
      const answer = String(body.answer || '').trim().slice(0, 400);

      if (!sessionId || !answer) {
        return { error: 'final_answer_required', status: 400 };
      }

      const existingSession = db.sessions[sessionId] || null;
      const teamName = normalizeTeamName(body.teamName || existingSession?.teamName);
      if (!teamName) {
        return { error: 'team_required', status: 400 };
      }

      db.sessions[sessionId] = {
        sessionId,
        teamName,
        telegramUserId: existingSession?.telegramUserId || (body.telegramUserId ? String(body.telegramUserId) : null),
        deviceId: existingSession?.deviceId || (body.deviceId ? String(body.deviceId) : null),
        updatedAt: nowIso(),
        createdAt: existingSession?.createdAt || nowIso()
      };

      const stats = ensureTeamStats(db, teamName);
      stats.finalAnswerText = answer;
      stats.finalAnswerAt = nowIso();
      stats.finalAnswerMoveCount = Number(stats.moveCount) || 0;
      stats.updatedAt = nowIso();

      pushEvent(db, {
        id: crypto.randomUUID(),
        sessionId,
        teamName,
        type: 'final-answer',
        pointId: '',
        meta: { answer },
        at: stats.finalAnswerAt
      });

      return {
        ok: true,
        teamName,
        finalAnswer: {
          text: stats.finalAnswerText,
          at: stats.finalAnswerAt
        },
        stats: participantStats(stats)
      };
    });

    if (result?.error) {
      res.status(result.status || 400).json({ ok: false, error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: 'final_answer_failed', detail: String(error?.message || error) });
  }
});

app.get('/api/team/:teamName/status', async (req, res) => {
  try {
    const db = await readDb();
    const teamName = normalizeTeamName(req.params.teamName);
    if (!teamName) {
      res.status(404).json({ ok: false, error: 'team_not_found' });
      return;
    }

    const stats = ensureTeamStats(db, teamName);
    res.json({
      ok: true,
      teamName,
      stats: participantStats(stats),
      triggers: (stats.triggerLog || []).slice(-8)
    });
  } catch (error) {
    console.error('[api/team/status] Error:', error);
    res.status(500).json({ ok: false, error: 'status_failed', detail: String(error?.message || error) });
  }
});

app.get('/api/admin/summary', async (_, res) => {
  try {
    const db = await readDb();
    const { rows, dirty } = buildAdminRows(db);
    const finalAnswers = buildFinalAnswers(rows);

    if (dirty) {
      await writeDb(db);
    }

    res.json({
      ok: true,
      teams: rows,
      finalAnswers,
      eventsTotal: db.events.length,
      updatedAt: nowIso()
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'summary_failed', detail: String(error?.message || error) });
  }
});

app.get('/api/admin/export/teams.csv', async (_, res) => {
  try {
    const db = await readDb();
    const { rows, dirty } = buildAdminRows(db);

    if (dirty) {
      await writeDb(db);
    }

    const csv = makeCsv(
      [
        'Команда',
        'Перемещения',
        'Города',
        'Решено',
        'Собранные улики',
        'Предметы',
        'Выданные улики',
        'Текущая точка',
        'Итоговый ответ',
        'Время ответа',
        'Перемещения на момент ответа',
        'Ожидают выдачи'
      ],
      rows.map((team) => [
        team.teamName,
        team.moveCount,
        team.uniquePointCount,
        team.solvedCount,
        (team.collectedClueNumbers || []).join(', '),
        (team.collectedItems || []).map((item) => item.variant ? `${item.label}: ${item.variant}` : item.label).join(' | '),
        (team.issuedClueNumbers || []).join(', '),
        team.currentPointLabel || '',
        team.finalAnswerText || '',
        team.finalAnswerAt || '',
        team.finalAnswerMoveCount || 0,
        (team.pendingTriggers || []).map((item) => item.actionLabel || item.text || '').join(' | ')
      ])
    );

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="miniapp-teams.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ ok: false, error: 'team_export_failed', detail: String(error?.message || error) });
  }
});

app.get('/api/admin/export/events.csv', async (_, res) => {
  try {
    const db = await readDb();
    const csv = makeCsv(
      ['Время', 'Команда', 'Тип', 'Точка', 'Данные'],
      (db.events || []).map((event) => [
        event.at || '',
        event.teamName || '',
        event.type || '',
        pointLabel(event.pointId || ''),
        event.meta ? JSON.stringify(event.meta) : ''
      ])
    );

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="miniapp-events.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ ok: false, error: 'event_export_failed', detail: String(error?.message || error) });
  }
});

app.post('/api/admin/team/:teamName/ack-trigger', async (req, res) => {
  try {
    const result = await mutateDb(async (db) => {
      const teamName = normalizeTeamName(req.params.teamName);
      const triggerId = String(req.body?.triggerId || '').trim();

      if (!teamName) {
        return { error: 'team_not_found', status: 404 };
      }

      if (!triggerId) {
        return { error: 'trigger_required', status: 400 };
      }

      const stats = ensureTeamStats(db, teamName);
      const exists = (stats.triggerLog || []).some((item) => item.id === triggerId && item.requiresDelivery);
      if (!exists) {
        return { error: 'trigger_not_found', status: 404 };
      }

      ensureUniquePush(stats.deliveredTriggerIds, triggerId);
      const triggerItem = (stats.triggerLog || []).find((item) => item.id === triggerId) || null;
      if (triggerItem) {
        triggerItem.deliveredAt = nowIso();
      }
      collectIssuedClue(stats, triggerItem?.clueNumber || DELIVERY_CLUES[triggerId]?.clueNumber || null);
      stats.updatedAt = nowIso();

      return {
        ok: true,
        teamName,
        pendingTriggers: getPendingTriggers(stats),
        issuedTriggers: getIssuedTriggers(stats),
        stats: participantStats(stats)
      };
    });

    if (result?.error) {
      res.status(result.status || 400).json({ ok: false, error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: 'ack_failed', detail: String(error?.message || error) });
  }
});
app.post('/api/admin/team/:teamName/clear-route', async (req, res) => {
  try {
    const result = await mutateDb(async (db) => {
      const teamName = normalizeTeamName(req.params.teamName);

      if (!teamName) {
        return { error: 'team_not_found', status: 404 };
      }

      const stats = ensureTeamStats(db, teamName);
      stats.routeLog = [];
      stats.currentPointId = '';
      stats.updatedAt = nowIso();

      return {
        ok: true,
        teamName,
        message: 'Перемещения очищены',
        stats: adminStats(stats)
      };
    });

    if (result?.error) {
      res.status(result.status || 400).json({ ok: false, error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: 'clear_route_failed', detail: String(error?.message || error) });
  }
});

app.post('/api/admin/reset-all', async (req, res) => {
  try {
    const result = await mutateDb(async (db) => {
      // Очищаем все сессии
      db.sessions = {};
      
      // Очищаем статистику всех команд
      TEAM_NAMES.forEach(teamName => {
        db.statsByTeam[teamName] = {
          teamName,
          moveCount: 0,
          uniquePointIds: [],
          solvedPointIds: [],
          collectedClueNumbers: [],
          issuedClueNumbers: [],
          collectedItems: [],
          finalAnswerText: '',
          finalAnswerAt: '',
          finalAnswerMoveCount: 0,
          poiVisitsByPoint: {},
          triggersFired: [],
          triggerLog: [],
          deliveredTriggerIds: [],
          routeLog: [],
          currentPointId: '',
          updatedAt: nowIso()
        };
      });
      
      // Очищаем события
      db.events = [];
      
      return {
        ok: true,
        message: 'Все данные очищены'
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: 'reset_failed', detail: String(error?.message || error) });
  }
});

app.get('/admin', (_, res) => {
  setNoCacheHeaders(res);
  res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
});

app.get('/', (_, res) => {
  setNoCacheHeaders(res);
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('*', (_, res) => {
  setNoCacheHeaders(res);
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, HOST, async () => {
  try {
    await initStorage();
    console.log(`[miniapp] http://${HOST}:${PORT} (${USE_POSTGRES ? 'postgres' : 'json'})`);
  } catch (error) {
    console.error('[miniapp] storage init failed', error);
  }
});
