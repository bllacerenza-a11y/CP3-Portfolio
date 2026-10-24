# Estado do projeto

Atualização: 24/10/2026, America/Sao_Paulo. Responsável: coordenação T00.

## Estado verificado

- Pasta canônica C:\Users\bruno\Documents\Codex\CP3-Portfolio; projeto cadastrado, coordenação e nove chats vinculados.
- T01 fundação (38484a4/f31726a), T02 UI/tema (9d7c883/e129e35) e T03 GitHub/rotas/cache (d961852/4d66cc4) revisadas e integradas pela T00. Evidências nos respectivos handoffs T00.
- T04: código inicial e2338e1 e evolução de testes/serviços até 212749d revisados pela T00. Migration/RLS, Auth do proprietário, serviços administrativos, API de contato, validação, idempotência, quotas e Resend implementados.
- T00 executou npm run check sobre 212749d: exit 0, lint/formato/tipos/build, 24 testes backend e 48 execuções E2E (24 cenários em dois perfis Chromium); runner E2E 23,4 s. Suíte padrão usa Postgres WASM e mocks Auth/email, sem envio real.
- Evidências adicionais T04: migration/proprietário provisionados no Supabase hospedado, login/restauração/logout reais, testes de outro usuário Auth real e probe SQL transacional. Roles reais com claims simulados não equivalem a todas as ações via JWT/UI.
- Contato real verificado pelo executor via adaptador Node local + Supabase/Resend: persistência, aceitação, repetição/conflito e falha parcial controlada. T00 conferiu registro e confirmação humana de recebimento no chat T04; não repetiu testes externos nem envios.
- Chaves/recibos ficam em .env/work ignorados. Busca limitada de padrões de segredos em arquivos versionados não encontrou correspondências; capturas Resend inspecionadas têm token mascarado, sem chave completa.
- Skills aplicadas textualmente: frontend-design/T02, Vercel React Best Practices/T03 e Supabase Postgres Best Practices/T04. Revisões/inventários registrados em T02_DESIGN, T03_GITHUB e T04_BACKEND. Nenhum pacote de skill instalado.
- Conteúdo confirmado: Bruno Bastos, estudante FIAP/Engenharia de Software/primeiro ano, conta pública bllacerenza-a11y; curadoria de três referências em T02_DESIGN.
- T02.1 React fbf34da, handoff 0a120d0, revisada pela T00: mídia/narrativa/editorial e catálogo compacto, câmera com contexto privado, APIs/cache/rotas/tema/T04 preservados. T00 repetiu npm run check: exit 0, 24 backend +60 E2E (21,8 s), lint/formato/tipos/build aprovados; navegador com dados públicos e interação Aether/tema/contexto privado conferido. Revisão em docs/handoffs/T00-revisao-T021-react.md. Integração local registrada no commit de fechamento desta revisão.
- T05 código 5628e24/handoff f85d22e revisados pela T00: contato, login/guard, painel lazy, mensagens/respondida e destaques implementados. Check próprio passou lint/formato/tipos/build:test e 25 backend; E2E inicial 103/104 com ERR_NO_BUFFER_SPACE em navegação Chromium. Repetição integral com quatro workers: 104 aprovados (42,5 s), sem mudança de código. Build de produção posterior aprovado e dist sintético substituído. Revisão em docs/handoffs/T00-revisao-T05.md, integração local no commit de fechamento.

## Situação das tarefas

Atualização posterior à devolução abaixo: produto **5cd7834**/handoff f6bec99 corrigiu R01 e foi aprovado para integração local pela T00. Probe próprio 19/19, lint aprovado, CI success do SHA conferido e navegador confirmou next.js direto/refresh com API real. Ver docs/handoffs/T00-revisao-T07-correcao.md. Produção CLI está corrigida; main remota/PR #1 ainda não receberam produto por merge/push desta revisão. Lighthouse 98 permanece relatório de 1263d47, frontend inalterado; não é medição nova.

