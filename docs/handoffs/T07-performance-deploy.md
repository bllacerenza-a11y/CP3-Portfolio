# T07 — Performance e deploy — candidato para T00

## Retomada após T00-revisao-T07 — correção de R01

24/10/2026, America/Sao_Paulo. **Novo produto candidato: 5cd7834c7a8a91e6cceb6b87d5423c7658988cb3**, publicado e pronto para nova revisão T00. PR #1 continua rascunho. Documentação/evidências posteriores ao produto não alteram o bundle.

- Branch retomada: `codex/t07-performance-deploy`; documentos da main local **ec372a9** incorporados pelo merge **6b029e1**. Não houve alteração própria de STATE/THREADS, integração do produto na main nem push da main. Remota continua **59702f8**.
- Causa confirmada pelo novo probe: a exclusão genérica de extensões devolvia 404 do host para `/projetos/vercel/next.js` e `/projetos/vercel/cp3-t07-missing.repo` (17/19 verificações aprovadas sobre 1263d47).
- Correção: regra explícita `/projetos/:owner/:repo` antes do fallback genérico. Aceita ponto no nome do repositório; mantém as exclusões fora desse formato. Caminho adicional `/projetos/vercel/next.js/package.json` continua sendo arquivo ausente/404.
- Novo comando opt-in **`npm run test:hosting -- <URL> <SHA-completo> [relatório.json]`**, sem novas dependências: verifica a configuração no host real com GET somente. Comprova status, shell React, tipos, exclusões, asset real e SHA; não substitui o navegador para conteúdo de API.
- **Depois: 19/19** na URL canônica, metadata production/5cd7834. Next.js real por acesso direto/refresh; ausente com ponto chega ao erro da aplicação com “Consultar novamente” nas duas entradas; Aether sem ponto também aprovado no navegador.
- Exclusões `/api`, API inexistente/com extensão, `/assets`, assets ausentes, `/.env`, `/work`, arquivos ausentes e caminho extra após detalhe: preservadas. GET `/api/contact` permanece 405 JSON/Allow POST/no-store. Nenhum POST.
- `npm run check`: exit 0, lint/formato/tipos, 25 backend (4,7s), ESM emitido e 110 E2E (43,1s). `npm run build` posterior exit 0. Logs e relatórios novos em **docs/evidence/t07-route-fix/**, separados dos antigos.
- CI de produto: [push 40138514973](https://github.com/bllacerenza-a11y/CP3-Portfolio/actions/runs/40138514973) e [PR 40138517675](https://github.com/bllacerenza-a11y/CP3-Portfolio/actions/runs/40138517675), ambos completed/success no SHA 5cd7834.
- Produção canônica: https://cp3-portfolio-peach.vercel.app. Imutável: https://cp3-portfolio-peem2adix-neox5.vercel.app. Preview do produto: https://cp3-portfolio-by1vnlkuo-neox5.vercel.app. Deploy via CLI da branch, Vercel Ready; nenhuma alteração de configuração/env/Function/serviços nesta retomada.
- Edição T02 permanece fora dos commits, hash **F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159**. Nenhum envio real, login do dono, migration/repair ou escrita no banco. Limites de contato hospedado e histórico CLI mantidos.
- Lighthouse 98 abaixo é **histórico de 1263d47**, não reexecutado nesta correção restrita ao rewrite. As evidências antigas foram preservadas e não são usadas como prova da correção.

Próximo passo T00: revisar o novo diff e pacote, conferir SHA/CI e rotas reais, decidir integração antes de qualquer push da main. Não avançar T08 como aprovada automaticamente. Fonte do achado preservada em docs/handoffs/T00-revisao-T07.md.

## Registro histórico da primeira entrega — 1263d47

Atualizado em 24/10/2026, America/Sao_Paulo. Chat CP3 · 07 — Performance e deploy (`01a1677e-a6c4-7ba0-b647-15f4cbb51410`). Estado: **pronto para revisão T00, com limites de produção explicitados abaixo**. Não equivale à aprovação/integração da T00 nem à auditoria T08.

## Escopo e código

- Base solicitada/conferida: `main` **44f0ffc1f3e0c2610ef1e6789d80dbc046474257**.
- Checkout: `C:\Users\bruno\Documents\Codex\CP3-Portfolio`.
- Branch: `codex/t07-performance-deploy`. Candidato de produto publicado: **1263d471c0eaa10855477a8c1254362f72b9c7c8**. O commit posterior de handoff contém documentação/evidências, sem nova alteração de produto.
- Commits de produto: 727264e (configuração/identificação), 1efe407 (imports ESM e teste emitido), 7d9eb1f (parser Vercel), 1263d47 (preservação da causa exigida pelo lint).
- Para provar o gatilho Git sem integrar antecipadamente T07, a main recebeu somente **59702f8aa5f5e0ade9a1c53f9a3a2c1f3563513d**, que adiciona `docs/PUBLICATION.md`. O push gerou deployment automático. Esse registro foi integrado à branch T07; diff de revisão: `main..codex/t07-performance-deploy`.
- A edição preexistente `docs/handoffs/T02-design-tema.md` permanece fora do staging/commits, SHA256 **F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159**. STATE/THREADS não foram alterados. Nenhum outro escritor foi iniciado.
- Dependências de entrada: AGENTS, HANDOFF, STATE, CONTRACTS, ARCHITECTURE, T07, REQUIREMENTS e revisões/handoffs T06. Nenhuma nova dependência de runtime nem pacote de skill instalado. Vercel 65.2.0 e Lighthouse 13.5.0 usados via npx; autenticação CLI realizada com participação do usuário, sem copiar tokens para o projeto.

## URLs e ambientes

| Ambiente | URL / revisão | Resultado |
| --- | --- | --- |
| GitHub público | https://github.com/bllacerenza-a11y/CP3-Portfolio | Histórico original preservado; origin HTTPS configurado; sem force-push |
| Produção canônica | https://cp3-portfolio-peach.vercel.app | `deployment.json` identifica 1263d47/production |
| Produção imutável | https://cp3-portfolio-b3qm91njg-neox5.vercel.app | CLI indicou Ready; Node 24/Hobby |
| Preview do candidato | https://cp3-portfolio-kdjf1umpp-neox5.vercel.app | 1263d47/preview; aviso de ambiente/revisão observado e capturado |
| Deployment automático de main | https://cp3-portfolio-b18ebsgg3-neox5.vercel.app | 59702f8; build log registra clone da main e commit; Ready |
| Vercel projeto | https://vercel.com/neox5/cp3-portfolio | GitHub conectado, main como branch de produção; planos pagos/domínio não contratados |

Produção final foi publicada explicitamente pela CLI a partir da branch candidata, para revisão. A main conserva o produto anterior e somente o registro documental de publicação. **Um novo push na main antes da integração T07 pode substituir a produção pelo produto anterior, que ainda não possui estas correções de hospedagem.** T00 deve revisar e integrar T07 antes de novos pushes de produto na main.

## Implementação e problemas efetivamente corrigidos

| Mudança | Razão e verificação |
| --- | --- |
| `vercel.json` | Vite/Node 24, npm ci/build/dist, 30s para Function; fallback SPA preserva `/api`, `/assets` e caminhos com extensão. HTTP real confirmou rotas e 404 de recursos ausentes |
| `vite.config.ts`, App | Emite `deployment.json` com ambiente/SHA; preview exibe aviso. Sem contratos funcionais alterados |
| `.vercelignore` | Exclui .env, work, dist local, node_modules, .git, testes e diagnósticos do upload CLI. Só build remoto normal é publicado |
| Imports `.js` no grafo servidor | Deployment original devolvia 500/ERR_MODULE_NOT_FOUND para server/contact; Node ESM do host não resolve imports emitidos sem extensão. Corrigido e comprovado em GET real 405/POST inválido 400 |
| Parser HTTP | JSON malformado no helper Vercel lança ApiError com statusCode 400, em vez de SyntaxError; resposta original 503 corrigida para 400. Cause preservada, erro interno não serializado. Regressão no teste de servidor |
| `scripts/checkFunctionRuntime.mjs`, package.json | Novo `npm run test:runtime` incluído em npm test/check/CI: compila o grafo NodeNext e executa JavaScript emitido, sem loader TS, GET 405 + inválido 400, configuração sintética e sem escrita externa |
| Operação e mídias | Procedimento de ambientes/restauração em T07_DEPLOY; fonte exata da foto e licenças em MEDIA_LICENSES |

Não houve troca de stack, micro-otimização sem medição, alteração de schema/RLS/quotas, novo remetente ou modificação do conteúdo editorial. A PNG Melodia tem 102.982 bytes, dimensões explícitas e carregamento lazy; o SVG autoral é pequeno/inline. Medições já satisfizeram a meta, sem alteração de imagem por rotina.

## Evidências e checks

Pacote versionado: `docs/evidence/t07/README.md`, logs, relatórios HTML/JSON e capturas. Ambiente local Windows/Node 24.20.0/npm 11.19.0; CI Ubuntu/Node 24/npm 11.19.0.

| Verificação | Resultado e revisão |
| --- | --- |
| `npm run check` final | exit 0; lint/formato/tipos, 25 backend, ESM emitido e 110 E2E; runner E2E 41,0s. Estado de produto equivalente a 1263d47, antes do commit; edição T02 presente mas não consumida pelo build |
| `npm run build` posterior | exit 0; dist sintético substituído pelo build normal. Log build-production |
| CI main inicial | https://github.com/bllacerenza-a11y/CP3-Portfolio/actions/runs/40111795231 — 44f0ffc, success |
| CI main do push real | https://github.com/bllacerenza-a11y/CP3-Portfolio/actions/runs/40112531558 — 59702f8, success |
| CI candidato | https://github.com/bllacerenza-a11y/CP3-Portfolio/actions/runs/40113449290 — 1263d47, completed/success |
| Histórico de falha CI | 7d9eb1f falhou no lint preserve-caught-error; corrigido em 1263d47, sem suprimir regra. Não tratar a execução falha como aprovada |
| HTTP real | 16/16: home/login/dashboard/detalhe/SPA404 servidos; API inexistente/assets/.env/work retornam 404; Function 405/400/403/415/413 corretos. Sem submissão válida |
| Navegador integrado | Preview com SHA; Aether com GitHub real por acesso direto e refresh; dashboard anônimo → login; 404 por acesso direto/refresh e retorno à home. Sem login do proprietário nesta rodada |
| Lighthouse | **Final 1263d47: 98**, LCP 2,3s, TBT 30ms, CLS 0; FCP/Speed Index 1,5s. Lighthouse 13.5.0/Chrome 156, mobile/throttling simulado/cache frio, URL canônica, 24/10 às 13:52 BRT. Meta >=80 satisfeita. Medição anterior 44f0ffc: 97; medição intermediária 7d9eb1f: 99. Variação não demonstra ganho causal das correções de servidor |
| Segredos | 340 blobs anteriores ao primeiro push sem correspondências pesquisadas; três segredos ausentes dos nove JS do build local e dos recursos iniciais hospedados. .env/.env.local/.vercel/work ignorados; somente URL/chave publishable no cliente. Inspeção limitada, não auditoria completa |
| Mídias | Foto Pexels 7586265 identificada e comparada visualmente com captura Melodia; uso em websites conferido na licença, crédito mantido. Nenhum material privado da câmera copiado; seis dependências diretas declaram MIT. Nenhuma licença geral inventada para código em equipe |

## Serviços, migrações e dados preservados

- Produção: duas variáveis públicas e sete variáveis de servidor, configuradas na Vercel sem valores em logs/commits; segredos classificados Secret. CONTACT_ALLOWED_ORIGINS contém somente a origem canônica exata. Comparação da configuração pública baixada com .env local: ambas iguais.
- Preview: somente URL/chave publishable públicas; nenhum segredo de banco/Resend/contato copiado. Contato do preview fecha com 503 sem servidor configurado; não é aceite do contato. Leituras públicas usam o mesmo banco autorizado, sujeito a RLS.
- Remetente existente permanece `onboarding@resend.dev`, limitado ao email da própria conta. Não se configurou domínio/remetente verificado nem se promete entrega futura.
- Conferência de migrações somente leitura: corpos de is_portfolio_owner, replace_highlights e save_contact iguais aos arquivos versionados (hash normalizado); predicado incremental, grants inspecionados e dados preservados. Evidência `migrations-readonly.sql`. Um erro de edição/concatenação da segunda consulta produziu somente erro de sintaxe; consulta corrigida em editor novo retornou três true, sem executar escrita.
- **Histórico CLI não existe no banco atual.** Mapeamento manual reconciliado com os arquivos/corpos observados, mas não se criou/alterou tabela de histórico. Nenhuma CLI Supabase, db push, reset, reaplicação ou seed foi executado. Antes de adotar CLI Supabase, realizar repair das duas versões após conferência completa de schema/grants conforme T07_DEPLOY; não marcar como já reparado.
- Leitura final separada: três mensagens; highlights públicos vazios. A primeira tentativa de contar destaques pela coluna id foi rejeitada (tabela usa project_id); conferência correta com publishable/project_id retornou 0. Nenhum dado foi modificado.
- Nenhum envio Resend/submissão válida, replay, remoção, mudança de respondida ou destaque nesta T07. Aceite de entrega real/UI/JWT continua sendo a evidência T06; esta rodada verifica o novo runtime sem efeitos externos.

## Limites e próxima ação T00

- R01/rotas hospedadas, R08/meta Lighthouse, R10/push main e G01/repositório público possuem evidências. R09/R12/CI têm a suíte ampliada; revisar o CI final.
- Sucesso válido de contato/persistência/entrega **no runtime Vercel**, login/JWT do dono na origem pública, esgotamento real de quota e configuração Site URL/redirecionamentos não foram novamente testados. Não declarar aceite integral R04/R05 em produção. O login usa email/senha, sem callback/magic link. A T07 não expandiu esse fluxo.
- Deduplicação GitHub e lazy chunks foram comprovados pela suíte com respostas controladas e inspeção de build; houve navegação real, mas o navegador integrado não expôs Resource Timing. Sem contagem própria real de chamadas, dispositivo físico, auditoria WCAG integral ou vídeo.
- Restauração documentada em T07_DEPLOY. Deployment anterior 7d9eb1f (`cp3-portfolio-l8wdrcwib-neox5.vercel.app`) passou HTTP/Lighthouse, mas tem o lint falho já corrigido; não confundir com candidato CI aprovado. Guardar a URL imutável 1263d47 como referência funcional para restauração futura. Rollback não executado, não reverte banco/env. Não restaurar os deployments main antigos sem considerar Function/fallback incompletos.
- T00 deve ler o diff, evidências e limites, conferir a URL canônica/deployment.json e CI, decidir sobre um único aceite de contato válido hospedado se necessário e integrar a branch. Depois T08 faz auditoria independente e T09 fecha documentação/vídeo. Não iniciar outros chats automaticamente.

> T07: candidato publicado e evidências prontas para revisão. Produto 1263d47; main recebeu apenas registro documental 59702f8 para comprovar deploy automático. Checkout mantém edição T02 intacta. Conferir relatórios finais/CI, limites de contato hospedado e requisito de repair antes de futura CLI Supabase. Handoff e pacote em docs/handoffs/T07-performance-deploy.md e docs/evidence/t07.
