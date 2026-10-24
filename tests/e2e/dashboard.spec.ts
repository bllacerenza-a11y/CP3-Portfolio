import { expect, test } from '@playwright/test';
import { mockGitHub } from '../fixtures/github';
import { expectPanel, login, mockDashboard } from '../fixtures/dashboard';

test.beforeEach(async ({ page }) => {
  await mockGitHub(page);
});

test('visitante vai para login com replace e não consulta mensagens', async ({
  page,
}) => {
  const state = await mockDashboard(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Área do proprietário' }).click();
  await expect(page).toHaveURL('/login');
  await expect(
    page.getByRole('heading', { name: 'Entrar', exact: true }),
  ).toBeVisible();
  expect(state.privateReads).toBe(0);
  await page.goBack();
  await expect(page).toHaveURL('/');
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Entrar', exact: true }),
  ).toBeVisible();
  expect(state.privateReads).toBe(0);
});

test('outro autenticado é negado e nunca consulta mensagens', async ({
  page,
}) => {
  const state = await mockDashboard(page, { allowed: false });
  await login(page);
  await expect(
    page.getByRole('heading', { name: 'Acesso negado' }),
  ).toBeVisible();
  expect(state.privateReads).toBe(0);
  await page.goto('/dashboard');
  await expect(
    page.getByRole('heading', { name: 'Acesso negado' }),
  ).toBeVisible();
  expect(state.privateReads).toBe(0);
  await page.getByRole('button', { name: 'Sair desta conta' }).click();
  await expect(page).toHaveURL('/login');
});

test('credenciais recusadas mostram feedback e não abrem painel', async ({
  page,
}) => {
  const state = await mockDashboard(page, { loginError: true });
  await login(page);
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível entrar',
  );
  await expect(page.getByLabel('Senha', { exact: true })).toHaveValue('');
  expect(state.privateReads).toBe(0);
});

test('espera autorização remota e não exibe dados enquanto pendente', async ({
  page,
}) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const state = await mockDashboard(page, { permissionGate: gate });
  await login(page);
  await expect(
    page.getByText('Verificando sessão e permissão', { exact: true }),
  ).toBeVisible();
  expect(state.privateReads).toBe(0);
  await expect(
    page.getByRole('heading', { name: 'Painel do portfólio' }),
  ).toHaveCount(0);
  release();
  await expectPanel(page);
});

test('falha de autorização permanece fechada', async ({ page }) => {
  const state = await mockDashboard(page, { permissionError: true });
  await login(page);
  await expect(
    page.getByText('Não foi possível verificar o acesso', { exact: true }),
  ).toBeVisible();
  expect(state.privateReads).toBe(0);
});

test('marca respondida, recarrega do serviço e não confunde resposta com notificação', async ({
  page,
}) => {
  const state = await mockDashboard(page);
  await login(page);
  await expectPanel(page);
  const article = page.getByRole('article', {
    name: 'Mensagem de Visitante sintético',
  });
  await expect(
    article.getByText('Notificação pendente de confirmação', { exact: false }),
  ).toBeVisible();
  await article
    .getByRole('button', { name: 'Marcar como respondida', exact: true })
    .click();
  await expect(article.getByText('Respondida', { exact: true })).toBeVisible();
  expect(state.writes).toBe(1);
  await page.reload();
  await expectPanel(page);
  await expect(article.getByText('Respondida', { exact: true })).toBeVisible();
  await article
    .getByRole('button', { name: 'Marcar como não respondida' })
    .click();
  await expect(
    article.getByText('Não respondida', { exact: true }),
  ).toBeVisible();
  expect(state.writes).toBe(2);
});

