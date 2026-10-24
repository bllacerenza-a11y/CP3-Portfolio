# T00 — Revisão T06 e passagem para produção

Data: 24/10/2026, America/Sao_Paulo. Base e512bde; código 84e45560ea55c16ad38ef606c68daf952932ace5; handoff/evidências 25ef39c. Responsável T00. Nenhum código de produto/serviço alterado pela revisão.

## Análise e evidências

- Diff revisado: token de borda de campos, foco de fragmentos/repetição de âncora, testes de regressão, quatro workers e runtime opt-in de QA. Runtime fica no loopback, contato bloqueado por padrão, sem conteúdo/segredo no recibo. Não é runtime Vercel e não deve ser publicado.
- Migration incremental comparada à original: corpo preserva security invoker, search_path vazio, owner check, validação, advisory lock e transação. Acrescenta WHERE project_id > 0, abrangendo todos os IDs permitidos pela CHECK da tabela. Não altera grants/RLS nem migração inicial. CREATE OR REPLACE preserva grants existentes; ambiente novo deve aplicar ambas em ordem. Hash ADDD08EDB374D3C26ABC1123B99BB4A3BD710CB74029315B36B6A27DBDA793E3 conferido.
- Aplicação manual hospedada relatada e evidenciada: captura SQL com cinco flags true (invoker/predicado/grants). T00 inspecionou a captura, sem reaplicar migration ou consultar credenciais. PGlite executa ambas migrations em sequência e testa autorização/reorder/remoção/rollback; não reproduz pg_safeupdate.
- Índice, real-state-final.json e amostras de capturas reais abertos: cartão T06 não respondido, destaques intermediários Melodia→Aether e grants. Estado final registrado: 3 mensagens, 1 T06 accepted/não respondida, highlights []; recibo 1 POST/1 chamada Resend/201. Dados de servidor final são leitura administrativa separada da prova UI/JWT.
- Handoff documenta UI/JWT do dono em sessão/reload/logout, respondida/desfeita, seleção/ordem/home/reload/[] e restauração. T00 conferiu registro do chat T06: usuário realizou login e confirmou literalmente “o email chegou”. Não repetiu login, mensagens administrativas, SQL ou envio externo nesta revisão.
- Navegador próprio em 4186, runtime local de produção: login anônimo, Enter em Contato focou a seção e Tab focou Nome; catálogo público e destaques vazios observados. Captura própria em outputs/CP3-T06-Revisao-T00.png na pasta da coordenação, fora do checkout. Sem submissão.

## Verificação local e resultado

Aprovada para integração local, sem achado impeditivo no escopo inspecionado. npm run check próprio: exit 0, lint/formato/tipos/build:test, 25 backend (4,9 s) e 110 E2E (38,6 s). npm run build posterior: exit 0; dist de produção restaurado. A primeira chamada de check teve saída extensa truncada na orquestração; não usada como resultado final. Rodada com log local explícito em work/t00-t06-check.log é a referência reproduzida pela T00. Nenhum teste externo com efeitos faz parte de npm run check.

Edição preexistente docs/handoffs/T02-design-tema.md com SHA F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159 preservada fora do staging/commits.

## Limites e próxima ação

R04/R05 têm aceite integrado local com Supabase/Resend reais nesta T06; produção ainda requer verificação no host correto. Não declarar Lighthouse, CI remoto, deploy/rewrites, rede/IP/origens/quotas/duração Vercel ou auditoria WCAG integral aprovados. Recebimento único não garante entregas futuras. Remetente de teste e licenças/mídias mantêm pendências anteriores.

Após integração, usuário pode iniciar CP3 · 07 — Performance e deploy sobre main atualizada. Preparar remoto público/CI/Vercel, build de produção, segredos por ambiente, SPA fallback preservando /api, runtime Function e origens/quotas; medir Lighthouse mobile >=80 com relatório/condições e comprovar deploy automático em push main. Conferir assets/licenças antes da publicação. Não publicar work, dist sintético, credenciais ou capturas de sessão.

As duas migrations já foram aplicadas manualmente no Supabase existente; reconciliar histórico antes do fluxo CLI e nunca reaplicar o CREATE inicial por rotina. Estado real ao encerrar T06: três mensagens e highlights vazios; não apagar/reseed/repetir envios apenas para reproduzir evidências. T08 faz auditoria independente após T07; T09 documentação/vídeo. Nenhum outro chat acionado pela T00.
