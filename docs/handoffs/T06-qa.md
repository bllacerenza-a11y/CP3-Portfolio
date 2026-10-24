# Handoff — T06 — QA funcional, responsividade e acessibilidade

## Identificação e estado

- Tarefa/chat: T06, CP3 · 06 — Testes e qualidade, `01a1677e-a25a-7050-8b85-8133c287b5cc`.
- Executor: Codex. Atualização: 24/10/2026, America/Sao_Paulo. Próxima responsável: T00.
- Estado: **pronta para revisão local**, com aceite UI/serviços reais descrito abaixo. Produção permanece pendente.
- Checkout: `C:\Users\bruno\Documents\Codex\CP3-Portfolio`; branch `codex/t06-qa`.
- Base: `e512bde5eb48699db6376441a0b49d2b3e0521bc` (main). Candidato de código: 84e45560ea55c16ad38ef606c68daf952932ace5. Commit documental posterior acrescenta este handoff e evidências; mesmo código de produto testado. Integração T00 pendente.

## Objetivo, requisitos e dependências

QA de R01–R07/R09 e checks R11/R12, preservando arquitetura, conteúdo/tema, API/cache/URLs e contratos T04/T05. R08/R10/produção não são declarados atendidos. Lidos AGENTS, HANDOFF, STATE, MODEL_POLICY, THREADS, seção T06 de TASKS, REQUIREMENTS, CONTRACTS, ARCHITECTURE, pesquisa de skills e handoffs T05/T00-revisao-T05/T04 pertinentes.

Sem biblioteca ou skill nova instalada, conta criada, credencial redefinida, remoto/push/deploy ou edição de STATE/THREADS. Não houve novo subagente nesta execução. Usuário realizou pessoalmente o login na UI e confirmou o recebimento do único e-mail T06. Nenhum valor de senha/token foi solicitado pelo chat ou registrado.

## Alterações e decisões

| Alteração | Motivo e efeito |
| --- | --- |
| Token `--color-control-border` em global.css e Field.module.css | Borda clara anterior tinha 1,55:1 contra o campo. Mantém divisórias decorativas; campos agora têm 3,69:1 claro / 4,00:1 escuro |
| NavigationEffects foca destino da âncora com tabindex -1, inclusive ao repetir a URL | Contato rolava sem transferir foco. Enter no link → seção focada → Tab no Nome; destinos não entram na ordem sequencial de Tab |
| `quality.spec.ts`: três cenários em dois perfis | Contraste de campos/texto/erros/instruções/foco, âncora repetida e operações do painel por teclado. Sem testes de cobertura artificial |
| Ajustes em presentation/evolution.spec.ts | Após pular ao conteúdo, começar documento sem hash para conferir a ordem inicial do cabeçalho; aguardar o foco da navegação antes de focar o disclosure. Resolve pressuposto anterior e corrida de requestAnimationFrame |
| Forward migration `202610240001_highlights_safe_delete.sql` | Corrige erro real `21000 DELETE requires a WHERE clause`; predicado project_id > 0 preserva substituição de todos os IDs válidos. Continua invoker, owner check, transação e grants existentes |
| database.ts aplica todos os SQL de migrations em ordem | Os testes passam a verificar a sequência incremental, incluindo reorder/remoção/rollback/autorização já cobertos; não altera migration inicial |
| Quatro workers E2E | Limita pressão do navegador diante do ERR_NO_BUFFER_SPACE relatado pela T00. Não adiciona retry local nem comprova a causa daquele erro |
| Runtime `scripts/qaRuntime.mjs` e README | Build de produção isolado em work, preview SPA + adaptador Node real. Contato opt-in, somente loopback/origem local. Sem watcher/scanner sobre relatórios gerados. Não é emulação do runtime Vercel |
| ESLint ignora work, como o Git | A primeira execução encontrou JS compilado no novo diretório local; saída gerada não é código-fonte |