test('destaques salvos e ordem refletem home, refresh e remoção total', async ({
  page,
}) => {
  const state = await mockDashboard(page);
  await login(page);
  await expectPanel(page);
  await page
    .getByRole('checkbox', {
      name: 'bllacerenza-a11y/GS_AETHER_EDGE',
      exact: true,
    })
    .check();
  await page
    .getByRole('checkbox', {
      name: 'bllacerenza-a11y/Melodia-Site-CP5-FRONTEND',
      exact: true,
    })
    .check();
  await page
    .getByRole('button', {
      name: 'Subir Melodia-Site-CP5-FRONTEND',
      exact: true,
    })
    .click();
  await page
    .getByRole('button', { name: 'Salvar destaques', exact: true })
    .click();
  await expect
    .poll(() => state.highlights.map((item) => item.project_id))
    .toEqual([2, 1]);
  await expect(
    page.getByText('Destaques salvos.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Bruno Bastos, início' }).click();
  const section = page.getByRole('region', { name: 'Em destaque agora' });
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('article')).toHaveCount(2);
  await expect(section.getByRole('article').first()).toContainText('Melodia');
  await page.reload();
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('article')).toHaveCount(2);
  await page.getByRole('link', { name: 'Área do proprietário' }).click();
  await expectPanel(page);
  await page
    .getByRole('button', { name: 'Remover gs_aether_edge', exact: true })
    .click();
  await page
    .getByRole('button', {
      name: 'Remover melodia-site-cp5-frontend',
      exact: true,
    })
    .click();
  await page
    .getByRole('button', { name: 'Salvar destaques', exact: true })
    .click();
  await expect.poll(() => state.highlights.length).toBe(0);
  await page.getByRole('link', { name: 'Bruno Bastos, início' }).click();
  await section.scrollIntoViewIfNeeded();
  await expect(
    section.getByText('Nenhum destaque selecionado no momento'),
  ).toBeVisible();
  await expect(section.getByRole('article')).toHaveCount(0);
});

