# T00 — Revisão T07 — correção necessária

Data: 24/10/2026, America/Sao_Paulo. Produto 1263d471c0eaa10855477a8c1254362f72b9c7c8; entrega documental f3b2d97/65e8247. Main 59702f8 contém apenas o registro de publicação sobre a base 44f0ffc. Resultado: **não integrar o candidato até corrigir o achado abaixo**. T00 não alterou código, deploy, serviços ou migrações.

## Achado impeditivo de integração — R01, prioridade P2

vercel.json, rewrite source: a exclusão genérica de caminhos terminados em ponto/extensão também exclui nomes de repositórios aceitos pela rota /projetos/:owner/:repo. Reproduzido na URL canônica com revisão 1263d47:

- GET /projetos/vercel/next.js → HTTP 404 text/plain, página NOT_FOUND da Vercel antes do React.
- API GitHub /repos/vercel/next.js retornou o repositório público vercel/next.js; não é repositório ausente.
- GET /projetos/bllacerenza-a11y/GS_AETHER_EDGE → HTTP 200 HTML.
- Navegador integrado confirmou o 404 do host no primeiro caso. Captura própria outputs/CP3-T07-Rota-Com-Ponto-T00.png na pasta da coordenação.

Consequência: acesso direto/refresh de projeto público com ponto falha no host, apesar do contrato público genérico T03. Corrigir fallback de rotas de projetos sem transformar /api, /assets ou arquivos ausentes em HTML de sucesso. Uma regra explícita anterior para o formato de detalhe é uma possibilidade, não prescrição de implementação.

Reteste necessário: detalhe público com ponto via acesso direto e refresh no deployment novo; detalhe sem ponto; projeto ausente com ponto chegando ao erro recuperável da aplicação; /api/contact e API inexistente, /assets ausente, /.env e /work permanecendo corretamente tratados. Acrescentar verificação reproduzível da configuração de hospedagem: Vite preview/Playwright SPA sozinho não reproduz rewrites da Vercel. Checks/CI e deployment.json devem identificar o novo SHA. Atualizar evidências/handoff; não reutilizar resultado HTTP antigo como prova da correção.

## Verificações próprias aprovadas

- Diff de Function/imports ESM/parser, configuração, runtime test e identificação de deployment lidos. Imports .js compatíveis com emissão NodeNext; ApiError(400) normalizado com causa preservada sem serializar erro interno. Nenhuma mudança de RLS/schema/quotas.
- npm run check no código entregue: exit 0, lint/formato/tipos/build:test, 25 backend e 110 E2E (47,2 s), teste de Function ESM emitido aprovado. Log local work/t00-t07-check.log. npm run build posterior exit 0, dist de produção restaurado antes da troca para branch documental da main.
- GET canônico /deployment.json → production/1263d47; /api/contact → 405 JSON. Sem POST válido, envios ou login do dono repetidos pela T00.
- API pública do GitHub confirmou CI 40113449290 completed/success no SHA 1263d47 e CI 40112531558 success no SHA documental main 59702f8. Log de deployment automático lido: clone main/59702f8. Repositório remoto público configurado.
- Relatório Lighthouse completo conferido: URL canônica, fetchTime 2026-10-24T16:52:30.529Z (13:52 BRT), versão 13.5.0, mobile/simulate, performance 0,98, LCP 2276,719ms, CLS 0. Não reexecutado pela T00; nota é desta execução, não garantia geral nem efeito causal do ajuste de servidor.
- Documentos de mídia/atribuições e operação/reconciliação lidos. Repair CLI continua pendente e condicionado à conferência completa; T07 não executou repair. Migrations já aplicadas manualmente não devem ser reaplicadas.
- SHA da edição preexistente T02 conferido: F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159, fora do staging/commits.

## Limites e passagem

Contato válido e UI/JWT do dono na origem Vercel continuam não verificados; evidência integrada real anterior é da T06/local Node. Não confundir respostas inválidas 400/405 com prova de persistência/entrega no host. T08 deve avaliar esses critérios antes do aceite final; não repetir mensagens por rotina. Quotas/rollback/dispositivo físico/acessibilidade integral mantêm os limites do handoff.

Usuário retoma CP3 · 07 — Performance e deploy, reaproveitando codex/t07-performance-deploy. Ler esta revisão da main local e integrar os documentos da coordenação à branch sem sobrescrever T02. Corrigir/testar/publicar candidato e retornar evidências. Não avançar T08 como fechamento aprovado ainda.

**Não fazer push da main anterior à integração do produto T07:** o gatilho Git pode substituir a produção atual pelo produto anterior sem as correções hospedadas. Esta rodada atualiza apenas coordenação local, sem push. Nenhum outro chat acionado automaticamente.
