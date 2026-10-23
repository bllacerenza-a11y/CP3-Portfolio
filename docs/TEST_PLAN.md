# Plano de testes — CP3 Portfólio

Este documento planeja a validação do projeto. Sua existência não comprova que a aplicação funciona. Nenhum teste foi executado na criação deste plano; todos os resultados começam como `NÃO_VERIFICADO`.

Os requisitos foram fornecidos no planejamento do CP3. A numeração R01–R12 é uma organização local, sem pesos ou notas oficiais. A matriz de aceitação e as regras de evidência estão em [REVIEW_RUBRIC.md](./REVIEW_RUBRIC.md).

## 1. Escopo e condições de execução

- **ENUNCIADO:** comprovar os doze requisitos, o repositório público, o deploy, a documentação, o vídeo e os três links de entrega.
- **RECOMENDADO:** combinar testes de código, navegador, banco e integrações; nenhuma dessas camadas substitui as demais.
- Usar o gerenciador de pacotes e os scripts efetivamente definidos pelo projeto. Os nomes de scripts de teste serão registrados no README após sua implementação; este plano não pressupõe comandos já existentes.
- Preparar dados sintéticos e contas exclusivas para teste. Não incluir senhas, tokens, mensagens pessoais, cookies ou URLs assinadas nos relatórios, screenshots, traces ou commits.
- Separar os testes determinísticos com mocks dos testes de integração real. Um teste com resposta simulada comprova o comportamento frente àquela resposta, não a disponibilidade ou a configuração do serviço real.
- Registrar o SHA completo do commit, ambiente, URL, versões das ferramentas e configuração de execução. Um resultado anterior a uma alteração relevante precisa ser reavaliado.
- Executar os E2E de aceitação contra o build de produção servido localmente e repetir um smoke no deploy correspondente ao commit. O servidor de desenvolvimento é útil durante a implementação, mas não cobre configuração de hospedagem.

## 2. Camadas

| Camada | O que verificar | Evidência esperada | Natureza |
| --- | --- | --- | --- |
| Análise estática e build | Lint, formatação, tipos se usados, build, estrutura e configuração pública | Comandos, versões, saída e código de saída | R11/R12 e suporte aos demais requisitos |
| Unitários | Validação dos campos, regras de apresentação/transformação dos dados e lógica isolada relevante | Testes versionados e relatório | Automação de formulário exigida em R09; casos adicionais recomendados |
| Integração de componentes | Formulário com serviço simulado, guard com estados de sessão, tema, estados de API | Testes versionados, assertions observáveis e fixtures | Formulário e proteção de rota exigidos em R09 |
| Integração de serviços e RLS | Persistência, autorização no serviço/banco e políticas de acesso, se o backend usar RLS | Matriz de identidade/operação, resultados e testes versionados | Verificação de segurança recomendada; sustenta a funcionalidade de R04/R05 |
| E2E automatizado | Jornadas completas da interface, rotas, autenticação, mensagens e destaques | Suíte Playwright Test, relatório e trace de falhas | Evidência para R01–R06 e R09; extensão recomendada da automação mínima |
| Exploração no navegador | Visual, teclado, zoom, responsividade e situações não cobertas pela suíte | Checklist, screenshots contextualizados e defeitos reproduzíveis | Responsividade exigida; cobertura complementar recomendada |
| Desempenho | Lighthouse mobile, imagens, carregamento de código, estabilidade visual e tráfego | Relatório Lighthouse e inspeção de rede/performance | R08 |
| Entrega | Deploy automático, clone limpo, documentação, vídeo e links | Execução reproduzível e links associados ao commit | R10–R12 e condições de entrega |

## 3. Matriz de cenários de aceitação

### R01 — Rotas de projeto e falhas de navegação

1. Abrir cada projeto exibido e verificar URL individual e conteúdo correspondente ao repositório.
2. Colar a URL de um projeto em uma sessão nova e recarregar a página no deploy. Verificar que a hospedagem entrega a aplicação e a rota correta.
3. Abrir uma rota inexistente e um identificador de projeto inexistente; verificar o tratamento 404 e uma saída útil para o visitante.
4. Simular falha de API em uma rota válida. Verificar estado de erro explícito, sem confundi-lo com uma lista vazia ou um projeto inexistente.
5. Repetir navegação com voltar/avançar do navegador e links internos. Registrar separadamente erro da hospedagem, do roteador e da API.

### R02 — Loading, erro, vazio e bloqueio de ações

