# Handoff — T01 — Fundação, arquitetura e harness

## Identificação e estado

- **Tarefa/chat:** T01 — CP3 · 01 — Fundação, arquitetura e harness; ID 01a1677e-8ee5-74a3-8c1d-e850e1de2a00.
- **Responsável:** executor T01; revisão e integração pela T00.
- **Atualizado em:** 23/10/2026, 15:45, America/Sao_Paulo.
- **Estado reportado:** pronta para revisão local; CI remoto e serviços pendentes, separados da validação local.
- **Resumo:** base React/TypeScript/Vite reproduzida com npm ci, checks aprovados, navegação testada, stack/contratos documentados e harness sanitizado. Nenhum outro chat foi reiniciado; nenhum subagente foi acionado.

## Objetivo, requisitos e limites

- Preparar fundação reproduzível conforme seção T01 de TASKS.md. A retomada do usuário autorizou implementação local; a limitação de leitura da primeira rodada foi substituída por esse pedido.
- **Relacionados:** R11/R12 (organização, padrões e automação), G01 (README/env, remoto ainda ausente), preparação de R09 (runner funciona, cenários obrigatórios ainda não existem) e G02 (inventário do harness; vídeo pendente). Fallback local é cobertura parcial de R01, sem comprovar o deploy.
- **Entregues:** package/lock, runtime, scripts, configuração de CI, teste comportamental, instruções e variáveis de exemplo, decisões comparadas e contratos iniciais.
- **Fora do escopo:** conteúdo/identidade visual final, GitHub API, formulário, autenticação, painel, schema físico/RLS, e-mail, Lighthouse e publicação.
- **Dependências recebidas:** AGENTS, HANDOFF geral, STATE, seção T01 de TASKS, REQUIREMENTS, ARCHITECTURE, THREADS, MODEL_POLICY, pesquisa de skills já existente e critérios pertinentes de TEST_PLAN. Nenhuma skill externa instalada/adotada na T01.

## Estado do código e integração

- **Repositório/checkout:** `C:\Users\bruno\Documents\Codex\CP3-Portfolio`; sem remoto (`git remote -v` sem saída).
- **Branch:** `codex/t01-foundation`, criada a partir de main limpa. A autorização atual iniciou T01 como escritor; STATE ainda descreve a fase anterior de documentação pela T00.
- **Base:** `560e27787d97291caa0223d8db3985a2516167b9`.
- **Candidato de implementação verificado:** `38484a447dd7d43dbb5af414f8faf2040d4798be`.
- **Commit de handoff:** consultar `git log -1`; o commit documental que contém este arquivo sucede o candidato acima sem alterar implementação/configuração.
- **Revisão integrada pela T00:** ainda não integrada a main. STATE e THREADS preservados para atualização pela coordenação.
- **Alterações não commitadas:** nenhuma no candidato; este handoff foi acrescentado em seguida. Artefatos gerados node_modules/dist/playwright-report/test-results são ignorados.
- **Arquivos:** package.json/lock e configs (execução/checks), `.github/workflows/ci.yml` (CI), src/app e styles (shell provisório/404), shared/contracts.ts (interfaces), tests/e2e/foundation.spec.ts (navegação), README/AGENTS (padrões), ARCHITECTURE/CONTRACTS/HARNESS (decisões), evidence/T01/home-local.png (inspeção).
- **Compartilhados:** dependências/configs/rotas estabelecidos pela T01; responsáveis seguintes e regra de um escritor por checkout em CONTRACTS.md. Nenhuma migração necessária para rodar a base.

## Decisões e implementação

