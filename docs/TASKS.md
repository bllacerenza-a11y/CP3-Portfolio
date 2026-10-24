# Plano de tarefas — CP3 Portfolio

Este documento define escopo e dependências. T00 revisou T01–T04; CI remoto e deploy pendentes. A evolução visual T02.1 foi solicitada pelo usuário e deve preceder T05. O estado corrente é mantido por T00 em STATE; chats em THREADS.

`docs/REQUIREMENTS.md` e o enunciado prevalecem sobre este plano. Cada chat deve identificar os requisitos que atende, preservar as restrições acadêmicas e registrar divergências antes de ampliar o escopo. Sugestões de melhoria não viram requisitos automaticamente. `docs/ARCHITECTURE.md` distingue a fundação adotada e validada das integrações ainda pendentes.

## Entrada nos chats

A primeira atividade dos chats criados é ler `HANDOFF_CP3_CODEX.md`, `AGENTS.md`, `docs/STATE.md`, sua tarefa e os requisitos relacionados. Depois, registrar compreensão do escopo, dependências e próxima ação. **A criação do chat não inicia código, instalações ou configuração de serviços.** A execução começa quando o usuário lançar a tarefa; a partir daí, seguir o escopo autorizado sem acrescentar aprovações para operações rotineiras.

## Quadro canônico

Somente T00 atualiza o estado em `docs/STATE.md`, dependências neste plano e vínculo dos chats em `docs/THREADS.md`. A tabela abaixo registra o planejamento inicial. Cada executor mantém seu próprio handoff e comunica conclusão com evidências para integração pela coordenação.

| ID | Tarefa | Status | Dependências principais |
| --- | --- | --- | --- |
| T00 | Coordenação e memória do projeto | EM ANDAMENTO; bases concluídas | Nenhuma; acompanha todas as tarefas |
| T01 | Fundação, arquitetura, harness, build e CI | EM REVISÃO; base local integrada, CI remoto pendente | Remoto GitHub para verificar execução CI |
| T02 | Design, tema, componentes e conteúdo | CONCLUÍDA no escopo local; revisada pela T00 | Integrações T03–T05 separadas |
| T02.1 | Evolução visual com referências | CONCLUÍDA no escopo local; React revisado pela T00 | Código fbf34da, handoff 0a120d0 e revisão T00 |
| T03 | GitHub, rotas e cache | CONCLUÍDA no escopo local; revisada pela T00 | Produção T07 e curadoria persistida T04/T05 separadas |
| T04 | Banco, autenticação, RLS, API de contato e email | CONCLUÍDA no escopo backend revisado | UI T05 e runtime/produção T07 separados |
| T05 | Contato, dashboard e destaques integrados no frontend | INTEGRADA; aceite UI/JWT/contato real realizado na T06 | Produção T07 separada |
| T06 | Testes, responsividade, acessibilidade e QA | CONCLUÍDA no escopo local/integrado real; revisada T00 | Código 84e4556/handoff 25ef39c; limites na revisão T00 |
| T07 | Performance e deploy de produção | CORREÇÕES PENDENTES após revisão T00; candidato publicado não integrado | Corrigir rewrite para repositórios com ponto; ver T00-revisao-T07 |
| T08 | Auditoria independente dos requisitos | PLANEJADA | T06 e T07, em revisão identificada |
| T09 | README, evidências, roteiro de vídeo e entrega | PLANEJADA | Registro contínuo; consolidação após T08 |

Estados permitidos: `PLANEJADA`, `EM ANDAMENTO`, `BLOQUEADA`, `EM REVISÃO`, `CONCLUÍDA`. Um bloqueio precisa indicar a dependência ou ação concreta que falta. Uma tarefa só fica concluída quando os critérios aplicáveis estiverem evidenciados e o resultado estiver integrado no estado registrado por T00.