1. Inventariar todos os componentes que consomem API. Para cada um, registrar os estados `loading`, `success`, `empty` e `error` aplicáveis.
2. Controlar o atraso e as respostas por fixture para observar cada estado de forma determinística.
3. Enquanto uma ação assíncrona estiver pendente, verificar botão desabilitado e indicação de andamento.
4. Tentar clicar novamente durante o envio para verificar o bloqueio do botão. Deduplicação no servidor é uma recomendação adicional, não uma exigência literal de R02.
5. Após sucesso ou falha, verificar feedback e recuperação da interface. Estados vazios devem explicar a ausência de dados.

### R03 — Projetos provenientes da API GitHub

1. Confirmar em código e rede a origem dos dados de repositório apresentados ao visitante.
2. Comparar uma fixture com a interface e executar um smoke com repositório real: nome, descrição e demais campos efetivamente exibidos devem corresponder à resposta usada.
3. Verificar que os dados de repositório não dependem de cadastro manual. Selecionar um identificador para destaque não equivale a recadastrar nome, descrição e outros dados do GitHub.
4. Exercitar resposta vazia, metadados ausentes, indisponibilidade e limite de requisições sem inventar dados para esconder a falha.
5. Se a aplicação pretende listar todos os repositórios elegíveis, testar paginação conforme esse contrato. A quantidade esperada deve vir do enunciado ou de uma decisão documentada, não deste plano.

### R04 — Contato, email e persistência

1. Automatizar campos obrigatórios, conteúdo inválido e email malformado; verificar mensagens associadas ao campo e preservação dos valores úteis.
2. Submeter dados válidos e verificar bloqueio durante envio, feedback de conclusão e comportamento definido após sucesso.
3. Simular falhas de transporte, persistência e envio de email, inclusive sucesso parcial. A interface não deve afirmar conclusão integral quando uma etapa obrigatória falhou.
4. Confirmar em integração real que uma mensagem sintética persiste no dashboard e que o email chega ao destinatário configurado do dono. Usar caixa/conta de teste controlada; não enviar mensagens a terceiros.
5. Registrar o identificador da mensagem e evidência sanitizada de recebimento. Uma resposta HTTP de aceitação do provedor, isoladamente, não prova entrega na caixa de entrada.
6. Como verificação recomendada de robustez, observar duplo clique e nova tentativa após falha parcial. Idempotência no servidor é uma melhoria recomendada; não adicionar um critério obrigatório além do bloqueio de envio exigido pelo enunciado.

### R05 — Login, dashboard, mensagens e destaques

1. Sem sessão, abrir diretamente uma rota protegida, inclusive após refresh; confirmar redirecionamento para login e ausência de conteúdo privado acessível.
2. Automatizar o guard com usuário autenticado, não autenticado e sessão ainda sendo resolvida. Testar expiração e logout como cobertura complementar.
3. Verificar login válido, credenciais inválidas, feedback e redirecionamento previsto para o dashboard.
4. Ler a mensagem sintética enviada em R04, marcá-la como respondida e recarregar. Confirmar persistência do estado.
5. Alterar os projetos destacados, abrir a home em uma sessão independente e confirmar o resultado persistido.
6. Se houver outras identidades autenticadas, confirmar que elas não ganham poderes de dono por estarem apenas logadas. Testar autorização diretamente no serviço; ocultar botões não basta como evidência de proteção.

### R06 — Tema persistido

1. Alternar entre os temas suportados e verificar os componentes e páginas relevantes.
2. Navegar, recarregar e reabrir a aplicação no mesmo perfil; confirmar persistência da escolha.
3. Confirmar que o formulário, feedbacks, foco e dashboard continuam legíveis em cada tema.

### R07 — Responsividade, reutilização e identidade visual

1. Inspecionar celular e desktop, incluindo navegação, cartões, detalhes de projeto, contato e dashboard.
2. Como matriz recomendada, usar viewports de 360, 390, 768, 1280 e 1440 pixels de largura, registrando também a altura. Esses valores não são breakpoints oficiais do enunciado.
3. Verificar ausência de rolagem horizontal acidental, conteúdo cortado, sobreposição e controles inacessíveis; testar textos longos e campos em erro.
4. Confirmar por revisão de código a reutilização de componentes e a coerência da identidade visual.
5. Elementos 3D são opcionais: ausência não é falha. Se existirem, testar fallback, legibilidade, toque, carregamento e impacto no desempenho.

### R08 — Desempenho

