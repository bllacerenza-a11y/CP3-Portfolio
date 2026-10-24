# Handoff — T04 — Banco, autenticação e contato

## Identificação e estado

- **Tarefa/chat:** T04, CP3 · 04 — Banco, autenticação e contato (`01a1677e-9a7c-7300-aab8-7afb327cbc06`).
- **Data:** 23/10/2026, America/Sao_Paulo.
- **Estado reportado:** implementação pronta para revisão local; validação de serviços reais pendente de acesso/configuração. T04 não declarada concluída integralmente.
- **Resumo:** migrations, proprietário por UUID Auth, autorização/RLS, serviços de sessão/dados, schema compartilhado e Function de contato com persistência/idempotência/quotas/notificação Resend. Contratos executáveis para T05. Uma frente/escritor ativo; nenhum novo subagente/chat acionado.

## Objetivo, requisitos e limites

R04: backend implementado/testado localmente; envio/recebimento real e UI pendentes. R05: autorização de banco, sessão e operações locais verificadas; telas/guard de rota são T05 e serviços reais ainda pendentes. R09: testes versionados de validação e autorização do backend acrescentados; cenário obrigatório de formulário e redirecionamento sem login na UI ainda depende T05. R11/R12: branch convencional, responsabilidades separadas e checks automáticos.

Recebidos: AGENTS, HANDOFF, STATE, T04 de TASKS, CONTRACTS, ARCHITECTURE, handoff T03 e revisão T00/T03, THREADS, MODEL_POLICY, REQUIREMENTS e pesquisa de skills. Aplicação existente preservada. Fora do escopo desta entrega: telas de login/dashboard/formulário, curadoria na home, deploy/rewrites/CI remoto/Lighthouse/vídeo. T05 integra a apresentação; T07 integra Vercel.

## Estado do código e integração

- **Checkout:** `C:\Users\bruno\Documents\Codex\CP3-Portfolio`.
- **Branch:** `codex/t04-auth-contact`, criada a partir da main integrada **847e710**.
- **Candidato de implementação/evidência:** **e2338e18b7519c2766a877ac7a1a99b5dca53553**.
- **Commit deste handoff:** posterior ao candidato, somente documentação.
- **Integração T00:** pendente; main, STATE e THREADS preservados.
- **Edição preexistente preservada:** última frase de `docs/handoffs/T02-design-tema.md`, `pronta parT02a`; não incluída em commits T04. Não declarar checkout limpo.
- **Arquivos centrais alterados:** package/lock (Supabase JS/Zod/PGlite e test:server), tsconfig (server/api incluídos), shared/contracts (+ pending/OwnerSession/HighlightInput), CONTRACTS/ARCHITECTURE/README/.env.example e inventário de skills/harness.
- **Novos módulos:** `api/contact.ts`, `server/contact*.ts`, `shared/schemas/*`, `src/features/auth/*`, `src/services/{supabase,contact,dashboard}.ts`, migration/provisionamento, config e `tests/server/*`.
- **Ordem:** T00 revisar candidato/diff; configurar migrations/Auth/dono por ambiente e testar matriz real antes de disponibilizar dados públicos; T05 consumir contratos e manter imports privados no dashboard lazy. Nenhum serviço publicado ou remoto criado.

## Decisões e implementação

