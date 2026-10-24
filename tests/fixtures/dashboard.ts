import { expect, type Page } from '@playwright/test';

/** HTTP fixtures only: the application still executes the real T04 SDK/services. */
export async function mockDashboard(
  page: Page,
  options: {
    allowed?: boolean;
    permissionError?: boolean;
    logoutError?: boolean;
    loginError?: boolean;
    messagesError?: boolean;
    highlightsError?: boolean;
    saveError?: boolean;
    messageWriteError?: boolean;
    permissionGate?: Promise<void>;
  } = {},
) {
  const userId = '11111111-1111-4111-8111-111111111111';
  const user = {
    id: userId,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'owner@example.com',
    app_metadata: {},
    user_metadata: {},
    created_at: '2026-01-01T00:00:00Z',
  };
  const messages = [
    {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Visitante sintético',
      email: 'visitor@example.com',
      message: 'Conteúdo privado sintético para verificar o painel.',
      created_at: '2026-10-24T12:00:00Z',
      responded_at: null as string | null,
      notification_status: 'pending',
    },
  ];
  const state = {
    highlights: [] as {
      project_id: number;
      owner: string;
      repo: string;
      position: number;
    }[],
    privateReads: 0,
    writes: 0,
    highlightWrites: 0,
    permissionReads: 0,
    messages,
    calls: [] as string[],
  };
  await page.route('https://cp3-fixture.supabase.co/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    state.calls.push(path);
    if (path.endsWith('/token'))
      return route.fulfill(
        options.loginError
          ? {
              status: 400,
              json: { error: 'invalid_grant', msg: 'Invalid credentials' },
            }
          : {
              json: {
                access_token: 'synthetic-access-token',
                refresh_token: 'synthetic-refresh-token',
                expires_in: 3600,
                token_type: 'bearer',
                user,
              },
            },
      );
    if (path.endsWith('/user'))
      return route.fulfill({ json: { ...user, user } });
    if (path.endsWith('/logout'))
      return route.fulfill(
        options.logoutError
          ? { status: 500, json: { message: 'Synthetic failure' } }
          : { status: 204, body: '' },
      );
    if (path.endsWith('/is_portfolio_owner')) {
      state.permissionReads++;
      if (options.permissionGate) await options.permissionGate;
      return route.fulfill(
        options.permissionError
          ? { status: 503, json: { message: 'Synthetic failure' } }
          : { json: options.allowed !== false },
      );
    }
    if (path.endsWith('/messages')) {
      if (request.method() === 'PATCH') {
        if (options.messageWriteError)
          return route.fulfill({
            status: 403,
            json: { message: 'Synthetic failure' },
          });
        state.writes++;
        messages[0].responded_at = request.postDataJSON().responded_at as
          string | null;
        return route.fulfill({ json: messages[0] });
      }
      state.privateReads++;
      return route.fulfill(
        options.messagesError
          ? { status: 503, json: { message: 'Synthetic failure' } }
          : {
              json: messages.slice(
                Number(new URL(request.url()).searchParams.get('offset') ?? 0),
                Number(new URL(request.url()).searchParams.get('offset') ?? 0) +
                  50,
              ),
            },
      );
    }
    if (path.endsWith('/highlights'))
      return route.fulfill(
        options.highlightsError
          ? { status: 503, json: { message: 'Synthetic failure' } }
          : { json: state.highlights },
      );
    if (path.endsWith('/replace_highlights')) {
      state.highlightWrites++;
      if (options.saveError)
        return route.fulfill({
          status: 503,
          json: { message: 'Synthetic failure' },
        });
      state.highlights = (
        request.postDataJSON().p_highlights as {
          projectId: number;
          owner: string;
          repo: string;
        }[]
      ).map((item, position) => ({
        project_id: item.projectId,
        owner: item.owner.toLowerCase(),
        repo: item.repo.toLowerCase(),
        position,
      }));
      return route.fulfill({ status: 204, body: '' });
    }
    throw new Error(`Unmocked fixture endpoint: ${path}`);
  });
  return state;
}

export async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('E-mail', { exact: true }).fill('owner@example.com');
  await page.getByLabel('Senha', { exact: true }).fill('synthetic-password');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
}

export async function expectPanel(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Painel do portfólio' }),
  ).toBeVisible();
}
