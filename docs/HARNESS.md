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