CONTRACTS registra os efeitos compartilhados; assinaturas de serviço, API, RLS e permissões não foram ampliadas. Nenhuma lógica administrativa passou a usar secret key no navegador. Um console diagnóstico temporário imprimiu somente código/mensagem da falha de highlights; foi removido antes do candidato e dos builds finais.

## Aceite integrado real — distinto dos mocks

Ambiente: UI no navegador integrado em `http://127.0.0.1:4186`, build de produção local; API GitHub pública, Supabase hospedado já existente e Resend configurado pela T04. Frontend administrativo usou login normal/publishable key/JWT do proprietário. Nenhuma conta administrativa substituiu o aceite da UI.

1. Login realizado pelo usuário, painel com três mensagens sintéticas reais após o contato T06; reload restaurou sessão e dados.
2. Cartão “QA T06 — contato integrado” inicialmente não respondido/accepted. Enter em Marcar como respondida; reload conservou Respondida. Marcar como não respondida restaurou `responded_at = null`. Nenhum e-mail é enviado por essa marcação.
3. Primeira gravação de destaques falhou com rascunho preservado. Diagnóstico da resposta real: `21000 DELETE requires a WHERE clause`. Não houve seleção falsa na home.
4. Migração corretiva aplicada por SQL Editor no projeto existente, dentro de BEGIN/COMMIT. SQL colado conferido integralmente por cópia da UI (1360 caracteres, incluindo wrapper/probe). CREATE OR REPLACE não chamou a função nem removeu dados. Probe retornou cinco true: invoker, predicado explícito, authenticated executa, anon negado, service_role negado. Captura recortada no pacote.
5. Repetição pela mesma UI/JWT salvou Aether. Depois Melodia foi selecionada e movida acima de Aether por teclado; salvar → home → reload mostrou **Melodia, Aether** nessa ordem com Project real do GitHub. Remoção dos dois itens/salvar [] restaurou a seleção vazia original. Home pública confirmou vazio real.
6. Logout por teclado terminou em /login e sem artigos privados; a outra aba também deixou de exibir o painel. Acesso direto a /dashboard, reload e voltar permaneceram sem painel privado. Nenhuma sessão autenticada foi exportada para arquivo.

### Contato único deliberado

- Às 12:55, aproximadamente, a UI submeteu uma mensagem claramente sintética chamada “QA T06 — contato integrado”, e-mail de teste `qa@example.com`. Destinatário real permaneceu o já fixado no servidor; nenhum dado pessoal novo foi inventado.
- Runtime usou `createContactHandler` + `createContactDependencies` existentes em Node, carregados pelo Vite SSR somente no servidor. Preview sozinho não foi tratado como Function.
- Durante o envio, campos/botão ficaram desabilitados e o texto indicou envio. Depois: feedback de mensagem salva/notificação aceita e campos limpos.
- Recibo: **1 POST, 1 chamada ao Resend, HTTP 201**. Conferência somente leitura encontrou exatamente **1 linha T06 com notification_status accepted**. Usuário confirmou no chat: “o email chegou”. Não houve replay/envio de falha parcial ou outro e-mail nesta rodada.
- Estado final: **3 mensagens** (duas T04 anteriores + uma T06), T06 não respondida; highlights **[]**. Mensagens T04 não foram editadas/removidas; quotas foram consumidas normalmente pelo contato único, sem reset administrativo.
- Conferência final do JSON usa chave de servidor para ler apenas contagem/status T06 e chave pública para highlights; é evidência separada, não prova de autorização UI/JWT. Segredos ficaram no .env ignorado/processo. O processo de envio foi encerrado; a prévia final está com contato bloqueado por padrão.

## QA visual, teclado e contraste

