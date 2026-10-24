-- Run as administrator in SQL Editor after provisioning exactly one owner.
-- Real PostgreSQL roles/policies, simulated request claims; not a JWT/login test.
-- Every fixture, role context and data change is rolled back. No emails are sent.
begin;
create temporary table t04_checks (name text, passed boolean);
grant select, insert on pg_temp.t04_checks to anon, authenticated, service_role;

insert into pg_temp.t04_checks select 'one confirmed owner', count(*) = 1
  from private.portfolio_owner o join auth.users u on u.id = o.user_id
  where u.email_confirmed_at is not null;
select set_config('cp3.t04_message_id', gen_random_uuid()::text, true);
insert into public.messages (id, submission_id, name, email, message)
  values (current_setting('cp3.t04_message_id')::uuid, gen_random_uuid(),
    'T04 rollback probe', 'probe@example.invalid', 'Synthetic transaction-only authorization probe.');

set local role anon;
insert into pg_temp.t04_checks select 'anon reads highlights', count(*) >= 0 from public.highlights;
do $$ begin
  begin
    perform id from public.messages;
    raise exception 'FAIL: anon can read messages';
  exception when insufficient_privilege then
    insert into pg_temp.t04_checks values ('anon denied messages', true);
  end;
end $$;
reset role;

select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
set local role authenticated;
insert into pg_temp.t04_checks select 'other is not owner', not public.is_portfolio_owner();
insert into pg_temp.t04_checks select 'other sees zero messages', count(*) = 0 from public.messages;
do $$ declare affected integer; begin
  update public.messages set responded_at = now() where id = current_setting('cp3.t04_message_id')::uuid;
  get diagnostics affected = row_count;
  insert into pg_temp.t04_checks values ('other cannot update message', affected = 0);
end $$;
reset role;

select set_config('request.jwt.claim.sub', (select user_id::text from private.portfolio_owner), true);
select set_config('request.jwt.claims', json_build_object('sub', (select user_id::text from private.portfolio_owner), 'role', 'authenticated')::text, true);
set local role authenticated;
insert into pg_temp.t04_checks select 'configured owner recognized', public.is_portfolio_owner();
insert into pg_temp.t04_checks select 'owner reads fixture', count(*) = 1 from public.messages where id = current_setting('cp3.t04_message_id')::uuid;
do $$ declare affected integer; begin
  update public.messages set responded_at = now() where id = current_setting('cp3.t04_message_id')::uuid;
  get diagnostics affected = row_count;
  insert into pg_temp.t04_checks values ('owner marks responded', affected = 1);
  begin
    update public.messages set message = 'Forbidden content edit' where id = current_setting('cp3.t04_message_id')::uuid;
    raise exception 'FAIL: owner can edit message body';
  exception when insufficient_privilege then
    insert into pg_temp.t04_checks values ('owner denied content edit', true);
  end;
end $$;
reset role;

set local role service_role;
insert into pg_temp.t04_checks
  select 'service RPC persists', public.save_contact(gen_random_uuid(), 'T04 service probe',
    'probe@example.invalid', 'Synthetic transaction-only contact probe.', repeat('a',64))->>'outcome' = 'created';
reset role;
do $$ begin
  if (select count(*) <> 11 or not coalesce(bool_and(passed), false) from pg_temp.t04_checks) then
    raise exception 'FAIL: authorization probe did not pass all 11 checks';
  end if;
end $$;
rollback;
select '11 authorization checks passed; all fixtures and changes rolled back' as result;
