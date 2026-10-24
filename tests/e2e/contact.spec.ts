import { expect, test, type Page } from '@playwright/test';
import { mockGitHub } from '../fixtures/github';

test.beforeEach(async ({ page }) => {
  await mockGitHub(page);
});
async function fillContact(page: Page) {
  await page.goto('/#contato');
  await page.getByLabel('Nome', { exact: true }).fill('Visitante sintético');
  await page.getByLabel('E-mail', { exact: true }).fill('visitor@example.com');
  await page
    .getByLabel('Mensagem', { exact: true })
    .fill('Mensagem sintética de teste sem envio externo.');
}

test('validação específica por campo, descrição acessível e foco, sem POST inválido', async ({
  page,
}) => {
  let posts = 0;
  await page.route('**/api/contact', (route) => {
    posts++;
    return route.fulfill({ json: {} });
  });
  await page.goto('/#contato');
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  for (const label of ['Nome', 'E-mail', 'Mensagem'])
    await expect(page.getByLabel(label, { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  await expect(page.getByLabel('Nome', { exact: true })).toBeFocused();
  await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
  await expect(page.getByLabel('Mensagem', { exact: true })).toHaveAttribute(
    'aria-describedby',
    /contact-message-hint.*contact-message-error/,
  );
  expect(posts).toBe(0);
});

test('envio lento bloqueia repetição, mostra aceitação sem prometer entrega e renova ID após sucesso', async ({
  page,
}) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const payloads: { submissionId: string }[] = [];
  await page.route('**/api/contact', async (route) => {
    payloads.push(route.request().postDataJSON());
    await gate;
    await route.fulfill({
      status: 201,
      json: {
        status: 'notified',
        messageId: '33333333-3333-4333-8333-333333333333',
      },
    });
  });
  await fillContact(page);
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(
    page.getByRole('button', { name: 'Enviando…', exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel('Mensagem', { exact: true })).toBeDisabled();
  expect(payloads).toHaveLength(1);
  release();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Mensagem salva; notificação aceita' }),
  ).toContainText('não confirma a entrega');
  await expect(page.getByLabel('Mensagem', { exact: true })).toHaveValue('');
  await page.getByLabel('Nome', { exact: true }).fill('Outro visitante');
  await page.getByLabel('E-mail', { exact: true }).fill('other@example.com');
  await page
    .getByLabel('Mensagem', { exact: true })
    .fill('Outra mensagem sintética de teste.');
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect.poll(() => payloads.length).toBe(2);
  expect(payloads[1].submissionId).not.toBe(payloads[0].submissionId);
});

for (const status of [
  'saved_notification_failed',
  'saved_notification_pending',
] as const)
  test(`${status}: conteúdo preservado, sem reenvio automático`, async ({
    page,
  }) => {
    let posts = 0;
    await page.route('**/api/contact', (route) => {
      posts++;
      return route.fulfill({
        status: 202,
        json: { status, messageId: '33333333-3333-4333-8333-333333333333' },
      });
    });
    await fillContact(page);
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Mensagem salva' }),
    ).toContainText('não será reenviado automaticamente');
    await expect(page.getByLabel('Mensagem', { exact: true })).toHaveValue(
      'Mensagem sintética de teste sem envio externo.',
    );
    await expect(
      page.getByRole('button', { name: 'Enviar mensagem' }),
    ).toHaveCount(0);
    await expect(page.getByLabel('Mensagem', { exact: true })).toBeDisabled();
    expect(posts).toBe(1);
    await page.getByRole('button', { name: 'Escrever outra mensagem' }).click();
    await expect(page.getByLabel('Mensagem', { exact: true })).toBeEnabled();
    await expect(page.getByLabel('Mensagem', { exact: true })).toHaveValue('');
  });

test('transporte e 429 preservam conteúdo e chave; editar inicia nova tentativa lógica', async ({
  page,
}) => {
  const payloads: { submissionId: string }[] = [];
  await page.route('**/api/contact', (route) => {
    payloads.push(route.request().postDataJSON());
    return payloads.length === 1
      ? route.abort('failed')
      : route.fulfill({
          status: 429,
          json: { status: 'failed', retryable: true },
        });
  });
  await fillContact(page);
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível confirmar o envio',
  );
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível confirmar o envio',
  );
  expect(payloads).toHaveLength(2);
  expect(payloads[1].submissionId).toBe(payloads[0].submissionId);
  await page
    .getByLabel('Mensagem', { exact: true })
    .fill('Conteúdo alterado para outra tentativa lógica.');
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect.poll(() => payloads.length).toBe(3);
  expect(payloads[2].submissionId).not.toBe(payloads[0].submissionId);
});

test('409 bloqueia repetição e erro estrutural/por campo do servidor é apresentado', async ({
  page,
}) => {
  let status = 400;
  let fields = {};
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status,
      json:
        status === 400
          ? { status: 'invalid', fields }
          : { status: 'failed', retryable: false },
    }),
  );
  await fillContact(page);
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível enviar',
  );
  fields = { email: 'E-mail recusado pelo servidor.' };
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByText('E-mail recusado pelo servidor.')).toBeVisible();
  status = 409;
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Este envio foi recusado',
  );
  await expect(
    page.getByRole('button', { name: 'Enviar mensagem' }),
  ).toHaveCount(0);
});
