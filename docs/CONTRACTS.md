# Contratos iniciais — T01

Decisões adotadas em 23/10/2026 para T02–T05. Tipos executáveis em `shared/contracts.ts`. Nenhum endpoint, formulário, autenticação ou banco foi implementado na T01.

## Rotas e estados

| URL                      | Acesso e contrato                                                                                                          | Responsável |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `/`                      | Home pública; projetos vêm do GitHub, destaques vêm da curadoria                                                           | T02/T03     |
| `/projetos/:owner/:repo` | Identifica repositório pelo dono/nome, parâmetros codificados com encodeURIComponent; ID numérico estável para curadoria   | T03         |
| `/login`                 | Login do proprietário, sem cadastro público                                                                                | T04/T05     |
| `/dashboard`             | Aguardar resolução de sessão; ausente redireciona para `/login` com replace; identidade sem permissão mostra acesso negado | T04/T05     |
| `*`                      | 404 com caminho de volta à home; já disponível na fundação                                                                 | T01/T03     |

Somente home provisória e fallback estão implementados. Não usar o fallback atual como prova de proteção do dashboard. API 404 (projeto ausente) é distinto de indisponibilidade/limite de API. Cada consulta implementará loading, error, empty e success quando aplicável. Dashboard será carregado com React.lazy/Suspense, sem imports pesados na home. T07 cuida do fallback SPA em produção, preservando `/api` e arquivos estáticos.

## Dados e cache

`Project` usa ID numérico do GitHub, owner/name e metadados da API; descrição, linguagem e homepage podem faltar. Datas são strings ISO 8601 em UTC. Não cadastrar metadados manualmente no banco. T03 normaliza respostas e trata paginação de todos os repositórios públicos elegíveis; inicialmente excluir forks e arquivados é uma proposta de curadoria, a confirmar com conteúdo do usuário.

Query keys adotadas: `['projects', owner]`, `['project', owner, repo]`, `['highlights']`, `['messages', userId]`. Normalizar owner/repo para minúsculas nas chaves. Projetos: staleTime 5 minutos, gcTime 30 minutos, refetchOnWindowFocus false; aproveitar lista para detalhes sem nova chamada quando suficiente. Mensagens: somente sessão autorizada, sem cache persistente. Alterar destaques invalida highlights; responder mensagem invalida messages do usuário. Logout cancela consultas privadas e remove cache de mensagens antes de liberar nova sessão. São políticas locais, ajustáveis por evidência de T03/T06.

## Contato e persistência

Decisão inicial de campos: name (trim, 2–100 caracteres), email (trim, formato válido, até 254), message (trim, 10–5000). Cliente e servidor usam o mesmo schema quando T04 o criar; rejeitar campos inválidos com mensagens específicas. São limites adotados, não prescritos pelo enunciado. `submissionId` é UUID criado uma vez por tentativa lógica; reutilizar após falha de transporte. Novo conteúdo após sucesso recebe outro ID.

`POST /api/contact` recebe ContactSubmission. Respostas: 201 para `notified` (persistiu e provedor aceitou), 202 para `saved_notification_failed` (persistiu mas notificação falhou), 400 para `invalid`, 429 para limitação e 500/503 para `failed`. Provedor aceitar não comprova chegada à caixa. A interface só afirma envio integral conforme evidência disponível e informa falha parcial sem apagar campos. Erro de transporte mantém valores e permite repetir com o mesmo submissionId. Botão desabilitado durante envio.

T04 usa restrição única em submission_id para evitar persistência duplicada, uma decisão adicional de robustez. Mesma chave com conteúdo diferente: 409, traduzido pelo cliente como falha não repetível sem nova tentativa lógica. Repetição com conteúdo igual retorna o estado persistido; uma notificação já aceita não é reenviada automaticamente. Não prometer entrega exatamente uma vez de e-mail; retries do provedor precisam respeitar sua janela de idempotência e ser definidos em T04.

Schema lógico para migrations T04: messages (id UUID, submission_id UUID único, name, email, message, created_at, responded_at nullable, notification_status pending/accepted/failed). highlights (project_id bigint único, owner, repo, position inteiro único não negativo). Ordenar destaques por position; metadados continuam no GitHub. `Message` é a projeção privada exibida no painel, sem submission_id.

