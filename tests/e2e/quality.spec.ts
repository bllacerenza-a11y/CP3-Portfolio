import { expect, test, type Locator } from '@playwright/test';
import { mockGitHub } from '../fixtures/github';
import { mockDashboard, login, expectPanel } from '../fixtures/dashboard';

function luminance(color: string) {
  const channels = color
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map(Number);
  const linear = channels.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(first: string, second: string) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
async function colors(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    let parent: Element | null = element;
    let background = 'rgba(0, 0, 0, 0)';
    while (parent && background === 'rgba(0, 0, 0, 0)') {
      background = getComputedStyle(parent).backgroundColor;
      parent = parent.parentElement;
    }
    return {
      text: style.color,
      border: style.borderTopColor,
      outline: style.outlineColor,
      background,
    };
  });
}

test.beforeEach(async ({ page }) => {
  await mockGitHub(page);
  await mockDashboard(page);
});

test('campos são distinguíveis e textos/erros têm contraste nos dois temas', async ({
  page,
}, testInfo) => {
  const measurements: unknown[] = [];
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto('/login');
    const email = page.getByLabel('E-mail', { exact: true });
    await expect(email).toBeVisible();
    const field = await colors(email);
    measurements.push({ colorScheme, screen: 'login', ...field });
    expect(
      contrast(field.border, field.background),
      'borda de campo',
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrast(field.text, field.background),
      'texto de campo',
    ).toBeGreaterThanOrEqual(4.5);
    await email.focus();
    await page.keyboard.press('Tab');
    const password = page.getByLabel('Senha', { exact: true });
    await expect(password).toBeFocused();
    await expect(password).toHaveCSS('outline-style', 'solid');
    const focused = await colors(password);
    expect(
      contrast(focused.outline, focused.background),
      'foco',
    ).toBeGreaterThanOrEqual(3);
    await page.getByRole('link', { name: 'Contato', exact: true }).click();
    const name = page.getByLabel('Nome', { exact: true });
    await expect(name).toBeVisible();
    const contact = await colors(name);
    measurements.push({ colorScheme, screen: 'contact', ...contact });
    expect(
      contrast(contact.border, contact.background),
      'borda do contato',
    ).toBeGreaterThanOrEqual(3);
    for (const hint of await page.locator('main small').all()) {
      const value = await colors(hint);
      expect(
        contrast(value.text, value.background),
        'instrução',
      ).toBeGreaterThanOrEqual(4.5);
    }
    await page
      .getByRole('button', { name: 'Enviar mensagem', exact: true })
      .click();
    await expect(name).toBeFocused();
    const errors = page.locator('[id$="-error"]');
    await expect(errors).toHaveCount(3);
    for (const error of await errors.all()) {
      const value = await colors(error);
      measurements.push({ colorScheme, screen: 'error', ...value });
      expect(
        contrast(value.text, value.background),
        'erro',
      ).toBeGreaterThanOrEqual(4.5);
    }
  }
  await testInfo.attach('contrast.json', {
    body: JSON.stringify(measurements, null, 2),
    contentType: 'application/json',
  });
});

test('navegação de âncora por teclado move foco para a seção de contato', async ({
  page,
}) => {
  await page.goto('/');
  const contactLink = page.getByRole('link', { name: 'Contato', exact: true });
  await contactLink.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('region', { name: 'Vamos conversar' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Nome', { exact: true })).toBeFocused();
  await contactLink.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('region', { name: 'Vamos conversar' }),
  ).toBeFocused();
});

test('proprietário opera mensagens e destaques com teclado', async ({
  page,
}) => {
  await login(page);
  await expectPanel(page);
  const respond = page.getByRole('button', {
    name: 'Marcar como respondida',
    exact: true,
  });
  await respond.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Respondida', { exact: true })).toBeVisible();
  const selection = page.getByRole('checkbox', {
    name: 'bllacerenza-a11y/GS_AETHER_EDGE',
    exact: true,
  });
  await selection.focus();
  await page.keyboard.press('Space');
  await expect(selection).toBeChecked();
  const save = page.getByRole('button', {
    name: 'Salvar destaques',
    exact: true,
  });
  await save.focus();
  await expect(save).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Destaques salvos.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Sair', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('main')).toBeFocused();
});
