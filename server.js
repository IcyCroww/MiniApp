const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');

const app = express();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'miniapp-db.json');
const MAX_EVENTS = 10000;

const TEAM_NAMES = [
  'Новый Вавилон',
  'Эльдорадо',
  'Счастливое государство',
  'Юксайленд',
  'Атлантида',
  'Ювента',
  'Орион',
  'Вика',
  'Новое поколение'
];

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
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDbExists();
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  const parsed = JSON.parse(raw);

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

  return parsed;
}

function writeDb(db) {
  db.updatedAt = nowIso();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function ensureTeamStats(db, teamName) {
  if (!db.statsByTeam[teamName]) {
    db.statsByTeam[teamName] = {
      teamName,
      moveCount: 0,
      uniquePointIds: [],
      solvedPointIds: [],
      poiVisitsByPoint: {},
      triggersFired: [],
      triggerLog: [],
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

function fireTrigger(stats, triggerId, text, out) {
  if (stats.triggersFired.includes(triggerId)) {
    return;
  }

  const item = {
    id: triggerId,
    text,
    at: nowIso()
  };

  stats.triggersFired.push(triggerId);
  stats.triggerLog.push(item);
  out.push(item);
}

function collectPoiCount(stats, pointId) {
  const list = stats.poiVisitsByPoint[pointId] || [];
  return list.length;
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

  return fresh;
}

function publicStats(stats) {
  return {
    teamName: stats.teamName,
    moveCount: Number(stats.moveCount) || 0,
    uniquePointCount: Array.isArray(stats.uniquePointIds) ? stats.uniquePointIds.length : 0,
    solvedCount: Array.isArray(stats.solvedPointIds) ? stats.solvedPointIds.length : 0,
    pisaPoiCount: collectPoiCount(stats, 'pisa'),
    updatedAt: stats.updatedAt || nowIso()
  };
}

function pushEvent(db, event) {
  db.events.push(event);
  if (db.events.length > MAX_EVENTS) {
    db.events.splice(0, db.events.length - MAX_EVENTS);
  }
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

app.post('/api/register', (req, res) => {
  try {
    const db = readDb();
    const teamName = normalizeTeamName(req.body?.teamName);

    if (!teamName) {
      res.status(400).json({ ok: false, error: 'unknown_team' });
      return;
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

    writeDb(db);

    res.json({
      ok: true,
      sessionId,
      teamName,
      stats: publicStats(stats),
      triggers: (stats.triggerLog || []).slice(-5)
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'register_failed', detail: String(error?.message || error) });
  }
});

app.post('/api/event', (req, res) => {
  try {
    const db = readDb();
    const body = req.body || {};
    const sessionId = String(body.sessionId || '').trim();
    const eventType = String(body.type || '').trim();
    const pointId = String(body.pointId || '').trim();
    const meta = body.meta && typeof body.meta === 'object' ? body.meta : {};

    if (!sessionId || !eventType) {
      res.status(400).json({ ok: false, error: 'missing_fields' });
      return;
    }

    const existingSession = db.sessions[sessionId] || null;
    const teamName = normalizeTeamName(body.teamName || existingSession?.teamName);
    if (!teamName) {
      res.status(400).json({ ok: false, error: 'team_required' });
      return;
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
    }

    if (meta.poiId && pointId) {
      if (!Array.isArray(stats.poiVisitsByPoint[pointId])) {
        stats.poiVisitsByPoint[pointId] = [];
      }
      ensureUniquePush(stats.poiVisitsByPoint[pointId], String(meta.poiId));
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
    writeDb(db);

    res.json({
      ok: true,
      event,
      stats: publicStats(stats),
      triggers: freshTriggers
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'event_failed', detail: String(error?.message || error) });
  }
});

app.get('/api/team/:teamName/status', (req, res) => {
  try {
    const db = readDb();
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

app.get('/api/admin/summary', (_, res) => {
  try {
    const db = readDb();
    const rows = TEAM_NAMES.map((teamName) => {
      const stats = ensureTeamStats(db, teamName);
      const latestTrigger = (stats.triggerLog || [])[stats.triggerLog.length - 1] || null;
      return {
        teamName,
        ...publicStats(stats),
        latestTrigger
      };
    });

    res.json({
      ok: true,
      teams: rows,
      eventsTotal: db.events.length,
      updatedAt: nowIso()
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'summary_failed', detail: String(error?.message || error) });
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

app.listen(PORT, HOST, () => {
  ensureDbExists();
  console.log(`[miniapp] http://${HOST}:${PORT}`);
});
