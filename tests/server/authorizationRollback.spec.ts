import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import { createDatabase } from './database';

test('probe SQL reproduzível passa e desfaz fixtures sem remover o proprietário', async () => {
  const db = await createDatabase();
  try {
    await db.exec(
      'alter table auth.users add column email_confirmed_at timestamptz default now()',
    );
    const results = await db.exec(
      await readFile('supabase/tests/authorizationRollback.sql', 'utf8'),
    );
    expect(results.at(-1)?.rows).toEqual([
      {
        result:
          '11 authorization checks passed; all fixtures and changes rolled back',
      },
    ]);
    expect(
      (await db.query('select count(*)::int as count from public.messages'))
        .rows,
    ).toEqual([{ count: 0 }]);
    expect(
      (
        await db.query(
          'select count(*)::int as count from private.contact_limits',
        )
      ).rows,
    ).toEqual([{ count: 0 }]);
    expect(
      (
        await db.query(
          'select count(*)::int as count from private.portfolio_owner',
        )
      ).rows,
    ).toEqual([{ count: 1 }]);
  } finally {
    await db.close();
  }
});
