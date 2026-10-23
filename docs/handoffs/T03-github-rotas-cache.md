# Handoff — T03 — GitHub, rotas e cache

## Identificação e estado

- **Tarefa/chat:** T03, CP3 · 03 — GitHub, rotas e cache (`01a1677e-969c-7931-9158-3d14721aa0a6`).
- **Atualizado:** 23/10/2026, 20:45, America/Sao_Paulo.
- **Estado reportado:** pronta para revisão local pela T00; não integrada à main.
- **Resumo:** API GitHub pública real, lista paginada, detalhes por URL, estados e cache, preservando conteúdo editorial/tokens/tema da T02. Skill Vercel avaliada e aplicada textualmente para Vite. Nenhum serviço publicado ou conta acessada.

## Objetivo, requisitos e limites

- R01: URL por projeto, navegação, refresh, erro e 404 amigável **verificados localmente**. Rewrites/rotas em produção continuam na T07.
- R02: loading visual, erro recuperável e vazio das consultas GitHub verificados. Estado de envio do formulário pertence à T05.
- R03: aplicação busca metadados reais pela API. Inspeção real separada da suíte com fixtures.
- R06/R07: tema e identidade preservados e regressão local verificada. Não declarar acessibilidade integral ou dispositivo físico testado.
- R08: cache e ausência de chamadas repetidas na navegação local verificados; Lighthouse, pacote do dashboard e medições de produção pendentes de T05/T06/T07.
- R11/R12: branch própria, commit convencional, serviço/consultas/apresentação separados e padrões automáticos aprovados.
- Fora do escopo: contato, autenticação, painel, highlights persistidos, banco, e-mail, deploy, vídeo. R09 obrigatório de formulário/autorização continua pendente.
- Dependências recebidas: T01 integrada, T02 integrada e revisão T00, AGENTS, HANDOFF, STATE, T03 de TASKS, CONTRACTS, ARCHITECTURE, MODEL_POLICY, T02_DESIGN, REQUIREMENTS e SKILLS_RESEARCH.

## Estado do código e integração

- **Checkout:** `C:\Users\bruno\Documents\Codex\CP3-Portfolio`.
- **Branch:** `codex/t03-github-routes-cache`.
- **Base:** main `1e7d79e`.
- **Candidato de implementação/evidências:** `d9618523f2f021f4c6a26d5a8b768ab81633cdbe`.
- **Commit deste handoff:** posterior ao candidato, somente documentação.
- **Integração T00:** pendente; STATE e THREADS preservados.
- **Alteração preexistente:** `docs/handoffs/T02-design-tema.md`, última frase com `pronta parT02a`; preservada literalmente e fora dos commits T03. Nenhuma edição de código preexistia ao início.
- **Compartilhados alterados:** package/lock (+ Query/Core), App/rotas/main, ProjectCard, conteúdo editorial (remoção de disponibilidade estática), CONTRACTS/ARCHITECTURE/README/HARNESS/SKILLS_RESEARCH. Nenhum tipo em shared/contracts.ts mudou.
- **Novos módulos:** `src/services/github.ts`, `src/features/projects/*`, `src/app/NavigationEffects.tsx`, `tests/e2e/projects.spec.ts`, `tests/fixtures/github.ts` e `docs/T03_GITHUB.md`.
- **Ordem de integração:** T00 revisar diff desde a base, executar checks, integrar branch; T05 deve consumir os contratos atualizados. `npm ci` usa o lockfile versionado. Nenhuma variável de ambiente/migração necessária.

## Decisões e implementação

| Decisão adotada | Motivo e comportamento | Efeito nos próximos chats |
| --- | --- | --- |
| TanStack Query 5.104.5, versão exata | Direção T01, peers React 18/19 compatíveis; deduplicação/cache compartilhado | Usar provider/QueryClient já existentes, não criar um segundo cache |
| Lista pública completa de bllacerenza-a11y | Não adotar a proposta não confirmada de excluir forks/arquivados | Curadoria persistida futura é seleção por ID; metadados continuam no GitHub |
| Seleção editorial separada de metadados | Manter Aether/Melodia e referência externa escolhidos na T02 | ProjectCard exige Project real; editorial é prop opcional |
| Outro dono consultado independentemente da lista | Evitar cascata; SmartCameraStudy pode falhar sem derrubar a home | T05 pode usar projectOptions(client, owner, repo) para destaques de outros donos |
| Cache em memória | staleTime 5 min, gcTime 30 min inativo, chaves em minúsculas; foco não refaz consulta | Reload inicia cache novo; sem storage persistido; detalhes preservam timestamp da lista |
| Sem retry automático | Evitar tempestade de consultas/limites; botões repetem explicitamente, inclusive 404 | Erro de detalhe não se repete no remount; refetch/reload/GC permitem nova tentativa |
| Navegação interna por Link | Header com âncoras anteriores recarregava documento e perdia cache | NavigationEffects sincroniza foco/âncoras na SPA |
| Validação na fronteira HTTP | Tipos TS não validam JSON; homepage somente HTTP/HTTPS; links GitHub construídos com origem fixa | Não propagar HTML/URLs inseguras nem inventar nulos |