| Decisão | Motivo/comportamento | Efeito no consumidor |
| --- | --- | --- |
| Dono por UUID em tabela privada singleton | Não confiar em email/metadata do cliente; ausência fecha acesso | Auth criado manualmente, signup público precisa ser desabilitado no serviço; exemplo de provisionamento versionado sem UUID real |
| RLS + grants por coluna | Outro autenticado não ganha acesso; dono só altera responded_at nas mensagens | Consultar projeção explícita; select * não autorizado |
| RPC transacional para destaques | Reordenar/remover sem conflitos transitórios; rollback conserva lista anterior | Array até 24, posições por ordem, IDs/owner/repo reais da API GitHub |
| Zod 4 compartilhado | Mesmos limites/trim/mensagens no cliente e servidor | T05 reaproveita schema; error estrutural pode ter fields vazio e pede feedback geral |
| Persistir antes de notificar | Preservar contato em falha parcial | notified não significa entregue; failed/pending preservam dados/ID na UI |
| Unique submission_id e comparação do conteúdo | Replay não duplica linha/notificação | Conteúdo alterado com mesma chave gera 409; apenas criação nova tenta email |
| Sem reenvio público automático | Janela Resend de 24h e resultados ambíguos | Pending/failed exigem reconciliação administrativa; não há fila/reprocessamento público |
| Quotas no Postgres | Compartilhadas entre instâncias da Function | 5/IP/10 min, 100 globais/hora; HMAC do IP, Retry-After conservador; limites são decisões locais |
| SDK Auth/DB e HTTP Resend | Evitar servidor próprio/SDK extra de email | Sem credenciais no navegador além da publishable; segredos só servidor |

Avaliação da skill **Supabase Postgres Best Practices**: Supabase/agent-skills, revisão **c9be0e931b7930f7d02126d04774d904c381e7d7**, versão declarada 1.1.1, MIT. SKILL/LICENSE/inventário e sete referências lidos; aplicada textualmente, sem instalação/cópia/execução de skill. Origem, links fixados, dependências, adequação e limites em `docs/T04_BACKEND.md`.

Dependências exatas: Supabase JS 2.118.0 (MIT, Node >=22), Zod 4.6.7 (MIT); PGlite 0.5.11 (Apache-2.0), somente dev/teste. npm reportou zero vulnerabilidades nas instalações; não equivale a auditoria completa. React Hook Form não instalado antecipadamente.

## Contratos para T05

Contrato normativo detalhado em `docs/CONTRACTS.md`, seção “Contratos executáveis T04 para T05”.

- `contactSchema`, `contactFieldErrors`; `submitContact(submission, signal?) → ContactResult`. Novo estado `saved_notification_pending`, além de notified/saved_notification_failed/invalid/failed. Não afirmar entrega na caixa. Manter ID e conteúdo para retry de transporte; sem retry automático de notificação.
- `resolveOwnerSession`, `signInOwner`, `signOutOwner(queryClient)`, `clearPrivateQueries`; `useOwnerSession()` dentro do QueryClientProvider existente. Aguardar loading; anonymous redireciona /login com replace; forbidden mostra negação; error não libera dados. T05 implementa esse guard, ainda ausente nesta entrega.
- Habilitar mensagens somente owner; limpar/cancelar queries messages ao trocar/sair. Bloquear painel/queries durante logout e manter bloqueio em erro. Sem cache persistente.
- `fetchMessages(offset=0, signal?)` retorna páginas de 50, ordered created_at/id desc; `markMessageResponded(id, boolean)` marca/limpa timestamp, sem enviar resposta ao visitante. Invalidar messages do usuário após mutação.
- `fetchHighlights(signal?)` retorna seleção pública ordenada; `replaceHighlights(HighlightInput[])` substitui atomicamente (inclusive []). Invalidar highlights e buscar Project real com T03. Metadados não são cadastrados no banco.
- Nenhuma rota/tela ou estilo alterado na T04; home continua honesta com contato em preparação. Confirmar divisão do bundle ao integrar auth/dashboard na T05.

## Verificação executada

Ambiente: Windows/PowerShell, Node **24.20.0**, npm **11.19.0**, Playwright **1.64.1**, PGlite **0.5.11**, que reportou **PostgreSQL 18.6 / wasm32**. Supabase real não configurado, sua versão não verificada. Código final testado corresponde a e2338e1; este handoff só acrescenta documentação.

