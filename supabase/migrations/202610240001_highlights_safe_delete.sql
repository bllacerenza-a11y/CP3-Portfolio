-- Supabase pg_safeupdate rejects DELETE without a predicate (SQLSTATE 21000).
-- Every valid project_id is positive; retain replace-all semantics and RLS.
create or replace function public.replace_highlights(p_highlights jsonb)
returns void language plpgsql security invoker set search_path = ''
as $$
begin
  if not public.is_portfolio_owner() then
    raise exception 'Access denied' using errcode = '42501';
  end if;
  if p_highlights is null or jsonb_typeof(p_highlights) <> 'array' or jsonb_array_length(p_highlights) > 24 then
    raise exception 'Invalid highlights' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(20261023, 1);
  delete from public.highlights where project_id > 0;
  insert into public.highlights (project_id, owner, repo, position)
    select (item->>'projectId')::bigint, lower(item->>'owner'), lower(item->>'repo'), (ordinality - 1)::integer
    from jsonb_array_elements(p_highlights) with ordinality as entries(item, ordinality);
end;
$$;
-- CREATE OR REPLACE preserves the existing grants. No role/policy is expanded.
