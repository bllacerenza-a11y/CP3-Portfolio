# Handoff — Projeto CP3

Atualizado em 23/10/2026, America/Sao_Paulo.

## Objetivo e origem

Construir e publicar um portfólio individual em React e demonstrar decisões de stack e harness de IA em vídeo de entrevista. O usuário confirmou que começaremos do zero e pediu organização em projeto e chats separados, para preservar contexto e aumentar eficiência.

Organização inspirada no ViaNegativa: pasta canônica, fontes de verdade, fases delimitadas, estado comprovado e pendências explícitas. Nenhum conteúdo de domínio, regra operacional, dado ou código do ViaNegativa foi incorporado.

Pasta canônica: C:\Users\bruno\Documents\Codex\CP3-Portfolio.

## Estado confirmado

- Enunciado público lido integralmente na conversa coordenadora.
- Mapeados 12 requisitos, condições do repositório e vídeo.
- Pesquisa de skills com leitura de fontes primárias concluída; detalhes em docs/SKILLS_RESEARCH.md.
- Fundação local T01 entregue, revisada pela T00 e integrada à main: 38484a4 (implementação), f31726a (handoff). Contratos em docs/CONTRACTS.md e decisões adotadas em docs/ARCHITECTURE.md.
- T00 executou npm run check: lint, formato, tipos, build e 1 cenário de navegação em 2 configurações Chromium passaram. Formulário/autorização e demais funcionalidades ainda não existem.
- Serviços externos, remoto, execução do CI remoto e deploy pendentes. Nenhuma skill externa instalada; nenhuma nota Lighthouse obtida.
- A presença de documentos e de conversas não representa conclusão das funcionalidades.
- Projeto CP3-Portfolio cadastrado no aplicativo; esta conversa é T00. Nove chats de execução criados e vinculados em docs/THREADS.md.
- As primeiras rodadas foram interrompidas pelo limite de uso; depois o usuário retomou T01 e sua entrega foi integrada. T02–T09 aguardam início; não reiniciá-las em lote.
- Em 23/10/2026, o usuário pediu concluir as bases e avisar antes de implementar para trocar de modelo; autorizou modelos mais econômicos quando adequados. Ver docs/MODEL_POLICY.md.

## Fontes de verdade

1. Instruções atuais do usuário e enunciado da atividade.
2. docs/REQUIREMENTS.md — comportamentos e entregas.
3. docs/STATE.md — estado real e próximas ações.
4. docs/ARCHITECTURE.md — propostas e decisões explicitadas.
5. docs/TASKS.md — escopo e dependências.
6. docs/THREADS.md — conversas responsáveis.
7. Código e evidências verificadas no Git — quando existirem.

## Leitura de cada novo chat

Ler este handoff, AGENTS.md e STATE. Depois ler sua tarefa e apenas os contratos/requisitos relacionados. Não exigir o histórico completo da conversa coordenadora. Se a evidência contradisser um resumo, registrar a divergência e investigar.

## Decisões e propostas

Adotado para organização: um chat coordenador, chats por resultado, critérios de aceite, verificação incremental, branches por funcionalidade e passagem de contexto por arquivos.

Fundação adotada e verificada: React, TypeScript, Vite, React Router, CSS Modules, Playwright, ESLint/Prettier. Direção para integrações futuras: TanStack Query, React Hook Form/Zod, Supabase Auth/Postgres/RLS e Vercel Functions; provedor de e-mail condicionado a contas/remetente. Conferir ARCHITECTURE e CONTRACTS. Não são todas obrigações do professor; familiaridade do aluno ainda precisa ser confirmada.

## Pontos pendentes do usuário ou do curso

- Ano e horário do prazo 03/11.
- Nome, apresentação, conteúdos e identidade visual do portfólio.
- Usuário GitHub e contas/destino dos serviços, quando necessários.
- Revisão das decisões técnicas pelo aluno e familiaridade para explicar a implementação.
- O professor usará Claude, segundo o usuário; desconhecemos produto, modelo, prompt, skills e ambiente de correção. Revisar contra requisitos verificáveis.

## Modo de trabalho

Abrir chats com tarefa e dependências. A primeira mensagem dos chats de execução é contextualização e preparação: não dispara implementação completa nem instalações globais. Quando uma tarefa for iniciada pelo usuário, seguir seu escopo até a conclusão, registrando evidências. Não criar burocracia de aprovações para operações rotineiras já autorizadas.

Inspeções podem ocorrer em paralelo; escrever simultaneamente no mesmo checkout exige coordenação. Para paralelismo de implementação, usar isolamento adequado. Arquivos centrais de dependências, rotas e estilos precisam de responsável definido.

## Próximo marco

T02: identidade visual e conteúdo real, componentes responsivos e tema persistido, usando contratos da fundação integrada. A confirmação do CI remoto da T01 permanece pendente sem bloquear esse avanço local. Executar uma tarefa por vez para reduzir consumo; testes e documentação acompanham cada entrega. Ver docs/STATE.md e docs/handoffs/T00-revisao-T01.md.
