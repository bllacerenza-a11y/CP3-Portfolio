# Handoff — Projeto CP3

Atualizado em 24/10/2026, America/Sao_Paulo.

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
- T02 entregue em 9d7c883/e129e35: conteúdo, identidade editorial, UI responsiva e tema persistido. T00 revisou código/contratos, conferiu respostas do usuário e inspecionou capturas; npm run check passou com 16 execuções. Ver STATE e docs/handoffs/T00-revisao-T02.md.
- T03 entregue em d961852/4d66cc4: API GitHub real, lista paginada, detalhes por URL, estados e cache. T00 inspecionou implementação/testes/capturas e repetiu npm run check: 48 execuções aprovadas, runner 9,6 s. Ver STATE e docs/handoffs/T00-revisao-T03.md.
- T04 revisada até 212749d (código inicial e2338e1): backend/auth/RLS/contato implementados, Supabase e Resend reais configurados/testados pelo executor; usuário confirmou recebimento do email. T00 repetiu somente checks locais: 24 backend +48 execuções E2E aprovados. Ver STATE e docs/handoffs/T00-revisao-T04.md para limites.
- Remoto/CI remoto e deploy Vercel pendentes. UI/formulário/guard/dashboard pertencem à T05. Remetente Resend atual é de teste, limitado à conta; configuração de produção pendente. Nenhuma nota Lighthouse obtida.
- frontend-design/T02, Vercel React Best Practices/T03 e Supabase Postgres Best Practices/T04 aplicadas textualmente; revisões em T02_DESIGN, T03_GITHUB e T04_BACKEND. Nenhum pacote de skill instalado.
- A presença de documentos e de conversas não representa conclusão das funcionalidades.
- Projeto CP3-Portfolio cadastrado no aplicativo; esta conversa é T00. Nove chats de execução criados e vinculados em docs/THREADS.md.
- As primeiras rodadas tiveram erros de limite históricos; T01–T04 foram retomadas pelo usuário. T05–T09 aguardam início. Evolução visual T02.1 combinada antes da T05; reutiliza o chat T02 e sua proposta começou isolada do checkout.
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
- Nome Bruno Bastos, apresentação FIAP/primeiro ano e identidade editorial definidos na T02. Habilidades, foto, contato direto e função individual nos projetos ainda pendentes.
- GitHub bllacerenza-a11y confirmado como origem; SmartCameraStudy de PedroOliDev retornou 404 na consulta T02. Contas/destinos dos serviços seguem pendentes.
- Revisão das decisões técnicas pelo aluno e familiaridade para explicar a implementação.
- O professor usará Claude, segundo o usuário; desconhecemos produto, modelo, prompt, skills e ambiente de correção. Revisar contra requisitos verificáveis.

## Modo de trabalho

Abrir chats com tarefa e dependências. A primeira mensagem dos chats de execução é contextualização e preparação: não dispara implementação completa nem instalações globais. Quando uma tarefa for iniciada pelo usuário, seguir seu escopo até a conclusão, registrando evidências. Não criar burocracia de aprovações para operações rotineiras já autorizadas.

Inspeções podem ocorrer em paralelo; escrever simultaneamente no mesmo checkout exige coordenação. Para paralelismo de implementação, usar isolamento adequado. Arquivos centrais de dependências, rotas e estilos precisam de responsável definido.

## Próximo marco

Receber a proposta/handoff T02.1 atualizada que o usuário enviará. Revisar e coordenar implementação visual a partir da main com T04 integrada, preservando contratos de auth/contato/API. Depois integrar a evolução visual e seguir à T05. Referências e sequência em TASKS/T02.1 e STATE. Respeitar a edição textual preexistente no handoff T02, preservada fora dos commits. Uma tarefa de implementação por vez.
