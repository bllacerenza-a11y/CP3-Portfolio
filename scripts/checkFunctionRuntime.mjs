import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Compile the actual Function graph, then execute emitted ESM without a TS loader.
// Playwright transforms TS imports and would conceal Node's extension requirements.
const cache = path.resolve('node_modules/.cache');
await mkdir(cache, { recursive: true });
const directory = await mkdtemp(path.join(cache, 'cp3-function-'));
let server;
try {
  const compiled = spawnSync(
    process.execPath,
    [
      'node_modules/typescript/bin/tsc',
      '--ignoreConfig',
      'api/contact.ts',
      '--outDir',
      directory,
      '--noEmit',
      'false',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      '--target',
      'ES2023',
      '--types',
      'node',
      '--strict',
      '--skipLibCheck',
    ],
    { encoding: 'utf8' },
  );
  assert.equal(compiled.status, 0, compiled.stdout + compiled.stderr);
  // Explicit synthetic configuration. Invalid payloads never reach persistence/email.
  Object.assign(process.env, {
    VERCEL: '1',
    SUPABASE_URL: 'https://runtime-fixture.supabase.co',
    SUPABASE_SECRET_KEY: 'synthetic-service-key-not-real',
    CONTACT_RATE_LIMIT_SECRET: 'synthetic-rate-limit-secret-not-real',
    CONTACT_ALLOWED_ORIGINS: 'https://runtime.example',
  });
  const { default: handler } = await import(
    pathToFileURL(path.join(directory, 'api/contact.js')).href
  );
  server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/contact`;
  const get = await fetch(url);
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('allow'), 'POST');
  assert.equal(get.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await get.json(), { status: 'failed', retryable: false });
  const invalid = await fetch(url, {
    method: 'POST',
    headers: {
      Origin: 'https://runtime.example',
      'Content-Type': 'application/json',
      'x-vercel-forwarded-for': '192.0.2.1',
    },
    body: '{}',
  });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).status, 'invalid');
  console.log(
    'Function emitted ESM: GET 405 and invalid POST 400 passed; no external writes.',
  );
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  // directory is generated directly under the project's node_modules/.cache.
  assert.equal(path.dirname(directory), cache);
  await rm(directory, { recursive: true, force: true });
}