| Decisão                                                                 | Motivo/evidência                                                                                                | Efeito nos próximos chats                                                                                          |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| React 19.3.1, Vite 8.3.5, Router 8.5.0, TypeScript 6.0.3                | Versões/engines/peerDependencies consultados no npm; instalação, tipos, build e navegador aprovados             | Usar API instalada; evitar exemplos de Next e versões antigas do Router                                            |
| Node 24.20.0 / npm 11.19.0                                              | Runtime real já disponível, compatível com engines consultados; .nvmrc/.npmrc/packageManager registram contrato | CI usa mesma referência; nenhuma mudança global de runtime feita localmente                                        |
| TypeScript 6.0.3 em vez de latest 7.0.2                                 | typescript-eslint 8.72.0 declara suporte a TypeScript `<6.1.0`                                                  | Atualizações precisam conferir pares, não apenas latest                                                            |
| CSS Modules, ESLint/Prettier e Playwright                               | Menor fundação útil; E2E testa comportamento no build                                                           | T02 cria UI/tema, T06 amplia cobertura; não há segunda suíte redundante                                            |
| Query, RHF/Zod, Supabase e Functions como direção para próximas tarefas | Justificativas e concessões em ARCHITECTURE; não necessários ao shell                                           | Instalar quando usados, validando versões e integrações; Resend permanece candidato condicionado à conta/remetente |
| Rotas, tipos, políticas de cache e autorização, contato parcial         | CONTRACTS.md e shared/contracts.ts fecham interfaces iniciais                                                   | T03–T05 implementam; autorização deve ser validada no servidor/RLS                                                 |
| Prévia Vite separada de Functions                                       | Preview só serve SPA                                                                                            | T04/T07 precisam de ambiente real de servidor e fallback de produção                                               |

- **Dados:** nenhum projeto/pessoa/mensagem inventado. Textos exibidos são rótulos provisórios de desenvolvimento; não há chamadas externas na aplicação.
- **Configuração:** base executa sem .env; exemplo contém apenas nomes comentados. Segredos futuros exclusivamente no servidor. `.env` e `.env.production` ignorados; `.env.example` não ignorado.
- **Familiaridade:** aluno ainda precisa revisar e explicar decisões; nenhum domínio pessoal da stack foi presumido.
- **Harness:** HARNESS.md diferencia ferramentas usadas, instruções configuradas e skills/serviços não instalados. Nenhuma alteração de modelo da conversa foi realizada por ferramenta.

## Verificação executada

Todos os comandos abaixo rodaram no checkout canônico, Windows/PowerShell, em 23/10/2026 (America/Sao_Paulo). Checks finais ocorreram aproximadamente 15:41–15:42. O estado local testado foi registrado em `38484a4`; alterações posteriores foram somente documentação do handoff.

| Comando/procedimento                                                                                                                                                                      | Resultado real                                                                                | Evidência/limite                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `git status --short`, `git branch --show-current`, `git log -3 --oneline`, `git remote -v`                                                                                                | Entrada limpa em main; base 560e277; nenhum remoto                                            | Conferido antes de editar; branch de funcionalidade criada                                                                 |
| `node --version`, `npm --version`                                                                                                                                                         | v24.20.0 / 11.19.0                                                                            | Runtime local                                                                                                              |
| `npm view vite version engines --json`, `npm view @vitejs/plugin-react version engines peerDependencies --json`, `npm view react version`, `npm view react-router version engines --json` | Vite 8.3.5, plugin 6.1.2, React 19.3.1, Router 8.5.0; engines aceitam Node local              | Registro da compatibilidade antes de instalar                                                                              |
| `npm view typescript version`, `npm view typescript@6.0 version --json`, `npm view typescript-eslint version peerDependencies --json`                                                     | latest TS 7.0.2; TS 6.0.3 disponível; lint 8.72.0 suporta `<6.1.0`                            | Escolhida versão compatível                                                                                                |
| `npm install`                                                                                                                                                                             | Exit 0; 167 pacotes adicionados, 168 auditados; 0 vulnerabilidades reportadas                 | Lockfile gerado; não é auditoria integral de segurança                                                                     |
| `npm run lint`, `npm run typecheck`                                                                                                                                                       | Aprovados, sem erros                                                                          | Código e contratos iniciais                                                                                                |
| `npx playwright install chromium`                                                                                                                                                         | Exit 0; Chromium 156.0.8078.4, revisão 1248; FFmpeg/headless shell instalados pelo Playwright | Cache local do runner, sem configuração de conta                                                                           |
| Primeira `npm run format:check` com escopo `.`                                                                                                                                            | Não aprovada; avisos em nove documentos preexistentes                                         | Corrigido o escopo para código/configuração, preservando documentos canônicos de T00. Não foram relaxadas regras de código |
| `npm run build`                                                                                                                                                                           | Exit 0; 94 módulos; JS 256.83 kB / gzip 81.69 kB; CSS 0.52 kB / gzip 0.32 kB                  | Build inicial, não equivale a Lighthouse                                                                                   |
| Primeira `npm run check` após ajuste                                                                                                                                                      | Exit 0; lint/formato/tipos/build aprovados; 2 E2E passaram em 23.1s                           | Desktop e mobile Chromium                                                                                                  |
| `npm run preview` durante teste ainda ativo                                                                                                                                               | Exit 1: porta 4173 ocupada pelo próprio runner                                                | Após encerrar runner, preview iniciou normalmente. Port strict evita testar servidor errado                                |
| `npm run preview` após runner                                                                                                                                                             | Iniciou em 127.0.0.1:4173                                                                     | Inspeção no navegador feita; processo encerrado pela T01 antes da verificação final                                        |
| `npm ci`                                                                                                                                                                                  | Exit 0; 167 pacotes adicionados/168 auditados; 0 vulnerabilidades reportadas                  | Reinstalação pelo lockfile, sem depender do node_modules anterior                                                          |
| `npm run check` após npm ci                                                                                                                                                               | Exit 0; lint/formato/tipos/build aprovados; **2 passed (3.0s)**                               | Mesmo comportamento passou em desktop/mobile após reinstalação                                                             |
| `npm ls --depth=0`                                                                                                                                                                        | Exit 0, dependências diretas resolvidas sem pares inválidos reportados                        | Versões exatas no package.json/lockfile                                                                                    |
| `git check-ignore .env .env.production .env.example node_modules dist`                                                                                                                    | Ignora .env/.env.production/node_modules/dist; exemplo não consta na saída                    | Configuração sanitizada                                                                                                    |
| `git diff --check`, `git diff --cached --check`                                                                                                                                           | Exit 0, sem erros                                                                             | Diff conferido antes do commit                                                                                             |
| `npm run dev -- --port 5173 --strictPort`                                                                                                                                                 | Vite pronto em 205 ms; home observada no navegador                                            | Servidor local deixado ativo nesta sessão (66434); parar com Ctrl+C se aberto em terminal                                  |

