import { expect, test } from '@playwright/test';
import { mockGitHub } from '../fixtures/github';

test.beforeEach(async ({ page }) => {
  await mockGitHub(page);
});

test('conteúdo confirmado, seleção de repositórios e pendência acessível', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'Bruno Bastos, início' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Estudante de Engenharia de Software na FIAP, no primeiro ano.',
    ),
  ).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(
    page.getByRole('link', { name: 'Ver repositório Aether no GitHub' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/bllacerenza-a11y/GS_AETHER_EDGE',
  );
  await expect(
    page.getByRole('link', { name: 'Ver repositório Melodia no GitHub' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/bllacerenza-a11y/Melodia-Site-CP5-FRONTEND',
  );
  const unavailable = page
    .getByRole('heading', { name: 'SmartCameraStudy' })
    .locator('..');
  await expect(
    unavailable.getByText(/Colaboração em repositório privado/),
  ).toBeVisible();
  await expect(
    unavailable.locator('a[href^="https://github.com/"]'),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Enviar mensagem' }),
  ).toBeVisible();
});

test('atalho de teclado leva ao conteúdo e controle de tema tem foco visível', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  // Start a fresh document without #conteudo: fragment loads now focus their target.
  await page.goto('/');
  // Pular, marca, três links de navegação, tema.
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
  const toggle = page.getByRole('button', { name: 'Ativar tema escuro' });
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Ativar tema claro' }),
  ).toBeFocused();
});

test('layout mantém conteúdo e controles dentro da tela nos dois temas', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        colorScheme,
      );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `overflow em ${width}px/${colorScheme}`).toBe(false);
      await expect(
        page.getByRole('heading', { name: /Bruno Bastos/ }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Usar sistema' }),
      ).toBeVisible();
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: testInfo.outputPath(`home-${width}-${colorScheme}.png`),
          fullPage: true,
        });
      }
    }
  }
});
