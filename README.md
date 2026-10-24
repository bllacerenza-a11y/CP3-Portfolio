# CP3 — Portfólio, Stack e Harness Engineering

Projeto individual de portfólio React, iniciado do zero. Fundação T01, identidade/tema T02 e API GitHub T03 integrados. T04 acrescenta migrations/RLS, serviços de sessão/dados e API de contato com persistência e notificação Resend; implementação e testes locais, serviços reais ainda pendentes. Consulte [T04_BACKEND](docs/T04_BACKEND.md), [contratos T05](docs/CONTRACTS.md) e [STATE](docs/STATE.md) para estado de integração. Telas de formulário/login/painel pertencem à T05.

## Começar por aqui

1. Leia [HANDOFF_CP3_CODEX.md](HANDOFF_CP3_CODEX.md).
2. Consulte os [requisitos](docs/REQUIREMENTS.md) e o [estado real](docs/STATE.md).
3. Localize sua tarefa no [plano de tarefas](docs/TASKS.md).
4. Leia somente as decisões, contratos e referências pertinentes à tarefa.
5. Registre a passagem usando o [modelo de handoff](docs/templates/TASK_HANDOFF.md).

## Documentos

- [Arquitetura e decisões](docs/ARCHITECTURE.md)
- [Contratos iniciais](docs/CONTRACTS.md)
- [Harness e inventário real](docs/HARNESS.md)
- [Handoff T01 e verificações](docs/handoffs/T01-fundacao.md)
- [Pesquisa e seleção de skills](docs/SKILLS_RESEARCH.md)
- [Plano de testes](docs/TEST_PLAN.md)
- [Rubrica de revisão](docs/REVIEW_RUBRIC.md)
- [Registro das conversas](docs/THREADS.md)
- [Política de modelos e economia de contexto](docs/MODEL_POLICY.md)

## Escopo

Portfólio público, projetos originados na API do GitHub, contato com persistência e e-mail, dashboard do proprietário, tema persistido, responsividade, desempenho, testes, deploy e evidências do processo com IA.

