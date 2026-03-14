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
  'Вика',
  'ОУИ'
];

const TEAM_NAME_ALIASES = {
  'новое поколение': 'ОУИ'
};

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
  genoa_media: 'Генуя'
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

app.use(express.static(path.join(__dirname, 'public')));

function nowIso() {
  return new Date().toISOString();
}

function normalizeTeamName(raw) {
  const prepared = String(raw || '').trim();
  const normalized = prepared.toLowerCase();
  const canonical = TEAM_NAME_ALIASES[normalized] || prepared;
  return TEAM_NAMES.find((team) => team.toLowerCase() === canonical.toLowerCase()) || null;
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
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
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
    if (!Array.isArray(stats.routeLog)) {
      stats.routeLog = [];
    }
    if (typeof stats.currentPointId !== 'string') {
      stats.currentPointId = '';
    }
  });

  return parsed;
}

function readFileDb() {
  ensureDbExists();
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  return normalizeDb(JSON.parse(raw));
}

function writeFileDb(db) {
  db.updatedAt = nowIso();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
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
          seed = normalizeDb(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
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
  return POINT_LABELS[pointId] || pointId || '';
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

  if (stats.routeLog.length > 25) {
    stats.routeLog.splice(0, stats.routeLog.length - 25);
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

function enrichTriggerItem(item) {
  const delivery = DELIVERY_CLUES[item.id] || null;
  return {
    ...item,
    clueNumber: item.clueNumber || delivery?.clueNumber || null,
    actionLabel: item.actionLabel || delivery?.actionLabel || item.text
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
    actionLabel: options.actionLabel || null
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
      doneLabel: item.clueNumber ? `Улика №${item.clueNumber} выдана` : 'Улика выдана'
    }))
    .sort((left, right) => String(right.deliveredAt).localeCompare(String(left.deliveredAt)));
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

function publicStats(stats) {
  return {
    teamName: stats.teamName,
    moveCount: Number(stats.moveCount) || 0,
    uniquePointCount: Array.isArray(stats.uniquePointIds) ? stats.uniquePointIds.length : 0,
    solvedCount: Array.isArray(stats.solvedPointIds) ? stats.solvedPointIds.length : 0,
    collectedClueNumbers: Array.isArray(stats.collectedClueNumbers) ? stats.collectedClueNumbers.slice() : [],
    issuedClueNumbers: Array.isArray(stats.issuedClueNumbers) ? stats.issuedClueNumbers.slice() : [],
    finalAnswerText: typeof stats.finalAnswerText === 'string' ? stats.finalAnswerText : '',
    finalAnswerAt: typeof stats.finalAnswerAt === 'string' ? stats.finalAnswerAt : '',
    finalAnswerMoveCount: Number(stats.finalAnswerMoveCount) || 0,
    pisaPoiCount: collectPoiCount(stats, 'pisa'),
    currentPointId: stats.currentPointId || '',
    currentPointLabel: pointLabel(stats.currentPointId || ''),
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
      ...publicStats(stats),
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

app.post('/api/register', async (req, res) => {
  try {
    const result = await mutateDb(async (db) => {
      const teamName = normalizeTeamName(req.body?.teamName);

      if (!teamName) {
        return { error: 'unknown_team', status: 400 };
      }

      const sessionId = String(req.body?.sessionId || crypto.randomUUID());
      const telegramUserId = req.body?.telegramUserId ? String(req.body.telegramUserId) : null;
      const deviceId = req.body?.deviceId ? String(req.body.deviceId) : null;

      db.sessions[sessionId] = {
        sessionId,
        teamName,
        telegramUserId,
        deviceId,
        updatedAt: nowIso(),
        createdAt: db.sessions[sessionId]?.createdAt || nowIso()
      };

      const stats = ensureTeamStats(db, teamName);
      stats.updatedAt = nowIso();

      return {
        ok: true,
        sessionId,
        teamName,
        stats: publicStats(stats),
        triggers: (stats.triggerLog || []).slice(-5)
      };
    });

    if (result?.error) {
      res.status(result.status || 400).json({ ok: false, error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
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

      if (eventType === 'travel' || eventType === 'city-poi') {
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
        stats: publicStats(stats),
        triggers: freshTriggers
      };
    });

    if (result?.error) {
      res.status(result.status || 400).json({ ok: false, error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
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
          at: stats.finalAnswerAt,
          moveCount: stats.finalAnswerMoveCount
        },
        stats: publicStats(stats)
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
      stats: publicStats(stats),
      triggers: (stats.triggerLog || []).slice(-8)
    });
  } catch (error) {
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
        stats: publicStats(stats)
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

app.get('/admin', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, async () => {
  try {
    await initStorage();
    console.log(`[miniapp] http://${HOST}:${PORT} (${USE_POSTGRES ? 'postgres' : 'json'})`);
  } catch (error) {
    console.error('[miniapp] storage init failed', error);
  }
});