| Data/estado | Procedimento/comando | Resultado/evidência |
| --- | --- | --- |
| 23/10, entrada main 847e710 | git status/log e leitura dos contratos/handoffs | Apenas edição T02 preexistente; criada branch T04 sem sobrescrever alteração |
| Preparação | docker info --format '{{.ServerVersion}}' | Exit 1: engine Linux indisponível. Nenhum banco Docker iniciado; adotado teste embarcado |
| Dependências | npm view dos três pacotes (version/engines/license); npm install --save-exact @supabase/supabase-js@2.118.0 zod@4.6.7; npm install --save-dev --save-exact @electric-sql/pglite@0.5.11 | Instalações exit 0, versões exatas no lock; npm ls --depth=0 sem erro |
| Primeira rodada de código | npm run typecheck; npm run lint; npm run test:server | Tipos passaram; lint falhou em setState síncrono no efeito. Backend 21/22: fixture esperava erro em logout 403, que SDK trata como sessão já inválida |
| Correções | Inicialização/configuração fora do efeito, updates por assinatura assíncrona; fixture de erro não ignorado em logout HTTP400 | Código do SDK instalado conferido: 401/403/404 encerram localmente sem erro. Lint e 22 testes passaram após correção; não foi afrouxada autorização |
| Revisão de SQL/HTTP | Acrescentados defaults amplos no shim, rejeição de destaques null, teste do ramo Vercel/preparsed body/IP | Defaults/revokes e estado preservado testados; body não é decodificado duas vezes; IP não vem de x-forwarded-for local/cliente |
| 23/10 ~21:05–21:07 BRT, estado final e2338e1 | npm run check | **Exit 0**, lint/formato/tipos/build, **23 testes backend** em 3,2s + **48 execuções E2E** (24 cenários × desktop/mobile Chromium) em **9,8s**. Log versionado `docs/evidence/T04/check.log` |
| Mesmo estado | git diff --check; git diff --cached --check | Exit 0; normalização CRLF/LF avisada em logs/documentos, sem erro de whitespace |
| Build | Saída Vite | 158 módulos; JS 306,15 kB (gzip96,57), CSS9,52 kB (gzip2,47), mesmo pacote da T03 porque módulos T04 ainda não importados na UI. Não é nota Lighthouse |
| Prévia local | npm run preview -- --port 4175; navegador do aplicativo | Home com dados reais GitHub observada, Aether/Melodia e referência 404 SmartCameraStudy; contato segue em preparação. Logs error retornaram []; somente observação da home, sem teste de Auth/Function no browser |

Os 23 testes backend executam SQL/RLS com roles/claims/Auth.users sintéticos (shim de Supabase) e respostas de GoTrue/Resend simuladas. Testes HTTP sobem servidor Node local usando o mesmo adaptador de /api/contact e banco embarcado. Nenhuma chamada real Supabase/Resend é feita pela suíte. Concorrência entre conexões independentes, runtime hospedado e durabilidade de disco não foram medidos. Testes de dashboard/formulário em navegador continuam T05/T06.

### Critérios de aceite e limites

| Critério | Estado/evidência |
| --- | --- |
| Esquema/policies reproduzíveis | Migration executada desde banco vazio pelo teste; dono/configuração por ambiente documentados, sem ID pessoal versionado |
| Sessão, login/logout e permissão | SDK real contra respostas Auth sintéticas; cache cancelado/removido; contas reais pendentes |
| Matriz visitante/dono/outro fora da UI | SQL real embarcado verifica grants/RLS, reads/writes, RPCs e colunas. Não substitui Data API e JWTs de Supabase real |
| Contato válido/inválido/sucesso/falha | Testes de schema, HTTP e SQL, idempotência/conflito/quotas/falha parcial/pending. Recepção real de email não verificada |
| Contratos para T05 | Tipos/schemas/serviços e limites registrados, UI não implementada nesta tarefa |
| Segredos | Nenhum .env real encontrado/configurado; nomes em .env.example e valores sintéticos em testes. Busca dos nomes de segredos conhecidos no JS de dist sem matches; não é auditoria geral |

### Inspeção do navegador e encerramento

