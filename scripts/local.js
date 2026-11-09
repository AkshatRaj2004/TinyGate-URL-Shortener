#!/usr/bin/env node
/**
 * TinyGate — one-command local runner.
 *
 *   npm run local        start MongoDB (if needed), API on :5000 and web on :3000
 *   npm run local:stop   stop the MongoDB container started by this script
 *
 * Steps:
 *   1. Create .env from .env.example if missing (with a random JWT secret).
 *   2. Install npm dependencies for the API and the client if missing.
 *   3. Use MONGO_URI from .env. If it points at localhost and nothing is
 *      listening there, start MongoDB with docker-compose.dev.yml.
 *      Remote URIs (e.g. Atlas) are used as-is and Docker is not needed.
 *   4. Run the API (nodemon) and the Vite dev server together; Ctrl+C stops both.
 */
const { spawn, spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const net = require('net');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLIENT = path.join(ROOT, 'client');
const ENV_FILE = path.join(ROOT, '.env');
const COMPOSE_FILE = path.join(ROOT, 'docker-compose.dev.yml');
const MONGO_CONTAINER = 'tinygate_mongo_dev';
const isWin = process.platform === 'win32';

// ── Output helpers ────────────────────────────────────────────────────────────
const c = (code) => (s) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const dim = c('2'), bold = c('1'), red = c('31'), green = c('32'), yellow = c('33'), cyan = c('36'), magenta = c('35');
const step = (msg) => console.log(`${cyan('›')} ${msg}`);
const ok = (msg) => console.log(`${green('✓')} ${msg}`);
const warn = (msg) => console.log(`${yellow('!')} ${msg}`);
const fail = (msg) => { console.error(`${red('✗')} ${msg}`); process.exit(1); };

const run = (cmd, opts = {}) => spawnSync(cmd, { shell: true, stdio: 'inherit', cwd: ROOT, ...opts });
const runQuiet = (cmd) => spawnSync(cmd, { shell: true, cwd: ROOT, encoding: 'utf8' });

const portOpen = (port, host = '127.0.0.1', timeout = 800) =>
  new Promise((resolve) => {
    const sock = net.connect({ port, host });
    const done = (val) => { sock.destroy(); resolve(val); };
    sock.setTimeout(timeout, () => done(false));
    sock.once('connect', () => done(true));
    sock.once('error', () => done(false));
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Stop mode ─────────────────────────────────────────────────────────────────
if (process.argv.includes('--stop')) {
  step('Stopping local MongoDB container…');
  const r = run(`docker compose -f "${COMPOSE_FILE}" down`);
  process.exit(r.status ?? 0);
}

// ── 1. Environment file ───────────────────────────────────────────────────────
const ensureEnv = () => {
  if (fs.existsSync(ENV_FILE)) return ok('.env found');
  const example = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8');
  const secret = crypto.randomBytes(48).toString('hex');
  const env = example
    .replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`)
    .replace(/^MONGO_URI=.*$/m, 'MONGO_URI=mongodb://127.0.0.1:27017/tinygate');
  fs.writeFileSync(ENV_FILE, env);
  ok('Created .env from .env.example (local MongoDB, random JWT secret)');
};

const readEnv = () => {
  const out = {};
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return out;
};

// ── 2. Dependencies ───────────────────────────────────────────────────────────
const ensureDeps = (dir, label) => {
  if (fs.existsSync(path.join(dir, 'node_modules'))) return ok(`${label} dependencies installed`);
  step(`Installing ${label} dependencies (first run only)…`);
  const r = run('npm install', { cwd: dir });
  if (r.status !== 0) fail(`npm install failed in ${path.relative(ROOT, dir) || '.'}`);
};

// ── 3. MongoDB ────────────────────────────────────────────────────────────────
const parseMongoHost = (uri) => {
  if (!uri || uri.startsWith('mongodb+srv://')) return null; // Atlas / SRV → remote
  const m = uri.match(/^mongodb:\/\/(?:[^@/]+@)?([^/,?]+)/);
  if (!m) return null;
  const [host, port = '27017'] = m[1].split(':');
  return { host, port: Number(port) };
};

const ensureMongo = async (uri) => {
  const target = parseMongoHost(uri);
  const isLocal = target && ['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(target.host);

  if (!isLocal) {
    ok(`Using remote MongoDB from .env ${dim('(Docker not needed)')}`);
    return;
  }

  if (await portOpen(target.port)) {
    ok(`MongoDB reachable on localhost:${target.port}`);
    return;
  }

  step(`Nothing on localhost:${target.port} — starting MongoDB in Docker…`);
  if (runQuiet('docker --version').status !== 0) {
    fail(
      'Docker is not installed and no MongoDB is running.\n' +
      '  Install Docker Desktop (https://docs.docker.com/get-docker/), or install MongoDB locally,\n' +
      '  or put a MongoDB Atlas URI in MONGO_URI in .env.'
    );
  }
  if (runQuiet('docker info').status !== 0) {
    fail('Docker is installed but the Docker engine is not running. Start Docker Desktop and run this again.');
  }

  const up = run(`docker compose -f "${COMPOSE_FILE}" up -d`);
  if (up.status !== 0) fail('docker compose failed to start MongoDB (is port 27017 used by something else?).');

  process.stdout.write(`${cyan('›')} Waiting for MongoDB to accept connections`);
  for (let i = 0; i < 60; i += 1) {
    const h = runQuiet(`docker inspect --format "{{.State.Health.Status}}" ${MONGO_CONTAINER}`);
    if (h.stdout && h.stdout.trim() === 'healthy') {
      process.stdout.write('\n');
      ok(`MongoDB running in Docker ${dim(`(container ${MONGO_CONTAINER})`)}`);
      return;
    }
    process.stdout.write('.');
    await sleep(1000);
  }
  process.stdout.write('\n');
  fail(`MongoDB did not become healthy in 60s. Check: docker logs ${MONGO_CONTAINER}`);
};

// ── 4. Run API + web ──────────────────────────────────────────────────────────
const children = [];

const startProc = (name, color, cmd, cwd, extraEnv = {}) => {
  const child = spawn(cmd, {
    cwd,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1', ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const prefix = color(name.padEnd(4)) + dim(' │ ');
  const pipe = (stream, out) => {
    let buf = '';
    stream.on('data', (d) => {
      buf += d.toString();
      const lines = buf.split(/\r?\n/);
      buf = lines.pop();
      for (const l of lines) out.write(`${prefix}${l}\n`);
    });
  };
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on('exit', (code) => {
    if (!shuttingDown) {
      console.log(`${prefix}${red(`exited with code ${code}`)}`);
      shutdown(code || 1);
    }
  });
  children.push(child);
  return child;
};

let shuttingDown = false;
const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${dim('Stopping API and web… (MongoDB keeps running; `npm run local:stop` to stop it)')}`);
  for (const child of children) {
    if (child.exitCode !== null) continue;
    if (isWin) spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else child.kill('SIGINT');
  }
  setTimeout(() => process.exit(code), 300);
};
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log(bold('\nTinyGate — local dev\n'));

  const [major] = process.versions.node.split('.').map(Number);
  if (major < 18) fail(`Node 18+ required (found ${process.versions.node}).`);

  ensureEnv();
  const env = readEnv();
  const apiPort = Number(env.PORT || 5000);

  ensureDeps(ROOT, 'API');
  ensureDeps(CLIENT, 'client');

  if (await portOpen(apiPort)) {
    fail(`Port ${apiPort} is already in use. Stop whatever is running there (or change PORT in .env).`);
  }

  await ensureMongo(env.MONGO_URI);

  const apiUrl = `http://localhost:${apiPort}`;
  console.log('');
  console.log(`  ${bold('Web')}  http://localhost:3000`);
  console.log(`  ${bold('API')}  ${apiUrl}  ${dim('(health: /health)')}`);
  console.log(`  ${dim('Ctrl+C to stop')}\n`);

  startProc('api', magenta, 'npm run dev', ROOT, { BASE_URL: env.BASE_URL || apiUrl });
  startProc('web', cyan, 'npm run dev', CLIENT, { VITE_API_URL: apiUrl });
})().catch((err) => fail(err.stack || String(err)));
