# Estado do projeto

Atualização: 23/10/2026, America/Sao_Paulo. Responsável: coordenação T00.

## Estado verificado

- Projeto CP3-Portfolio cadastrado; coordenação e nove chats vinculados. Pasta canônica: C:\Users\bruno\Documents\Codex\CP3-Portfolio.
- Requisitos, tarefas, decisões, pesquisa de skills, plano de testes e rubrica versionados.
- T01: fundação React/TypeScript/Vite/Router/CSS Modules, Playwright, lint/formatação e workflow CI entregues em 38484a4/f31726a e integrados pela T00. Revisão em docs/handoffs/T00-revisao-T01.md.
- T02: identidade editorial, conteúdo, componentes, UI responsiva e tema persistido entregues em 9d7c883/e129e35. T00 revisou código/contratos, conferiu as respostas do usuário no chat e inspecionou capturas desktop claro/mobile escuro. Fechamento da integração no commit que contém docs/handoffs/T00-revisao-T02.md.
- T00 executou npm run check sobre e129e35: exit 0, lint/formatação/tipos/build e 16 execuções E2E aprovadas (8 cenários em Chromium desktop/mobile); runner 8,0 s.
- frontend-design aplicada textualmente na T02; Vercel React Best Practices aplicada textualmente na T03. Revisões/inventários em T02_DESIGN.md e T03_GITHUB.md. Nenhum pacote de skill instalado; demais candidatas somente pesquisadas/recomendadas.
- T03: implementação d961852 e handoff 4d66cc4 revisados pela T00; API pública sem token, lista paginada, detalhes por URL e cache TanStack Query. npm run check sobre 4d66cc4 passou: 48 execuções (24 cenários em 2 perfis Chromium), runner 9,6 s; lint, formato, tipos e build aprovados. Revisão/integração no commit que contém docs/handoffs/T00-revisao-T03.md.
- Nome Bruno Bastos, FIAP/Engenharia de Software/primeiro ano e direção editorial autorizados pelo usuário na T02. GitHub público bllacerenza-a11y; três referências em T02_DESIGN.

## Situação das tarefas

| Tarefa | Situação real |
| --- | --- |
| T00 | Coordenação ativa; revisão T03 registrada |
| T01 | Base local aprovada e integrada; EM REVISÃO para execução do CI remoto |
| T02 | CONCLUÍDA no escopo local UI/tema; integrações T03–T05 separadas |
| T03 | CONCLUÍDA no escopo local API/rotas/cache; produção e destaques persistidos seguem em suas tarefas |
| T04 | PLANEJADA; próxima frente liberada para início pelo usuário |
| T05–T09 | PLANEJADAS, conforme dependências de TASKS.md |

Os erros iniciais de limite de uso são históricos. T01/T02/T03 foram retomadas pelo usuário e estavam idle antes das revisões. T04–T09 não foram reiniciadas em lote.

## Pendências e limites

- API GitHub/lista/detalhes/cache implementados e verificados localmente. Rewrites e acesso direto em produção dependem da T07; curadoria persistida de destaques depende T04/T05.
- Formulário, autenticação/dashboard, banco/RLS, e-mail, serviços e deploy pendentes.
- Remoto GitHub não configurado; workflow CI existe, mas nunca foi executado remotamente.
- Testes obrigatórios de formulário e bloqueio sem login, Lighthouse e vídeo não realizados.
- Responsividade e tema verificados nos perfis registrados; sem conclusão de acessibilidade integral ou dispositivo físico.
- SmartCameraStudy de PedroOliDev retornou 404 nas consultas T02/T03. Causa não comprovada; UI trata ausência e oferece recuperação sem metadados inventados. Confirmar URL/acesso permanece pendente.
- Habilidades específicas, contato direto, foto e função individual nos projetos pendentes. Ano/horário do prazo 03/11 não confirmados.

## Preservação do checkout

Há edição local preexistente na última frase de docs/handoffs/T02-design-tema.md (troca textual com erro de digitação). T00 a preservou literalmente e não a incluiu no commit da revisão. Próximo executor deve conferir Git e respeitá-la. Código/configuração/testes correspondem ao candidato revisado.

Um escritor por checkout. Próximo escritor previsto é T04 quando iniciado pelo usuário; abrir branch própria a partir da main integrada e conferir status antes de editar.

## Próxima ação

Iniciar CP3 · 04 — Banco, autenticação e contato. Ler sua tarefa, CONTRACTS, ARCHITECTURE e handoff T03. Preparar migrations, autenticação do proprietário, RLS/autorização, API de contato com validação/persistência/notificação e contratos reais para T05. Avaliar Supabase Postgres Best Practices antes da adoção. Identificar contas e acessos realmente necessários, continuar implementação independente e distinguir testes locais de validação nos serviços reais. Preview Vite não executa Functions. Não expor segredos nem declarar envio entregue sem evidência.

## Evidências e revisão

- T00: npm run check no candidato e129e35 aprovado; implementação 9d7c883.
- Capturas abertas pela T00: docs/evidence/T02/home-1440-light.png e home-390-dark.png, sem impedimento visual observado.
- git diff --check main...HEAD e git merge-base --is-ancestor main HEAD aprovados antes da integração.
- Chat T02 idle e respostas do usuário conferidas via ferramentas do aplicativo.
- Revisão detalhada: docs/handoffs/T00-revisao-T02.md. A inspeção interativa do navegador foi realizada pelo executor; T00 repetiu a suíte e inspecionou as capturas.
- T03: diff/serviço/normalização/consultas/componentes/testes inspecionados; npm run check passou. Capturas aether-real-mobile-dark e smart-camera-real-404 abertas pela T00. Inspeção interativa/API real registrada pelo executor; suíte T00 usa fixtures. Revisão detalhada: docs/handoffs/T00-revisao-T03.md.