Fonte: [enunciado do CP3](https://cherry-client-b8f.notion.site/CP3-Portfolio-Stack-e-Harness-Engineering-3fe911d84e0d80f7bb6dec712e6d904a).

## Execução

Referência: Node **24.20.0**, npm **11.19.0**, Windows/PowerShell no desenvolvimento; CI configurado para Ubuntu (execução remota pendente). Instale essas versões usando seu gerenciador de runtime. `.nvmrc`, `engines` e `.npmrc` registram o contrato; nenhuma instalação global de runtime foi feita pela T01.

```powershell
npm ci
npx playwright install chromium
npm run dev
```

Vite informa a URL local (porta padrão 5173). Home/GitHub não precisam de variáveis. `.env.example` documenta nomes utilizados pela integração T04; copie para `.env` com valores próprios ao configurar os serviços. Nunca inclua segredos em VITE_: seu conteúdo vai ao navegador. Configuração e ordem das migrations/Auth/Resend em [T04_BACKEND](docs/T04_BACKEND.md). Preview/dev Vite servem a SPA; não executam /api/contact.

| Comando                                   | Resultado esperado                                 |
| ----------------------------------------- | -------------------------------------------------- |
| `npm run dev`                             | Servidor de desenvolvimento em 127.0.0.1           |
| `npm run dev:auth-check`                  | Diagnóstico local opt-in de login/logout real na porta 4176, caminho /work/t04AuthProbe.html |
| `npm run build`                           | Typecheck e build de produção em dist              |
| `npm run preview`                         | Serve dist em http://127.0.0.1:4173, porta estrita |
| `npm run lint`                            | ESLint, sem warnings                               |
| `npm run format:check` / `npm run format` | Confere / aplica Prettier                          |
| `npm run typecheck`                       | TypeScript estrito sem emitir arquivos             |
| `npm test`                                | Testes de servidor, build e E2E desktop/mobile Chromium |
| `npm run test:server`                     | SQL/RLS em Postgres WASM e lógica HTTP/Auth/email com fixtures |
| `npm run test:supabase`                   | Opt-in no Supabase configurado: cria/remove um usuário Auth descartável, testa JWT de não proprietário, sem enviar email |
| `npm run test:contact-live`               | Opt-in: persiste dois contatos sintéticos e envia uma notificação real ao destinatário configurado; não executa no CI |
| `npm run test:e2e`                        | E2E sobre dist já atualizado                       |
| `npm run check`                           | Lint, formatação, typecheck/build e E2E            |

Playwright sobe o preview automaticamente e recusa servidor preexistente na porta 4173 para não testar uma aplicação errada. Em Linux/CI use `npx playwright install --with-deps chromium`. O relatório HTML fica em playwright-report (ignorado no Git); traces são mantidos apenas em falhas. A suíte E2E verifica navegação, tema e GitHub com fixtures sintéticas, sem API externa no CI. `tests/server` executa a migration em PGlite, com roles/Auth sintéticos, e testa validação, autorização de banco, idempotência, quotas e HTTP/notificação. Não reproduz GoTrue/PostgREST/Vercel/Resend reais; R09 na UI de formulário e redirecionamento sem login depende da T05. A aplicação não importa fixtures. Evidências reais são separadas nos handoffs.

`.github/workflows/ci.yml` executa a instalação limpa e `npm run check` em pushes e PRs. A configuração precisa ser executada no GitHub após criação do remoto público. Preview Vite não executa Functions; deploy e rewrites de produção pertencem a T07.

## Stack e padrões

Instalados: React, TypeScript, Vite, React Router declarativo, TanStack Query, Supabase JS, Zod, CSS Modules, ESLint, Prettier e Playwright; PGlite apenas em desenvolvimento/testes. Decisões e limites em ARCHITECTURE.md/T04_BACKEND.md; versões exatas em package.json/lockfile.

- `src/app`: composição e rotas; `src/styles`: tokens globais; `shared`: contratos cliente/servidor; `tests/e2e`: comportamento no build.
- `src/components` apresenta UI; `src/features` reúne funcionalidades/hooks; `src/services` integra APIs do navegador; `shared/schemas` valida fronteiras; `api` adapta HTTP Node; `server` concentra regra/integrações privadas; `supabase/migrations` guarda SQL versionado; `tests/server` verifica backend local. Apresentação não contém acesso direto a serviços.
- Componentes e arquivos `.tsx`: PascalCase; hooks: `useNome.ts`; outros módulos: camelCase; testes: `*.spec.ts`. Interfaces e tipos: PascalCase.
- CSS local em `Componente.module.css`; estilos globais restritos a tokens/base. Tokens e props compartilhados devem seguir os contratos antes de consumo por outra tarefa.
- TypeScript estrito verifica tipos; ESLint verifica código e regras de hooks; Prettier verifica formato; CI aplica os mesmos comandos locais. Convenções de nomes de arquivo são conferidas em revisão.

Responsáveis por arquivos compartilhados e contratos estão em CONTRACTS.md. Um escritor por checkout; verificar `git status` antes de editar e registrar mudanças no handoff. STATE/THREADS são mantidos pela coordenação.

## Processo Git

Convenção inicial: GitHub Flow, branch por funcionalidade, commits com prefixos feat, fix, test, docs, refactor, chore e ci. O histórico deve refletir trabalho real. O repositório remoto público e a integração com Vercel ainda precisam ser configurados.

Branch principal local adotada: `main`. T01–T04 revisadas pela T00. Proposta T02.1 aprovada para implementação React; próxima passagem: executar a evolução visual sobre a base com T04 e submetê-la à revisão T00 antes da T05. Consulte STATE e handoffs para evidências/limites; uma frente de implementação por vez.

## Conteúdo e tema

Conteúdo editorial em `src/content/portfolio.ts`, com fontes em [T02_DESIGN.md](docs/T02_DESIGN.md). A T03 mantém os resumos separados de descrição, linguagem e datas obtidas pela API. Não atribuir autoria exclusiva ou tecnologias dominadas a partir de um README de equipe.

Projetos: `src/services/github.ts` acessa a API pública sem token e valida a fronteira HTTP; `src/features/projects` reúne consultas e apresentação. Lista `GET /users/bllacerenza-a11y/repos` inclui todos os públicos, forks e arquivados; referências de outros donos usam `GET /repos/:owner/:repo`. Detalhes em `/projetos/:owner/:repo`. SmartCameraStudy tem tratamento explícito de 404 sem inferir a causa. Cache somente em memória: válido por 5 minutos, descarte após 30 minutos inativo, sem atualização por foco, reaproveitando lista nos detalhes. Reload faz nova consulta. Falhas oferecem repetição; atualização falha conserva os dados anteriores com aviso. [Contratos e consumo pela T05](docs/CONTRACTS.md), [revisão da skill Vercel e decisões T03](docs/T03_GITHUB.md). Nenhuma variável de ambiente é necessária para esta integração pública. Fallback de URLs em produção ainda depende da T07.

Preferência em `cp3.theme`: `light` ou `dark`. Sem preferência válida, acompanhar o sistema; “Usar sistema” remove a escolha. Tokens CSS e componentes compartilhados estão documentados em [CONTRACTS.md](docs/CONTRACTS.md). Sem armazenamento disponível, alternar funciona na sessão, mas não persiste após recarregar. Testes cobrem também esse limite.

## Entregas finais

Links GitHub público, Vercel e YouTube não listado no Teams. Vídeo de até oito minutos com rosto e tela durante toda a gravação. Prazo informado na fonte: 03/11, sem ano ou horário confirmados.
