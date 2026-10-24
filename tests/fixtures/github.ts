import type { Page } from '@playwright/test';

/** Dados sintéticos apenas para testes. A aplicação usa fetch real em produção. */
export function repository(name: string, id = 1, owner = 'bllacerenza-a11y') {
  return {
    id,
    name,
    owner: { login: owner },
    description: `Descrição de teste: ${name}`,
    language: 'TypeScript',
    updated_at: '2026-10-20T12:00:00Z',
    homepage: null,
    fork: false,
    archived: false,
  };
}

export const repositories = [
  repository('GS_AETHER_EDGE', 1),
  repository('Melodia-Site-CP5-FRONTEND', 2),
];

export async function mockGitHub(page: Page) {
  // Default public selection for old visual/API scenarios; never contact Supabase.
  await page.route('**/rest/v1/highlights*', (route) =>
    route.fulfill({ json: [] }),
  );
  await page.route('https://api.github.com/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/users/')) {
      await route.fulfill({ json: repositories });
      return;
    }
    const name = decodeURIComponent(url.pathname.split('/').at(-1) ?? '');
    const project = repositories.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
    await route.fulfill(
      project
        ? { json: project }
        : { status: 404, json: { message: 'Not Found' } },
    );
  });
}
