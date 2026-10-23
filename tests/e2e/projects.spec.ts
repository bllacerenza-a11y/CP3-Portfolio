import { expect, test } from '@playwright/test';
import { mockGitHub, repositories, repository } from '../fixtures/github';

const listPattern = 'https://api.github.com/users/**';
const detail = '/projetos/bllacerenza-a11y/GS_AETHER_EDGE';

test.beforeEach(async ({ page }) => {
  await mockGitHub(page);
});

test('mostra loading e consulta referência externa sem esperar pela lista', async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(listPattern, async (route) => {
    await gate;
    await route.fulfill({ json: repositories });
  });
  await page.goto('/');
  await expect(page.getByText('Carregando projetos do GitHub')).toBeVisible();
  await expect(page.getByText('Repositório não encontrado')).toBeVisible();
  release();
  await expect(
    page.getByRole('link', { name: 'Ver detalhes de Aether', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Carregando projetos do GitHub')).toHaveCount(0);
});

test('lista, detalhes e navegação SPA compartilham cache e preservam tema', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith('https://api.github.com/'))
      requests.push(request.url());
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await page
    .getByRole('link', { name: 'Ver detalhes de Aether', exact: true })
    .click();
  await expect(page).toHaveURL(detail);
  await expect(
    page.getByRole('heading', { name: 'Aether', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Descrição de teste: GS_AETHER_EDGE'),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('link', { name: 'Projetos', exact: true }).click();
  await expect(page).toHaveURL('/#projetos');
  await expect(page.getByRole('article')).toHaveCount(4);
  await page
    .getByRole('link', { name: 'Ver detalhes de Melodia', exact: true })
    .click();
  await page.goBack();
  await page.goForward();
  await expect(
    page.getByRole('heading', { name: 'Melodia', exact: true }),
  ).toBeVisible();
  // Lista e referência externa são as únicas chamadas, inclusive no retorno pela navegação principal.
  expect(requests).toHaveLength(2);
});

test('acesso direto e refresh usam API; nulos e URL insegura têm fallback', async ({
  page,
}) => {
  const calls: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/repos/')) calls.push(request.url());
  });
  await page.route('https://api.github.com/repos/**', (route) =>
    route.fulfill({
      json: {
        ...repository('GS_AETHER_EDGE'),
        description: null,
        language: null,
        homepage: 'javascript:alert(1)',
      },
    }),
  );
  await page.goto(detail);
  await expect(
    page.getByText('Descrição não informada no GitHub.'),
  ).toBeVisible();
  await expect(page.getByText('Não informada', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Visitar site do projeto' }),
  ).toHaveCount(0);
  await expect(page.locator('time')).toHaveText('20/10/2026');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Aether', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Descrição não informada no GitHub.'),
  ).toBeVisible();
  expect(calls).toHaveLength(2);
});

test('SmartCameraStudy 404 tem URL interna e recuperação sem metadados fictícios', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Consultar detalhes de SmartCameraStudy' })
    .click();
  await expect(page).toHaveURL('/projetos/PedroOliDev/SmartCameraStudy');
  await expect(page.getByText('Repositório não encontrado')).toBeVisible();
  await expect(page.getByText(/A causa não foi confirmada/)).toBeVisible();
  await expect(page.locator('dl')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Ver repositório no GitHub', exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Repositório não encontrado')).toBeVisible();
  await page.getByRole('link', { name: 'Voltar aos projetos' }).click();
  await expect(
    page.getByRole('heading', { name: 'Projetos selecionados' }),
  ).toBeVisible();
});

test('lista vazia não apresenta referências editoriais como dados reais', async ({
  page,
}) => {
  await page.route(listPattern, (route) => route.fulfill({ json: [] }));
  await page.route('https://api.github.com/repos/**', (route) =>
    route.fulfill({ status: 404, json: {} }),
  );
  await page.goto('/');
  await expect(
    page.getByText('Nenhum repositório público encontrado'),
  ).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(0);
});

test('detalhe mostra loading, erro e recuperação com site HTTP seguro', async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let calls = 0;
  await page.route('https://api.github.com/repos/**', async (route) => {
    calls += 1;
    if (calls === 1) {
      await gate;
      await route.fulfill({ status: 503, json: {} });
    } else {
      await route.fulfill({
        json: {
          ...repository('GS_AETHER_EDGE'),
          homepage: 'https://example.com/projeto',
        },
      });
    }
  });
  await page.goto(detail);
  await expect(page.getByText('Carregando repositório')).toBeVisible();
  release();
  await expect(page.getByRole('alert')).toContainText('indisponível');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(
    page.getByRole('link', { name: 'Visitar site do projeto' }),
  ).toHaveAttribute('href', 'https://example.com/projeto');
  expect(calls).toBe(2);
});

