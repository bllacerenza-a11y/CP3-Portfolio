import { test, expect } from '@playwright/test';
import { createContactDependencies } from '../../server/contactDependencies';

const env = {
  SUPABASE_URL: 'https://synthetic.supabase.co',
  SUPABASE_SECRET_KEY: 'synthetic-secret-key-for-tests-only',
  CONTACT_RATE_LIMIT_SECRET: 'synthetic-rate-secret-32-characters',
  CONTACT_ALLOWED_ORIGINS: 'https://portfolio.example',
  RESEND_API_KEY: 'synthetic-resend-key',
  CONTACT_FROM_EMAIL: 'from@example.com',
  CONTACT_TO_EMAIL: 'to@example.com',
};
const data = {
  submissionId: '11111111-1111-4111-8111-111111111111',
  name: '<b>Visitante</b>',
  email: 'visitor@example.com',
  message: 'Mensagem de teste sintética.',
};

test('integração Resend usa texto, destinatário fixo, reply_to e chave de idempotência estável', async () => {
  const requests: { url: string; options?: RequestInit }[] = [];
  const deps = createContactDependencies(env, async (input, options) => {
    requests.push({ url: String(input), options });
    return Response.json({ id: 'synthetic-provider-id' });
  });
  await deps.notify(data, data.submissionId);
  expect(requests[0].url).toBe('https://api.resend.com/emails');
  const payload = JSON.parse(String(requests[0].options?.body));
  expect(payload).toMatchObject({
    to: ['to@example.com'],
    reply_to: data.email,
    subject: 'Nova mensagem no portfólio',
  });
  expect(payload.text).toContain('<b>Visitante</b>');
  expect(payload.html).toBeUndefined();
  expect(requests[0].options?.headers).toHaveProperty(
    'Idempotency-Key',
    `contact/${data.submissionId}`,
  );
});

test('recusa, resposta inválida e falta de email configurado não viram notificação aceita', async () => {
  for (const response of [
    Response.json({ message: 'denied' }, { status: 403 }),
    Response.json({ invalid: true }),
  ]) {
    await expect(
      createContactDependencies(env, async () => response).notify(
        data,
        data.submissionId,
      ),
    ).rejects.toThrow();
  }
  await expect(
    createContactDependencies({ ...env, RESEND_API_KEY: undefined }).notify(
      data,
      data.submissionId,
    ),
  ).rejects.toThrow(/not configured/);
});

test('persistência transmite HMAC do IP e parâmetros normalizados; segredo nunca entra no payload', async () => {
  let payload: Record<string, unknown> = {};
  const deps = createContactDependencies(env, async (_input, options) => {
    payload = JSON.parse(String(options?.body));
    return Response.json({
      outcome: 'created',
      id: data.submissionId,
      notificationStatus: 'pending',
    });
  });
  await deps.save(data, '192.0.2.1');
  expect(payload.p_bucket).toMatch(/^[a-f0-9]{64}$/);
  expect(JSON.stringify(payload)).not.toContain('192.0.2.1');
  expect(JSON.stringify(payload)).not.toContain(env.CONTACT_RATE_LIMIT_SECRET);
  expect(payload).toMatchObject({
    p_submission_id: data.submissionId,
    p_name: data.name,
  });
});
