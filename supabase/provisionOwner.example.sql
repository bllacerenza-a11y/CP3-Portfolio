-- Run as the project's administrator AFTER creating the Auth user manually.
-- Replace the sentinel with that Auth user's UUID. No email/password in SQL or Git.
-- This is an environment operation, not a migration or public RPC.
begin;
do $$
declare owner_uuid uuid := '00000000-0000-0000-0000-000000000000';
begin
  if owner_uuid = '00000000-0000-0000-0000-000000000000' then
    raise exception 'Replace owner_uuid with the existing Auth user UUID';
  end if;
  insert into private.portfolio_owner (user_id) values (owner_uuid)
    on conflict (singleton) do update set user_id = excluded.user_id;
end;
$$;
commit;
