# Arquitetura e decisões

Estado: decisões iniciais adotadas em T01, em 23/10/2026. Validação técnica local registrada em `docs/handoffs/T01-fundacao.md`; familiaridade do aluno e integrações externas ainda precisam de confirmação durante as tarefas correspondentes.

## Princípios

Resolver todos os requisitos com uma aplicação pequena e explicável. Evitar dependências e abstrações sem necessidade. Componentes apresentam dados; serviços integram APIs; hooks organizam estados; servidor protege segredos; banco persiste mensagens e destaques.

## Stack adotada e limites de validação

Fundação instalada: React + TypeScript + Vite; React Router em modo declarativo; CSS Modules; Playwright Test; ESLint e Prettier. Node 24.20.0 e npm 11.19.0 são a referência local e de CI. Versões exatas em package.json e resolução no package-lock.json.

T03 instala TanStack Query 5.104.5 para cache compartilhado lista/detalhes, com versões exatas em package/lock; avaliação e decisões em docs/T03_GITHUB.md. Escolhas de integração ainda sem instalação/configuração: React Hook Form/Zod para formulário e validação compartilhada em T04/T05; Supabase Auth/Postgres/RLS e Vercel Functions em T04. Resend é candidato para e-mail, condicionado ao remetente e à conta disponíveis. Tarefas responsáveis devem verificar versões/compatibilidade ao instalar e registrar mudanças de decisão.

| Problema e opções comparadas documentalmente           | Decisão e motivo                                                                                 | Concessão/limitação                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Vite SPA versus Next com SSR                           | Vite: React é exigido; SSR não é requisito e não há necessidade inicial de um segundo framework  | SEO por projeto e fallback de URLs exigem atenção; T07 configura rewrites sem capturar `/api` |
| JavaScript versus TypeScript                           | TypeScript estrito para conferir contratos entre tarefas                                         | Tipos não validam respostas HTTP; acrescentar validação nas fronteiras                        |
| CSS Modules versus Tailwind                            | CSS Modules, com tokens CSS, evita ferramenta e convenção adicionais                             | T02 mantém consistência dos tokens e componentes                                              |
| Cache manual versus TanStack Query                     | Query em T03, para compartilhar dados entre lista e detalhes sem duplicar controle de expiração  | Dependência extra só entra quando usada; política definida em CONTRACTS.md                    |
| Validação manual versus React Hook Form/Zod            | RHF/Zod em T04/T05 para mensagens por campo e regras no cliente/servidor                         | Limites de campos são decisões locais, não exemplos obrigatórios do professor                 |
| Supabase/Postgres versus Firebase                      | Supabase para mensagens/destaques relacionais e políticas por proprietário                       | RLS e migrações precisam de testes reais; serviço ainda não configurado                       |
| Vercel Functions versus servidor separado              | Functions no mesmo projeto, alinhadas ao destino de entrega                                      | Preview do Vite não executa Functions; integração requer ambiente próprio em T04/T07          |
| Playwright versus duas suítes iniciais                 | Uma suíte Playwright sobre o build; adicionar teste de lógica apenas quando necessário           | Chromium desktop/mobile agora; outros engines e integrações reais ficam para T06              |
| TypeScript mais recente versus compatibilidade do lint | TypeScript 6.0.3: typescript-eslint 8.72.0 declara suporte `<6.1.0`; latest consultado foi 7.0.2 | Atualizar por tarefa explícita; não usar latest indiscriminadamente                           |

Comparações acima são análise de requisitos e documentação, não benchmarks de alternativas nem declaração de familiaridade do aluno. Evidência: consultas npm de versions/engines/peerDependencies e checks da fundação no handoff T01. Referências primárias: [Vite](https://vite.dev/guide/), [Router declarativo](https://reactrouter.com/start/declarative/installation), [servidor de testes Playwright](https://playwright.dev/docs/test-webserver).

## Contratos iniciais fechados

Documento normativo inicial: [CONTRACTS.md](CONTRACTS.md), com tipos em `shared/contracts.ts` e rotas em `src/app/routes.ts`. Implementações são das tarefas consumidoras; alterações incompatíveis precisam ser registradas antes de integração. Os tópicos cobertos são:

1. Rotas públicas, rotas privadas e identificação de projetos.
2. Tipos Project, ContactSubmission, ContactResult e Message.
3. Esquema de mensagens e destaques; política de proprietário único.
4. Estados de contato: salvo/notificação aceita/falha parcial; retries sem duplicação.
5. Chaves e política de cache; invalidação de destaques e limpeza de dados privados no logout.
6. Componentes, tokens de tema e validação de campos.
7. Comandos, runtime, organização de diretórios e ambientes.

## Dados

- GitHub é a origem dos projetos. O banco guarda somente seleção/ordem de destaques e dados administrativos necessários.
- Mensagens são privadas e persistentes; tema é preferência local do navegador.
- Status de mensagem respondida e status de notificação são conceitos diferentes.
- Recebimento pelo provedor de e-mail não prova entrega na caixa de entrada; demonstração deve verificar mensagem real.
- A sessão é verificada antes de redirecionar; ocultar UI não protege os dados.

## Organização adotada

Criados: src/app (shell/rotas), src/styles (tokens globais), shared (contratos), tests/e2e, docs e CI. Reservados para quando houver implementação: src/components (UI/layout), src/features (projects/contact/auth/dashboard), src/services, src/hooks, shared/schemas, api, supabase/migrations. Não criar pastas vazias como evidência de implementação.

## Critério para adotar decisões

Cada decisão relevante registra: problema, opções realmente comparadas, escolha, motivo, limitação aceita, impacto nos contratos, data e evidência. Não apresentar sugestão como escolha já validada.

## Fora do escopo inicial

Chatbot no site, CMS completo, administração multiusuário, microsserviços, fila complexa, 3D obrigatório. Podem ser reconsiderados somente se houver benefício demonstrado sem comprometer requisitos e prazo.