T07 candidato 1263d47 publicado, entrega f3b2d97/65e8247 revisada: CI remoto success e Lighthouse mobile 98 conferidos; check próprio aprovado (25 backend +110 E2E e ESM emitido). **Correção necessária antes da integração:** rewrite exclui nomes de repo com ponto; /projetos/vercel/next.js retorna 404 do host. Ver docs/handoffs/T00-revisao-T07.md. Main tem somente registro documental 59702f8; não fazer push nela até integrar o produto T07, pois pode substituir a produção atual pelo produto anterior. Nenhum push/deploy feito pela T00 nesta revisão.

T06 84e4556/25ef39c revisada pela T00: correções de foco/contraste e migration incremental de destaques sem expansão de grants/RLS. Evidências UI/JWT e recibo de contato reais conferidos, incluindo confirmação humana de recebimento no chat T06. Check próprio: 25 backend +110 E2E, lint/formato/tipos/build aprovados; build produção posterior aprovado. Revisão em docs/handoffs/T00-revisao-T06.md. Nenhum envio/escrita externa repetido pela T00.

| Tarefa | Situação real |
| --- | --- |
| T00 | Coordenação ativa; T07 corrigida e aprovada localmente |
| T01 | Base integrada; CI remoto conferido na T07 |
| T02 | Escopo original UI/tema concluído; evolução visual solicitada como T02.1 |
| T03 | CONCLUÍDA no escopo local API/rotas/cache |
| T04 | CONCLUÍDA no escopo backend revisado; UI e runtime Vercel nas tarefas responsáveis |
| T02.1 | CONCLUÍDA no escopo local; React revisado/aprovado para integração à main |
| T05 | INTEGRADA localmente; aceite UI/JWT/contato real realizado na T06, produção pendente |
| T06 | CONCLUÍDA no escopo local/integrado real; produção e auditoria integral separadas |
| T07 | INTEGRADA localmente; publicada via CLI, merge/push remoto e limites de produção explícitos |
| T08 | LIBERADA para auditoria independente |
| T09 | PLANEJADA após auditoria; consolidação de documentação/vídeo |

A reavaliação T07 aprovou a correção do fallback. T08 liberada; nenhuma conversa acionada pela T00. Um escritor por checkout.

## Próxima ação

Usuário inicia CP3 · 08 — Auditoria independente sobre main integrada local e produção 5cd7834. Ler requisitos, esta STATE e docs/handoffs/T00-revisao-T07-correcao.md; auditar R01–R12/G01–G03, distinguindo aprovado/limite/não verificado. Priorizar contato válido/UI do dono na origem pública, situação PR/main remota e entrega documental/vídeo. Preservar T02 e não escrever código durante revisão; achados retornam ao executor. Não repetir envios ou reparar migrations por rotina.

Briefing da proposta: CP3-T02.1-Briefing-Visual.md nos outputs da conversa coordenadora; protótipo isolado previsto em outputs/T02.1. Regras e referências essenciais também constam em TASKS, seção T02.1. O usuário autorizou elevar o nível visual usando templates React, Bruno Simon e Awwwards como referências; isso é meta adicional do projeto, sem criar exigência acadêmica de 3D.

Proposta entregue em outputs/T02.1, fora do checkout, com PROPOSTA, INTEGRACAO, MIDIAS e HANDOFF. T00 leu documentos, inspecionou capturas home desktop claro/mobile escuro e detalhe Aether, navegou home→Aether/disclosure/tema/retorno, conferiu 53 hashes sem divergência e sintaxe JS. Relatório do executor registra 42 verificações/34 capturas; essa suíte inteira não foi repetida pela T00. Revisão em docs/handoffs/T00-revisao-T02-1-proposta.md.

## Pendências e limites