for (const status of [403, 429, 503]) {
  test(`HTTP ${status} tem erro recuperável e repetição explícita`, async ({
    page,
  }) => {
    let calls = 0;
    await page.route(listPattern, (route) => {
      calls += 1;
      return route.fulfill(
        calls === 1 ? { status, json: {} } : { json: repositories },
      );
    });
    await page.goto('/');
    const alert = page.getByRole('alert');
    await expect(alert).toContainText(
      status === 503 ? 'indisponível' : 'limitou ou recusou',
    );
    expect(calls).toBe(1);
    await alert.getByRole('button', { name: 'Tentar novamente' }).click();
    await expect(
      page.getByRole('link', { name: 'Ver detalhes de Aether', exact: true }),
    ).toBeVisible();
    await expect(alert).toHaveCount(0);
    expect(calls).toBe(2);
  });
}

for (const failure of ['rede', 'resposta inválida', 'JSON inválido']) {
  test(`falha de ${failure} preserva interface e oferece recuperação`, async ({
    page,
  }) => {
    await page.route(listPattern, (route) =>
      failure === 'rede'
        ? route.abort('failed')
        : failure === 'JSON inválido'
          ? route.fulfill({ contentType: 'application/json', body: '{' })
          : route.fulfill({ json: [{ id: 'inválido' }] }),
    );
    await page.goto('/');
    await expect(page.getByRole('alert')).toContainText(
      failure === 'rede' ? 'conectar ao GitHub' : 'dados inesperados',
    );
    await expect(
      page.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Sobre mim' }),
    ).toBeVisible();
  });
}

test('pagina lista completa, deduplica IDs e inclui forks e arquivados', async ({
  page,
}) => {
  const pages: string[] = [];
  await page.route(listPattern, (route) => {
    const pageNumber = new URL(route.request().url()).searchParams.get('page')!;
    pages.push(pageNumber);
    return route.fulfill(
      pageNumber === '1'
        ? {
            json: repositories,
            headers: {
              'access-control-expose-headers': 'link',
              link: '<https://api.github.com/users/bllacerenza-a11y/repos?page=2>; rel="next"',
            },
          }
        : {
            json: [
              repositories[0],
              {
                ...repository('fork-arquivado', 3),
                fork: true,
                archived: true,
              },
            ],
          },
    );
  });
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(5);
  await expect(
    page.getByRole('link', {
      name: 'Ver detalhes de fork-arquivado',
      exact: true,
    }),
  ).toBeVisible();
  expect(pages).toEqual(['1', '2']);
});

test('referência de outro dono acessível também usa API e cache de detalhes', async ({
  page,
}) => {
  let calls = 0;
  await page.route('https://api.github.com/repos/PedroOliDev/**', (route) => {
    calls += 1;
    return route.fulfill({
      json: repository('SmartCameraStudy', 3, 'PedroOliDev'),
    });
  });
  await page.goto('/');
  await page
    .getByRole('link', {
      name: 'Ver detalhes de SmartCameraStudy',
      exact: true,
    })
    .click();
  await expect(
    page.getByText('Descrição de teste: SmartCameraStudy'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Ver repositório no GitHub', exact: true }),
  ).toHaveAttribute('href', 'https://github.com/PedroOliDev/SmartCameraStudy');
  expect(calls).toBe(1);
});

test('cache vence em cinco minutos; falha na atualização mantém dados anteriores', async ({
  page,
}) => {
  await page.clock.install();
  let calls = 0;
  await page.route(listPattern, (route) => {
    calls += 1;
    return route.fulfill(
      calls === 1 ? { json: repositories } : { status: 503, json: {} },
    );
  });
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Ver detalhes de Aether', exact: true })
    .click();
  await page.clock.fastForward(5 * 60 * 1000 + 1);
  await page.getByRole('link', { name: 'Voltar aos projetos' }).click();
  await expect(page.getByRole('alert')).toContainText('indisponível');
  await expect(page.getByRole('article')).toHaveCount(4);
  expect(calls).toBe(2);
});

test('referência externa informa falha de atualização sem apagar dados em cache', async ({
  page,
}) => {
  await page.clock.install();
  let calls = 0;
  await page.route('https://api.github.com/repos/PedroOliDev/**', (route) => {
    calls += 1;
    return route.fulfill(
      calls === 1
        ? { json: repository('SmartCameraStudy', 3, 'PedroOliDev') }
        : { status: 503, json: {} },
    );
  });
  await page.goto('/');
  await expect(
    page.getByRole('link', {
      name: 'Ver detalhes de SmartCameraStudy',
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Ver detalhes de Aether', exact: true })
    .click();
  await page.clock.fastForward(5 * 60 * 1000 + 1);
  await page.getByRole('link', { name: 'Voltar aos projetos' }).click();
  await expect(page.getByRole('alert')).toContainText('indisponível');
  await expect(
    page.getByText('Descrição de teste: SmartCameraStudy'),
  ).toBeVisible();
  expect(calls).toBe(2);
});
