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
- Aplicação, serviços externos, repositório remoto, testes e deploy ainda não configurados.
- Nenhuma skill externa instalada; nenhuma nota Lighthouse ou teste funcional obtido.
- A presença de documentos e de conversas não representa conclusão das funcionalidades.
- Projeto CP3-Portfolio cadastrado no aplicativo; esta conversa é T00. Nove chats de execução criados e vinculados em docs/THREADS.md.
- As nove rodadas iniciais foram interrompidas pelo limite de uso da conta. Chats existem, mas a preparação individual não foi concluída; não reiniciá-los em lote.
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

Stack proposta: React, TypeScript, Vite, React Router, TanStack Query, CSS Modules, React Hook Form/Zod, Supabase Auth/Postgres/RLS, Vercel Functions, provedor de e-mail e Playwright Test. Validar adequação e familiaridade antes de fixar versões e contratos. Não são todas obrigações do professor.

## Pontos pendentes do usuário ou do curso

- Ano e horário do prazo 03/11.
- Nome, apresentação, conteúdos e identidade visual do portfólio.
- Usuário GitHub e contas/destino dos serviços, quando necessários.
- Stack definitiva e habilidades que o aluno consegue explicar.
- O professor usará Claude, segundo o usuário; desconhecemos produto, modelo, prompt, skills e ambiente de correção. Revisar contra requisitos verificáveis.

## Modo de trabalho

Abrir chats com tarefa e dependências. A primeira mensagem dos chats de execução é contextualização e preparação: não dispara implementação completa nem instalações globais. Quando uma tarefa for iniciada pelo usuário, seguir seu escopo até a conclusão, registrando evidências. Não criar burocracia de aprovações para operações rotineiras já autorizadas.

Inspeções podem ocorrer em paralelo; escrever simultaneamente no mesmo checkout exige coordenação. Para paralelismo de implementação, usar isolamento adequado. Arquivos centrais de dependências, rotas e estilos precisam de responsável definido.

## Próximo marco

Organização inicial finalizada: avisar o usuário para trocar o modelo. Depois da retomada, T01 valida stack e contratos, configura base local e checks e prepara harness mínimo; o primeiro preview é coordenado com T07. T02 e T04 podem desenvolver propostas independentes enquanto os contratos são definidos. As demais etapas dependem do quadro. A preferência atual é executar uma tarefa por vez para reduzir consumo.
