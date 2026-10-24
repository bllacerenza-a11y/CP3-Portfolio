import type { SupabaseClient } from '@supabase/supabase-js';
import type { QueryClient } from '@tanstack/react-query';
import type { OwnerSession } from '../../../shared/contracts';
import { getSupabase } from '../../services/supabase';

export async function resolveOwnerSession(
  client: SupabaseClient = getSupabase(),
): Promise<OwnerSession> {
  // getSession is used only to detect absence; identity/authorization are checked remotely.
  const session = await client.auth.getSession();
  if (session.error) return { status: 'error' };
  if (!session.data.session) return { status: 'anonymous' };
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return { status: 'error' };
  const permission = await client.rpc('is_portfolio_owner');
  if (permission.error || typeof permission.data !== 'boolean')
    return { status: 'error' };
  return {
    status: permission.data ? 'owner' : 'forbidden',
    userId: data.user.id,
  };
}

export async function signInOwner(
  email: string,
  password: string,
  client: SupabaseClient = getSupabase(),
): Promise<OwnerSession> {
  const { error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error)
    throw new Error(
      'Não foi possível entrar. Confira as credenciais e tente novamente.',
    );
  return resolveOwnerSession(client);
}

export async function clearPrivateQueries(cache: QueryClient): Promise<void> {
  await cache.cancelQueries({ queryKey: ['messages'] });
  cache.removeQueries({ queryKey: ['messages'] });
  const mutations = cache.getMutationCache();
  mutations
    .findAll({ mutationKey: ['messages'] })
    .forEach((mutation) => mutations.remove(mutation));
}

export async function signOutOwner(
  cache: QueryClient,
  client: SupabaseClient = getSupabase(),
): Promise<void> {
  // Clear sensitive cache even if the remote logout fails. UI must remain blocked on error.
  await clearPrivateQueries(cache);
  try {
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error)
      throw new Error('Não foi possível encerrar a sessão. Tente novamente.');
  } finally {
    await clearPrivateQueries(cache);
  }
}
