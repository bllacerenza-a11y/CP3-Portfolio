# T07 — Publicação e operação

Base: `44f0ffc`, branch `codex/t07-performance-deploy`. Estado e resultados da execução em `handoffs/T07-performance-deploy.md`; este documento descreve os procedimentos e decisões.

## Publicação

Repositório: https://github.com/bllacerenza-a11y/CP3-Portfolio. Preservar o histórico real; não fabricar commits antigos. GitHub Actions executa `npm run check` em push/PR com Node 24 e npm 11.19.0, banco WASM e provedores simulados, sem segredos dos serviços reais.

Vercel importa o repositório Git, usa `main` para produção e branches para preview. `vercel.json` fixa Vite, `npm ci`, `npm run build`, `dist` e 30 segundos para `/api/contact` (três chamadas sequenciais com timeout de 8s, mais margem). A Function continua Node 24 conforme engines. SPA fallback exclui `/api`, `/assets` e caminhos com extensão; recursos ausentes não recebem HTML de sucesso. `deployment.json` identifica ambiente e SHA; previews também exibem aviso na página. Nenhum build com `--mode test` deve ser publicado.

Não publicar `work`, diagnósticos, `.env`, sessões ou `dist` local. `.vercelignore` exclui esses itens de upload pela CLI; deploy Git compila o código, e somente `dist` mais a Function são servidos.

Correção após revisão T00: o detalhe `/projetos/:owner/:repo` tem regra explícita antes do fallback genérico, permitindo repositórios com ponto, como `vercel/next.js`. A exclusão de arquivos com extensão continua nas demais rotas. Um caminho adicional como `/projetos/vercel/next.js/package.json` não corresponde ao detalhe e continua 404 do host, assim como API/assets/arquivos ausentes.

Probe opt-in reproduzível no host real: `npm run test:hosting -- https://cp3-portfolio-peach.vercel.app <SHA-completo> work/hosted-routes.json`. Faz apenas GET, confere 19 casos (incluindo recurso real e ausente), shell React/tipos HTTP e SHA do deployment. Não roda em `npm run check`, pois depende de deployment externo já pronto; é executado após publicar. Navegador verifica separadamente o conteúdo obtido pela API e o refresh. Preview do Vite não substitui esse probe.

O deployment inicial expôs `ERR_MODULE_NOT_FOUND` em `/api/contact`: o Node ESM exige extensões nos imports relativos emitidos. A T07 usa `.js` nos imports do grafo servidor, resolvidos para TypeScript em desenvolvimento e JavaScript no host. `npm run test:runtime`, incorporado a `npm test`/CI, compila o grafo com NodeNext e executa o JavaScript emitido sem loader TS; verifica GET 405 e POST inválido 400 com configuração sintética e sem escrita externa.

## Ambientes e segredos

| Variável | Desenvolvimento | Preview | Produção |
| --- | --- | --- | --- |
| VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY | `.env` ignorado | públicas, somente ambiente autorizado | públicas, projeto hospedado conferido |
| SUPABASE_URL / SUPABASE_SECRET_KEY | servidor local | não copiar automaticamente | servidor, nunca VITE_ |
| CONTACT_RATE_LIMIT_SECRET | servidor local | chave própria quando habilitado | segredo de servidor >=32 caracteres |
| CONTACT_ALLOWED_ORIGINS | loopback exato | origem de preview explícita, se habilitada | URL canônica exata, sem barra final |
| RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL | servidor local | omitir até teste autorizado | servidor; respeitar restrição do remetente |

Preview não recebe segredo de serviço/e-mail por padrão. Pode usar os valores públicos para leituras permitidas por RLS; contato fecha com 503 sem configuração de servidor. Não confundir isso com aceite do contato de produção. Não autorizar `*.vercel.app` indiscriminadamente nem inferir origem por header enviado pelo visitante. A origem imutável de um deployment só envia contato se autorizada explicitamente.

O remetente atual `onboarding@resend.dev` só pode enviar ao destinatário da própria conta Resend. Isso permite o contato dirigido ao proprietário configurado, mas não demonstra domínio próprio/remetente verificado. Não contratar domínio ou serviço pago por rotina.

## Migrações existentes

As migrations `202610230001_portfolio.sql` e `202610240001_highlights_safe_delete.sql` já foram aplicadas manualmente. Não executar `db push`, `db reset`, seeds ou CREATE inicial no banco existente. SQL Editor não preenche o histórico da CLI automaticamente.

Antes de usar a CLI Supabase: conferir no banco correto o schema/grants/RLS e o corpo atual de `replace_highlights`, comparar com os dois arquivos versionados e consultar `supabase_migrations.schema_migrations`. Se ausentes e a equivalência for comprovada, registrar **apenas** as versões aplicadas com `supabase migration repair --status applied 202610230001 202610240001`, então executar `supabase migration list` e verificar que local/remoto concordam. Repair altera o histórico, não executa SQL da migration. Não marcar como aplicada por mera existência das tabelas. Se houver divergência, investigar primeiro e registrar uma migration de correção; não reexecutar CREATE inicial.

Referência: [histórico e migrations Supabase](https://supabase.com/docs/guides/deployment/database-migrations). A T07 não precisa executar CLI Supabase para publicar frontend/Function; qualquer reconciliação efetivamente realizada deve constar no handoff.

## Verificação sem efeitos externos

Depois de publicar, conferir `/`, detalhe Aether, `/login`, acesso anônimo a `/dashboard`, 404, acesso direto e refresh no navegador. Conferir que `/api/contact` devolve JSON/405 em GET; payload inválido na origem permitida deve devolver 400, origem não permitida 403 e tipo incorreto 415, sem persistência nem chamada ao Resend. Não usar submissões válidas/replays por rotina: também contam na quota. Confirmar IP da plataforma e quota pela implementação/teste isolado; não simular dezenas de envios no banco real.

Lighthouse: medir a URL de produção canônica, navegação mobile, cache frio, throttling simulado padrão e navegador identificado. Guardar HTML e JSON, versão da ferramenta, SHA, condições e métricas. Meta exigida de performance: >=80. Medir antes de otimizar; nenhum número local substitui o relatório do deployment real. Registrar também chunks privados fora do carregamento inicial, imagens/dimensões/loading e Network na navegação de volta a projeto em cache.

## Restaurar a versão anterior

1. Anotar o deployment atual, SHA, URL canônica e URL imutável anterior conhecida como funcional. Não remover deployments anteriores.
2. Na Vercel, abrir o projeto → Deployments → deployment de produção anterior → menu → **Instant Rollback**, quando disponível no plano/estado. Conferir o destino antes de executar. Isso altera o tráfego; não desfaz dados do Supabase nem env de outros deployments.
3. Se a ação não estiver disponível, usar `git revert <commit-do-problema>` em branch própria, passar checks/revisão e integrar/push na `main`; o vínculo Git gera outro deployment. Não usar reset/force-push nem reescrever histórico público.
4. Verificar `deployment.json`, rotas, `/api/contact` sem envio, assets e acesso anônimo após restauração. Registrar URLs/SHA/resultado. A Vercel pode pausar promoção automática após rollback; conferir e retomar a promoção somente com a correção validada.
5. Migrations exigem plano separado e compatibilidade com a versão restaurada; não apagar mensagens/destaques nem reverter schema automaticamente.

O procedimento é documentado; não alegar teste de restauração sem executar e registrar. Fontes: [deployments imutáveis e rollback](https://vercel.com/academy/vercel-foundations/deployments), [configuração Vercel](https://vercel.com/docs/project-configuration/vercel-json).