### Contratos para T05

- `fetchProjects(owner, signal?) -> Promise<Project[]>`, `fetchProject(owner, repo, signal?) -> Promise<Project>`.
- `GitHubError.kind`: `not-found | rate-limit | unavailable | invalid`; 403/429 são descritos como recusa/limitação, sem presumir a política exata.
- `projectsOptions(owner)` e `projectOptions(client, owner, repo)` em `src/features/projects/projectQueries.ts`; QueryClient único exportado nesse módulo e provider em main.tsx.
- `projectPath(owner, repo)` codifica parâmetros; `ProjectCard`: `{ project: Project, editorial?: { title, summary, context, note } }`. `ProjectMetadata` reutiliza linguagem/data.
- API 404 é estado de repositório ausente, distinto de rota inexistente, lista vazia, rede indisponível e erro HTTP. Em falha de atualização, dados anteriores ficam visíveis com aviso.
- Contratos completos atualizados em `docs/CONTRACTS.md`; não fabricar Project a partir de referência editorial.

### Skill e dados reais versus simulados

- Vercel React Best Practices: revisão `063bee94c3f4df8453406c830b0a7df0f2860278`, versão declarada 1.0.0, licença MIT declarada no YAML/README, inventário e regras lidos conforme `docs/T03_GITHUB.md`. Nenhuma skill instalada ou copiada ou script externo executado. Não usar Next/RSC/SSR/Server Actions/next/dynamic na SPA.
- Aplicação textual: consultas independentes, intenção de deduplicação da regra SWR adaptada ao Query adotado, estado derivado durante renderização. Nenhuma alegação de benefício causal ou nota Lighthouse.
- Dados reais: API pública em runtime, sem token. Consulta PowerShell e navegador do aplicativo confirmaram **15 repositórios** de bllacerenza-a11y; Aether com Python/30-07-2026 e Melodia com HTML/23-09-2026, descrições nulas com fallback visível.
- SmartCameraStudy/PedroOliDev retornou **HTTP 404** novamente. Causa não comprovada; nenhum substituto de nome semelhante foi escolhido. Sem ID, linguagem, descrição ou participação inventada. Referência oferece URL interna/recuperação; não oferece link externo para o endereço ausente.
- Fixtures sintéticas restritas a tests/fixtures; testes também simulam SmartCameraStudy acessível para verificar outro dono. Isso não é evidência de existência real do repositório.

## Verificação executada

Ambiente: Windows/PowerShell, Node **v24.20.0**, npm **11.19.0**, Playwright **1.64.1**. Comandos no checkout acima. Código final verificado corresponde ao candidato `d961852`; somente documentação será acrescentada depois.

| Data/estado | Comando ou procedimento | Resultado real |
| --- | --- | --- |
| 23/10, base + implementação local | `npm view @tanstack/react-query@5.104.5 version peerDependencies engines license --json` e `npm install --save-exact @tanstack/react-query@5.104.5` | Peers/licença conferidos; 2 pacotes adicionados; auditoria npm informou zero vulnerabilidades, sem substituir auditoria de segurança |
| Rodada inicial | `npm run check` | 42/44 aprovados; 2 falhas no cenário de paginação por fixture sem exposição CORS do Link |
| Correção da fixture | Consulta `Invoke-WebRequest` à API com per_page=1; `npx playwright test tests/e2e/projects.spec.ts -g 'pagina lista'` | API real expõe Link em Access-Control-Expose-Headers; fixture corrigida; 2/2 passaram |
| Validação do lockfile | `npm ci` | Primeira tentativa EPERM: prévia aberta segurava módulo nativo do Vite no Windows. Check subsequente dessa tentativa não pôde iniciar lint. Parada somente da prévia T03 e repetição: exit 0, 169 pacotes, zero vulnerabilidades informadas |
| 23/10, código final; fechamento 20:45 BRT | `npm run check` | **Exit 0**: lint sem warnings, formato, TypeScript, build e **48/48 execuções** (24 cenários em Chromium desktop/mobile), runner **21,2 s**. Log: `docs/evidence/T03/check.log` |
| Mesmo código | `git diff --check` e `git diff --cached --check` | Exit 0; aviso de normalização CRLF/LF do log, sem erro de whitespace |
| Build final real | `npm run preview -- --port 4174` e inspeção pelo navegador do aplicativo | Sucesso de lista/detalhe, refresh real de Aether, tema e SmartCameraStudy 404 observados; capturas em docs/evidence/T03 |

Cobertura da suíte: loading visual e consultas independentes, lista/detalhes compartilhando cache, header SPA, histórico, acesso direto e refresh, 404 com retorno e sem metadados falsos, vazio, 403/429/503 com retry, falha de rede, JSON inválido, payload inválido, campos nulos/homepage insegura, site HTTPS válido, paginação/deduplicação, forks/arquivados, outro dono, expiração de 5 min com relógio controlado e retenção/aviso após falha de atualização, além dos cenários herdados de tema/layout/teclado.

### Critérios de aceite e limites