| Tela/condição | Amostra e resultado observado |
| --- | --- |
| Home/detalhes Aether/Melodia, login/painel/contato | Suíte com HTTP sintético: larguras 320/390/768/1440, claro/escuro, Chromium desktop e contexto Pixel 7; cenários aplicáveis conforme specs. Sem overflow nas assertions existentes |
| Dashboard autenticado real | 320×900, 390×844, 768×900, 1440×900; dois temas. `layout-real.json`: oito medidas, zero overflow e zero botões/inputs fora horizontalmente. Cartão T06 em 390 aberto e inspecionado |
| Público real no navegador integrado | Home 1440/claro e 320/escuro; contato 390/escuro; detalhe Aether 768 e 390/escuro com refresh e disclosure aberto por Enter. Capturas e geometria inspecionadas |
| Teclado/foco | Skip link e tema por suíte; âncora Contato real focou seção; suíte garante Tab no Nome e repetição. Painel real: responder, ordenar/salvar e logout via Enter; disclosure Aether real via Enter |
| Nomes/rótulos/erros | Label de campos, descrições e erros associados, aria-invalid, estados e foco no primeiro inválido conferidos na suíte e código. Guard positivo real e negativo após logout observados |
| Contraste | Teste lê estilos computados: bordas >=3, texto/instruções/erros >=4,5, foco >=3 nas amostras. Pares CSS de referência: texto em campo 13,70 claro/10,44 escuro; erro em fundo 6,14/9,44; muted em fundo 5,34/8,79. Cálculo de luminância relativa; bordas de campos 3,69/4,00 |

Não foi auditoria WCAG integral. Sem leitor de tela, dispositivo físico, Safari/Firefox, forced-colors ou medição Lighthouse. Conteúdo dentro das mídias/gráficos não foi certificado por contraste de pixels. Imagens/avisos editoriais e contexto privado aprovados nas tarefas anteriores foram preservados.

Limite da captura integral Aether: o bitmap mostra o skip link na composição rolada; no viewport o foco era SUMMARY e o limite inferior do skip link era -21,76 px (fora da tela), sem sobreposição reproduzida na interação. Evidência/possível artefato fullPage documentado no índice, sem retocar a imagem nem confundir o bitmap com falha observada.

O primeiro ensaio da matriz real tentou redimensionar uma aba diferente da inspecionada: valores retornaram 1280 e não foram usados como prova das quatro larguras. A matriz foi refeita na aba correta e registra os tamanhos efetivos. Não confundir dimensões solicitadas com medidas observadas.

## Verificação e evidências

Ambiente confirmado: Windows/PowerShell, Node v24.20.0, npm 11.19.0, Playwright 1.64.1. Todos os comandos no checkout canônico. Estado: base e512bde + mudanças que formam o candidato, preservando edição T02.

| Procedimento realmente executado | Resultado |
| --- | --- |
| Build:test + quality.spec desktop inicial | 1 aprovado, 2 falhas: contraste 1,5503 e foco da âncora. Defeitos reproduzidos antes da correção |
| Build:test + quality.spec nos dois perfis | 6 aprovados após correções |
| Checks intermediários | Um abortou no lint do build dentro de work (2109 erros de saída compilada); outro 108/110 após mudança de foco, outro 109/110 por corrida ao focar disclosure. Causas/ajustes acima; não foram registrados como checks aprovados |
| `npx playwright test tests/e2e/evolution.spec.ts tests/e2e/presentation.spec.ts tests/e2e/quality.spec.ts --workers=4` | 22 aprovados, 18,0s; `focused.log` |
| `npm run test:server` após forward migration | 25 aprovados, 4,9s; `backend-migrations.log` |
| `npm run check` final | Lint/formato/tipos/build:test e 25 backend +110 E2E aprovados; 4,3s backend / 36,2s E2E; check.log. Sem conta/e-mail reais nesse comando |
| `npm run build` e `npm run build -- --outDir work/t06-production` | Produção aprovada em ambos; logs no pacote. Repetidos depois do check para restaurar dist de produção |
| `node scripts/qaRuntime.mjs --allow-contact` | Processo usado para o único envio real; encerrado após conferência |
| `node scripts/qaRuntime.mjs` | Smoke de inicialização da versão final sem scanner/watcher; porta 4186, envio bloqueado. Não inclui prova de runtime Vercel |
| `git diff --check`, hash T02 e busca limitada de segredos conhecidos | Conferidos antes dos commits; resultado final registrado na passagem/commit. Não equivalem a auditoria de toda infraestrutura |

