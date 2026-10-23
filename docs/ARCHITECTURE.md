# Arquitetura e decisões

Estado: proposta para discussão e validação em T01. Aplicação ainda inexistente.

## Princípios

Resolver todos os requisitos com uma aplicação pequena e explicável. Evitar dependências e abstrações sem necessidade. Componentes apresentam dados; serviços integram APIs; hooks organizam estados; servidor protege segredos; banco persiste mensagens e destaques.

## Stack candidata

React + TypeScript + Vite; React Router; TanStack Query; CSS Modules; React Hook Form e Zod; Supabase Auth/Postgres com RLS; Vercel Functions; Resend ou provedor equivalente; Playwright Test em TypeScript e testes de lógica/componentes quando necessários; ESLint e formatação automatizada.

Comparações a registrar: Vite/Next; CSS Modules/Tailwind; Supabase/Firebase; cache manual/Query; validação manual/schema. Critérios: familiaridade, prazo, comportamento exigido, manutenção, teste e desempenho. Registrar também o custo aceito de cada escolha.

## Contratos a fechar antes de paralelizar implementação

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

## Organização candidata

src/app (rotas/providers), src/components (UI/layout), src/features (projects/contact/auth/dashboard), src/services, src/hooks, src/styles, shared/schemas, api, supabase/migrations, tests, docs.

## Critério para adotar decisões

Cada decisão relevante registra: problema, opções realmente comparadas, escolha, motivo, limitação aceita, impacto nos contratos, data e evidência. Não apresentar sugestão como escolha já validada.

## Fora do escopo inicial

Chatbot no site, CMS completo, administração multiusuário, microsserviços, fila complexa, 3D obrigatório. Podem ser reconsiderados somente se houver benefício demonstrado sem comprometer requisitos e prazo.
