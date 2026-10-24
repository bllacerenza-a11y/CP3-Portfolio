import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';
import {
  resolveOwnerSession,
  signInOwner,
  signOutOwner,
  clearPrivateQueries,
} from '../../src/features/auth/ownerAuth';
import { ownerId, outsiderId } from './database';

test('limpeza privada remove resultados de mutação além de consultas, preservando cache público', async () => {
  const cache = new QueryClient();
  cache.setQueryData(
    ['messages', ownerId],
    [{ message: 'synthetic-private-message' }],
  );
  cache.setQueryData(['highlights'], []);
  const mutations = cache.getMutationCache();
  await mutations
    .build(cache, {
      mutationKey: ['messages', ownerId],
      mutationFn: async () => ({ message: 'synthetic-private-message' }),
    })
    .execute(undefined);
  await mutations
    .build(cache, { mutationKey: ['highlights'], mutationFn: async () => [] })
    .execute(undefined);
  await clearPrivateQueries(cache);
  expect(cache.getQueryData(['messages', ownerId])).toBeUndefined();
  expect(mutations.findAll({ mutationKey: ['messages'] })).toHaveLength(0);
  expect(mutations.findAll({ mutationKey: ['highlights'] })).toHaveLength(1);
  expect(cache.getQueryData(['highlights'])).toEqual([]);
  cache.clear();
});

function authFixture(
  options: {
    allowed?: boolean;
    failed?: boolean;
    rejectedLogin?: boolean;
    rejectedLogout?: boolean;
  } = {},
) {
  const calls: string[] = [];
  const user = {
    id: options.allowed === false ? outsiderId : ownerId,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'synthetic@example.com',
    app_metadata: {},
    user_metadata: {},
    created_at: '2026-01-01T00:00:00Z',
  };
  const client = createClient(
    'https://synthetic.supabase.co',
    'synthetic-publishable-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: async (input) => {
          const url = new URL(String(input));
          calls.push(url.pathname);
          if (url.pathname.endsWith('/token'))
            return Response.json(
              options.rejectedLogin
                ? { error: 'invalid_grant', msg: 'Invalid credentials' }
                : {
                    access_token: 'synthetic-access-token',
                    refresh_token: 'synthetic-refresh-token',
                    expires_in: 3600,
                    token_type: 'bearer',
                    user,
                  },
              { status: options.rejectedLogin ? 400 : 200 },
            );
          if (url.pathname.endsWith('/user'))
            return Response.json({ user, ...user });
          if (url.pathname.endsWith('/is_portfolio_owner'))
            return Response.json(
              options.failed
                ? { message: 'Denied' }
                : options.allowed !== false,
              { status: options.failed ? 403 : 200 },
            );
          if (url.pathname.endsWith('/logout'))
            return options.rejectedLogout
              ? Response.json({ message: 'Denied' }, { status: 400 })
              : new Response(null, { status: 204 });
          throw new Error(`Unexpected fixture endpoint: ${url.pathname}`);
        },
      },
    },
  );
  return { client, calls };
}

test('sem sessão não consulta mensagens nem presume identidade', async () => {
  const { client, calls } = authFixture();
  expect(await resolveOwnerSession(client)).toEqual({ status: 'anonymous' });
  expect(calls).toEqual([]);
});

test('login verifica usuário remotamente e consulta autorização; outro autenticado é negado', async () => {
  for (const allowed of [true, false]) {
    const { client, calls } = authFixture({ allowed });
    expect(
      await signInOwner('synthetic@example.com', 'synthetic-password', client),
    ).toEqual({
      status: allowed ? 'owner' : 'forbidden',
      userId: allowed ? ownerId : outsiderId,
    });
    expect(calls).toContain('/auth/v1/user');
    expect(calls).toContain('/rest/v1/rpc/is_portfolio_owner');
  }
});

test('credenciais recusadas e erro de autorização não concedem acesso', async () => {
  const rejected = authFixture({ rejectedLogin: true });
  await expect(
    signInOwner('synthetic@example.com', 'wrong-password', rejected.client),
  ).rejects.toThrow(/Não foi possível entrar/);
  const unavailable = authFixture({ failed: true });
  expect(
    await signInOwner(
      'synthetic@example.com',
      'synthetic-password',
      unavailable.client,
    ),
  ).toEqual({ status: 'error' });
});

test('logout encerra sessão e remove somente dados privados do QueryClient', async () => {
  const { client, calls } = authFixture();
  await signInOwner('synthetic@example.com', 'synthetic-password', client);
  const cache = new QueryClient();
  cache.setQueryData(
    ['messages', ownerId],
    [{ message: 'synthetic-private-message' }],
  );
  cache.setQueryData(['highlights'], []);
  await signOutOwner(cache, client);
  expect(cache.getQueryData(['messages', ownerId])).toBeUndefined();
  expect(cache.getQueryData(['highlights'])).toEqual([]);
  expect(await resolveOwnerSession(client)).toEqual({ status: 'anonymous' });
  expect(calls).toContain('/auth/v1/logout');
  cache.clear();
});

test('falha no logout limpa cache mas retorna erro para manter painel bloqueado', async () => {
  const { client } = authFixture({ rejectedLogout: true });
  await signInOwner('synthetic@example.com', 'synthetic-password', client);
  const cache = new QueryClient();
  cache.setQueryData(['messages', ownerId], ['synthetic-private-message']);
  await expect(signOutOwner(cache, client)).rejects.toThrow(
    /encerrar a sessão/,
  );
  expect(cache.getQueryData(['messages', ownerId])).toBeUndefined();
  cache.clear();
});
