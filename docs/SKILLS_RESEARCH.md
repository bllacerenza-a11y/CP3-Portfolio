# Pesquisa e seleção de skills — CP3 Portfolio

Data da consulta: 23 de outubro de 2026.

Este documento registra uma avaliação documental para um projeto acadêmico individual com React, Vite e TypeScript, interface responsiva, API do GitHub, formulário de contato com backend, dashboard autenticado, testes, CI e meta de Lighthouse mobile de pelo menos 80, conforme a rubrica do projeto. A escolha das skills deve ajudar a cumprir requisitos verificáveis com o menor conjunto útil de dependências e instruções.

**Atualização T02: frontend-design avaliada e aplicada como orientação textual, sem instalação.** Revisão, licença, inventário, adaptações e aplicação delimitada em [T02_DESIGN.md](T02_DESIGN.md). As demais candidatas continuam somente pesquisadas/recomendadas. Ler um `SKILL.md` para avaliar seu conteúdo não significa adotá-lo. Nenhum pacote externo foi instalado pela T02.

**Atualização T03:** Vercel React Best Practices avaliada e aplicada textualmente, sem instalação de skill, na revisão `063bee94c3f4df8453406c830b0a7df0f2860278`. Inventário, licença, regras lidas e adaptações ao Vite em [T03_GITHUB.md](T03_GITHUB.md). Deduplicação usa TanStack Query conforme arquitetura, sem adicionar SWR ou Next. Não há comparação que prove ganho causal pela skill.

## O que significa cada estado

| Estado | Significado |
| --- | --- |
| Pesquisada | O `SKILL.md` foi lido e sua adequação foi analisada. Referências pontuais foram consultadas quando necessárias para conferir limitações. |
| Recomendada | Há um caso de uso concreto no projeto. Ainda depende da avaliação de adoção descrita adiante. |
| Opcional | Só deve entrar quando aparecer o problema para o qual foi feita. |
| Instalada | Arquivos ou plugin foram efetivamente incorporados ao ambiente e sua descoberta foi verificada. Nenhuma das candidatas está neste estado. |
| Validada no projeto | Foi aplicada a uma tarefa pequena, teve seu resultado conferido e demonstrou benefício. A T02 aplicou frontend-design e verificou a UI, sem atribuir benefício causal à skill por falta de comparação. |

A pesquisa não representa uma auditoria integral de todos os scripts e referências transitivas de cada repositório. Essa inspeção deve ocorrer antes da adoção do pacote escolhido.

## Conjunto recomendado

| Skill | Estado e momento de uso | Contribuição esperada |
| --- | --- | --- |
| `frontend-design` — Anthropic | Avaliada e aplicada textualmente na T02, sem instalação; revisão fixa em T02_DESIGN.md. | Plano visual, tokens, hierarquia e crítica por screenshots. |
| `vercel-react-best-practices` — Vercel | Avaliada e aplicada textualmente na T03, filtrada para Vite; revisão fixa em T03_GITHUB.md. | Consultas independentes, cache/deduplicação e estado derivado durante renderização. |
| `web-design-guidelines` — Vercel | Recomendada para revisar telas já funcionais. | Conferir semântica, teclado, foco, formulários, estados de erro, imagens e interação mobile. |
| `supabase-postgres-best-practices` — Supabase | Recomendada condicionalmente às tarefas que realmente utilizem Postgres/Supabase. | Orientar schema, queries, índices, migrations e políticas de acesso por linha. |

Não há motivo para carregar o conjunto inteiro em todas as conversas. Direção visual, implementação, banco e revisão têm necessidades diferentes. A recomendação é usar a skill pertinente à tarefa e manter a rubrica acadêmica como critério de aceitação.

## Fontes, conteúdo e limites

### 1. Frontend Design

- Origem: repositório da Anthropic, `anthropics/skills`; exemplo do fornecedor, não autoria comunitária independente.
- Arquivo lido: [`skills/frontend-design/SKILL.md`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).
- Licença verificada: [Apache-2.0 no `LICENSE.txt` da própria skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/LICENSE.txt).

Orienta uma identidade visual adequada ao assunto, planejamento de tokens, paleta, tipografia, layout, linguagem da interface e autocrítica. A versão consultada também inclui responsividade mobile, foco de teclado visível, movimento reduzido e contenção de decoração. Serve para construir uma linguagem visual consistente para o portfólio e o dashboard.

