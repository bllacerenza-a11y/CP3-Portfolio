# T00 — Reavaliação T07 corrigida

24/10/2026, America/Sao_Paulo. Produto 5cd7834c7a8a91e6cceb6b87d5423c7658988cb3; handoff/evidências f6bec99. Base de coordenação ec372a9 incorporada à branch por 6b029e1. **Aprovada para integração local; achado R01 da revisão anterior resolvido.** Nenhum novo código de produto alterado pela T00.

## Evidências próprias

- Diff da correção lido: regra /projetos/:owner/:repo anterior ao fallback que exclui extensões. Demais mudanças são probe GET opt-in, script npm e documentação. Sem nova dependência, alteração de frontend, Function, env ou dados.
- npm run test:hosting -- https://cp3-portfolio-peach.vercel.app 5cd7834c7a8a91e6cceb6b87d5423c7658988cb3 work/t00-t07-route-fix.json: exit 0, 19/19, metadata/revisão corretos. Rotas de projetos com ponto recebem shell React; exclusões de API/assets/arquivos e caminho adicional após detalhe preservadas. GET da Function 405 JSON/Allow POST/no-store, sem POST.
- Navegador próprio: acesso direto e reload de /projetos/vercel/next.js carregaram metadados reais, linguagem JavaScript e link GitHub correto. Captura própria em outputs/CP3-T07-Rota-Corrigida-T00.png na pasta da coordenação. Não houve login ou envio.
- npm run lint próprio: exit 0. Não repetida suíte completa para mudança restrita à hospedagem/probe; a revisão anterior T00 já repetiu 25 backend/110 E2E/ESM emitido no produto 1263d47. Pacote novo registra check completo 25 backend/110 E2E e build em 5cd7834. API pública GitHub conferida: run 40138514973 completed/success no SHA 5cd7834.
- Lighthouse 98/13.5.0 mobile conferido anteriormente é histórico de 1263d47. Não houve medição nova da correção de rewrite; frontend inalterado. Não atribuir ao novo SHA um relatório que não o mediu.
- PR #1 continua open/draft, anexada a este chat; não houve merge remoto nem push da main pela T00. Integração desta rodada é local. O novo commit documental de fechamento identifica a main local resultante.
- Edição T02 preservada, SHA F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159, fora do staging/commits.

## Pendências e passagem

T08 liberada para auditoria independente da base integrada local e produção https://cp3-portfolio-peach.vercel.app (produto 5cd7834). Conferir REQUIREMENTS R01–R12/G01–G03 contra evidências; distinguir teste próprio, relatório existente e não verificado. Priorizar limites de contato válido e login/UI/JWT do dono na origem pública: não comprovados nesta T07, ainda que T06 tenha aceite real em Node local com Supabase/Resend. Nenhum envio válido repetido por rotina ou leitura com secret key substitui esse aceite.

PR/main remota ainda precisam receber o produto integrado; a prova anterior de deploy automático é do push documental 59702f8. Publicação CLI atual já contém a correção; antes de qualquer push/merge conferir SHA/CI e que main inclui T07, preservando histórico e edição local. Após futura promoção Git, verificar deployment.json/rotas no host. Esta revisão não altera produção nem declara PR integrada remotamente.

Histórico CLI Supabase não foi reparado; antes de futura CLI conferir schema/grants/RLS e equivalência, então repair das versões já aplicadas conforme T07_DEPLOY. Não reaplicar CREATE/reset/seed. Estado de referência: três mensagens e highlights vazios. Remetente de teste/rollback não executado/dispositivo físico/acessibilidade integral/vídeo mantêm limites anteriores. T09 consolida documentação/vídeo após achados T08. Nenhum outro chat acionado pela T00.