URL `http://127.0.0.1:4175/`, build local do candidato, navegador integrado, viewport padrão (não fixado/medido). Inspeção DOM da home e logs; sem nova avaliação visual detalhada ou dispositivo físico. Nenhuma captura nova reivindicada. Não alterar tema/fluxos existentes para simular funcionalidade nova. Prévia T04 deve ser encerrada ao terminar esta rodada; abas temporárias não são entrega de autenticação.

## Ambientes, acessos e pendências

| Item | Acesso necessário / responsável | Impacto e próxima ação |
| --- | --- | --- |
| Supabase | Usuário: projeto dedicado e acesso administrativo; URL/publishable e secret key nos ambientes apropriados | Aplicar migration, desabilitar signup público, criar dono/test user, provisionar UUID e testar RLS via Data API com três identidades |
| Auth | Usuário escolhe credencial do dono; não enviar senha por chat/Git | Verificar login/logout/reload/renovação reais; T05 fará guard e telas |
| Resend | Usuário: conta, API key de envio, remetente/domínio autorizado e destinatário controlado | Configurar só servidor; submeter contato real e comprovar persistência/recepção pelo dono; aceitação do provedor não comprova inbox |
| Vercel | T07/usuário: projeto/ambientes, duração da Function e origens exatas | Validar runtime/body/IP/quotas, preservar /api nos rewrites; preview Vite não executa Functions |
| Revisão T00 | Candidato e handoff desta branch | Revisar código/testes, decidir integração e atualizar STATE/THREADS; não foram alterados pelo executor |

Configuração nominal em `.env.example`; passos/matriz/limites completos em `docs/T04_BACKEND.md`. A pergunta sobre disponibilidade dos serviços foi enviada ao usuário durante a execução; nenhuma informação de acesso chegou nesta rodada. Não foram criadas contas, credenciais, sessões, serviços ou deploys. Trabalho independente local concluído para revisão; validações externas continuam pendentes e não foram convertidas em sucesso simulado.

Riscos/limites adotados: quota global pode ser esgotada por abuso; IP compartilhado pode atingir limite; origem não é autenticação anti-bot. A secret key é privilegiada e deve permanecer no servidor. Pending/failed exigem reconciliação manual e não garantem ausência de email. Timestamp responded_at vem do relógio do cliente do dono. Migrations não foram aplicadas em Supabase real. Mais detalhes em T04_BACKEND.

## Pacote para revisão e próxima ação

1. T00 revisar diff **847e710..e2338e1**, começando por migration/grants/RPCs, shared/schemas, orquestração/dependências/HTTP e sessão/cache. Conferir CONTRACTS e os testes/evidência em vez de confiar apenas neste resumo.
2. Reproduzir instalação via lock e npm run check. Antes de npm ci no Windows, encerrar prévias que prendam binários do Vite; nenhuma prévia alheia foi terminada pela T04. npm ci não foi repetido nesta rodada; npm install/check/ls foram executados.
3. Preservar edição T02, conteúdo/tema/T03 e STATE/THREADS. Não trocar branch sob outro escritor. T05 só começa após registrar a integração/contratos e os limites de ambiente.
4. Disponibilizar acessos pelos mecanismos locais/servidor, nunca pelo chat; seguir checklist de serviços reais de T04_BACKEND. Esta rodada não conclui R04/R05 integralmente.

### Mensagem curta para T00

> T04 pronta para revisão local na branch codex/t04-auth-contact, candidato e2338e1. Migration/RLS, Auth do dono, serviços administrativos, contato com validação/persistência/idempotência/quotas e Resend implementados. Check aprovado: 23 backend +48 execuções E2E; serviços Auth/email simulados, SQL em Postgres WASM. Skill Supabase avaliada/aplicada textualmente, detalhes em T04_BACKEND. Supabase/Resend/Vercel reais pendentes; UI/guard são T05. Handoff: docs/handoffs/T04-banco-auth-contato.md. Edição T02 e arquivos canônicos T00 preservados. Próxima ação: revisar candidato e resolver acessos antes de comprovar integração real.
