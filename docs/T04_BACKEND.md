# T04 — Banco, sessão e contato

Base: main `847e710`, branch `codex/t04-auth-contact`. Decisões de 23/10/2026. Implementação local; integração Supabase/Resend/Vercel depende de configuração e verificação reais. Formulário, telas de login/dashboard e proteção de rota são da T05.

Atualização de serviço: migration aplicada no Supabase real, signup público desligado e proprietário provisionado com confirmação do usuário. Dez inspeções de catálogo e 11 probes comportamentais de SQL passaram; Data API real de visitante/serviço verificada. Evidências e distinção de claims simulados versus login/JWT em `evidence/T04/supabase-initial-verification.md` e `evidence/T04/supabase-owner-verification.md`. Login real do dono em diagnóstico local ainda pendente; Resend/Vercel seguem sem configuração. As menções de serviço não acessado abaixo descrevem a rodada inicial de implementação, anterior à retomada.

Atualização posterior: login real do dono, restauração de sessão, logout/cache e JWT de outro usuário sem permissão foram verificados; `npm run test:supabase` passou 12 checks e removeu sua conta Auth descartável. Evidência atual: `evidence/T04/auth-live-session.md`. Resend/recebimento de email, Vercel e UI T05 continuam pendentes. Esse comando é opt-in, não deve executar em CI sem intenção explícita de usar/criar/remover a fixture no serviço configurado.

## Skill avaliada e aplicada

Atualização de 24/10/2026: Resend configurado no `.env` ignorado, com chave Sending access autorizada pelo usuário. `npm run test:contact-live` passou contra Supabase e Resend reais usando o adaptador Node local: persistência, uma notificação aceita, replay sem novo envio, conflito e falha parcial controlada. O destinatário confirmou recebimento no chat. Evidência em `evidence/T04/contact-live.md`; Vercel e UI T05 continuam pendentes. O remetente de teste `onboarding@resend.dev` só permite envio ao email da própria conta Resend; produção requer remetente/domínio autorizado e configuração por ambiente.

