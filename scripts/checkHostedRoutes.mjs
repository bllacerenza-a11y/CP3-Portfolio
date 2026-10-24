import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Opt-in probe against the real host. Vite preview does not apply vercel.json.
// GET only: never submits contact, logs in, or mutates hosted data.
const [baseArgument, expectedRevision, output = 'work/hosted-routes.json'] =
  process.argv.slice(2);
assert.ok(
  baseArgument && expectedRevision,
  'Pass URL and expected full Git SHA',
);
const base = new URL(baseArgument);
assert.equal(base.protocol, 'https:');
assert.equal(base.pathname, '/');
assert.ok(!base.username && !base.password && !base.search && !base.hash);
assert.match(expectedRevision, /^[0-9a-f]{40}$/);

const cases = [
  ['/projetos/vercel/next.js', 200, 'spa'],
  ['/projetos/vercel/cp3-t07-missing.repo', 200, 'spa'],
  ['/projetos/bllacerenza-a11y/GS_AETHER_EDGE', 200, 'spa'],
  ['/', 200, 'spa'],
  ['/login', 200, 'spa'],
  ['/dashboard', 200, 'spa'],
  ['/rota-inexistente', 200, 'spa'],
  ['/api/contact', 405, 'api'],
  ['/api', 404, 'missing'],
  ['/api/inexistente', 404, 'missing'],
  ['/api/contact.js', 404, 'missing'],
  ['/assets', 404, 'missing'],
  ['/assets/inexistente.js', 404, 'missing'],
  ['/.env', 404, 'missing'],
  ['/work/t04AuthProbe.html', 404, 'missing'],
  ['/arquivo-ausente.txt', 404, 'missing'],
  ['/deployment-inexistente.json', 404, 'missing'],
  ['/projetos/vercel/next.js/package.json', 404, 'missing'],
];
const results = [];
let home;
for (const [pathname, expectedStatus, kind] of cases) {
  const response = await fetch(new URL(pathname, base), {
    signal: AbortSignal.timeout(20000),
  });
  const body = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  const spaShell = /<div\s+id=["']root["']/.test(body);
  const correctBody =
    kind === 'spa'
      ? contentType.includes('text/html') && spaShell
      : kind === 'api'
        ? contentType.includes('application/json') &&
          JSON.parse(body).status === 'failed' &&
          response.headers.get('allow') === 'POST' &&
          response.headers.get('cache-control') === 'no-store'
        : !spaShell && !contentType.includes('text/html');
  results.push({
    pathname,
    expectedStatus,
    status: response.status,
    contentType,
    spaShell,
    passed: response.status === expectedStatus && correctBody,
  });
  if (pathname === '/') home = body;
}
const asset = home?.match(/src="(\/assets\/[^"<>]+\.js)"/)?.[1];
assert.ok(asset, 'Home must reference a built JS asset');
const assetResponse = await fetch(new URL(asset, base));
results.push({
  pathname: asset,
  expectedStatus: 200,
  status: assetResponse.status,
  contentType: assetResponse.headers.get('content-type'),
  passed:
    assetResponse.status === 200 &&
    !assetResponse.headers.get('content-type')?.includes('text/html'),
});
const metadataResponse = await fetch(new URL('/deployment.json', base));
const metadata = await metadataResponse.json();
const revisionMatches = metadata.revision === expectedRevision;
const report = {
  checkedAt: new Date().toISOString(),
  base: base.origin,
  expectedRevision,
  metadata,
  revisionMatches,
  requests: 'GET only',
  checks: results,
};
await mkdir(path.dirname(path.resolve(output)), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(
  JSON.stringify({
    revisionMatches,
    passed: results.filter((result) => result.passed).length,
    total: results.length,
    failures: results.filter((result) => !result.passed),
    report: output,
  }),
);
assert.ok(revisionMatches, 'Deployment revision differs from requested SHA');
assert.ok(
  results.every((result) => result.passed),
  'Hosted routing failed',
);
