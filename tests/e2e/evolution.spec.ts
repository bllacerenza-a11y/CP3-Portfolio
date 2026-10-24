import { expect, test } from '@playwright/test';
import { mockGitHub, repositories, repository } from '../fixtures/github';

test.beforeEach(async ({ page }) => {
  await mockGitHub(page);
});

test('pranchas, narrativa e navegação por teclado usam conteúdo real da consulta', async ({
  page,
}) => {
  await page.goto('/');
  const aether = page.getByRole('article').filter({
    has: page.getByRole('heading', { name: 'Aether', exact: true }),
  });
  await expect(
    aether.getByRole('img', { name: /Diagrama explicativo/ }),
  ).toBeVisible();
  await expect(
    aether.getByText('Diagrama explicativo autoral. Não é captura do sistema.'),
  ).toBeVisible();
  await aether
    .getByRole('link', { name: 'Ver detalhes de Aether', exact: true })
    .click();
  const summary = page.getByText('Explorar o caminho dos dados', {
    exact: true,
  });
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details')).toHaveAttribute('open', '');
  await expect(page.locator('details li')).toHaveCount(3);
  await expect(page.locator('time')).toHaveText('20/10/2026');
  await expect(
    page.getByText('Descrição de teste: GS_AETHER_EDGE'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Minha participação' }),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      /a detalhar|metadados entram|Laboratório de interface|Estudo visual/,
    ),
  ).toHaveCount(0);
});

test('mídia com falha preserva fallback, conteúdo e links do projeto', async ({
  page,
}) => {
  await page.route('**/assets/melodia-real-desktop-*.png', (route) =>
    route.abort('failed'),
  );
  await page.goto('/projetos/bllacerenza-a11y/Melodia-Site-CP5-FRONTEND');
  await expect(
    page.getByText('Conheça o código e a documentação no GitHub.'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Ver repositório no GitHub', exact: true }),
  ).toHaveAttribute(
    'href',
    'https://github.com/bllacerenza-a11y/Melodia-Site-CP5-FRONTEND',
  );
  await expect(page.getByRole('heading', { name: 'O problema' })).toBeVisible();
  await expect(page.locator('time')).toBeVisible();
});

test('projeto sem editorial usa fallback sem inventar narrativa ou mídia', async ({
  page,
}) => {
  await page.route('https://api.github.com/repos/outro-dono/publico', (route) =>
    route.fulfill({ json: repository('publico', 3, 'outro-dono') }),
  );
  await page.goto('/projetos/outro-dono/publico');
  await expect(
    page.getByText('Repositório público', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Descrição de teste: publico', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'O problema' })).toHaveCount(
    0,
  );
  await expect(page.getByRole('img')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Ver repositório no GitHub', exact: true }),
  ).toBeVisible();
});

test('home e detalhes mantêm hierarquia e mídia em desktop/mobile e ambos os temas', async ({
  page,
}, testInfo) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      for (const [name, url] of Object.entries({
        home: '/',
        aether: '/projetos/bllacerenza-a11y/GS_AETHER_EDGE',
        melodia: '/projetos/bllacerenza-a11y/Melodia-Site-CP5-FRONTEND',
      })) {
        await page.goto(url);
        await expect(
          page.getByRole('link', {
            name:
              name === 'home'
                ? 'Ver detalhes de Aether'
                : 'Ver repositório no GitHub',
            exact: true,
          }),
        ).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute(
          'data-theme',
          colorScheme,
        );
        for (const img of await page.locator('main img').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate((e: HTMLImageElement) => e.decode());
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          name + ' ' + width + ' ' + colorScheme,
        ).toBe(false);
        await page.evaluate(() => window.scrollTo(0, 0));
        if (width === 390 || width === 1440)
          await page.screenshot({
            path: testInfo.outputPath(
              name + '-' + width + '-' + colorScheme + '.png',
            ),
            fullPage: true,
          });
      }
    }
  }
});

test('estados reais mantêm saída, layout e redução de movimento', async ({
  page,
}, testInfo) => {
  for (const status of ['loading', 'error', 'empty', '404']) {
    let release = () => {};
    await page.unroute('https://api.github.com/users/**');
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route('https://api.github.com/users/**', async (route) => {
      if (status === 'loading') await gate;
      await route.fulfill(
        status === 'error'
          ? { status: 503, json: {} }
          : status === 'empty'
            ? { json: [] }
            : { json: repositories },
      );
    });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const colorScheme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
        await page.goto(
          status === '404' ? '/projetos/outro-dono/ausente' : '/',
        );
        await expect(
          page.getByText(
            {
              loading: 'Carregando projetos do GitHub',
              error: 'Não foi possível carregar os projetos',
              empty: 'Nenhum repositório público encontrado',
              '404': 'Repositório não encontrado',
            }[status]!,
          ),
        ).toBeVisible();
        if (status === 'loading')
          await expect(
            page.locator('[data-status="loading"] span[aria-hidden]'),
          ).toHaveCSS('animation-name', 'none');
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
        ).toBe(false);
        await page.screenshot({
          path: testInfo.outputPath(
            status + '-' + width + '-' + colorScheme + '.png',
          ),
          fullPage: true,
        });
      }
    }
    release();
  }
});