Proprietário único: UUID de Auth definido por configuração/migração, nunca por e-mail vindo do cliente. Visitante lê destaques e envia contato pela Function; não insere/lê messages diretamente. RLS permite ao dono ler mensagens/alterar responded_at e administrar destaques; outro autenticado não ganha acesso. Function valida entrada e usa segredo só no servidor. T04 precisa registrar migration, limites contra abuso e matriz real de autorização; este texto não comprova segurança implementada.

## UI e responsabilidades de edição

T02 implementa tokens semânticos `--color-background`, `--color-text`, `--color-muted`, `--color-link`, `--color-surface`, `--color-border`, `--color-accent`, `--color-on-accent` e `--color-error`. Direção editorial confirmada pelo usuário em docs/T02_DESIGN.md. Tema usa `data-theme="light|dark"` na raiz e localStorage `cp3.theme` (`light` ou `dark`); ausência/valor inválido segue sistema. Retorno ao sistema remove a chave. Storage bloqueado mantém a alternância apenas durante a sessão; não prometer persistência nesse caso. Script inicial em index.html aplica antes do React; themeStore/useTheme mantêm mudanças de sistema e outras abas.

Contratos concretos da T02:

- `Button`: props nativas de botão; `variant?: primary | quiet`, padrão primary; `type` padrão button. Consumidor T05 define type submit e disabled durante envio. Não usar botão para navegação.
- `ThemeToggle`: sem props, usa `useTheme`; botão alterna claro/escuro e botão `Usar sistema` expõe seleção por aria-pressed.
- `AsyncState`: `status: loading | error | empty | success`, `title: string`, `children?: ReactNode`, `onRetry?: () => void`. Error usa alert; demais status usam status; loading tem indicador com movimento reduzido. Retry só aparece em error com callback. T03/T05 controlam os estados e devem verificar as transições reais; T02 usa empty no aviso de contato em preparação.
- `ProjectCard`: `project: Pick<Project, 'owner' | 'name'>`, `title`, `summary`, `context`, `note` (strings), `available` (boolean). Um Project completo é estruturalmente aceito. No estágio T02, recebe referências escolhidas e resumos editoriais dos READMEs; link externo só quando a referência foi acessível. Não afirma integração API. T03 deve acrescentar o link interno de detalhes e metadados da API; não transformar essa curadoria em cadastro manual substituto da API. Contexto editorial e participação são distintos de descrição/linguagem/datas fornecidas pelo GitHub.
- `Field` fica para T05, quando existir formulário real; contrato preservado: label/id, hint/erro por aria-describedby e aria-invalid quando aplicável. Não foi criada abstração sem uso. T05 reutiliza tokens, Button e AsyncState; painel/destaques seguem os contratos de dados acima.

Conteúdo editável em `src/content/portfolio.ts`; origem e pendências em docs/T02_DESIGN.md. Atenção T03: seleção inclui dois donos diferentes e uma referência com 404 público. A curadoria inicial não determina o acesso a repositórios privados nem expõe credenciais. T04/T05 continuam responsáveis pelo mecanismo persistido de destaques.

T01 estabelece package/lock/configs e roteador inicial; T02 é dono dos estilos/componentes, T03 de projetos/cache/rotas públicas, T04 de contratos de servidor/schemas/migrations, T05 de formulário/dashboard. Modificação de package/lock, rotas, tokens e contratos exige conferir o Git e atualizar este acordo/handoff antes de outro escritor começar. Um escritor por checkout; usuário iniciou T01 neste checkout limpo. Coordenação T00 revisa integração; não editar STATE/THREADS em executor.

## Ambientes e configuração

Fundação roda sem .env. Variáveis futuras, comentadas em .env.example, só entram quando usadas. Tudo com VITE_ é público; chave publishable Supabase só é aceitável com RLS verificada. Secret key, dono do contato, e-mail e credenciais do provedor pertencem ao servidor. Não copiar configuração autenticada da máquina para o Git.

T07: output `dist`, build `npm run build`, runtime da referência `.nvmrc`, produção em main, previews por branch quando remoto/Vercel existirem. Primeiro preview local: `npm run build` e `npm run preview`. Esse preview serve apenas a SPA e não testa Functions nem deploy automático.