Warnings do runner: NO_COLOR/FORCE_COLOR definidos simultaneamente no ambiente. Não causaram falha dos testes; nenhum erro de aplicação foi observado.

### Critérios de aceite

| Critério                              | Estado                        | Evidência/pendência                                                                                                    |
| ------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Instalação/execução reproduzíveis     | Verificado localmente         | npm ci, build, preview e dev; Node/npm registrados                                                                     |
| Build/checks                          | Verificado localmente         | npm run check após instalação limpa                                                                                    |
| Teste relevante                       | Verificado                    | URL inexistente, refresh, voltar à home e histórico, com assertions e captura de pageerror                             |
| CI configurada                        | Verificado por inspeção local | Workflow usa npm ci, instala Chromium e executa check                                                                  |
| CI no remoto                          | Não verificado                | Repositório GitHub ainda não configurado; Ubuntu ainda não executado                                                   |
| Regras de arquivos, ambiente, preview | Verificado por inspeção       | README, CONTRACTS, .env.example e configurações                                                                        |
| Decisões/contratos/harness            | Registrados                   | ARCHITECTURE, CONTRACTS, shared/contracts.ts, HARNESS, AGENTS                                                          |
| R09 integral                          | Não verificado                | Formulário e guard ainda serão implementados; teste inicial não os substitui                                           |
| R11/R12/G01/G02 integrais             | Não verificado                | Fundamentos locais presentes; histórico contínuo, remoto público, funcionalidades e vídeo dependem de próximas tarefas |

### Verificação visual e de fluxos

- **Build inspecionado:** candidato 38484a4, servido em http://127.0.0.1:4173.
- **Manual:** navegador integrado do Codex; viewport observado 516×480. Home e 404 legíveis na captura; clique em Voltar ao início abriu home. `dev.logs` filtrado em error/warn retornou lista vazia. Largura do documento 516, igual à viewport nessa observação.
- **Automatizado:** Playwright 1.64.1 / Chromium 156.0.8078.4; desktop 1280×720 e Pixel 7 emulado 412×839 (touch/mobile). Teste em tests/e2e/foundation.spec.ts; não há teste físico de celular.
- **Evidência:** [home local](../evidence/T01/home-local.png). Relatório Playwright gerado localmente em playwright-report, ignorado no Git e regenerável com npm test.
- **Dev:** http://127.0.0.1:5173 também inspecionado após commit; home observada e aba deixada aberta como resultado local.
- **Não verificado:** páginas finais, teclado completo, acessibilidade integral, outros engines, integração externa, Lighthouse e produção.