Não especifica arquitetura de aplicação, testes automatizados, autenticação ou banco. Preferências estéticas devem permanecer subordinadas ao conteúdo, à rubrica e à usabilidade. O [README da Anthropic](https://github.com/anthropics/skills/blob/main/README.md) caracteriza essas skills como exemplos educacionais e informa que o comportamento real no produto pode diferir; não se pode presumir que sejam as mesmas configurações usadas pelo professor.

### 2. Vercel React Best Practices

- Origem: coleção oficial da Vercel, `vercel-labs/agent-skills`.
- Arquivo lido: [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md).
- Nome no YAML: `vercel-react-best-practices`; nome da pasta: `react-best-practices`.
- Licença: MIT declarada no frontmatter e no [README do repositório](https://github.com/vercel-labs/agent-skills/blob/main/README.md). Não foi localizado um arquivo de licença na raiz nos caminhos comuns consultados; a declaração foi conferida, mas deve-se preservar e conferir os avisos distribuídos no artefato escolhido.

O guia prioriza performance de React e Next.js: paralelização de trabalho independente, tamanho do bundle, dados no cliente, renderizações e JavaScript. É útil na implementação e na investigação de resultados de performance, sem justificar micro-otimizações sem evidência.

**Adaptação obrigatória ao stack:** regras sobre RSC, Server Actions, SSR, `next/dynamic` e APIs de Next.js não devem ser transplantadas para uma SPA Vite. A [regra de importações dinâmicas](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) usa `next/dynamic`; no projeto React, avaliar [`lazy` com `Suspense`](https://react.dev/reference/react/lazy) quando o carregamento tardio for útil. A skill não exige migrar para Next.js e não comprova uma nota Lighthouse.

### 3. Web Design Guidelines

- Origem: Vercel.
- Arquivo lido: [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md).
- Dependência documental lida: [`vercel-labs/web-interface-guidelines/command.md`](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md).
- Licença: MIT declarada no README de `agent-skills`; o [repositório das diretrizes contém licença MIT](https://github.com/vercel-labs/web-interface-guidelines/blob/main/LICENSE).

A skill busca as diretrizes externas e revisa arquivos, apontando problemas por arquivo e linha. O material cobre acessibilidade, foco, formulários, animações, imagens, performance, navegação, toque, layout, temas e conteúdo. É um complemento útil à revisão manual de telas e aos testes.

O arquivo principal menciona a ferramenta `WebFetch`: em outro agente, é necessário usar a ferramenta equivalente disponível. A dependência externa também muda em `main`; fixar somente a skill não congela as regras buscadas por ela. Registrar a revisão das diretrizes usada na avaliação. Não confundir inspeção de código com execução do Lighthouse ou certificação de acessibilidade.

### 4. Supabase Postgres Best Practices

- Origem: Supabase, `supabase/agent-skills`.
- Arquivo lido: [`skills/supabase-postgres-best-practices/SKILL.md`](https://github.com/supabase/agent-skills/blob/main/skills/supabase-postgres-best-practices/SKILL.md).
- Licença verificada: [MIT](https://github.com/supabase/agent-skills/blob/main/LICENSE), também declarada no frontmatter.

Cobre queries, conexões, segurança e RLS, schema, concorrência, acesso a dados e diagnóstico. A descrição abrange autoria de SQL, migrations e políticas, além de otimização. É pertinente se o backend adotar Postgres/Supabase, especialmente ao definir quem pode ler ou alterar os dados do dashboard.

Não substitui o desenho da autenticação, a verificação de autorização de cada operação, a proteção de segredos nem testes com usuários distintos. Também não exige a contratação ou adoção do serviço Supabase: sua descrição contempla Postgres em outros ambientes. Antes de uso concreto, ler as referências correspondentes à mudança proposta; elas não foram todas auditadas nesta pesquisa.

## Opcionais e alternativas

### Composição de componentes

[`vercel-composition-patterns`](https://github.com/vercel-labs/agent-skills/blob/main/skills/composition-patterns/SKILL.md), da Vercel, declara MIT. A pasta se chama `composition-patterns`. Foi pesquisada e fica opcional para componentes com muitas props booleanas, variantes confusas, reutilização real ou compartilhamento de estado que justifique composição.

É possível aumentar a complexidade de um projeto pequeno ao aplicar providers e componentes compostos antes de existir necessidade. A seção de React 19 deve ser ignorada em versões anteriores. A [regra de React 19](https://github.com/vercel-labs/agent-skills/blob/main/skills/composition-patterns/rules/react19-no-forwardref.md) classifica `useContext` como incorreto; porém, [`useContext` continua sendo API documentada de React](https://react.dev/reference/react/useContext). Tratar essa classificação como preferência da skill, não como proibição da biblioteca.

### Verificação antes de concluir

[`verification-before-completion`](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md), de `obra/superpowers`, é uma opção comunitária, com [licença MIT](https://github.com/obra/superpowers/blob/main/LICENSE). O projeto é de Jesse Vincent e colaboradores; distribuição em um marketplace oficial não muda a autoria para OpenAI ou Anthropic.

Propõe relacionar alegações de conclusão a comandos, saídas e evidências recentes. Pode ajudar no encerramento de tarefas e na entrega final. A política local deve manter as verificações proporcionais: executar os checks necessários, registrar o que demonstram e repetir quando uma mudança ou dúvida relevante justificar. Não transformar toda atualização de status em repetição indiscriminada de testes.

### Depuração sistemática

[`systematic-debugging`](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md), do mesmo projeto e sob a mesma licença MIT, foi pesquisada como opcional para falhas reproduzíveis de API, autenticação, build, CI ou testes. Seu fluxo passa por reprodução, investigação, hipótese, teste mínimo e verificação da correção.

Ela referencia documentos auxiliares e outras skills do pacote, incluindo TDD e verificação. Esses vínculos precisam de leitura antes da adoção; não instalar a metodologia inteira apenas para obter uma técnica. Seu texto contém exigências amplas de processo e escalonamento, que precisam ser conciliadas com as instruções do usuário e a autonomia já autorizada.

### Testes de interface da Anthropic

[`webapp-testing`](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md) é oficial da Anthropic e tem [licença Apache-2.0 verificada](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/LICENSE.txt). Ajuda a inspecionar a aplicação local com Playwright, capturar screenshots e logs e gerenciar frontend e backend com um helper.

Não é a primeira escolha para este repositório: seus exemplos usam Python, enquanto a aplicação usa TypeScript. A orientação de esperar por `networkidle` também precisa ser revista: o [Playwright desaconselha essa estratégia para avaliar prontidão em testes](https://playwright.dev/docs/api/class-page#page-wait-for-load-state). Preferir condições observáveis e assertions adequadas. Evitar manter duas infraestruturas equivalentes quando o Playwright do projeto já resolver a tarefa.

### QA de frontend da OpenAI

[`frontend-testing-debugging`](https://github.com/openai/plugins/blob/main/plugins/build-web-apps/skills/frontend-testing-debugging/SKILL.md), em `openai/plugins`, é uma alternativa oficial de fluxo de QA. Verifica identidade da página, renderização, erros de console, interação e screenshots; usa o Browser plugin quando disponível e contempla Playwright do projeto como alternativa nas condições descritas.

Tem dependências do runtime de ferramentas do Codex, portanto não é intercambiável com Claude sem adaptação. A licença dessa skill não foi confirmada nos arquivos e caminhos comuns consultados; não inferir Apache-2.0 a partir de outra skill ou repositório. Permanece uma referência pesquisada, sem recomendação de copiar ou redistribuir seu pacote neste estágio.

O [README atual de `openai/skills`](https://github.com/openai/skills/blob/main/README.md) marca aquele catálogo como descontinuado e aponta `openai/plugins`. O antigo `playwright` não deve ser apresentado como a opção atual sem essa ressalva.

## Compatibilidade, conflitos e limites de cobertura

O [padrão Agent Skills](https://agentskills.io/specification) organiza metadados, instruções e recursos. O [CLI da Vercel declara suporte a Claude Code e Codex](https://github.com/vercel-labs/skills/blob/main/README.md). Isso facilita distribuição, mas não garante igualdade de comportamento ou execução. Scripts, permissões, paths, ferramentas de browser e dependências devem funcionar no ambiente real.

Antes de usar uma skill em Windows/PowerShell, conferir exemplos Bash, paths como `/tmp`, executáveis Python/Node e a forma de manter o servidor local ativo. Skills de orientação textual tendem a exigir menos adaptação que workflows presos a um runtime específico. A existência de suporte a Claude Code não demonstra disponibilidade idêntica em Claude.ai, na API ou na configuração do professor.

Há conflitos de preferência: `frontend-design` recomenda sentence case, enquanto as diretrizes da Vercel pedem Title Case. Definir uma convenção coerente em português e fazê-la prevalecer no projeto. Não alternar o produto entre preferências editoriais de skills a cada revisão.

As candidatas não demonstram, por si, que a API GitHub lida com erros, que o contato chega ao backend, que o dashboard bloqueia acesso indevido, que os testes passaram, que o CI está verde ou que o Lighthouse atingiu a meta. Essas alegações dependem de implementação e evidências específicas, com ambiente e condições de medição registrados.

## Versões e rastreabilidade

Os links de arquivos dos repositórios acima apontam para `main`, um alvo mutável. Números de versão no YAML não substituem uma identificação imutável do conteúdo. A documentação dos produtos também pode mudar sem que esses links deixem de funcionar.

Na adoção, registrar o repositório de origem, caminho da skill, SHA do commit, data, licença, dependências transitivas, adaptações locais e resultado da avaliação. Preferir URLs de arquivos com o SHA no lugar de `main`. Quando a skill buscar documentos remotos, registrar também o SHA ou revisão desses documentos. Atualizações posteriores devem ser avaliadas pelo diff e por uma nova tarefa de validação proporcional à mudança.

## Protocolo para avaliar uma skill proposta pelo usuário

1. **Identificar o problema.** Registrar qual requisito ou dificuldade a skill pretende resolver e qual resultado observável demonstraria benefício. Popularidade e quantidade de regras não bastam.
2. **Conferir a origem.** Abrir o repositório original, identificar mantenedores e distinguir autoria oficial, autoria comunitária e mera distribuição por um marketplace. Verificar se o projeto foi descontinuado ou substituído.
3. **Ler o pacote relevante integralmente.** Ler o `SKILL.md`, os arquivos que ele exige para o fluxo pretendido, os scripts que seriam executados, manifests, hooks e dependências. Não executar um script desconhecido apenas porque a própria skill manda executá-lo antes da leitura.
4. **Verificar licença e efeitos.** Conferir a licença de cada parte que seria copiada, adaptada ou distribuída. Identificar downloads, instalação de pacotes, acesso à rede, uso de credenciais, mudanças de configuração e ações externas. Ausência de licença confirmada deve constar como pendência, sem atribuir uma licença por suposição.
5. **Confrontar o ambiente e as instruções.** Comparar com React/Vite/TypeScript, a versão real das bibliotecas, Windows/PowerShell, ferramentas disponíveis, rubrica e decisões do projeto. Registrar conflitos, referências exclusivas de Next.js e etapas redundantes.
6. **Fixar a revisão.** Selecionar um commit SHA e registrar fontes, dependências e adaptações antes de adotar. Manter licenças e avisos necessários junto dos materiais incorporados.
7. **Aplicar a uma tarefa pequena e reversível.** Dentro do escopo autorizado, testar por exemplo um formulário, uma revisão de componente ou uma query isolada. Definir antes o resultado esperado e usar os checks já adequados ao projeto.
8. **Comparar valor e custo.** Verificar se houve melhoria demonstrável, menos erros ou revisão mais clara. Considerar esforço adicional, conflitos, dependências e tempo. Não atribuir o sucesso exclusivamente à skill sem comparação suficiente.
9. **Decidir e registrar.** Adotar apenas o trecho ou pacote útil, adaptar quando a licença permitir, manter como referência ou rejeitar. Atualizar o estado neste documento somente depois da ação correspondente e da verificação de descoberta e funcionamento.

O estado inicial acima permanece para as candidatas sem adoção. Exceções registradas: frontend-design aplicada textualmente na T02 e Vercel React Best Practices aplicada textualmente na T03 após conferência de revisão, licença e inventário. Avaliações nos documentos de cada tarefa, resultados e limites nos handoffs. Nenhum pacote de skill foi instalado ou redistribuído.

## Aplicação efetiva T04 — 23/10/2026

Supabase Postgres Best Practices avaliada e aplicada como orientação textual na revisão c9be0e931b7930f7d02126d04774d904c381e7d7, versão declarada 1.1.1, licença MIT. SKILL/LICENSE/inventário e sete referências pertinentes lidos; detalhes e links fixados em T04_BACKEND.md. Nenhuma instalação de skill. SQL/RLS verificados localmente em Postgres WASM; serviços Supabase/Auth/Resend/Vercel reais continuam pendentes. A avaliação textual não substitui a matriz real de autorização.
