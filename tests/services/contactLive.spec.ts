import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import { test, expect } from '@playwright/test';
import { createContactHandler } from '../../api/contact';
import { createContactDependencies } from '../../server/contactDependencies';

interface Receipt {
  submissionId: string;
  partialSubmissionId: string;
  notifiedMessageId?: string;
  partialMessageId?: string;
  notified?: boolean;
  partialSaved?: boolean;
  checkedAt?: string;
}

test('API Node com Supabase e Resend reais persiste, notifica, deduplica e conserva falha parcial', async () => {
  const env = process.env;
  expect(
    Boolean(
      env.RESEND_API_KEY?.startsWith('re_') && env.RESEND_API_KEY.length >= 20,
    ),
    'Configure a chave Resend no .env antes deste teste opt-in.',
  ).toBe(true);
  expect(
    Boolean(env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL),
    'Configure remetente e destinatário no .env.',
  ).toBe(true);
  await mkdir('work', { recursive: true });
  const statePath = 'work/t04ContactReceipt.json';
  let receipt: Receipt;
  try {
    receipt = JSON.parse(await readFile(statePath, 'utf8')) as Receipt;
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT'))
      throw error;
    receipt = { submissionId: randomUUID(), partialSubmissionId: randomUUID() };
    await writeFile(statePath, JSON.stringify(receipt, null, 2));
  }
  const admin = createClient(env.SUPABASE_URL!, env.SUPABASE_SECRET_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const origin = env.CONTACT_ALLOWED_ORIGINS!.split(',')[0].trim();
  let resendCalls = 0;
  const liveFetch: typeof fetch = async (input, options) => {
    if (String(input) === 'https://api.resend.com/emails') resendCalls++;
    return fetch(input, options);
  };
  let notificationsConfigured = true;
  const server = createServer(
    createContactHandler(
      () =>
        createContactDependencies(
          notificationsConfigured ? env : { ...env, RESEND_API_KEY: undefined },
          liveFetch,
        ),
      false,
    ),
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/contact`;
  const submit = (payload: unknown) =>
    fetch(url, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  const payload = {
    submissionId: receipt.submissionId,
    name: 'Teste de integração T04',
    email: env.CONTACT_TO_EMAIL!,
    message:
      'Teste sintético da API de contato T04 com Supabase e Resend reais. Não representa contato de visitante. Verifica persistência e notificação por e-mail.',
  };
  try {
    const before = await admin
      .from('messages')
      .select('id,notification_status')
      .eq('submission_id', receipt.submissionId);
    expect(Boolean(before.error)).toBe(false);
    const invalid = await submit({
      ...payload,
      name: 'x',
      email: 'invalid',
      message: 'curta',
    });
    expect(invalid.status).toBe(400);
    const first = await submit(payload);
    expect(
      first.status,
      'A notificação precisa ser aceita pelo provedor; 202 indica falha parcial/pendência, não sucesso integral.',
    ).toBe(201);
    const result = (await first.json()) as {
      status: string;
      messageId: string;
    };
    expect(result.status).toBe('notified');
    receipt.notifiedMessageId = result.messageId;
    receipt.notified = true;
    await writeFile(statePath, JSON.stringify(receipt, null, 2));
    const rows = await admin
      .from('messages')
      .select('id,notification_status')
      .eq('submission_id', receipt.submissionId);
    expect(Boolean(rows.error)).toBe(false);
    expect(rows.data).toEqual([
      { id: result.messageId, notification_status: 'accepted' },
    ]);
    const replay = await submit(payload);
    expect(replay.status).toBe(201);
    expect(await replay.json()).toEqual(result);
    expect(resendCalls).toBe(before.data?.length ? 0 : 1);
    const conflict = await submit({
      ...payload,
      message: 'Conteúdo diferente para verificar conflito na mesma chave.',
    });
    expect(conflict.status).toBe(409);
    expect(resendCalls).toBe(before.data?.length ? 0 : 1);
    notificationsConfigured = false;
    const partial = await submit({
      ...payload,
      submissionId: receipt.partialSubmissionId,
      name: 'Teste controlado T04 sem notificação',
      message:
        'Teste sintético de falha parcial T04. A chave de e-mail foi deliberadamente omitida apenas nesta instância de teste; a persistência usa Supabase real.',
    });
    expect(partial.status).toBe(202);
    const partialResult = (await partial.json()) as {
      status: string;
      messageId: string;
    };
    expect(partialResult.status).toBe('saved_notification_failed');
    const partialRows = await admin
      .from('messages')
      .select('id,notification_status')
      .eq('submission_id', receipt.partialSubmissionId);
    expect(Boolean(partialRows.error)).toBe(false);
    expect(partialRows.data).toEqual([
      { id: partialResult.messageId, notification_status: 'failed' },
    ]);
    receipt.partialMessageId = partialResult.messageId;
    receipt.partialSaved = true;
    receipt.checkedAt = new Date().toISOString();
    await writeFile(statePath, JSON.stringify(receipt, null, 2));
    console.log(
      'Serviços reais: 201/notified + registro accepted; replay sem nova notificação; conflito 409; falha controlada 202 persistida. Recebimento na caixa ainda precisa ser confirmado pelo destinatário.',
    );
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
