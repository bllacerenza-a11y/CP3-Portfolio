import { readFile, readdir } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

export const ownerId = '11111111-1111-4111-8111-111111111111';
export const outsiderId = '22222222-2222-4222-8222-222222222222';

export async function createDatabase() {
  const db = new PGlite();
  // Test-only shim for Supabase managed roles/Auth; not a GoTrue/PostgREST emulator.
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$;
    grant usage on schema auth to authenticated;
    insert into auth.users values ('${ownerId}'), ('${outsiderId}');
  `);
  for (const migration of (await readdir('supabase/migrations')).sort()) {
    if (migration.endsWith('.sql'))
      await db.exec(await readFile(`supabase/migrations/${migration}`, 'utf8'));
  }
  await db.query('insert into private.portfolio_owner (user_id) values ($1)', [
    ownerId,
  ]);
  return db;
}

export async function asRole<T>(
  db: PGlite,
  role: 'anon' | 'authenticated' | 'service_role',
  userId: string | undefined,
  run: () => Promise<T>,
): Promise<T> {
  await db.exec(`set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [
    userId ?? '',
  ]);
  try {
    return await run();
  } finally {
    await db.exec('reset role');
  }
}
