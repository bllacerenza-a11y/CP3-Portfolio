-- Executadas no SQL Editor em 24/10/2026. Somente leitura, sem migration/seed.
select
  to_regclass('supabase_migrations.schema_migrations') is not null as cli_history_exists,
  (select count(*) from public.messages) = 3 as message_count_preserved,
  (select count(*) from public.highlights) = 0 as highlights_preserved,
  (select not prosecdef and prosrc like '%delete from public.highlights where project_id > 0%'
   from pg_proc where oid='public.replace_highlights(jsonb)'::regprocedure) as incremental_present,
  has_function_privilege('authenticated','public.replace_highlights(jsonb)','execute') as owner_rpc_grant,
  not has_function_privilege('anon','public.replace_highlights(jsonb)','execute') as anon_rpc_denied,
  not has_function_privilege('authenticated','public.save_contact(uuid,text,text,text,text)','execute') as contact_rpc_denied,
  has_function_privilege('service_role','public.save_contact(uuid,text,text,text,text)','execute') as contact_service_granted;
-- Observado: false, true, true, true, true, true, true, true.

-- Hash MD5 do corpo sem whitespace, comparado com os arquivos locais em ordem.
-- É comparação de equivalência de corpo, não uma assinatura de segurança.
select p.proname,
  md5(regexp_replace(p.prosrc, '[[:space:]]', '', 'g')) = expected.hash as body_matches_versioned_migrations
from pg_proc p
join (values
  ('is_portfolio_owner','762304082677cc8b737af466eb3a956b'),
  ('replace_highlights','8f39e96df53173fc127290cc059e87b3'),
  ('save_contact','583ce51782003d95b7022cc481f7ecdb')
) expected(name,hash) on p.proname=expected.name
where p.pronamespace='public'::regnamespace
order by p.proname;
-- Observado: três funções, todas true.