| Tarefa | Requisitos principalmente cobertos |
| --- | --- |
| T00 | Coordenação de R01–R12 e G01–G03 |
| T01 | R09, R11, R12, G01 e preparação do harness de G02 |
| T02 | R02, R06 e R07 |
| T03 | R01, R02, R03 e cache de R08 |
| T04 | Backend de R04 e R05; configuração de G01 |
| T05 | Integração de R02, R04 e R05 |
| T06 | Verificação incremental de R01–R09 e R12 |
| T07 | R08, R10 e publicação de G03 |
| T08 | Auditoria de R01–R12 e G01–G03 |
| T09 | Documentação de R11/R12 e consolidação de G01–G03 |

## Regras de execução e integração

- **Um escritor de código por checkout.** Chats podem investigar e revisar em paralelo. Edições paralelas exigem worktrees apropriadas, escopo de arquivos separado e integração coordenada por T00.
- `package.json`, lockfile, roteador, configuração de build/CI e contratos compartilhados têm um responsável por vez. Acordar a mudança com T00 antes de competir pelo mesmo arquivo.
- Não presumir que outro chat possui o histórico desta conversa. Iniciar pelo enunciado, documentos canônicos, tarefa atribuída e handoff das dependências.
- Registrar decisões aceitas e restrições nos documentos do projeto. Conversas longas não substituem a memória persistente.
- Validar a alteração no checkout e revisão reais. Separar resultado executado de expectativa; nunca converter teste não executado em aprovação.
- Não expor segredos em código, commits, evidências, logs ou handoffs. Registrar somente nomes das variáveis e onde devem ser configuradas.
- Contas, credenciais, permissões e dados pessoais pendentes devem ter responsável e efeito explícitos. Continuar trabalho independente; marcar somente a integração afetada como bloqueada.
- Skills são auxiliares, com uso proporcional à tarefa. Não instalar plugins, acionar workflows adicionais, exigir nova aprovação ou alterar o escopo apenas porque uma skill sugere isso. Respeitar as autorizações existentes e as instruções do ambiente.
- T06 acompanha a qualidade desde o início. Cada implementador verifica a própria mudança antes de encaminhá-la; o ciclo final de QA não substitui isso.
- Produzir um handoff por chat com o modelo em `docs/templates/TASK_HANDOFF.md`. Guardar os registros em `docs/handoffs/`, usando o ID da tarefa no nome. T00 mantém o vínculo entre tarefa, chat e handoff.

## T00 — Coordenação e memória do projeto

**Objetivo:** manter uma fonte curta e confiável do estado do trabalho, do escopo autorizado e da próxima ação.

**Entregáveis:** quadro atualizado; vínculo dos chats e handoffs; decisões persistidas; registro de dependências, responsáveis por arquivos compartilhados e integrações.

**Escopo:** organizar, conferir evidências e integrar entregas. Evitar concentrar toda a implementação em uma conversa extensa. Despachar uma tarefa com seu contexto suficiente e recuperar o resultado pelos artefatos e commits indicados.

**Dependências:** nenhuma para iniciar; recebe sinais e entregas de T01–T09 continuamente.

**Critérios de aceite:**

- Cada requisito obrigatório tem tarefa responsável e critério verificável.
- Status e impedimentos refletem evidências atuais; não há tarefas marcadas concluídas apenas pelo relato do executor.
- Cada integração identifica branch/worktree, revisão de origem, revisão integrada e verificações pertinentes.
- O próximo chat consegue continuar sem reler centenas de mensagens.
- A entrega final resolve ou declara expressamente as pendências encontradas pela auditoria.

**Skills sugeridas:** `verification-before-completion` ao aceitar entregas; `requesting-code-review` nos marcos relevantes. `using-git-worktrees` somente quando o trabalho precisar de isolamento.

**Interação humana e integração:** centralizar decisões de escopo, dados pessoais, acesso a serviços e eventual custo. Reaproveitar decisões e autorizações já dadas. Manter tarefas executáveis enquanto acessos específicos estiverem pendentes.

## T01 — Fundação, arquitetura, harness, build e CI

**Objetivo:** preparar uma base reproduzível para implementar e verificar o portfólio.

