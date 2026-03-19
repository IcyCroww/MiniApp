import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const BASE_URL = String(__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const START_VUS = Number(__ENV.START_VUS || 1);
const TARGET_VUS = Number(__ENV.TARGET_VUS || 80);
const RAMP_UP = String(__ENV.RAMP_UP || '1m');
const HOLD_FOR = String(__ENV.HOLD_FOR || '3m');
const RAMP_DOWN = String(__ENV.RAMP_DOWN || '30s');
const THINK_MIN = Number(__ENV.THINK_MIN || 0.2);
const THINK_MAX = Number(__ENV.THINK_MAX || 0.8);
const TEAM_NAME_OVERRIDE = String(__ENV.TEAM_NAME || '').trim();
const FINAL_ANSWER_TEXT = String(__ENV.FINAL_ANSWER || 'Нагрузочный тест: итоговый ответ отправлен.');

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'X-Load-Test': 'k6-miniapp-full-scenario'
};

const journeySuccess = new Rate('journey_success');
const pointEvents = new Counter('point_events_total');
const cityPoiEvents = new Counter('city_poi_events_total');

const FULL_POINT_FLOW = [
  { id: 'vatican', kind: 'slider' },
  { id: 'rome', kind: 'caesar' },
  { id: 'venice', kind: 'quiz' },
  { id: 'milan', kind: 'quiz' },
  { id: 'turin', kind: 'slider', assets: ['/assets/slider/oval-table.svg'] },
  { id: 'florence', kind: 'caesar' },
  { id: 'naples', kind: 'match' },
  { id: 'bologna', kind: 'hotspot', assets: ['/assets/puzzles/bologna-room.svg'] },
  { id: 'verona', kind: 'scanner', assets: ['/assets/puzzles/verona-scanner.svg'] },
  {
    id: 'pisa',
    kind: 'empty',
    cityPois: ['pizzeria', 'coffee', 'cityhall']
  },
  { id: 'palermo', kind: 'decoder', assets: ['/assets/puzzles/palermo-board.svg'] },
  { id: 'genoa_media', kind: 'chess' },
  { id: 'trieste', kind: 'rotor' },
  { id: 'siena', kind: 'hotspot', assets: ['/assets/puzzles/bologna-room.svg'] },
  { id: 'ravenna', kind: 'scanner', assets: ['/assets/puzzles/verona-scanner.svg'] },
  { id: 'matera', kind: 'rotor' },
  { id: 'bari', kind: 'decoder', assets: ['/assets/puzzles/bari-board.svg'] },
  { id: 'cagliari', kind: 'chess' }
];

