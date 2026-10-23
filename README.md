# CP3 — Portfólio, Stack e Harness Engineering

Projeto individual de portfólio React, iniciado do zero. A fundação T01 está integrada. A T02 acrescenta apresentação de Bruno Bastos, seleção editorial de repositórios, layout responsivo e tema claro/escuro persistido. Integração dinâmica GitHub, contato, autenticação e painel continuam nas tarefas responsáveis. Consulte docs/STATE.md para o estado de integração e docs/handoffs/T02-design-tema.md para a entrega local.

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

Vite informa a URL local (porta padrão 5173). A fundação não precisa de variáveis. `.env.example` documenta apenas nomes futuros; copie para `.env` quando implementar integrações, com valores próprios. Nunca inclua segredos em VITE_: seu conteúdo vai ao navegador.

| Comando                                   | Resultado esperado                                 |
| ----------------------------------------- | -------------------------------------------------- |
| `npm run dev`                             | Servidor de desenvolvimento em 127.0.0.1           |
| `npm run build`                           | Typecheck e build de produção em dist              |
| `npm run preview`                         | Serve dist em http://127.0.0.1:4173, porta estrita |
| `npm run lint`                            | ESLint, sem warnings                               |
| `npm run format:check` / `npm run format` | Confere / aplica Prettier                          |
| `npm run typecheck`                       | TypeScript estrito sem emitir arquivos             |
| `npm test`                                | Gera build e executa E2E desktop/mobile Chromium   |
| `npm run test:e2e`                        | E2E sobre dist já atualizado                       |
| `npm run check`                           | Lint, formatação, typecheck/build e E2E            |

Playwright sobe o preview automaticamente e recusa servidor preexistente na porta 4173 para não testar uma aplicação errada. Em Linux/CI use `npx playwright install --with-deps chromium`. O relatório HTML fica em playwright-report (ignorado no Git); traces são mantidos apenas em falhas. A suíte inicial verifica 404, refresh, retorno à home e histórico, sem dados externos. Não cobre ainda os cenários obrigatórios de formulário/autorização de R09.

`.github/workflows/ci.yml` executa a instalação limpa e `npm run check` em pushes e PRs. A configuração precisa ser executada no GitHub após criação do remoto público. Preview Vite não executa Functions; deploy e rewrites de produção pertencem a T07.

## Stack e padrões

Instalados: React, TypeScript, Vite, React Router declarativo, CSS Modules, ESLint, Prettier e Playwright. As decisões comparadas e os serviços escolhidos para futuras integrações estão em ARCHITECTURE.md; versões exatas estão em package.json/lockfile.

- `src/app`: composição e rotas; `src/styles`: tokens globais; `shared`: contratos cliente/servidor; `tests/e2e`: comportamento no build.
- Criar `src/components`, `src/features`, `src/services`, `src/hooks`, `shared/schemas`, `api` e migrations somente quando forem usados. Apresentação não contém acesso direto a serviços; regras e validação ficam separadas e testáveis.
- Componentes e arquivos `.tsx`: PascalCase; hooks: `useNome.ts`; outros módulos: camelCase; testes: `*.spec.ts`. Interfaces e tipos: PascalCase.
- CSS local em `Componente.module.css`; estilos globais restritos a tokens/base. Tokens e props compartilhados devem seguir os contratos antes de consumo por outra tarefa.
- TypeScript estrito verifica tipos; ESLint verifica código e regras de hooks; Prettier verifica formato; CI aplica os mesmos comandos locais. Convenções de nomes de arquivo são conferidas em revisão.

Responsáveis por arquivos compartilhados e contratos estão em CONTRACTS.md. Um escritor por checkout; verificar `git status` antes de editar e registrar mudanças no handoff. STATE/THREADS são mantidos pela coordenação.

## Processo Git

Convenção inicial: GitHub Flow, branch por funcionalidade, commits com prefixos feat, fix, test, docs, refactor, chore e ci. O histórico deve refletir trabalho real. O repositório remoto público e a integração com Vercel ainda precisam ser configurados.

Branch principal local adotada: `main`. Fundação T01 e UI/tema T02 revisadas pela T00; próxima frente T03 (GitHub, rotas e cache). Consulte STATE para o estado canônico e os handoffs para evidências; não iniciar todos os chats.

## Conteúdo e tema

Conteúdo editorial em `src/content/portfolio.ts`, com fontes em [T02_DESIGN.md](docs/T02_DESIGN.md). Os resumos iniciais não substituem a integração API prevista na T03. Não atribuir autoria exclusiva ou tecnologias dominadas a partir de um README de equipe.

Preferência em `cp3.theme`: `light` ou `dark`. Sem preferência válida, acompanhar o sistema; “Usar sistema” remove a escolha. Tokens CSS e componentes compartilhados estão documentados em [CONTRACTS.md](docs/CONTRACTS.md). Sem armazenamento disponível, alternar funciona na sessão, mas não persiste após recarregar. Testes cobrem também esse limite.

## Entregas finais

Links GitHub público, Vercel e YouTube não listado no Teams. Vídeo de até oito minutos com rosto e tela durante toda a gravação. Prazo informado na fonte: 03/11, sem ano ou horário confirmados.
