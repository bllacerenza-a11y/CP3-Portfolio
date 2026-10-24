import { randomBytes, randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Opt-in against the configured project, never part of npm run check/CI.
// Creates ONE disposable Auth user, sends no email, removes it in finally.
// No real owner's credential, JWT, user id or key is printed or written.
const config = process.env;
const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (url, options) =>
      fetch(url, { ...options, signal: AbortSignal.timeout(10000) }),
  },
};
const checks = [];
function verify(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
  if (!passed) throw new Error('Service verification failed');
}
const publicClient = createClient(
  config.VITE_SUPABASE_URL,
  config.VITE_SUPABASE_PUBLISHABLE_KEY,
  clientOptions,
);
const admin = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SECRET_KEY,
  clientOptions,
);
const email = `cp3-t04-${randomUUID()}@example.invalid`;
const password = randomBytes(36).toString('base64url');
let createdId;
try {
  const highlights = await publicClient.from('highlights').select('project_id');
  verify(
    'visitor reads highlights',
    !highlights.error && Array.isArray(highlights.data),
  );
  const anonymousMessages = await publicClient.from('messages').select('id');
  verify(
    'visitor cannot read messages',
    anonymousMessages.error?.code === '42501',
  );
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { purpose: 'T04 disposable authorization probe' },
  });
  createdId = created.data.user?.id;
  verify('disposable Auth user created', !created.error && Boolean(createdId));
  const other = createClient(
    config.VITE_SUPABASE_URL,
    config.VITE_SUPABASE_PUBLISHABLE_KEY,
    clientOptions,
  );
  const login = await other.auth.signInWithPassword({ email, password });
  verify(
    'non-owner login issued real session',
    !login.error && Boolean(login.data.session),
  );
  const user = await other.auth.getUser();
  verify(
    'non-owner identity verified by Auth',
    !user.error && user.data.user?.id === createdId,
  );
  const permission = await other.rpc('is_portfolio_owner');
  verify(
    'non-owner explicitly denied ownership',
    !permission.error && permission.data === false,
  );
  const messages = await other.from('messages').select('id');
  verify(
    'non-owner reads zero messages',
    !messages.error && messages.data?.length === 0,
  );
  const forbiddenUpdate = await other
    .from('messages')
    .update({ message: 'Forbidden test edit' })
    .eq('id', randomUUID())
    .select('id');
  verify(
    'non-owner denied editing content',
    forbiddenUpdate.error?.code === '42501',
  );
  // Invalid payloads prevent mutations even if an authorization regression exists.
  const highlightsMutation = await other.rpc('replace_highlights', {
    p_highlights: null,
  });
  verify(
    'non-owner denied highlights RPC',
    highlightsMutation.error?.code === '42501',
  );
  const contact = await other.rpc('save_contact', {
    p_submission_id: randomUUID(),
    p_name: 'T04 disposable probe',
    p_email: 'probe@example.invalid',
    p_message: 'Must never be persisted.',
    p_bucket: 'invalid-test-bucket',
  });
  verify(
    'non-owner denied contact service RPC',
    contact.error?.code === '42501',
  );
  const logout = await other.auth.signOut({ scope: 'local' });
  const afterLogout = await other.auth.getSession();
  verify(
    'non-owner logout clears session',
    !logout.error && !afterLogout.data.session,
  );
} catch {
  process.exitCode = 1;
} finally {
  if (createdId) {
    try {
      const lookup = await admin.auth.admin.getUserById(createdId);
      if (
        lookup.error ||
        lookup.data.user?.email !== email ||
        lookup.data.user?.user_metadata?.purpose !==
          'T04 disposable authorization probe'
      ) {
        checks.push({ name: 'cleanup identity mismatch', passed: false });
        process.exitCode = 1;
      } else {
        const cleanup = await admin.auth.admin.deleteUser(createdId);
        checks.push({
          name: 'disposable user removed',
          passed: !cleanup.error,
        });
        if (cleanup.error) process.exitCode = 1;
      }
    } catch {
      checks.push({ name: 'disposable user cleanup', passed: false });
      process.exitCode = 1;
    }
  }
  console.log(JSON.stringify(checks, null, 2));
}
