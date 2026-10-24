import { mkdir, writeFile } from 'node:fs/promises';
import { createServer, loadEnv, preview } from 'vite';

// Opt-in local QA runtime: built SPA + the actual Node contact adapter.
// No secrets are returned to the browser, logged or written to the receipt.
const port = 4186;
const origin = `http://127.0.0.1:${port}`;
const allowContact = process.argv.includes('--allow-contact');
const env = {
  ...process.env,
  ...loadEnv('production', process.cwd(), ''),
  CONTACT_ALLOWED_ORIGINS: origin,
};
const runner = await createServer({
  server: { middlewareMode: true, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: 'custom',
});
const { createContactHandler } = await runner.ssrLoadModule('/api/contact.ts');
const { createContactDependencies } = await runner.ssrLoadModule(
  '/server/contactDependencies.ts',
);
const receipt = { requests: 0, providerCalls: 0, results: [] };
await mkdir('work', { recursive: true });
const trackedFetch = async (input, options) => {
  if (String(input) === 'https://api.resend.com/emails')
    receipt.providerCalls++;
  return fetch(input, options);
};
const handler = createContactHandler(
  () => createContactDependencies(env, trackedFetch),
  false,
);
const app = await preview({
  build: { outDir: 'work/t06-production' },
  preview: { host: '127.0.0.1', port, strictPort: true },
  plugins: [
    {
      name: 'local-qa-contact',
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.split('?')[0] !== '/api/contact') return next();
          if (!allowContact) {
            response.writeHead(503, { 'Content-Type': 'application/json' });
            response.end('{"status":"failed","retryable":false}');
            return;
          }
          receipt.requests++;
          response.once('finish', () => {
            receipt.results.push({
              at: new Date().toISOString(),
              status: response.statusCode,
            });
            void writeFile(
              'work/t06ContactRuntime.json',
              JSON.stringify(receipt, null, 2),
            );
          });
          void handler(request, response);
        });
      },
    },
  ],
});
console.log(
  `QA local: ${origin}; contato real ${allowContact ? 'habilitado deliberadamente' : 'bloqueado (use --allow-contact)'}.`,
);
async function close() {
  await new Promise((resolve) => app.httpServer.close(resolve));
  await runner.close();
  process.exit(0);
}
process.once('SIGINT', () => void close());
process.once('SIGTERM', () => void close());