**Entregáveis:** estrutura inicial compatível com os requisitos; dependências e lockfile coerentes; scripts de desenvolvimento, build e verificações; configuração de CI; ambiente mínimo de testes que exercite um comportamento real; instruções iniciais de execução e variáveis de ambiente; harness mínimo documentado para G02, distinguindo instruções, skills, conectores/MCPs e agentes efetivamente configurados dos apenas pesquisados.

**Escopo:** fundação técnica, sem antecipar funcionalidades de T02–T05. Adotar a stack exigida e registrar escolhas que o enunciado deixa abertas. Não criar infraestrutura que o trabalho não utiliza.

**Dependências:** documento de requisitos e decisões iniciais. É a primeira tarefa de implementação.

**Critérios de aceite:**

- Instalação e execução local são reproduzíveis com a versão de runtime e o gerenciador registrados.
- Build e verificações disponíveis passam com comandos e resultados documentados.
- CI executa as verificações previstas no repositório configurado; se acesso remoto faltar, registrar configuração local e validação remota pendente separadamente.
- Um teste relevante confirma que o ambiente funciona; a existência de um script vazio não conta como verificação.
- Há regras claras para arquivos compartilhados, variáveis de ambiente e início de preview em T07.
- Stack e contratos iniciais estão registrados como decisões, com alternativas e limitações compreensíveis pelo aluno.
- Harness tem instruções e configurações sanitizadas versionadas; cada skill, ferramenta ou agente é identificado como pesquisado, configurado ou efetivamente usado, com evidência correspondente.

**Skills sugeridas:** `verification-before-completion`; `systematic-debugging` se o ambiente falhar.

**Interação humana e integração:** acesso ao repositório remoto e provedor de CI pode estar pendente. T00 coordena Git. Entregar a T02–T04 os caminhos de componentes, rotas, testes e configuração antes de edições concorrentes.

## T02 — Design, tema, componentes e conteúdo

**Objetivo:** definir e implementar a apresentação do portfólio com consistência visual e conteúdo verificável.

**Entregáveis:** decisões de tema e layout; componentes reutilizáveis necessários; estilos e estados de interação; conteúdo organizado; contratos de apresentação para dados, contato, dashboard e destaques.

**Escopo:** interface e conteúdo previstos nos requisitos. Evitar redesign contínuo, bibliotecas de componentes sem necessidade ou criação de biografia, conquistas e projetos como se fossem fatos do usuário.

**Dependências:** pesquisa, levantamento de conteúdo e propostas podem acontecer em paralelo a T01 e T04; código após a fundação de T01. Contratos de componentes devem chegar a T03 e T05 antes da integração.

**Critérios de aceite:**

- Tema, espaçamento, tipografia e estados são consistentes nas telas implementadas.
- Preferência claro/escuro é mantida entre navegação, atualização e novas visitas, conforme R06.
- Componentes têm interfaces claras e atendem aos usos previstos, sem abstrações antecipadas.
- Conteúdo obrigatório está presente e sua origem é identificada; itens pessoais ainda não fornecidos estão sinalizados como pendentes.
- Navegação por teclado, foco visível, rótulos e adaptação de layout são verificados nas partes alteradas.
- Estados vazio, carregando, erro e sucesso aplicáveis têm tratamento definido para integração.

**Skills sugeridas:** `frontend-design` e `verification-before-completion`. Usar discussão de design somente para decisões realmente em aberto; `brainstorming` completo não é requisito deste plano.

**Interação humana e integração:** solicitar somente informações pessoais e decisões visuais que não possam ser inferidas dos materiais existentes. Alinhar com T03 o formato dos dados e com T05 os componentes de formulário e dashboard. Documentar a origem e o uso permitido de imagens e outros materiais incorporados.

## T02.1 — Evolução visual com referências

**Origem:** usuário identificou distância visual entre a entrega e suas referências e autorizou prosseguir. É meta adicional de qualidade, sem inventar obrigação acadêmica de 3D.

