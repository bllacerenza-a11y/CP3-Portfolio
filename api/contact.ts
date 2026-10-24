import type { IncomingMessage, ServerResponse } from 'node:http';
import { isIP } from 'node:net';
import { handleContact } from '../server/contact';
import type { ContactDependencies } from '../server/contact';
import { createContactDependencies } from '../server/contactDependencies';

const maxBodyBytes = 32 * 1024;
type NodeRequest = IncomingMessage & { body?: unknown };

async function readBody(request: NodeRequest): Promise<unknown> {
  const declaredBytes = Number(request.headers['content-length']);
  if (Number.isFinite(declaredBytes) && declaredBytes > maxBodyBytes)
    throw new RangeError('Payload too large');
  if (request.body !== undefined) {
    const text = JSON.stringify(request.body);
    if (Buffer.byteLength(text) > maxBodyBytes)
      throw new RangeError('Payload too large');
    // Vercel's body helper already parsed JSON. Do not accept double-encoded JSON.
    return request.body;
  }
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > maxBodyBytes) throw new RangeError('Payload too large');
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}

export function createContactHandler(
  dependencies: () => ContactDependencies,
  onVercel: boolean,
) {
  return async (request: NodeRequest, response: ServerResponse) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const reply = (statusCode: number, body: unknown) => {
      response.statusCode = statusCode;
      response.end(JSON.stringify(body));
    };
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      reply(405, { status: 'failed', retryable: false });
      return;
    }
    try {
      // Only trust the header overwritten by Vercel on Vercel. Local runner uses socket IP.
      const forwarded = request.headers['x-vercel-forwarded-for'];
      const clientIp = onVercel
        ? typeof forwarded === 'string' && isIP(forwarded)
          ? forwarded
          : undefined
        : request.socket.remoteAddress;
      const result = await handleContact(
        {
          method: request.method,
          origin: request.headers.origin,
          contentType: request.headers['content-type'],
          clientIp,
          body: await readBody(request),
        },
        dependencies(),
      );
      for (const [key, value] of Object.entries(result.headers ?? {}))
        response.setHeader(key, value);
      reply(result.statusCode, result.body);
    } catch (error) {
      if (error instanceof RangeError)
        reply(413, { status: 'failed', retryable: false });
      else if (error instanceof SyntaxError)
        reply(400, { status: 'invalid', fields: {} });
      else reply(503, { status: 'failed', retryable: true });
    }
  };
}

export default createContactHandler(
  () => createContactDependencies(process.env),
  process.env.VERCEL === '1',
);
