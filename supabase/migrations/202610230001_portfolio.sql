-- Schema T04. Provision the owner separately; no personal UUID/seed in Git.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.portfolio_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete restrict
);
revoke all on private.portfolio_owner from public, anon, authenticated, service_role;

create function public.is_portfolio_owner()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from private.portfolio_owner where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_portfolio_owner() from public, anon, service_role;
grant execute on function public.is_portfolio_owner() to authenticated;

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null check (name = btrim(name) and char_length(name) between 2 and 100),
  email text not null check (email = btrim(email) and char_length(email) between 3 and 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  message text not null check (message = btrim(message) and char_length(message) between 10 and 5000),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'accepted', 'failed'))
);
create index messages_created_at_id_idx on public.messages (created_at desc, id desc);
alter table public.messages enable row level security;
alter table public.messages force row level security;
revoke all on public.messages from public, anon, authenticated, service_role;
grant select (id, name, email, message, created_at, responded_at, notification_status)
  on public.messages to authenticated;
grant update (responded_at) on public.messages to authenticated;
grant select, insert, update on public.messages to service_role;
create policy owner_reads_messages on public.messages for select to authenticated
  using ((select public.is_portfolio_owner()));
create policy owner_responds_messages on public.messages for update to authenticated
  using ((select public.is_portfolio_owner()))
  with check ((select public.is_portfolio_owner()));

create table public.highlights (
  project_id bigint primary key check (project_id > 0 and project_id <= 9007199254740991),
  owner text not null check (owner ~ '^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$'),
  repo text not null check (repo ~ '^[a-zA-Z0-9_.-]{1,100}$' and repo not in ('.', '..')),
  position integer not null unique check (position between 0 and 23),
  unique (owner, repo)
);
alter table public.highlights enable row level security;
alter table public.highlights force row level security;
revoke all on public.highlights from public, anon, authenticated, service_role;
grant select on public.highlights to anon, authenticated;
grant insert, update, delete on public.highlights to authenticated;
create policy public_reads_highlights on public.highlights for select to anon, authenticated using (true);
create policy owner_inserts_highlights on public.highlights for insert to authenticated
  with check ((select public.is_portfolio_owner()));
create policy owner_updates_highlights on public.highlights for update to authenticated
  using ((select public.is_portfolio_owner())) with check ((select public.is_portfolio_owner()));
create policy owner_deletes_highlights on public.highlights for delete to authenticated
  using ((select public.is_portfolio_owner()));

-- A single transaction supports reorder/removal without transient unique-position conflicts.
create function public.replace_highlights(p_highlights jsonb)
returns void language plpgsql security invoker set search_path = ''
as $$
begin
  if not public.is_portfolio_owner() then
    raise exception 'Access denied' using errcode = '42501';
  end if;
  if p_highlights is null or jsonb_typeof(p_highlights) <> 'array' or jsonb_array_length(p_highlights) > 24 then
    raise exception 'Invalid highlights' using errcode = '22023';
  end if;
  -- Serialize owner edits, including the empty-list case.
  perform pg_advisory_xact_lock(20261023, 1);
  delete from public.highlights;
  insert into public.highlights (project_id, owner, repo, position)
    select (item->>'projectId')::bigint, lower(item->>'owner'), lower(item->>'repo'), (ordinality - 1)::integer
    from jsonb_array_elements(p_highlights) with ordinality as entries(item, ordinality);
end;
$$;
revoke all on function public.replace_highlights(jsonb) from public, anon, service_role;
grant execute on function public.replace_highlights(jsonb) to authenticated;

-- Durable quotas shared by all Function instances. Only HMACs, never raw IPs.
create table private.contact_limits (
  bucket text primary key,
  window_start timestamptz not null,
  attempts integer not null check (attempts > 0)
);
revoke all on private.contact_limits from public, anon, authenticated, service_role;

create function public.save_contact(
  p_submission_id uuid, p_name text, p_email text, p_message text, p_bucket text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  current_message public.messages%rowtype;
  ip_window timestamptz := date_bin(interval '10 minutes', now(), timestamptz '2000-01-01');
  global_window timestamptz := date_trunc('hour', now());
  attempt_count integer;
begin
  if p_bucket is null or p_bucket !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid bucket' using errcode = '22023';
  end if;
  -- Global quota first: consistent lock order. Denials do not raise/roll back counters.
  delete from private.contact_limits where window_start < now() - interval '1 day';
  insert into private.contact_limits as limits (bucket, window_start, attempts)
    values ('global', global_window, 1)
    on conflict (bucket) do update set window_start = excluded.window_start,
      attempts = case when limits.window_start = excluded.window_start
        then least(limits.attempts + 1, 101) else 1 end
    returning attempts into attempt_count;
  if attempt_count > 100 then return jsonb_build_object('outcome', 'limited'); end if;
  insert into private.contact_limits as limits (bucket, window_start, attempts)
    values (p_bucket, ip_window, 1)
    on conflict (bucket) do update set window_start = excluded.window_start,
      attempts = case when limits.window_start = excluded.window_start
        then least(limits.attempts + 1, 6) else 1 end
    returning attempts into attempt_count;
  if attempt_count > 5 then return jsonb_build_object('outcome', 'limited'); end if;

  perform pg_advisory_xact_lock(hashtextextended(p_submission_id::text, 0));
  select * into current_message from public.messages where submission_id = p_submission_id;
  if found then
    if current_message.name <> p_name or current_message.email <> p_email or current_message.message <> p_message then
      return jsonb_build_object('outcome', 'conflict');
    end if;
    return jsonb_build_object('outcome', 'existing', 'id', current_message.id,
      'notificationStatus', current_message.notification_status);
  end if;
  insert into public.messages (submission_id, name, email, message)
    values (p_submission_id, p_name, p_email, p_message) returning * into current_message;
  return jsonb_build_object('outcome', 'created', 'id', current_message.id, 'notificationStatus', 'pending');
end;
$$;
revoke all on function public.save_contact(uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.save_contact(uuid, text, text, text, text) to service_role;