1. Executar Lighthouse no perfil mobile contra a versão de produção e guardar o relatório completo. Registrar versão do Lighthouse/Chrome, URL, SHA, data, perfil e condições.
2. **Critério do enunciado:** desempenho mobile de pelo menos 80. Este plano não cria mínimos para outras categorias.
3. Para avaliar variação, recomenda-se três execuções comparáveis. Publicar resultados individuais e investigar qualquer resultado abaixo de 80; não usar uma média para ocultá-lo.
4. Inspecionar formatos, dimensões e tamanho transferido das imagens; aplicar lazy loading onde for adequado. Não atrasar indiscriminadamente a imagem principal responsável pelo LCP.
5. Confirmar que recursos pesados exclusivos do dashboard não entram desnecessariamente no carregamento inicial da área pública.
6. Observar mudanças inesperadas de layout durante imagens, fontes, estados de carregamento e navegação. Registrar métricas e a reprodução, sem inventar um limite de CLS não informado.
7. Registrar as requisições ao GitHub durante navegação repetida. Identificar duplicações indevidas, preservando atualizações justificadas por expiração de cache, mudança de parâmetros ou alteração de dados.
8. Lighthouse e inspeção de rede são verificações distintas: uma nota suficiente não prova todos os itens de R08.

### R09 — Automação mínima exigida

1. Manter testes automatizados versionados para o formulário e para a proteção de rota.
2. Demonstrar as assertions sobre resultados visíveis e regras relevantes, incluindo caminhos inválidos/sem sessão; apenas renderizar um componente não basta.
3. Rodar a suíte e associar o resultado ao commit. Se um teste falhar, corrigir o produto ou o teste conforme o contrato; não remover assertions para produzir sucesso artificial.

### R10 — Deploy automático público

1. Confirmar configuração de produção ligada à branch principal (`main`, nome adotado neste projeto) e URL pública acessível sem sessão de administração.
2. Usar um commit legítimo de desenvolvimento para verificar o deploy automático; registrar SHA, execução do provedor e URL resultante.
3. Rodar smoke na URL publicada: home, projeto via URL direta, contato com dados controlados e redirecionamento de rota protegida.
4. Verificar variáveis do ambiente de produção sem expor seus valores. A presença de um preview manual não comprova deploy automático de `main`.

### R11 — Histórico, documentação e instruções para IA

1. Inspecionar histórico real, convenção de commits adotada e branches por feature. Não reescrever ou fabricar histórico para simular o processo.
2. Confirmar README com objetivo, stack, arquitetura, decisões, execução, testes, configuração e links relevantes.
3. Conferir instruções para IA e os artefatos do harness usados: ferramenta, modelo quando identificável, instruções, skills, MCP e agentes. Registrar somente o que foi efetivamente usado, incluindo limitações de identificação.
4. Para skills/agentes externos, registrar origem e versão ou commit quando disponível. Para configurações locais, versionar uma forma sanitizada e reproduzível, sem credenciais.

### R12 — Organização e qualidade do código

1. Revisar separação de pastas e responsabilidades, lógica de dados/serviços e apresentação.
2. Inspecionar nomes, documentação suficiente para manutenção e consistência entre componentes reutilizados.
3. Demonstrar lint e formatação automáticos conforme a configuração adotada, tanto na execução local documentada quanto nos mecanismos automatizados existentes.
4. Executar build e verificações apropriadas em checkout limpo. Não exigir bibliotecas, número de pastas ou arquitetura que não constem do enunciado.

## 4. Autorização e RLS, se aplicáveis ao backend

RLS é uma camada de segurança recomendada quando a arquitetura usa um banco com esse recurso. A exigência funcional de login não determina, sozinha, a tecnologia de autorização. Validar as regras com a API/cliente de usuário, sem usar uma credencial administrativa para demonstrar isolamento.

| Identidade | Mensagens | Estado respondida | Destaques |
| --- | --- | --- | --- |
| Visitante sem sessão | Pode realizar somente a operação pública de contato definida; não lê a caixa privada | Não altera | Lê apenas dados públicos; não altera |
| Dono autenticado | Lê as mensagens destinadas ao painel | Altera conforme a regra do produto | Altera e confirma efeito na home |
| Outro usuário, se existir | Não acessa mensagens privadas do dono | Não altera dados do dono | Não altera a curadoria do dono |
| Sessão inválida/expirada | Recebe rejeição para operações privadas | Recebe rejeição | Recebe rejeição para alterações |

Testar acesso direto a endpoints/tabelas, não apenas pela interface. Verificar políticas de leitura e escrita separadamente e usar identificadores conhecidos para provar que a negativa não depende de desconhecer o ID. A estratégia pública de envio deve ser compatível com o contrato de contato sem abrir leitura da caixa de mensagens. Registrar `NÃO_VERIFICADO` enquanto o backend ou as identidades necessárias não estiverem disponíveis.

## 5. Mocks e integrações reais

