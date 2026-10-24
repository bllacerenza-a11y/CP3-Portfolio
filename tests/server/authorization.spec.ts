import { test, expect } from '@playwright/test';
import type { PGlite } from '@electric-sql/pglite';
import { asRole, createDatabase, ownerId, outsiderId } from './database';

let db: PGlite;
test.beforeAll(async () => {
  db = await createDatabase();
});
test.afterAll(async () => {
  await db.close();
});
test.beforeEach(async () => {
  await db.exec(
    "truncate public.messages, public.highlights, private.contact_limits; insert into public.messages (submission_id, name, email, message) values (gen_random_uuid(), 'Visitante', 'visitor@example.com', 'Mensagem sintética de teste.'); insert into public.highlights values (1, 'sample', 'project', 0)",
  );
});

test('visitante lê destaques, sem acesso direto a mensagens ou RPCs privadas', async () => {
  await asRole(db, 'anon', undefined, async () => {
    expect(
      (await db.query('select * from public.highlights')).rows,
    ).toHaveLength(1);
    await expect(db.query('select id from public.messages')).rejects.toThrow(
      /permission denied/,
    );
    await expect(
      db.query(
        "insert into public.messages (submission_id,name,email,message) values (gen_random_uuid(),'Visitante','v@example.com','Mensagem de teste')",
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.query(
        "select public.save_contact(gen_random_uuid(),'Visitante','v@example.com','Mensagem de teste',repeat('a',64))",
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.query("select public.replace_highlights('[]')"),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.query("insert into public.highlights values (2,'sample','other',1)"),
    ).rejects.toThrow(/permission denied/);
  });
});

test('outro autenticado não ganha acesso a mensagens, alterações ou identidade de proprietário', async () => {
  await asRole(db, 'authenticated', outsiderId, async () => {
    expect(
      (await db.query('select public.is_portfolio_owner() as allowed')).rows,
    ).toEqual([{ allowed: false }]);
    expect(
      (await db.query('select id from public.messages')).rows,
    ).toHaveLength(0);
    expect(
      (
        await db.query(
          'update public.messages set responded_at=now() returning id',
        )
      ).rows,
    ).toHaveLength(0);
    expect(
      (await db.query('delete from public.highlights returning project_id'))
        .rows,
    ).toHaveLength(0);
    expect(
      (
        await db.query(
          "update public.highlights set repo='tampered' returning project_id",
        )
      ).rows,
    ).toHaveLength(0);
    await expect(
      db.query("insert into public.highlights values (2,'sample','other',1)"),
    ).rejects.toThrow(/row-level security/);
    await expect(
      db.query("select public.replace_highlights('[]')"),
    ).rejects.toThrow(/Access denied/);
    await expect(
      db.query(`update private.portfolio_owner set user_id='${outsiderId}'`),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.query(
        "select public.save_contact(gen_random_uuid(),'Visitante','v@example.com','Mensagem de teste',repeat('a',64))",
      ),
    ).rejects.toThrow(/permission denied/);
  });
});

test('dono lê mensagens e só pode alterar responded_at; não insere nem apaga mensagens', async () => {
  await asRole(db, 'authenticated', ownerId, async () => {
    expect(
      (await db.query('select public.is_portfolio_owner() as allowed')).rows,
    ).toEqual([{ allowed: true }]);
    expect(
      (
        await db.query(
          'select id,name,email,message,created_at,responded_at,notification_status from public.messages',
        )
      ).rows,
    ).toHaveLength(1);
    expect(
      (
        await db.query(
          'update public.messages set responded_at=now() returning responded_at',
        )
      ).rows[0],
    ).toHaveProperty('responded_at');
    await expect(
      db.query('select submission_id from public.messages'),
    ).rejects.toThrow(/permission denied/);
    for (const field of [
      "name='Alterado'",
      "email='a@example.com'",
      "message='Outra mensagem'",
      "notification_status='accepted'",
      'created_at=now()',
    ]) {
      await expect(
        db.query(`update public.messages set ${field}`),
      ).rejects.toThrow(/permission denied/);
    }
    await expect(db.query('delete from public.messages')).rejects.toThrow(
      /permission denied/,
    );
    await expect(
      db.query(
        "insert into public.messages(submission_id,name,email,message) values(gen_random_uuid(),'Dono','d@example.com','Mensagem de teste')",
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.query('select * from private.portfolio_owner'),
    ).rejects.toThrow(/permission denied/);
  });
});

test('destaques substituem/ordenam atomicamente, preservando seleção anterior em falha', async () => {
  await asRole(db, 'authenticated', ownerId, async () => {
    const items = [
      { projectId: 3, owner: 'Sample', repo: 'Three' },
      { projectId: 2, owner: 'Sample', repo: 'Two' },
    ];
    await db.query('select public.replace_highlights($1::jsonb)', [
      JSON.stringify(items),
    ]);
    expect(
      (await db.query('select * from public.highlights order by position'))
        .rows,
    ).toEqual([
      { project_id: 3, owner: 'sample', repo: 'three', position: 0 },
      { project_id: 2, owner: 'sample', repo: 'two', position: 1 },
    ]);
    await expect(
      db.query('select public.replace_highlights($1::jsonb)', [
        JSON.stringify([items[0], items[0]]),
      ]),
    ).rejects.toThrow(/duplicate key/);
    expect(
      (await db.query('select * from public.highlights')).rows,
    ).toHaveLength(2);
    await expect(
      db.query('select public.replace_highlights(null)'),
    ).rejects.toThrow(/Invalid highlights/);
    expect(
      (await db.query('select * from public.highlights')).rows,
    ).toHaveLength(2);
    await db.query("select public.replace_highlights('[]')");
    expect(
      (await db.query('select * from public.highlights')).rows,
    ).toHaveLength(0);
  });
});

test('banco mantém restrições de campos, IDs, positions e proprietário único', async () => {
  await expect(
    db.query(
      "insert into public.messages(submission_id,name,email,message) values(gen_random_uuid(),'X','invalid','curta')",
    ),
  ).rejects.toThrow(/check constraint/);
  await expect(
    db.query("insert into public.highlights values (2,'sample','two',0)"),
  ).rejects.toThrow(/duplicate key/);
  await expect(
    db.query(
      "insert into public.highlights values (9007199254740992,'sample','two',1)",
    ),
  ).rejects.toThrow(/check constraint/);
  await expect(
    db.query('insert into private.portfolio_owner(user_id) values ($1)', [
      outsiderId,
    ]),
  ).rejects.toThrow(/duplicate key/);
});
