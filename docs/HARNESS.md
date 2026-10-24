# Harness mínimo — T01

Estado em 23/10/2026. Inventário sanitizado: este documento e os arquivos de projeto não incluem sessões, tokens ou contas.

| Categoria                   | Estado observado                            | Evidência e limite                                                                                                                           |
| --------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Instruções                  | Configuradas e usadas                       | AGENTS.md, CLAUDE.md, handoff e documentos de tarefa lidos em T01; padrões locais no README                                                  |
| Skills externas pesquisadas | Pesquisadas, sem instalação/execução na T01 | SKILLS_RESEARCH.md reaproveitado; não copiar pacotes nem scripts sem avaliação de origem, revisão, licença e dependências                    |
| Ferramentas                 | Usadas nesta tarefa                         | exec_command para Git/npm/checks; apply_patch para edição; web para documentação primária; inspeção no navegador registrada no handoff       |
| Conectores/MCPs de serviços | Nenhum serviço do portfólio configurado     | GitHub remoto, Supabase, e-mail e Vercel pendentes. Ferramenta disponível no Codex não equivale a serviço conectado/configurado pelo projeto |
| Agentes                     | Executor único T01                          | Nenhum subagente acionado na T01; chats T02–T09 não foram reiniciados. Não há configuração local de agentes customizados                     |
| Modelo                      | Sem mudança de configuração pela T01        | Consultada MODEL_POLICY.md; não atribuir modelo diferente sem confirmação da ferramenta. Política e escolha da interface são distintas       |

## Fluxo reproduzível

1. Ler AGENTS, handoff geral, STATE e tarefa relevante; conferir status/branch Git.
2. Abrir branch por tarefa; registrar decisões e contratos antes de consumidores editarem.
3. Executar npm ci, instalar Chromium com `npx playwright install chromium`, implementar dentro do escopo e rodar `npm run check`.
4. Inspecionar o build no navegador; registrar observação separada dos testes e de integrações reais.
5. Atualizar handoff individual com comandos, revisão, resultados e pendências; T00 atualiza o estado canônico.

Nenhum MCP de banco nem skill adicional é necessário para rodar a fundação. G02 continua pendente de demonstração final das categorias realmente usadas; inventário não equivale ao vídeo entregue.

## Aplicação na T02

Em 23/10/2026, T02 aplicou `frontend-design` como orientação textual, após leitura integral do SKILL.md e licença, conferência do inventário e fixação do SHA. Não houve instalação, cópia de pacote, script externo nem dependência adicional. Avaliação, adaptação às instruções do usuário e plano em T02_DESIGN.md; verificações em handoffs/T02-design-tema.md.

Execução T02: um escritor na branch `codex/t02-design-theme`; nenhum novo subagente ou outro chat acionado na implementação. A tentativa histórica de subagente na contextualização inicial falhou por limite de uso e não produziu entrega. Ferramentas: Git/npm, edição de arquivos, consulta pública GitHub, navegador do aplicativo e suíte Playwright versionada. Nenhuma conta GitHub autenticada foi usada, nenhum serviço publicado e nenhum modelo da conversa alterado por ferramenta.

## Aplicação na T03

Em 23/10/2026, Vercel React Best Practices aplicada como orientação textual à integração GitHub: revisão `063bee94c3f4df8453406c830b0a7df0f2860278`, avaliação e adaptações em T03_GITHUB.md. Nenhuma skill instalada ou copiada, nenhum script externo executado. TanStack Query 5.104.5 é dependência da aplicação, já prevista na arquitetura; não é instalação de skill. Git/npm, API pública sem autenticação, documentação oficial, edição local, suíte Playwright e navegador do aplicativo foram usados. Somente T03 ativa na execução; nenhum subagente ou outro chat acionado nesta rodada. STATE/THREADS continuam sob responsabilidade da T00. A contextualização histórica desta conversa não constitui entrega de implementação.

## Aplicação na T04

Supabase Postgres Best Practices aplicada textualmente após avaliação de origem, revisão c9be0e931b7930f7d02126d04774d904c381e7d7, MIT, versão 1.1.1, inventário e sete referências de SQL/segurança. Detalhes em T04_BACKEND.md. Nenhuma coleção de skill instalada ou script externo executado. Supabase JS/Zod são dependências de produto; PGlite é somente teste local. Ferramentas: Git/npm, documentação primária, edição, Playwright (Postgres WASM, Auth/email sintéticos e regressões E2E) e navegador do aplicativo para conferir a home. Nenhuma conta/serviço do portfólio configurado, nenhuma mudança de modelo por ferramenta. Somente T04 ativa nesta execução; nenhum novo subagente ou outro chat acionado. A contextualização histórica não representa esta implementação. STATE/THREADS preservados para T00.