- R09 coberto por validação/bloqueio sem login. R04/R05 têm aceite UI/JWT do dono e contato UI→Node→Supabase/Resend reais na T06; runtime de produção permanece pendente. Negativas locais usam mocks/PGlite; evidência de outro JWT real pertence à T04. Não confundir esses ambientes.
- GitHub público/CI/Vercel/produção e Lighthouse 98 possuem evidências T07 conferidas; rewrite com ponto corrigido em 5cd7834. PR/main remota não receberam integração do produto nesta revisão. Contato válido/UI do dono no host e esgotamento de quota reais não verificados na T07. Vite preview não executa Functions.
- Resend usa remetente de teste onboarding@resend.dev e destinatário da própria conta. Produção/outros destinatários exigem configuração de remetente/domínio autorizada; não presumir que o teste comprova esse ambiente.
- Migration inicial e incremental 202610240001_highlights_safe_delete.sql aplicadas via SQL Editor; reconciliar histórico antes de usar fluxo CLI. Não reaplicar CREATE inicial em banco já migrado.
- Recebimento de teste não garante entrega futura. notified significa aceitação pelo provedor; failed/pending não são reenviados automaticamente. Estado final T06: três mensagens (duas T04 +uma T06 accepted/não respondida), highlights []; não remover/reseed/repetir envios por rotina.
- Lighthouse mobile medido 98 na T07/1263d47; dispositivo físico, acessibilidade integral, aceite final de produção e vídeo pendentes.
- Usuário informou em 24/10 que SmartCameraStudy/PedroOliDev é privado e que contribuiu nele. Isso é compatível com o 404 anônimo, documentado pelo GitHub; T00 não realizou acesso autenticado ao repo. Contribuição detalhada e mídia pública autorizada continuam pendentes. Ser de outro dono não impede consultas públicas; privacidade requer acesso autorizado. Login web não autentica automaticamente API pública/Git nem torna dados privados publicáveis.
- T02.1 trata a câmera como referência editorial secundária privada, sem metadados simulados ou consulta anônima; os projetos públicos continuam atendendo à integração GitHub. Não colocar token GitHub no frontend; eventual apresentação pública mais completa depende de materiais autorizados pelo responsável.
- Foto, contato público, habilidades e função individual nos projetos ainda têm pendências; ano/horário de 03/11 não confirmados.

## Checkout e evidências

- Única alteração preexistente: última frase de docs/handoffs/T02-design-tema.md com erro de digitação, preservada sem staging. Não declarar checkout limpo nem sobrescrever essa edição.
- T04 estava idle antes da integração; um escritor por checkout. T00 alterou somente documentação da revisão.
- Revisão atual: docs/handoffs/T00-revisao-T04.md; código testado 212749d, implementação e2338e1. Commit de fechamento contém o estado acima e mantém histórico original.
- Revisão da proposta visual: docs/handoffs/T00-revisao-T02-1-proposta.md. O commit dessa revisão altera apenas coordenação, sem copiar o protótipo para o código da aplicação.
- Revisão React atual: docs/handoffs/T00-revisao-T021-react.md; código fbf34da, handoff 0a120d0. T00 alterou somente coordenação nesta rodada; SHA da edição preexistente T02 permaneceu igual. Check de aplicação realizado antes destas mudanças documentais.
- Revisão frontend atual: docs/handoffs/T00-revisao-T05.md; código 5628e24/handoff f85d22e. T00 alterou somente coordenação; edição preexistente T02 permanece fora dos commits e com mesmo SHA. Nenhuma escrita administrativa/envio real nesta revisão.
- Revisão QA atual: docs/handoffs/T00-revisao-T06.md; código 84e4556/handoff 25ef39c. T00 alterou somente coordenação, preservando SHA T02; integração local registrada no commit de fechamento.
- Revisão hospedagem: docs/handoffs/T00-revisao-T07.md. T00 atualizou apenas coordenação na main local, sem integrar produto T07, push ou mudanças externas. Edição T02 permanece preservada.
