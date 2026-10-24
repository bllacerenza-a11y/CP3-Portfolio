import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { PGlite } from '@electric-sql/pglite';
import { test, expect } from '@playwright/test';
import { createContactHandler } from '../../api/contact';
import { handleContact } from '../../server/contact';
import type {
  ContactDependencies,
  ContactRequest,
  SaveResult,
} from '../../server/contact';
import { contactSchema } from '../../shared/schemas/contact';
import { asRole, createDatabase } from './database';

let db: PGlite;
let notifications: string[];
let failNotification: boolean;
let deps: ContactDependencies;
const origin = 'https://portfolio.example';
const submission = () => ({
  submissionId: randomUUID(),
  name: ' Visitante ',
  email: ' visitor@example.com ',
  message: ' Mensagem sintética para testes. ',
});
const request = (body: unknown): ContactRequest => ({
  method: 'POST',
  origin,
  contentType: 'application/json',
  clientIp: '192.0.2.1',
  body,
});

test.beforeAll(async () => {
  db = await createDatabase();
});
test.afterAll(async () => {
  await db.close();
});
test.beforeEach(async () => {
  await db.exec('truncate public.messages, private.contact_limits');
  notifications = [];
  failNotification = false;
  deps = {
    allowedOrigins: [origin],
    save: async (data) =>
      asRole(db, 'service_role', undefined, async () => {
        const result = await db.query<{ result: SaveResult }>(
          'select public.save_contact($1,$2,$3,$4,$5) as result',
          [
            data.submissionId,
            data.name,
            data.email,
            data.message,
            'a'.repeat(64),
          ],
        );
        return result.rows[0].result;
      }),
    notify: async (_data, id) => {
      notifications.push(id);
      if (failNotification) throw new Error('Simulated provider failure');
    },
    setNotificationStatus: async (id, status) => {
      await db.query(
        'update public.messages set notification_status=$1 where id=$2',
        [status, id],
      );
    },
  };
});

test('validação específica e normalização compartilhadas; dados inválidos não persistem', async () => {
  const invalid = await handleContact(
    request({ ...submission(), name: 'x', email: 'invalid', message: 'curta' }),
    deps,
  );
  expect(invalid.statusCode).toBe(400);
  expect(invalid.body).toMatchObject({
    status: 'invalid',
    fields: {
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    },
  });
  expect((await db.query('select id from public.messages')).rows).toHaveLength(
    0,
  );
  const valid = contactSchema.parse(submission());
  expect(valid.name).toBe('Visitante');
  expect(
    contactSchema.safeParse({ ...submission(), submissionId: 'bad' }).success,
  ).toBe(false);
  expect(
    contactSchema.safeParse({
      ...submission(),
      email: 'a@example.com\r\nBcc:b@example.com',
    }).success,
  ).toBe(false);
  expect(
    contactSchema.safeParse({ ...submission(), unexpected: true }).success,
  ).toBe(false);
  expect(
    contactSchema.safeParse({ ...submission(), name: 'n'.repeat(101) }).success,
  ).toBe(false);
  expect(
    contactSchema.safeParse({ ...submission(), message: 'm'.repeat(5001) })
      .success,
  ).toBe(false);
});

test('persiste antes da notificação; repetição não duplica registro nem e-mail', async () => {
  const data = submission();
  const first = await handleContact(request(data), deps);
  expect(first.statusCode).toBe(201);
  expect(first.body).toMatchObject({ status: 'notified' });
  expect(await handleContact(request(data), deps)).toEqual(first);
  expect(notifications).toHaveLength(1);
  const rows = (
    await db.query(
      'select name,email,message,notification_status from public.messages',
    )
  ).rows;
  expect(rows).toEqual([
    {
      name: 'Visitante',
      email: 'visitor@example.com',
      message: 'Mensagem sintética para testes.',
      notification_status: 'accepted',
    },
  ]);
  const conflict = await handleContact(
    request({ ...data, message: 'Conteúdo diferente na mesma tentativa.' }),
    deps,
  );
  expect(conflict).toMatchObject({
    statusCode: 409,
    body: { status: 'failed', retryable: false },
  });
});

test('falha do provedor conserva mensagem e não afirma entrega nem reenvia automaticamente', async () => {
  failNotification = true;
  const data = submission();
  const first = await handleContact(request(data), deps);
  expect(first).toMatchObject({
    statusCode: 202,
    body: { status: 'saved_notification_failed' },
  });
  expect(await handleContact(request(data), deps)).toEqual(first);
  expect(notifications).toHaveLength(1);
  expect(
    (await db.query('select notification_status from public.messages')).rows,
  ).toEqual([{ notification_status: 'failed' }]);
});