| Serviço | Casos determinísticos | Smoke real controlado |
| --- | --- | --- |
| GitHub | Sucesso, vazio, campos ausentes, projeto inexistente, limitação e falha | Confirmar origem e correspondência de dados de um repositório acessível |
| Autenticação | Sessão pendente, válida, ausente, expirada e credencial rejeitada | Login/logout de conta de teste e proteção de acesso direto |
| Persistência | Leitura/escrita bem-sucedida, falha e resposta atrasada | Mensagem persiste; respondida e destaques persistem após refresh |
| Email | Aceitação, rejeição, timeout e sucesso parcial do fluxo | Mensagem chega à caixa controlada do destinatário configurado |

Cada teste deve controlar seu estado e seus dados. Priorizar seletores por papel, rótulo e nome acessível, além de assertions que aguardam o estado esperado. Não usar pausas fixas ou `networkidle` como prova de prontidão da aplicação. Fixtures não devem depender da ordem dos testes.

## 6. Navegador, dispositivos e acessibilidade

- Recomenda-se executar os fluxos críticos em Chromium, Firefox e WebKit, além de configurações mobile compatíveis com o runner. A matriz realmente executada deve aparecer no relatório.
- Emulação de viewport, user agent e toque não equivale a teste em aparelho físico. Registrar como `EMULADO`; registrar fabricante, sistema e navegador quando houver execução `FÍSICA`.
- Combinar varredura com axe, navegação por teclado, ordem/foco visível, labels, mensagens de erro, zoom e revisão manual de contraste/legibilidade.
- Uma árvore de acessibilidade usada por um agente de navegador não é uma auditoria de acessibilidade. Zero violações automatizadas no axe não garante conformidade WCAG.
- Screenshots ajudam na avaliação visual, mas não provam persistência, envio de email, autorização ou origem dos dados.
- Exploração com agente de navegador pode descobrir cenários; os casos importantes devem ser convertidos em testes versionados quando úteis. MCP ou CLI não substituem automaticamente uma suíte Playwright Test.

## 7. Registro de execução e critérios de conclusão

Para cada cenário, preencher:

```text
ID do cenário / requisito:
Origem: ENUNCIADO ou RECOMENDADO
Status: VERIFICADO | FALHOU | NÃO_VERIFICADO
SHA completo:
Data/hora e ambiente:
URL e versão da ferramenta:
Pré-condições e identidade de teste, sem credenciais:
Passos/comando:
Resultado esperado:
Resultado observado:
Evidência: caminho de relatório, execução CI, trace ou captura sanitizada
Limitação/bloqueio e próximo passo:
```

`VERIFICADO` exige execução ou inspeção adequada, com evidência vinculada ao commit. `FALHOU` exige divergência observada. `NÃO_VERIFICADO` cobre ausência de execução, dependência indisponível, configuração pendente ou evidência insuficiente. Não converter impossibilidade de testar em sucesso.

Um requisito com vários subitens só fica `VERIFICADO` quando todos os seus itens obrigatórios estiverem demonstrados. Se qualquer um falhar, o requisito fica `FALHOU`; sem falhas observadas, mas com itens pendentes, fica `NÃO_VERIFICADO`. Recomendações adicionais têm resultado separado e não criam reprovação oficial fictícia.

## 8. Verificação da entrega

- Repositório GitHub público com histórico real, README executável e exemplo de variáveis sem segredos.
- Clone limpo: seguir o README, configurar valores próprios pelo exemplo e executar build/testes sem depender de arquivos pessoais não documentados.
- URL pública Vercel e deploy automático de `main`, associados ao SHA auditado.
- Vídeo de até oito minutos, rosto e tela sempre visíveis, publicado no YouTube como não listado. Revisar duração, visibilidade e áudio antes da entrega.
- O vídeo deve demonstrar stack, arquitetura, visual, decisões comparadas, tradeoffs e aplicação do harness: ferramentas/modelo, instruções, skills, MCP e agentes efetivamente utilizados e versionados quando cabível.
- No Teams, entregar os três links: GitHub, Vercel e YouTube. Validar acessibilidade dos links em sessão sem privilégios.
- Prazo informado: **03/11**. O ano e o horário limite não foram confirmados; não inferi-los a partir da data de criação do projeto.

## 9. Referências técnicas

As referências abaixo orientam métodos de teste; não são a fonte da rubrica acadêmica.

- [Playwright: boas práticas](https://playwright.dev/docs/best-practices).
- [Playwright: projetos e diferentes navegadores](https://playwright.dev/docs/test-projects).
- [Playwright: emulação](https://playwright.dev/docs/emulation).
- [Playwright: acessibilidade com axe e limites da automação](https://playwright.dev/docs/accessibility-testing).
- [Playwright: estados de carregamento e recomendação contra networkidle para testes](https://playwright.dev/docs/api/class-page#page-wait-for-load-state).
- [Microsoft: Playwright MCP](https://github.com/microsoft/playwright-mcp) e [Playwright CLI](https://github.com/microsoft/playwright-cli).