**Chat:** reutilizar T02. Proposta isolada aprovada pela T00 em 24/10 e convertida para React em fbf34da, handoff 0a120d0. T00 revisou código/navegador e repetiu check (24 backend +60 E2E); aprovação e integração local em docs/handoffs/T00-revisao-T021-react.md. Plano original INTEGRACAO permanece na pasta outputs/T02.1 da coordenação como histórico da proposta.

**Referências:** [templates React](https://reactjsexample.com/24-best-free-open-source-react-portfolio-page-templates/), [Bruno Simon](https://bruno-simon.com/) e [Awwwards](https://www.awwwards.com/websites/portfolio/). Selecionar exemplos concretos e registrar aplicação, sem importar stacks/dependências só por constarem em templates.

**Entregáveis:** direção editorial tecnológica mais expressiva; home com abertura autoral, destaques demonstrados visualmente, catálogo secundário compacto e detalhe com narrativa; desktop/mobile e claro/escuro; mídia real ou diagrama identificado, sem métricas/autoria inventadas. Proposta deve indicar assets/licenças/pendências e plano de integração. Skill frontend-design é apoio, não prova de qualidade.

**Dependências:** implementação a partir da main com T04 integrada. Preservar API/rotas/cache T03, tema, schemas, tipos e serviços auth/contato T04; coordenar mudanças em contratos. Formulário/guard/dashboard continuam T05.

**Aceite:** comparar telas com referências escolhidas; demonstrar projetos além de texto; inspecionar hierarquia, mídia, ritmo, estados, teclado e responsividade; preservar regressões pertinentes e executar checks reais na implementação. Não alegar Lighthouse ≥80 sem medição. A T05 começa após integração da evolução visual pela T00.

## T03 — GitHub, rotas e cache

**Objetivo:** implementar os fluxos de navegação e obtenção de dados do GitHub definidos no trabalho, com estados e cache coerentes.

**Entregáveis:** integração com GitHub; contratos de dados; rotas exigidas; política de cache e atualização; estados de carregamento, vazio, erro e indisponibilidade; testes dos comportamentos relevantes.

**Escopo:** apenas dados e operações pedidos. Paginação, filtros e autenticação de API entram quando exigidos pelo contrato e requisitos, sem transformar o portfólio em uma plataforma adicional.

**Dependências:** T01; identificação da conta/origem dos dados; contrato definido com T00/T04 quando compartilhado; alinhamento com os componentes de T02.

**Critérios de aceite:**

- Cada projeto tem URL própria; navegação, acesso direto, refresh e 404 amigável funcionam conforme R01.
- Dados exibidos correspondem à fonte e ao contrato; fixtures usadas em testes não são apresentadas como integração real.
- Cache tem chave, validade ou condição de atualização e comportamento de erro documentados e verificados.
- Falhas de rede, resposta vazia e limitações da API não quebram a interface.
- Nenhum segredo aparece no bundle ou armazenamento do navegador.

**Skills sugeridas:** `vercel-react-best-practices`, filtrada para Vite; `systematic-debugging` para falhas de integração; `verification-before-completion` ao entregar.

**Interação humana e integração:** confirmar usuário/organização GitHub pelos materiais existentes ou obter a informação faltante. Credencial só se o desenho realmente exigir. Combinar alterações do roteador e fornecer a T05 nomes, tipos, estados e exemplos de retorno.

## T04 — Banco, autenticação, RLS, API de contato e email

**Objetivo:** implementar persistência e operações protegidas exigidas pelo portfólio, mantendo autorização efetiva no servidor/banco.

**Entregáveis:** esquema e mudanças versionadas; autenticação e sessão; políticas RLS; contrato de contato; validação no servidor; integração de email; configuração documentada dos ambientes e testes de autorização.

**Escopo:** entidades, perfis e operações previstos nos requisitos. Não ampliar para múltiplos produtos, administração genérica ou permissões sem uso. Não confundir esconder controles na interface com autorização.

**Dependências:** pesquisa de serviços, desenho de dados e levantamento de acessos podem ocorrer junto de T01/T02. Implementação após T01 e definição do contrato de dados; integrações reais dependem das contas e permissões necessárias.

**Critérios de aceite:**

- Esquema e políticas podem ser reproduzidos a partir do repositório e da configuração registrada.
- Autenticação, encerramento de sessão e acesso às operações protegidas são verificados.
- Testes distinguem visitante, usuário autorizado e usuário sem permissão, conforme os papéis existentes nos requisitos.
- RLS impede leituras e escritas indevidas mesmo fora da interface.
- Mensagens e sua marcação de respondida, além dos destaques exigidos, têm contrato de persistência e autorização definido para T05.
- A API de contato valida entradas e responde adequadamente a erro e sucesso; o caminho de email real tem evidência quando houver acesso ao serviço.
- Falha no envio não é registrada como email entregue. Segredos permanecem em configuração apropriada do servidor.

**Skills sugeridas:** `supabase-postgres-best-practices` se Postgres/Supabase for adotado; `systematic-debugging`, `verification-before-completion` e revisão independente para mudanças de autorização.

**Interação humana e integração:** podem faltar conta/projeto do banco, configuração de autenticação, serviço de email, remetente e destinatário autorizados. T00 registra quem resolve cada acesso. Entregar a T05 contrato completo de sessão, operações, erros, validação e dados; exemplos simulados devem ser identificados.

## T05 — Contato, dashboard e destaques integrados no frontend

**Objetivo:** conectar as telas aos dados e operações reais, completando os fluxos de contato e gestão previstos.

**Entregáveis:** formulário de contato integrado; dashboard com proteção e operações requeridas; apresentação e gestão de destaques conforme requisitos; sincronização de estado; mensagens e feedback acessíveis.

**Escopo:** integração dos contratos existentes de T02–T04. Alterações de contrato precisam ser combinadas com seu responsável; não implementar APIs duplicadas ou caminhos simulados como conclusão.

**Dependências:** T02, T03 e T04 com interfaces estáveis e entregas integráveis.

**Critérios de aceite:**

- Fluxos completos atendem aos requisitos desde a interação do usuário até persistência/resposta real.
- Dashboard respeita sessão e permissões; dados protegidos não aparecem a visitantes nem a usuários sem acesso.
- Formulário trata entradas inválidas, envio em andamento, falha e sucesso sem afirmar entrega não confirmada.
- Marcar mensagem como respondida persiste; alterar destaques pelo dashboard atualiza a home, inclusive após atualização da página.
- Estados e componentes seguem T02 e os comportamentos alterados têm verificação incremental.

**Skills sugeridas:** `vercel-react-best-practices` filtrada para Vite; `verification-before-completion`; `systematic-debugging` para falhas; `requesting-code-review` no fechamento dos fluxos relevantes.

**Interação humana e integração:** obter pelo fluxo apropriado conta de teste ou acesso autorizado, sem colocar senhas no handoff. Confirmar com T04 os estados reais disponíveis. Combinar mudanças em roteador, contratos e dependências com T00.

## T06 — Testes, responsividade, acessibilidade e QA

**Objetivo:** verificar os fluxos obrigatórios e as condições de uso relevantes ao longo da implementação e antes da produção.

**Entregáveis:** verificações incrementais; testes dos comportamentos relevantes; matriz de telas, resoluções e interações testadas; evidências de QA; lista de defeitos com reprodução, impacto e responsável.

**Escopo:** requisitos funcionais e qualidade prevista no trabalho. Priorizar risco real e evitar testes que apenas repetem a implementação ou metas de cobertura sem utilidade demonstrada.

**Dependências:** começa com T01 e acompanha cada funcionalidade. O ciclo integrado final depende de T05 e dos acessos necessários para testar os serviços reais.

**Critérios de aceite:**

- Build, lint, análise de tipos e testes existentes aplicáveis são executados no estado candidato, com resultados reais registrados.
- Fluxos essenciais, validações, falhas e autorização são testados no nível adequado.
- A suíte automatizada cobre ao menos validação do formulário e acesso sem login, como exige R09.
- Layout é verificado em resoluções representativas; não há transbordamentos ou controles inutilizáveis nas condições testadas.
- Teclado, foco, nomes acessíveis, rótulos e contraste pertinentes são inspecionados; não declarar conformidade integral sem auditoria suficiente.
- Defeitos impeditivos são corrigidos e retestados; limitações e testes não executados ficam explícitos.

**Skills sugeridas:** `web-design-guidelines`, `verification-before-completion` e `systematic-debugging`. Revisão humana/visual complementa verificações automatizadas.

**Interação humana e integração:** depender apenas dos dispositivos e acessos disponíveis; declarar limites da amostra. Encaminhar defeitos aos responsáveis, mantendo um escritor por checkout. Entregar a T07/T08 o candidato identificado e a matriz de resultados.

## T07 — Performance e deploy de produção

**Objetivo:** disponibilizar o portfólio nos ambientes necessários e verificar desempenho e funcionamento no ambiente publicado.

**Entregáveis:** preview utilizável cedo; configuração de deploy e variáveis por ambiente; medições de performance reproduzíveis; ajustes justificados; URL de produção e verificação após publicação.

**Escopo:** infraestrutura e otimizações necessárias ao trabalho. Medir antes de otimizar; evitar troca de stack, serviço pago ou domínio sem necessidade e decisão registrada.

**Dependências:** preview pode começar com T01. Produção depende do candidato testado por T06, das contas/configurações de T04 e do acesso ao provedor de hospedagem.

**Critérios de aceite:**

- Preview identifica claramente seu ambiente e revisão, permitindo QA antes da produção.
- Lighthouse de produção atinge performance mobile de pelo menos 80, conforme R08, com URL, ferramenta, condições e relatório registrados; não inventar metas adicionais.
- Imagens eficientes/sob demanda, estabilidade visual, separação de dashboard/pesados do pacote inicial e ausência de chamadas GitHub repetidas na navegação são verificadas conforme R08.
- Build de produção e rotas por acesso direto funcionam no host escolhido.
- Variáveis, autenticação, banco e email apontam para os ambientes corretos; nenhum segredo de servidor fica exposto.
- A URL de produção é acessível e recebe verificação de funcionamento após o deploy, identificando revisão e limitações.
- Publicação automática em push na branch principal é comprovada com alteração real, conforme R10. Vercel é o destino conservador registrado em `docs/REQUIREMENTS.md`.
- Existe caminho documentado para restaurar uma versão publicada anterior se necessário.

**Skills sugeridas:** `vercel-react-best-practices` para gargalos medidos de React; `verification-before-completion`; `systematic-debugging` para diferenças entre local e hospedagem.

**Interação humana e integração:** podem faltar login do provedor, autorização do repositório e configuração de domínio/remetente. Solicitar ação humana apenas quando necessária e ainda não autorizada. Registrar URLs com ambiente, nunca tokens de acesso. Mudanças após QA retornam às verificações afetadas de T06.

## T08 — Auditoria independente dos requisitos

**Objetivo:** conferir o produto e a entrega contra o enunciado, com evidência independente do relato dos implementadores.

**Entregáveis:** matriz requisito → evidência → resultado; achados reproduzíveis classificados por impacto; veredito delimitado à revisão e ambientes auditados; lista de lacunas.

**Escopo:** auditoria inicialmente somente leitura. Não alterar código, índice, HEAD, branch ou status canônico. Não transformar preferências de estilo em falhas obrigatórias nem ampliar requisitos.

**Dependências:** T06 e T07 com revisão candidata, URL publicada e evidências. Se a revisão mudar, registrar quais conclusões precisam de nova verificação.

**Critérios de aceite:**

- Cada requisito obrigatório tem evidência concreta ou indicação explícita de ausência/não verificação.
- Achados apontam arquivo/linha ou URL, condição de ocorrência, consequência e forma de reproduzir.
- Código, comportamento observado, resultado de comando e relato de executor são distinguidos.
- Veredito considera falhas funcionais, autorização, publicação e exigências acadêmicas dentro do escopo.
- Correções retornam ao responsável e são retestadas antes de encerrar o achado.

**Skills sugeridas:** `requesting-code-review` como referência para o pacote de revisão; `verification-before-completion` para afirmações finais. Um chat independente recebe requisitos e artefatos, sem depender do raciocínio anterior dos autores.

**Interação humana e integração:** T00 fornece revisão e acessos de teste autorizados. Dúvidas do enunciado são identificadas como interpretação pendente; não presumir dispensa de exigência. T00 decide prioridade e distribui correções. A auditoria não faz merge nem publica.

## T09 — README, evidências, roteiro de vídeo e entrega

**Objetivo:** organizar uma entrega acadêmica verificável, reproduzível e coerente com o que foi construído.

**Entregáveis:** README; instruções de execução e configuração; links exigidos; evidências identificadas; roteiro de demonstração/vídeo; checklist final de entrega e limitações conhecidas.

**Escopo:** documentação e materiais previstos no enunciado. Documentar continuamente e consolidar após a auditoria. Não afirmar funcionalidades, resultados, autoria pessoal ou publicação que não tenham evidência.

**Dependências:** coleta começa com T01 e acompanha todas as tarefas; consolidação final depende de T08 e da resolução/declaração das pendências.

**Critérios de aceite:**

- Outra pessoa consegue entender a finalidade, executar o projeto e localizar os fluxos exigidos a partir do README.
- Links de GitHub público, Vercel e YouTube não listado são corretos e têm o acesso necessário para a avaliação; a entrega via Teams segue G03.
- Evidências correspondem à revisão entregue e não expõem dados ou credenciais desnecessários.
- Roteiro cobre arquitetura, componentes, alternativas/concessões, branch→deploy e harness realmente configurado. Planeja até 8 minutos, com rosto e tela durante toda a gravação, conforme G02.
- Se a gravação depender do usuário, distinguir roteiro pronto de vídeo gravado/publicado.
- Checklist final informa itens atendidos, pendentes e limitações, com resultado da auditoria e identificação da revisão final.

**Skills sugeridas:** `verification-before-completion` para conferir links, comandos e alegações. Nenhuma skill adicional é obrigatória para redigir o README.

**Interação humana e integração:** obter somente dados acadêmicos/pessoais e gravação que ainda faltem. T00 coordena a decisão de entrega. Alterações de produto descobertas na documentação voltam à tarefa responsável, sem mudanças silenciosas durante a consolidação.

## Referências opcionais de workflow

As referências abaixo foram consultadas como fonte de método, não instaladas nem adotadas integralmente. Todas apontam para a revisão auditada `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` de `obra/superpowers`, sob licença MIT. A versão distribuída por um marketplace pode ter regras diferentes; ler o arquivo efetivamente disponível antes de usá-lo.

- [Verificação antes de concluir](https://github.com/obra/superpowers/blob/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/verification-before-completion/SKILL.md): evidência antes da afirmação de sucesso.
- [Depuração sistemática](https://github.com/obra/superpowers/blob/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/systematic-debugging/SKILL.md): reprodução, investigação e hipótese antes da correção.
- [Revisão de código](https://github.com/obra/superpowers/blob/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/requesting-code-review/SKILL.md): requisitos e intervalo Git explícitos para o revisor.
- [Worktrees](https://github.com/obra/superpowers/blob/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/using-git-worktrees/SKILL.md): reconhecer isolamento existente e priorizar ferramentas nativas.

Não aplicar automaticamente o pacote completo de brainstorming, planejamento, aprovações, TDD e revisões por tarefa. Este projeto usa o plano e o fluxo de coordenação acima; necessidades adicionais devem ser justificadas pelo requisito ou pelo problema observado.