- Origem primária: [supabase/agent-skills](https://github.com/supabase/agent-skills), revisão **c9be0e931b7930f7d02126d04774d904c381e7d7**, obtida pela API GitHub em 23/10/2026.
- [SKILL.md fixado](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/SKILL.md) lido integralmente; versão declarada **1.1.1**, autor/organização Supabase. [LICENSE](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/LICENSE) MIT, copyright Supabase 2026, conferido integralmente; frontmatter também declara MIT.
- Inventário recursivo da pasta na mesma revisão: SKILL.md, CHANGELOG.md e referências Markdown. Nenhum script, executável, hook ou manifesto de dependências dentro dessa pasta. A skill é orientação textual; não foi instalada, copiada ou executada como pacote.
- Referências lidas integralmente nessa revisão: `security-privileges`, `security-rls-basics`, `security-rls-performance`, `schema-constraints`, `schema-data-types`, `lock-short-transactions`, `data-upsert`, todas em `skills/supabase-postgres-best-practices/references/`.
- Adequação: tipos UUID/bigint/text/timestamptz, constraints, RLS, grants mínimos, `search_path = ''`, consulta de identidade com SELECT, unicidade e transações curtas sem HTTP dentro do banco. Somente o serviço pode chamar a RPC de contato. A checagem booleana `is_portfolio_owner` é uma RPC pública deliberada para a UI autenticada, sem argumentos/UUIDs retornados nem capacidade administrativa. Sua execução é revogada de anon/PUBLIC/service_role. Ela verifica `auth.uid()` e consulta tabela privada; não transfere o exemplo multi-tenant da skill para um produto multiusuário.
- A skill não comprova segurança nem performance. As políticas são exercitadas em Postgres embarcado com identidades sintéticas; não há benchmark nem certificação. As referências externas da skill são documentação, não dependências executáveis.

Dependências de produto conferidas via npm (version/engines/license) antes da instalação exata: `@supabase/supabase-js` **2.118.0**, MIT, Node >=22; `zod` **4.6.7**, MIT. Ambiente Node 24.20.0. Dependência apenas de testes: `@electric-sql/pglite` **0.5.11**, Apache-2.0; executa Postgres WASM e permite testar SQL/RLS sem Docker. Docker instalado, mas engine indisponível nesta rodada. Instalação npm informou zero vulnerabilidades; isso não equivale a auditoria completa.

## Modelo e autorização

`supabase/migrations/202610230001_portfolio.sql` cria tabela privada singleton do dono, mensagens, destaques, quotas e RPCs. Não contém dono real, senha, seed editorial ou metadados de repositórios. Ordem: aplicar migration uma vez por ambiente, provisionar Auth, registrar UUID do dono e verificar matriz antes de disponibilizar o navegador. Se faltar o dono, nenhuma identidade ganha permissão.

| Operação | Visitante (anon) | Outro autenticado | Proprietário | Serviço de contato |
| --- | --- | --- | --- | --- |
| Ler destaques | Sim | Sim | Sim | Não necessário/não concedido |
| Administrar destaques | Negado | Negado/RLS | Sim | Não concedido |
| Ler projeção de mensagens | Negado/grant | Vazio/RLS | Sim | Sim para persistência |
| Atualizar responded_at | Negado | Zero linhas/RLS | Sim | Concedido ao serviço |
| Alterar conteúdo/status pelo navegador | Negado | Negado | Negado/grants de coluna | Serviço pode gravar/status |
| Inserir mensagens diretamente | Negado | Negado | Negado | Sim; aplicação usa RPC |
| RPC save_contact | Negado | Negado | Negado | Sim |
| Alterar dono/quotas privadas | Negado | Negado | Negado | Não diretamente; quotas só pela RPC |

O administrador do projeto e a secret key têm privilégios elevados; RLS não protege contra vazamento da secret key. O proprietário do site usa chave publishable + JWT. O UUID vem de `auth.uid()`, nunca de email, metadata editável pelo usuário ou parâmetro enviado pelo cliente. Não há setter de dono acessível via Data API. As tabelas públicas usam ENABLE/FORCE RLS, policies específicas e grants explícitos; a projeção não inclui submission_id. A consulta de mensagens deve listar colunas explicitamente, pois `select('*')` inclui coluna não autorizada.

`replace_highlights` é security invoker: verifica dono, serializa substituições e aplica delete/insert numa transação, mantendo a seleção anterior em falha. Posição deriva da ordem do array; limite adotado de 24 itens (0–23), IDs distintos, owner/repo normalizados em minúsculas. Metadados continuam na API GitHub. Não há verificação online do vínculo ID↔repo no banco: T05 deve enviar a seleção obtida da API, sem fabricar Project.

## Contato e notificação

`api/contact.ts` é adaptador Node de Vercel; `server/contact.ts` orquestra a regra; `server/contactDependencies.ts` integra SDK Supabase/Resend; schema único em `shared/schemas/contact.ts`. O body JSON tem teto de 32 KiB; nome/email/mensagem têm trim e limites de CONTRACTS. UUID inválido, campo extra, email inválido e limites são recusados. Campos inválidos recebem mensagens específicas; erro estrutural/submissionId gera `invalid` com fields vazio, exigindo mensagem geral na T05. Método/origem/tipo/body são verificados, respostas são `no-store`, sem dados privados ou detalhes internos no erro.

Quotas adotadas, não prescritas pelo professor: 5 solicitações válidas por IP a cada janela fixa de 10 minutos; 100 solicitações válidas globais/hora. Também contam repetições/conflitos. Banco coordena todas as instâncias; não usar Map local em produção. Chave IP é HMAC-SHA256 com segredo de >=32 caracteres; origem/limites não substituem proteção anti-bot. `Retry-After: 3600` é conservador para ambas as quotas. Buckets vencidos há mais de um dia são removidos durante o próximo contato válido. Requisições inválidas não chegam ao banco; mitigação de tráfego volumétrico é da infraestrutura. Compartilhar IP pode atingir a quota; ajustar só com evidência. A quota global pode ser esgotada por abuso: é um teto de custo, não garantia de disponibilidade.

Em Vercel, usa exclusivamente `x-vercel-forwarded-for` fornecido pela plataforma e valida IP único. Fora de Vercel usa socket.remoteAddress, ignorando forwarded headers do cliente. Outro proxy/destino precisa de adaptação explícita. Origem exata deve constar em CONTACT_ALLOWED_ORIGINS; sem origem ou fora da lista, 403. CORS não é liberado. Origens podem ser forjadas fora do navegador, por isso não são tratadas como autenticação.

Persistência/idempotência: a RPC serializa a chave submissionId, aplica unique e compara o conteúdo normalizado. Repetição idêntica retorna o estado existente; conteúdo diferente retorna 409. Somente a criação nova tenta notificar. Não há retry público de e-mail para `failed`/`pending`, mesmo após 24h: evita reenvio automático fora da janela de idempotência de 24h do Resend. Resend recebe chave `contact/<messageId>`, texto puro, assunto/remetente/destinatário fixos no servidor e reply_to validado. Não há HTML de usuário, e o destinatário nunca vem do body.

Estados: `pending` após persistência; `accepted` somente após HTTP de sucesso com ID do provedor; `failed` se chamada falha/é recusada. Timeout pode ser ambíguo: failed indica ausência de aceitação confirmada, não prova de não envio. Falha ao gravar o resultado deixa pending e retorna `saved_notification_pending`. Esse resultado também aparece na repetição durante envio ou após interrupção da Function. Sem fila/job automático: operador precisa reconciliar pending/failed no painel Resend pela referência, antes de qualquer recuperação manual. Não existe endpoint público para reprocessar. Um HTTP 201 prova aceitação registrada, nunca entrega na caixa. Timeout Supabase/Resend: 8s por chamada; T07 deve reservar duração suficiente para até três chamadas sequenciais, mais margem, conforme plano.

## Configurar serviços reais

Nenhum serviço foi criado/acessado nesta execução. `.env.example` lista nomes usados; `.env`/`.env.*` ficam ignorados. Não colocar credenciais em comandos, logs, capturas ou commits.

1. **Supabase:** projeto dedicado; acesso de administrador para aplicar migration no SQL Editor ou pelo fluxo de migrations do serviço. Se usar SQL Editor, executar o arquivo completo em transação e registrar revisão aplicada por ambiente; ele não atualiza automaticamente o histórico da CLI. Não reaplicar o mesmo CREATE em banco já migrado. Desabilitar novos cadastros públicos em Auth; criar o usuário proprietário manualmente, com email confirmado e senha escolhida pelo dono. Autenticação email/senha, sem OAuth/magic link/cadastro público nesta implementação. Configurar Site URL/URLs autorizadas do ambiente. Criar outro usuário de teste controlado para a matriz; não conceder dono a ele.
2. **Provisionar dono:** copiar o conteúdo de `supabase/provisionOwner.example.sql` para operação administrativa local, trocar sentinel pelo UUID Auth existente e executar no ambiente correto. Sentinel falha deliberadamente; FK rejeita usuário inexistente. A operação é transacional/reexecutável, não registrar UUID pessoal no Git. Rotação exige administrador e invalidação de sessões antigas; `is_portfolio_owner` consulta a tabela a cada operação, não conserva role em metadata/token.
3. **Chaves/configuração:** URL e publishable key em VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY. Só servidor: SUPABASE_URL/SUPABASE_SECRET_KEY, CONTACT_RATE_LIMIT_SECRET e CONTACT_ALLOWED_ORIGINS. Secret key do projeto com privilégio de serviço, nunca chave pública. Dono vem do banco; CONTACT_OWNER_ID anterior foi removida por não ser usada.
4. **Resend:** conta, API key com permissão de envio, remetente/domínio autorizado e destinatário controlado. CONTACT_FROM_EMAIL/CONTACT_TO_EMAIL são emails simples; restrições de sandbox/conta precisam ser conferidas. RESEND_API_KEY e emails são opcionais: deixar ausentes enquanto não configurados permite persistir e retornar falha parcial. Variável opcional vazia/valor inválido deve ser removida/corrigida. Configuração inválida obrigatória fecha a Function com 503.
5. **Vercel/T07:** configurar segredos e origens por ambiente. Function fica em `/api/contact`; rewrites da SPA devem preservar `/api`. Preview Vite não executa Node Functions. O teste HTTP versionado executa o mesmo adaptador em Node com banco local e email simulado; isso não comprova deploy Vercel. Deploy e configuração de duração pertencem à T07.

## Verificação real pendente e evidência necessária

Após acessos, registrar ambiente, revisão/migration, horário e resultado sem tokens/senhas. Fazer login/logout reais e resolver sessão/dono pela RPC; testar Data API com publishable key de visitante, JWT do dono e JWT de outro usuário. Conferir reads/writes de mensagens/destaques e negativa de RPC/colunas conforme matriz, fora da UI. Repetir testes SQL com roles reais se possível. Confirmar signup público desabilitado. Isso cobre diferenças de grants padrão, PostgREST/GoTrue e versão/configuração do serviço que o shim não reproduz.

Submeter pelo endpoint real, conferir uma única mensagem persistida, recepção real pelo dono e ID/status do provedor. Repetir submissionId idêntico e com conteúdo alterado; testar resposta parcial em ambiente de teste controlado. Verificar header de IP real, quotas, tamanho e origens no runtime Vercel. Não declarar R04/R05 concluídos sem essas evidências e a UI T05. Nenhuma nota Lighthouse/CI remoto/deploy foi obtida pela T04.

## Fontes primárias

- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [funções](https://supabase.com/docs/guides/database/functions), [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
- [Auth signInWithPassword](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [getUser](https://supabase.com/docs/reference/javascript/auth-getuser).
- [Resend Send Email](https://resend.com/docs/api-reference/emails/send-email), [idempotência de 24h](https://resend.com/changelog/idempotency-keys).
- [Vercel Node/body helper](https://vercel.com/docs/functions/runtimes/node-js), [headers de IP](https://vercel.com/docs/headers/request-headers).

Fontes consultadas em 23/10/2026. Decisões do projeto e limites de teste acima são locais, não afirmações de resultados nos serviços.