## Ambientes e serviços

| Ambiente/serviço | Identificação                        | Situação                                                                  |
| ---------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| Desenvolvimento  | http://127.0.0.1:5173                | Verificado; ativo ao fechar T01, processo vinculado à sessão local        |
| Build/preview    | dist / http://127.0.0.1:4173         | Verificado; preview de inspeção parado; testes sobem seu próprio servidor |
| GitHub/CI        | Sem remoto                           | Workflow pronto; execução pública/Ubuntu pendente de T00                  |
| Supabase/e-mail  | Sem projeto/conta configurada na T01 | T04 configura e valida autorização/envio real                             |
| Vercel           | Sem publicação                       | T07 configura preview, fallback e deploy automático após integração       |

Nenhuma conta foi acessada e nenhum serviço foi publicado. Credenciais devem ser inseridas por canal apropriado, nunca no handoff ou Git.

## Achados, riscos e pendências

| Item                                                                 | Responsável e próxima ação                                                                 | Bloqueia                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| STATE/THREADS ainda descrevem pré-implementação                      | T00 revisa este handoff e registra nova situação, sem presumir integração                  | Quadro canônico atualizado                                 |
| Sem remoto/CI executada                                              | T00 configura GitHub público e executa workflow; conferir Linux                            | Aceite remoto de T01/G01                                   |
| Familiaridade do aluno e conteúdo ausentes                           | Usuário revisa escolhas; T02 coleta conteúdo; registrar mudanças de decisão                | Conteúdo final e explicação em vídeo, não a fundação local |
| Contas/remetente/UUID do dono ausentes                               | T04 coleta configurações sem versionar segredo e implementa/testa integração               | Contato e dashboard reais                                  |
| Contratos ainda sem implementações de negócio                        | T03–T05 consomem CONTRACTS/shared e registram eventuais incompatibilidades antes de editar | Critérios funcionais futuros                               |
| Rewrites de produção não configurados                                | T07 testa acesso direto, refresh e /api na Vercel                                          | R01/R10 em produção                                        |
| Skills somente pesquisadas, agentes/MCPs de serviço não configurados | Escolher adoção apenas com função concreta; inventário HARNESS preserva o estado real      | Demonstração final de G02 ainda pendente                   |

## Pacote para revisão independente

- **Diff:** `560e277..38484a4` para implementação; commit documental seguinte acrescenta somente este handoff.
- **Referência:** seção T01 de TASKS; R11/R12/G01 e preparação de R09/G02 em REQUIREMENTS.
- **Atenção:** distinguir contrato de segurança de implementação; não interpretar 404 em /dashboard como guard; nenhum serviço externo existe; verificar engines/lock/configuração CI ao integrar.
- **Reprodução:** Node/npm registrados, npm ci, npx playwright install chromium, npm run check; sem contas/env. Não iniciar preview manual na porta 4173 durante testes.
- **Limites:** execução remota do workflow e demais funcionalidades fora do escopo não demonstradas.

## Próxima ação e passagem de contexto

1. T00 revisa `38484a4` e este handoff, confirma integração e atualiza STATE/THREADS; não trocar branch enquanto outro escritor estiver ativo.
2. Próximo executor lê AGENTS, handoff geral/STATE, própria tarefa, CONTRACTS, ARCHITECTURE e este handoff; preserva package/lock e contratos antes de implementar.
3. Após integração, T02 pode definir conteúdo/tema/componentes; T03/T04 consomem contratos conforme sequência coordenada. Não iniciar todos os chats automaticamente.
4. Ação humana indispensável posterior: configurar destino GitHub/CI e contas de serviços quando as tarefas correspondentes precisarem; nenhuma senha ou token deve ser enviado ao repositório.

### Mensagem curta para T00

> T01: fundação local pronta para revisão na branch codex/t01-foundation, candidato 38484a447dd7d43dbb5af414f8faf2040d4798be. npm ci e npm run check aprovados, 2 E2E Chromium desktop/mobile; home/404 inspecionadas. Stack, contratos e harness registrados. Sem remoto: CI/serviços/deploy não verificados. Handoff: docs/handoffs/T01-fundacao.md. Próxima ação: revisar/integrar e atualizar STATE/THREADS antes de próximo escritor.