test('falhas de leitura e escrita são distintas de seleção/caixa vazias', async ({
  page,
}) => {
  await mockDashboard(page, { messagesError: true, saveError: true });
  await login(page);
  await expectPanel(page);
  await expect(
    page.getByText('Não foi possível carregar as mensagens', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Nenhuma mensagem nesta página')).toHaveCount(0);
  const checkbox = page.getByRole('checkbox', {
    name: 'bllacerenza-a11y/GS_AETHER_EDGE',
    exact: true,
  });
  await checkbox.check();
  await page
    .getByRole('button', { name: 'Salvar destaques', exact: true })
    .click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Sua seleção foi mantida' }),
  ).toBeVisible();
  await expect(checkbox).toBeChecked();
});

test('logout remove painel/cache e voltar não mostra conteúdo privado', async ({
  page,
}) => {
  const state = await mockDashboard(page);
  await login(page);
  await expectPanel(page);
  await expect(
    page.getByText('Conteúdo privado sintético para verificar o painel.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('/login');
  await expect(
    page.getByText('Conteúdo privado sintético para verificar o painel.'),
  ).toHaveCount(0);
  const reads = state.privateReads;
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
  expect(state.privateReads).toBe(reads);
});

test('logout falha: bloqueia painel e consultas inclusive na navegação SPA', async ({
  page,
}) => {
  const state = await mockDashboard(page, { logoutError: true });
  await login(page);
  await expectPanel(page);
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await expect(
    page.getByText(
      'Não foi possível encerrar a sessão. O painel permanece bloqueado.',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText('Conteúdo privado sintético para verificar o painel.'),
  ).toHaveCount(0);
  const reads = state.privateReads;
  await page.getByRole('link', { name: 'Bruno Bastos, início' }).click();
  await page.getByRole('link', { name: 'Área do proprietário' }).click();
  await expect(
    page.getByRole('heading', { name: 'Painel do portfólio' }),
  ).toHaveCount(0);
  expect(state.privateReads).toBe(reads);
});

test('mensagens paginadas não somem após a primeira página; vazio é explícito', async ({
  page,
}) => {
  const state = await mockDashboard(page);
  const original = state.messages[0];
  for (let index = 2; index <= 51; index++)
    state.messages.push({
      ...original,
      id: `22222222-2222-4222-8222-${String(index).padStart(12, '0')}`,
      name: `Visitante ${index}`,
    });
  await login(page);
  await expectPanel(page);
  await expect(page.getByRole('article')).toHaveCount(50);
  await page.getByRole('button', { name: 'Próximas', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toContainText('Visitante 51');
  await expect(
    page.getByRole('button', { name: 'Próximas', exact: true }),
  ).toBeDisabled();
  state.messages.length = 0;
  await page.reload();
  await expectPanel(page);
  await expect(
    page.getByText('Nenhuma mensagem nesta página', { exact: true }),
  ).toBeVisible();
});

test('marcação recusada não afirma sucesso nem altera mensagem localmente', async ({
  page,
}) => {
  await mockDashboard(page, { messageWriteError: true });
  await login(page);
  await expectPanel(page);
  const article = page.getByRole('article', {
    name: 'Mensagem de Visitante sintético',
  });
  await article
    .getByRole('button', { name: 'Marcar como respondida', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível alterar a mensagem',
  );
  await expect(
    article.getByText('Não respondida', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Marcação salva.')).toHaveCount(0);
});

test('destaques indisponíveis não viram seleção vazia, na home ou painel', async ({
  page,
}) => {
  await mockDashboard(page, { highlightsError: true });
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Em destaque agora' });
  await section.scrollIntoViewIfNeeded();
  await expect(
    section.getByText('Não foi possível carregar os destaques salvos', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    section.getByText('Nenhum destaque selecionado no momento'),
  ).toHaveCount(0);
  await login(page);
  await expectPanel(page);
  await expect(
    page.getByText('Não foi possível ler os destaques salvos', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Salvar destaques', exact: true }),
  ).toHaveCount(0);
});

test('logout e novo login não reapresentam caixa antiga em falha de leitura', async ({
  page,
}) => {
  const options = { messagesError: false };
  await mockDashboard(page, options);
  await login(page);
  await expectPanel(page);
  await expect(
    page.getByText('Conteúdo privado sintético para verificar o painel.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('/login');
  options.messagesError = true;
  await page.getByLabel('E-mail', { exact: true }).fill('owner@example.com');
  await page.getByLabel('Senha', { exact: true }).fill('synthetic-password');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expectPanel(page);
  await expect(
    page.getByText('Não foi possível carregar as mensagens', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Conteúdo privado sintético para verificar o painel.'),
  ).toHaveCount(0);
});

test('home inicial não solicita Auth/SDK/painel; destaques carregam sob demanda', async ({
  page,
}) => {
  await mockDashboard(page);
  const assets: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/assets/')) assets.push(request.url());
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Bruno Bastos/ }),
  ).toBeVisible();
  expect(
    assets.some((url) => /\/(AuthArea|Dashboard|supabase)-/.test(url)),
  ).toBe(false);
  await page
    .getByRole('region', { name: 'Em destaque agora' })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByText('Nenhum destaque selecionado no momento'),
  ).toBeVisible();
  expect(assets.some((url) => /\/supabase-/.test(url))).toBe(true);
  expect(assets.some((url) => /\/(AuthArea|Dashboard)-/.test(url))).toBe(false);
});

test('painel, login e contato cabem nas telas e temas, com capturas sintéticas', async ({
  page,
}, testInfo) => {
  await mockDashboard(page);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await login(page);
  await expectPanel(page);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        colorScheme,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      if (
        (width === 390 && colorScheme === 'dark') ||
        (width === 1440 && colorScheme === 'light')
      )
        await page.screenshot({
          path: testInfo.outputPath(
            `fixture-dashboard-${width}-${colorScheme}.png`,
          ),
          fullPage: true,
        });
    }
  }
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('/login');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({
    path: testInfo.outputPath('fixture-login-390-dark.png'),
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Contato', exact: true }).click();
  await page
    .getByRole('button', { name: 'Enviar mensagem', exact: true })
    .click();
  await expect(page.getByLabel('Nome', { exact: true })).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await page.getByRole('region', { name: 'Vamos conversar' }).screenshot({
    path: testInfo.outputPath('fixture-contact-invalid-390-dark.png'),
  });
  expect(errors).toEqual([]);
});
