import { expect, test } from '@playwright/test';

test('preferência explícita sobrevive a navegação, refresh e nova visita', async ({
  page,
  context,
  browser,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(
    page.getByRole('button', { name: 'Ativar tema claro' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Sobre', exact: true }).click();
  await expect(page).toHaveURL('/#sobre');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/rota-inexistente');
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  // Novo contexto reaproveita apenas o armazenamento salvo, sem estado React.
  const returning = await browser.newContext({
    storageState: await context.storageState(),
    colorScheme: 'light',
  });
  const revisit = await returning.newPage();
  await revisit.goto('http://127.0.0.1:4173/');
  await expect(
    revisit.getByRole('button', { name: 'Ativar tema claro' }),
  ).toBeVisible();
  await expect(revisit.locator('html')).toHaveAttribute('data-theme', 'dark');
  await revisit.getByRole('button', { name: 'Ativar tema claro' }).click();
  await revisit.reload();
  await expect(revisit.locator('html')).toHaveAttribute('data-theme', 'light');
  await returning.close();
});

test('acompanha o sistema somente quando não há escolha explícita', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(
    page.getByRole('button', { name: 'Usar sistema' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Usar sistema' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Usar sistema' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('storage indisponível não impede leitura nem alternância na sessão', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Ativar tema claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(errors).toEqual([]);
});

test('preferência inválida usa sistema e mudanças são sincronizadas entre abas', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('cp3.theme', 'invalid'));
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Usar sistema' }),
  ).toHaveAttribute('aria-pressed', 'true');
  const second = await context.newPage();
  await second.goto('/');
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await expect(second.locator('html')).toHaveAttribute('data-theme', 'dark');
  await second.close();
});
