# Supabase real — primeira configuração T04

23/10/2026, aproximadamente 21:25–21:33, America/Sao_Paulo. Projeto público de referência `fkaqywmnsknqoqniohfz`, nome CP3-Portfolio, região São Paulo. Acesso pelo navegador integrado após login realizado pelo usuário. Nenhuma senha/chave/token copiado para o repositório.

Código de referência: e2338e1, handoff inicial 5991ed7. Antes da operação, checkout tinha somente a edição preexistente em handoffs/T02-design-tema.md; preservada.

## Operações observadas

1. Consulta SQL somente leitura reportou PostgreSQL **17.11**, current_user postgres. Messages/highlights estavam ausentes (`to_regclass` → null/coalesce absent).
2. Conteúdo de `supabase/migrations/202610230001_portfolio.sql` copiado para o SQL Editor, envolto em BEGIN/COMMIT. Cópia conferida antes de executar: 7704 caracteres e FNV-1a 1684533169 para o arquivo normalizado LF; texto no editor igual à cópia com wrapper transacional (7719 caracteres). FNV serve apenas à conferência de transporte, não assinatura de segurança.
3. Editor retornou **Success. No rows returned.** Não foi criado histórico de migration via CLI; registrar esta aplicação manual antes de usar db push, para evitar tentativa de recriar objetos. Não reaplicar o arquivo em banco já configurado.
4. Consulta de catálogo/privilégios abaixo retornou dez linhas, todas **true**. Screenshot `supabase-rls-grants.jpg` mostra parte da grade; o restante foi lido na árvore de acessibilidade.
5. Em Authentication → Sign In / Providers, `Allow new users to sign up` estava ligado. Desligado e salvo; após reload, switch permaneceu **0**, `Save changes` desabilitado. Email provider permaneceu enabled, confirmação de email ligada, sign-ins anônimos desligados. Nenhuma integração OAuth adicionada.
6. Authentication → Users → Add user → Create new user aberto e deixado para o usuário preencher email/senha diretamente. Campos vazios; Auto confirm user marcado por padrão. Nenhuma credencial criada pelo agente, nenhum email de convite enviado. Política de navegador exige handoff antes de inserir nova credencial.

| check_name | passed |
| --- | --- |
| messages RLS + force | true |
| highlights RLS + force | true |
| anon cannot read messages | true |
| anon reads highlights | true |
| authenticated cannot edit body | true |
| authenticated can mark responded | true |
| anon cannot call save_contact | true |
| authenticated cannot call save_contact | true |
| service can call save_contact | true |
| no owner provisioned yet | true |

Isto verifica o catálogo/grants no serviço real. Não é ainda prova comportamental com JWTs reais de visitante/dono/outro usuário. O último check registra o estado anterior ao provisionamento do proprietário.

## Consulta de verificação executada

```sql
select 'messages RLS + force' as check_name, (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.messages'::regclass) as passed
union all select 'highlights RLS + force', (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.highlights'::regclass)
union all select 'anon cannot read messages', not has_column_privilege('anon', 'public.messages', 'id', 'SELECT')
union all select 'anon reads highlights', has_table_privilege('anon', 'public.highlights', 'SELECT')
union all select 'authenticated cannot edit body', not has_column_privilege('authenticated', 'public.messages', 'message', 'UPDATE')
union all select 'authenticated can mark responded', has_column_privilege('authenticated', 'public.messages', 'responded_at', 'UPDATE')
union all select 'anon cannot call save_contact', not has_function_privilege('anon', 'public.save_contact(uuid,text,text,text,text)', 'EXECUTE')
union all select 'authenticated cannot call save_contact', not has_function_privilege('authenticated', 'public.save_contact(uuid,text,text,text,text)', 'EXECUTE')
union all select 'service can call save_contact', has_function_privilege('service_role', 'public.save_contact(uuid,text,text,text,text)', 'EXECUTE')
union all select 'no owner provisioned yet', (select count(*) = 0 from private.portfolio_owner);
```

## Limites e próxima ação

Usuário deve criar o usuário Auth proprietário com email/senha escolhidos diretamente no formulário do Supabase. Depois provisionar UUID pela operação administrativa versionada e executar matriz comportamental real; não versionar credencial/UUID pessoal. Aplicação local ainda sem variáveis reais; Resend/Vercel e recebimento de email seguem pendentes. Os checks locais anteriores não foram repetidos nesta rodada, pois nenhum código mudou.

O painel exibiu aviso geral de investigação técnica da plataforma; projeto estava Healthy e as consultas/operação acima tiveram resultado observado. Isso não confirma ausência de incidente em outros serviços.
