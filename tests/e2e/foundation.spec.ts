import { expect, test } from '@playwright/test';
import { mockGitHub } from '../fixtures/github';

test.beforeEach(async ({ page }) => {
  await mockGitHub(page);
});

test('URL inexistente oferece recuperação para a home, inclusive após refresh', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/endereco-inexistente');
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page).toHaveURL('/');
  await expect(
    page.getByRole('heading', { name: /Bruno Bastos/ }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