| Critério | Estado | Evidência/limite |
| --- | --- | --- |
| URL por projeto, refresh, histórico e 404 | Verificado localmente | projects.spec + foundation.spec; produção depende T07 |
| API real conforme fonte, sem fixture na aplicação | Verificado | Serviços fetch reais; navegador mostrou 15 repositórios/17 cards (2 selecionados repetidos na lista); metadados comparados com resposta real |
| Loading, vazio e falhas sem quebrar interface | Verificado em testes | projects.spec com transporte controlado; dados reais observados em sucesso/404 |
| Cache e erro documentados/verificados | Verificado para comportamentos testados | Apenas 2 chamadas no fluxo lista→detalhes→header→outro detalhe; expiração 5 min e erro com dados mantidos. Descarte de 30 min conferido em configuração, sem medição de longa duração |
| Nenhum segredo no navegador | Verificado no escopo do diff | Fetch só com Accept, sem token/env/conta; QueryClient sem persistência; não é uma auditoria de todo serviço futuro |
| Identidade e tema T02 | Verificado localmente | Regressão em 320/390/768/1440 nos dois temas; capturas reais desktop claro e detalhes mobile escuro |

### Verificação visual e fluxos reais

- URL: `http://127.0.0.1:4174`, build do código candidato. Viewport desktop **1440×900**, mobile **390×844**, navegador integrado do aplicativo; perfil físico não testado.
- Fluxos: home/API real, navegação por detalhes Aether, claro→escuro, refresh de Aether mantendo preferência, retorno à home e detalhes SmartCameraStudy/404; recuperação para projetos. Nenhum impedimento visual observado; detalhe mobile sem overflow horizontal na medição DOM.
- Capturas inspecionadas: `selection-real-light.png`, `aether-real-light.png`, `aether-real-mobile-dark.png`; `smart-camera-real-404.png` registra estado após aguardar resposta, não o loading intermediário. Todas em `docs/evidence/T03`, sem mocks.
- Logs de erro do navegador consultados: nenhum registro retornado no intervalo consultado. Isso não é prova de ausência de todo erro de rede; o 404 foi verificado pela interface/API.
- Prévia final na porta 4174, aba mantida disponível; override de viewport temporário removido. Para interromper, usar Ctrl+C no processo de prévia T03. Não fazer npm ci com essa prévia em execução no Windows.
- Não verificado: deploy/rewrites de produção, CI remoto, Lighthouse, Safari/Firefox, dispositivo físico e segurança de serviços ainda não implementados. Paginação de duas páginas é simulação reproduzível; a conta real retornou uma página de 15 itens.

## Achados, riscos e pendências

| Item | Impacto | Responsável/próxima ação |
| --- | --- | --- |
| SmartCameraStudy 404 público | Não apresentar metadados ou link externo sem confirmação | Usuário pode corrigir URL/tornar público quando quiser; T03 já trata estado e permite consultar novamente |
| API pública tem limite/indisponibilidade | Sem credencial no navegador; mostrar falha/retry, conservar cache anterior | T06 revisar resiliência; não adicionar token VITE_ |
| Main e CI remoto | Entrega local ainda requer revisão/integração | T00 revisar branch e atualizar STATE/THREADS; remoto continua ausente |
| Contato/auth/dashboard/destaques persistidos | Fora da T03; textos de preparação continuam honestos | T04/T05 conforme dependências |
| Dependência Query no pacote inicial | Tamanho é saída de build, não avaliação de desempenho | T06 medir Lighthouse em produção; não inferir nota do tamanho |
| Edição T02 preexistente | Não incluir incidentalmente na integração | T00/usuário decidir correção em tarefa própria |

## Pacote para revisão independente e próxima ação

1. T00 revisar `1e7d79e..codex/t03-github-routes-cache`, começando por CONTRACTS e T03_GITHUB, serviços/query options e novos testes; conferir evidências acima.
2. Reproduzir com `npm ci` (prévia parada) e `npm run check`; abrir prévia em porta livre para API real. Nenhuma credencial necessária.
3. Preservar tokens/tema/textos T02 e a edição local preexistente. Não substituir descrições faltantes por resumos como se fossem da API.
4. Integrar somente após revisão; T00 atualiza quadro canônico. T05 recebe tipos, chaves, estados e exemplos de Project nos testes, identificados como sintéticos.
5. Nenhuma ação humana indispensável bloqueia a entrega local. Confirmar o SmartCameraStudy melhora o conteúdo, mas não impede revisar o tratamento de indisponibilidade.

### Mensagem curta para T00

> T03 pronta para revisão local na branch codex/t03-github-routes-cache, implementação d961852. API GitHub real, lista/detalhes por URL, estados e cache, identidade/tema T02 preservados. npm ci e check aprovados; 48/48 execuções desktop/mobile; navegador com dados reais e 404 SmartCameraStudy observado. Revisão da skill Vercel em T03_GITHUB.md. Handoff: docs/handoffs/T03-github-rotas-cache.md. Sem deploy/CI remoto, main/STATE/THREADS preservados; edição T02 preexistente mantida fora dos commits. Próxima ação: T00 revisar e integrar.