Evidências em `docs/evidence/t06/`, com índice que diferencia capturas reais e fixtures. Nenhum storageState, cookie, JWT ou senha faz parte da entrega. Resultados e imagens foram conferidos pelo executor, não apenas relatados por outro agente.

## Achados e pendências

| Item | Impacto, estado e responsável |
| --- | --- |
| Destaques recusados pelo banco hospedado (impeditivo R05) | Corrigido por forward migration e retestado via JWT/UI, inclusive ordem, reload e []. T00 deve revisar a migração; T07 deve respeitar histórico manual |
| Contraste dos campos / foco de âncoras | Corrigidos e cobertos por regressão automatizada. T00 revisar identidade preservada e comportamento de foco |
| Negativas/falhas controladas | Formulário/guard/outra identidade/erros API/transportes cobertos com mocks e PGlite. Outro usuário JWT real não foi recriado nesta rodada; evidência anterior pertence à T04 |
| Runtime Vercel, origem/IP/quotas/duração, CI remoto e deploy/rewrites | Não verificados aqui; T07. Remetente de teste Resend continua limitado à conta; recebimento único não garante entrega futura |
| Lighthouse/dispositivo físico/auditoria integral | Pendentes; T07/T08. Não inferir nota ou certificação dos testes locais |
| Conteúdo pessoal/licenças/mídias/contexto privado | Pendências anteriores mantidas; sem novas alegações de autoria/experiência |

## Preservação, integração e próxima ação

- Edição preexistente em `docs/handoffs/T02-design-tema.md` preservada fora do staging/commits. SHA-256 antes/depois: `F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159`. Checkout não é limpo por essa edição alheia.
- Busca local dos três segredos conhecidos configurados, sem imprimir valores: 227 arquivos versionados/incluindo staging T06 e builds finais conferidos, zero correspondências. Não é auditoria completa de segredos; capturas também foram inspecionadas visualmente.
- Migração incremental já aplicada manualmente no projeto hospedado; SHA-256 do arquivo: `ADDD08EDB374D3C26ABC1123B99BB4A3BD710CB74029315B36B6A27DBDA793E3`. Não executar a inicial novamente no banco existente. CLI/histórico não foram reconciliados nesta rodada.
- Revisão T00: comparar `e512bde..codex/t06-qa`, ler este handoff/índice, migração, NavigationEffects/Field, testes e runtime. Conferir logs/capturas e rodar checks proporcionais sem repetir e-mails.
- Antes de publicar: usar build de produção; testes substituem dist por configuração sintética. Runtime local separado não deve ser publicado. .env e work permanecem ignorados.
- T00 confirma integração e atualiza STATE/THREADS. Nenhum outro chat foi acionado automaticamente. Após revisão, T07 trata publicação/performance/runtime, T08 auditoria independente.

### Mensagem curta para T00

> T06 pronta para revisão local, branch codex/t06-qa, base e512bde, candidato 84e45560ea55c16ad38ef606c68daf952932ace5. Aceite real UI/JWT: sessão/reload/logout, respondida/desfeita e destaques/ordem/home/reload/[] verificados. Falha real SQL 21000 corrigida por migration incremental já aplicada, sem mudar grants/RLS. Um contato UI→Node→Supabase/Resend, 1 POST/1 envio/201/1 registro accepted e recebimento confirmado pelo usuário. Estado final: 3 mensagens (2 T04 +1 T06 não respondida), highlights []. Check: 25 backend +110 E2E e lint/formato/tipos/build aprovados. Evidências em docs/evidence/t06, handoff docs/handoffs/T06-qa.md. T02 local preservada. Próxima ação: T00 revisar/integrar; produção/Lighthouse permanecem T07/T08.
