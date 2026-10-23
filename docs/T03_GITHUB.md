# T03 — GitHub, rotas e cache

Execução iniciada em 23/10/2026 a partir da main integrada `1e7d79e`, branch `codex/t03-github-routes-cache`. Único escritor nesta frente. Edição preexistente em `docs/handoffs/T02-design-tema.md` preservada.

## Avaliação da skill Vercel

- Origem oficial: `vercel-labs/agent-skills`, pasta `skills/react-best-practices`, revisão fixa `063bee94c3f4df8453406c830b0a7df0f2860278`, consultada em 23/10/2026.
- [SKILL.md integral](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/react-best-practices/SKILL.md), README e metadata lidos. Nome YAML `vercel-react-best-practices`, versão declarada `1.0.0`. A revisão SHA identifica o material efetivamente usado.
- Licença MIT declarada no frontmatter e no [README raiz](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/README.md#license). Nenhum arquivo de licença separado consta no inventário da pasta; não foi copiado ou redistribuído o pacote.
- Inventário recursivo pela API GitHub: SKILL.md, README.md, metadata.json, AGENTS.md compilado e rules/*.md. Sem scripts, hooks, manifests ou executáveis dentro da pasta. O README descreve comandos pnpm para autores; não são necessários à leitura nem foram executados. Não instalar a coleção para consumir instruções textuais.
- Regras lidas integralmente: `async-parallel`, `client-swr-dedup`, `rerender-derived-state-no-effect`, `bundle-dynamic-imports`, todas na revisão acima. Referências externas não foram executadas nem importadas como dependências de workflow.
- Aplicação delimitada: iniciar lista do proprietário e referência de outro dono independentemente; deduplicar/cachear consultas com **TanStack Query já escolhido pela T01**, adaptando a intenção da regra de SWR sem adicionar SWR; calcular seleção e contexto a partir dos dados durante renderização, sem efeitos que dupliquem estado.
- Compatibilidade: React 19.3.1, Vite 8.3.5 e TypeScript 6.0.3. RSC, SSR, Server Actions, React.cache e next/dynamic não se aplicam à SPA. Nenhum recurso Next foi introduzido. Detalhes são pequenos; não criar uma divisão artificial de bundle apenas para seguir um exemplo. Dashboard pesado continua reservado para lazy/Suspense na T05.
- Dependência de produto: `@tanstack/react-query` **5.104.5**, MIT, peers React/@types/react `^18 || ^19`, conferidos no npm antes de instalar com versão exata. Somente Query/Core adicionados; npm informou zero vulnerabilidades na instalação. Isso não equivale a auditoria de segurança completa.
- Estado: avaliada e aplicada como orientação textual, **sem instalação de skill**. Testes verificam o comportamento resultante, sem atribuição causal de performance à skill nem alegação Lighthouse.

## Decisões adotadas

- Origem primária `bllacerenza-a11y`, confirmada na T02. A seleção editorial permanece Aether, Melodia e referência SmartCameraStudy de PedroOliDev; metadados vêm somente da API em execução.
- Lista pública completa, inclusive forks e arquivados: exclusão era proposta não confirmada. Paginação por `Link: rel="next"`, páginas de até 100, sem seguir URLs de hosts arbitrários. Repositórios são deduplicados por ID.
- Fonte HTTP pública sem token, sem variáveis e sem persistência de cache no storage. Normalização valida campos nas fronteiras; homepage aceita somente HTTP/HTTPS. Não carregar README remoto na interface nem inferir participação individual.
- SmartCameraStudy: consulta pública repetida nesta execução retornou HTTP 404. Mostrar a indisponibilidade com causa não confirmada; não substituir por outro repositório de nome parecido nem exibir metadados editoriais como dados reais.
- Estados de transporte/API são distintos de 404 e lista vazia. Consultas não fazem retries automáticos; falhas transitórias oferecem repetição explícita. Em falha de atualização, manter dados anteriores e apresentar aviso.
- Cache em memória por QueryClient único: chaves de CONTRACTS normalizadas em minúsculas, staleTime 5 min, gcTime 30 min de inatividade, sem refetch em foco. Detalhe aproveita lista com timestamp original; depois de stale pode atualizar. Reload inicia novo cache. Erros sem dados não são repetidos no remount dos detalhes; nova consulta depende de repetição explícita ou descarte/reload.

## Fontes técnicas

- [API GitHub de repositórios](https://docs.github.com/en/rest/repos/repos), contratos públicos de lista/detalhe e paginação.
- [TanStack Query useQuery](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery), initialDataUpdatedAt, staleTime, gcTime e políticas de retry/refetch.

Resultados e limites de verificação serão registrados em `docs/handoffs/T03-github-rotas-cache.md`.