export const options = {
  scenarios: {
    miniapp_full_flow: {
      executor: 'ramping-vus',
      startVUs: START_VUS,
      stages: [
        { duration: RAMP_UP, target: TARGET_VUS },
        { duration: HOLD_FOR, target: TARGET_VUS },
        { duration: RAMP_DOWN, target: 0 }
      ],
      gracefulRampDown: '30s'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.03'],
    checks: ['rate>0.97'],
    journey_success: ['rate>0.95'],
    'http_req_duration{kind:page}': ['p(95)<1500'],
    'http_req_duration{kind:api}': ['p(95)<1200'],
    'http_req_duration{kind:asset}': ['p(95)<2500']
  }
};

function pause(multiplier = 1) {
  const min = Math.max(0, THINK_MIN * multiplier);
  const max = Math.max(min, THINK_MAX * multiplier);
  sleep(min + Math.random() * (max - min));
}

function absoluteUrl(pathOrUrl = '') {
  if (!pathOrUrl) {
    return BASE_URL;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalized = String(pathOrUrl).replace(/^\.\//, '/');
  return `${BASE_URL}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
}

function getJson(path, tags = {}) {
  return http.get(absoluteUrl(path), {
    tags: { kind: 'api', ...tags },
    headers: {
      Accept: 'application/json',
      'X-Load-Test': JSON_HEADERS['X-Load-Test']
    }
  });
}

function getAsset(path, step = 'asset') {
  return http.get(absoluteUrl(path), {
    tags: { kind: 'asset', step },
    responseType: 'none',
    headers: {
      'X-Load-Test': JSON_HEADERS['X-Load-Test']
    }
  });
}

function postJson(path, body, tags = {}) {
  return http.post(absoluteUrl(path), JSON.stringify(body), {
    tags: { kind: 'api', ...tags },
    headers: JSON_HEADERS
  });
}

function expectOk(response, label) {
  return check(response, {
    [`${label} returned 2xx`]: (res) => res.status >= 200 && res.status < 300
  });
}

function expectJsonOk(response, label) {
  return check(response, {
    [`${label} returned 200`]: (res) => res.status === 200,
    [`${label} ok=true`]: (res) => {
      try {
        return Boolean(res.json('ok'));
      } catch (_) {
        return false;
      }
    }
  });
}

function pickTeam(configTeams) {
  if (TEAM_NAME_OVERRIDE) {
    return TEAM_NAME_OVERRIDE;
  }

  const teams = Array.isArray(configTeams) ? configTeams : [];
  if (!teams.length) {
    return 'Новый Вавилон';
  }

  return teams[(__VU + __ITER) % teams.length];
}

function buildSessionId() {
  const suffix = Math.floor(Math.random() * 1000000);
  return `k6-${__VU}-${__ITER}-${Date.now()}-${suffix}`;
}

function buildDeviceId() {
  return `k6-device-${__VU}-${__ITER}`;
}

function openMiniappShell() {
  const responses = http.batch([
    ['GET', absoluteUrl('/'), null, { tags: { kind: 'page', step: 'index' } }],
    ['GET', absoluteUrl('/styles.css'), null, { tags: { kind: 'asset', step: 'styles' }, responseType: 'none' }],
    ['GET', absoluteUrl('/app.js'), null, { tags: { kind: 'asset', step: 'app' }, responseType: 'none' }],
    ['GET', absoluteUrl('/sequential-map-manual.html'), null, { tags: { kind: 'page', step: 'prototype-page' } }],
    ['GET', absoluteUrl('/assets/maps/sequential-city-map.svg'), null, { tags: { kind: 'asset', step: 'prototype-map' }, responseType: 'none' }],
    ['GET', absoluteUrl('/assets/media/test-photo.svg'), null, { tags: { kind: 'asset', step: 'prototype-photo' }, responseType: 'none' }],
    ['GET', absoluteUrl('/assets/maps/italy-schematic.svg'), null, { tags: { kind: 'asset', step: 'fallback-map' }, responseType: 'none' }]
  ]);

  const [indexResponse, stylesResponse, appResponse, prototypeResponse, cityMapResponse, photoResponse, fallbackMapResponse] = responses;

  let ok = true;
  ok = expectOk(indexResponse, 'index page') && ok;
  ok = check(indexResponse, {
    'index page contains MiniApp Quest': (res) => res.body && res.body.includes('MiniApp Quest')
  }) && ok;
  ok = expectOk(stylesResponse, 'styles.css') && ok;
  ok = expectOk(appResponse, 'app.js') && ok;
  ok = expectOk(prototypeResponse, 'prototype page') && ok;
  ok = expectOk(cityMapResponse, 'prototype city map asset') && ok;
  ok = expectOk(photoResponse, 'test photo asset') && ok;
  ok = expectOk(fallbackMapResponse, 'fallback italy map asset') && ok;
  return ok;
}

function loadBootstrapData() {
  const healthResponse = getJson('/health', { step: 'health' });
  const configResponse = getJson('/api/config', { step: 'config' });
  const mapSourceResponse = getJson('/api/map-source', { step: 'map-source' });

  let ok = true;
  ok = expectJsonOk(healthResponse, 'health') && ok;
  ok = expectJsonOk(configResponse, 'config') && ok;
  ok = expectJsonOk(mapSourceResponse, 'map source') && ok;

  let config;
  let mapSource;

  try {
    config = configResponse.json();
  } catch (_) {
    config = {};
    ok = false;
  }

  try {
    mapSource = mapSourceResponse.json();
  } catch (_) {
    mapSource = {};
    ok = false;
  }

  if (mapSource?.src) {
    const imageResponse = getAsset(mapSource.src, 'team-map-image');
    ok = expectOk(imageResponse, 'resolved team map image') && ok;
  } else {
    ok = false;
  }

  return {
    ok,
    config,
    mapSource
  };
}

function registerTeam(teamName, sessionId, deviceId) {
  const response = postJson(
    '/api/register',
    {
      teamName,
      sessionId,
      deviceId,
      telegramUserId: null
    },
    { step: 'register' }
  );

  let ok = expectJsonOk(response, 'register');
  let payload = {};

  try {
    payload = response.json();
  } catch (_) {
    ok = false;
  }

  ok = check(payload, {
    'register returns sessionId': (data) => Boolean(data?.sessionId),
    'register returns teamName': (data) => Boolean(data?.teamName)
  }) && ok;

  return {
    ok,
    payload
  };
}

function getTeamStatus(teamName) {
  const response = getJson(`/api/team/${encodeURIComponent(teamName)}/status`, { step: 'team-status' });
  const ok = expectJsonOk(response, 'team status');
  return { ok, response };
}

function postEvent(sessionId, teamName, deviceId, type, pointId = '', meta = {}) {
  const response = postJson(
    '/api/event',
    {
      sessionId,
      teamName,
      deviceId,
      telegramUserId: null,
      type,
      pointId,
      meta
    },
    { step: type, eventType: type, pointId: pointId || 'none' }
  );

  const ok = expectJsonOk(response, `${type} event`);
  pointEvents.add(1);
  return { ok, response };
}

function submitFinalAnswer(sessionId, teamName, deviceId) {
  const response = postJson(
    '/api/final-answer',
    {
      sessionId,
      teamName,
      deviceId,
      telegramUserId: null,
      answer: FINAL_ANSWER_TEXT
    },
    { step: 'final-answer' }
  );

  const ok = expectJsonOk(response, 'final answer');
  return { ok, response };
}

export default function () {
  let ok = true;
  const uniqueAssets = new Set();

  group('open-miniapp-shell', () => {
    ok = openMiniappShell() && ok;
  });

  pause();

  let bootstrap = { ok: false, config: {}, mapSource: {} };
  group('bootstrap-data', () => {
    bootstrap = loadBootstrapData();
    ok = bootstrap.ok && ok;
  });

  const teamName = pickTeam(bootstrap?.config?.teams);
  const sessionId = buildSessionId();
  const deviceId = buildDeviceId();

  pause();

  group('team-registration', () => {
    const registration = registerTeam(teamName, sessionId, deviceId);
    ok = registration.ok && ok;
  });

  pause();

  group('open-team-status', () => {
    const statusResult = getTeamStatus(teamName);
    ok = statusResult.ok && ok;
  });

  for (const point of FULL_POINT_FLOW) {
    pause(0.6);

    group(`point-${point.id}`, () => {
      const travelResult = postEvent(sessionId, teamName, deviceId, 'travel', point.id, {
        source: point.id === 'pisa' ? 'city-entry' : 'point'
      });
      ok = travelResult.ok && ok;

      for (const assetPath of point.assets || []) {
        if (uniqueAssets.has(assetPath)) {
          continue;
        }
        uniqueAssets.add(assetPath);
        const assetResult = getAsset(assetPath, `point-asset-${point.id}`);
        ok = expectOk(assetResult, `${point.id} asset`) && ok;
      }

      if (point.kind === 'empty') {
        for (const poiId of point.cityPois || []) {
          pause(0.3);
          const cityPoiResult = postEvent(sessionId, teamName, deviceId, 'city-poi', point.id, { poiId });
          cityPoiEvents.add(1);
          ok = cityPoiResult.ok && ok;
        }
        return;
      }

      pause(0.35);
      const solvedResult = postEvent(sessionId, teamName, deviceId, 'task-solved', point.id, {
        kind: point.kind
      });
      ok = solvedResult.ok && ok;
    });
  }

  pause();

  group('final-answer', () => {
    const finalAnswerResult = submitFinalAnswer(sessionId, teamName, deviceId);
    ok = finalAnswerResult.ok && ok;
  });

  pause(0.5);

  group('final-team-status', () => {
    const statusResult = getTeamStatus(teamName);
    ok = statusResult.ok && ok;
  });

  journeySuccess.add(ok ? 1 : 0);
}