test('confirmação de status indisponível resulta em pendência e repetição não reenvia', async () => {
  deps.setNotificationStatus = async () => {
    throw new Error('Database unavailable');
  };
  const data = submission();
  const first = await handleContact(request(data), deps);
  expect(first).toMatchObject({
    statusCode: 202,
    body: { status: 'saved_notification_pending' },
  });
  expect(await handleContact(request(data), deps)).toEqual(first);
  expect(notifications).toHaveLength(1);
});

test('falha de persistência não chama notificador', async () => {
  deps.save = async () => {
    throw new Error('Unavailable');
  };
  expect(await handleContact(request(submission()), deps)).toMatchObject({
    statusCode: 503,
    body: { status: 'failed', retryable: true },
  });
  expect(notifications).toHaveLength(0);
});

test('quota persistida limita IP e não depende da memória da Function', async () => {
  for (let count = 0; count < 5; count++)
    expect((await handleContact(request(submission()), deps)).statusCode).toBe(
      201,
    );
  const limited = await handleContact(request(submission()), { ...deps });
  expect(limited.statusCode).toBe(429);
  expect(limited.headers).toHaveProperty('Retry-After');
  expect((await db.query('select id from public.messages')).rows).toHaveLength(
    5,
  );
  expect(notifications).toHaveLength(5);
});

test('quota global limita novas origens e janela expirada volta a aceitar', async () => {
  await db.query(
    "insert into private.contact_limits values ('global',date_trunc('hour',now()),100)",
  );
  expect((await handleContact(request(submission()), deps)).statusCode).toBe(
    429,
  );
  await db.query(
    "update private.contact_limits set window_start=now()-interval '2 hours'",
  );
  expect((await handleContact(request(submission()), deps)).statusCode).toBe(
    201,
  );
});

test('método, origem, formato e ausência de IP são recusados antes de persistir', async () => {
  for (const [patch, status] of [
    [{ method: 'GET' }, 405],
    [{ origin: 'https://other.example' }, 403],
    [{ contentType: 'text/plain' }, 415],
    [{ clientIp: undefined }, 503],
  ] as const)
    expect(
      (await handleContact({ ...request(submission()), ...patch }, deps))
        .statusCode,
    ).toBe(status);
  expect(notifications).toHaveLength(0);
});

test('adaptador HTTP executa a Function localmente, limita body e não armazena resposta em cache', async () => {
  const server = createServer(createContactHandler(() => deps, false));
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/contact`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify(submission()),
    });
    expect(response.status).toBe(201);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect((await response.json()).status).toBe('notified');
    expect((await fetch(url)).status).toBe(405);
    expect((await fetch(url, { method: 'POST', body: '{broken' })).status).toBe(
      400,
    );
    expect(
      (await fetch(url, { method: 'POST', body: 'x'.repeat(32769) })).status,
    ).toBe(413);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test('ramo Vercel aceita body pré-processado e usa somente IP da plataforma', async () => {
  const data = submission();
  const handler = createContactHandler(() => deps, true);
  const server = createServer((incoming, response) => {
    const requestWithBody = Object.assign(incoming, {
      body: incoming.url?.includes('double') ? JSON.stringify(data) : data,
    });
    if (incoming.url?.includes('invalid-json')) {
      Object.defineProperty(requestWithBody, 'body', {
        get() {
          throw Object.assign(new Error('Invalid JSON'), { statusCode: 400 });
        },
      });
    }
    void handler(requestWithBody, response);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/contact`;
  const headers = { Origin: origin, 'Content-Type': 'application/json' };
  try {
    const missing = await fetch(url, {
      method: 'POST',
      headers: { ...headers, 'x-forwarded-for': '192.0.2.1' },
      body: '{}',
    });
    expect(missing.status).toBe(503);
    const invalid = await fetch(url, {
      method: 'POST',
      headers: { ...headers, 'x-vercel-forwarded-for': '192.0.2.1, 192.0.2.2' },
      body: '{}',
    });
    expect(invalid.status).toBe(503);
    const validHeaders = { ...headers, 'x-vercel-forwarded-for': '192.0.2.1' };
    expect(
      (await fetch(url, { method: 'POST', headers: validHeaders, body: '{}' }))
        .status,
    ).toBe(201);
    expect(
      (
        await fetch(`${url}?double`, {
          method: 'POST',
          headers: validHeaders,
          body: '{}',
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await fetch(`${url}?invalid-json`, {
          method: 'POST',
          headers: validHeaders,
          body: '{broken',
        })
      ).status,
    ).toBe(400);
    expect(notifications).toHaveLength(1);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
