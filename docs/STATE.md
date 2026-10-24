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

## Situação das tarefas

| Tarefa | Situação real |
| --- | --- |
| T00 | Coordenação ativa; fechamento da revisão T04 |
| T01 | Base local integrada; EM REVISÃO para CI remoto |
| T02 | Escopo original UI/tema concluído; evolução visual solicitada como T02.1 |
| T03 | CONCLUÍDA no escopo local API/rotas/cache |
| T04 | CONCLUÍDA no escopo backend revisado; UI e runtime Vercel nas tarefas responsáveis |
| T02.1 | Aguardando o usuário trazer a proposta/handoff atualizado para revisão; implementação visual após integração T04 |
| T05 | PLANEJADA após T02.1 e contratos T04 integrados |
| T06–T09 | PLANEJADAS conforme dependências; checks/documentação incrementais já existem |

Não iniciar T05 enquanto a evolução visual combinada estiver em avaliação. T02.1 reutiliza o chat T02; nenhuma conversa foi acionada pela T00 nesta revisão.

## Próxima ação

Receber do usuário a tarefa T02 atualizada (T02.1), revisar a proposta e então coordenar sua implementação em branch própria a partir da main com T04. Preservar contratos reais de auth/contato/dados e regressões T03. Depois revisar/integrar T02.1 antes da T05.

Briefing da proposta: CP3-T02.1-Briefing-Visual.md nos outputs da conversa coordenadora; protótipo isolado previsto em outputs/T02.1. Regras e referências essenciais também constam em TASKS, seção T02.1. O usuário autorizou elevar o nível visual usando templates React, Bruno Simon e Awwwards como referências; isso é meta adicional do projeto, sem criar exigência acadêmica de 3D.

## Pendências e limites

- UI de formulário/login/guard/dashboard e gestão de destaques persistidos ainda pertencem à T05. Não declarar R04/R05 ou R09 integralmente concluídos.
- Remoto GitHub/CI remoto, Vercel/deploy/rewrites, origens/segredos públicos por ambiente e IP/quotas no runtime hospedado pendentes. Vite preview não executa Functions.
- Resend usa remetente de teste onboarding@resend.dev e destinatário da própria conta. Produção/outros destinatários exigem configuração de remetente/domínio autorizada; não presumir que o teste comprova esse ambiente.
- Migration foi aplicada via SQL Editor; reconciliar histórico antes de usar fluxo CLI. Não reaplicar CREATE em banco já migrado.
- Recebimento deste teste não garante entrega futura. notified significa aceitação pelo provedor; failed/pending não são reenviados automaticamente. Duas mensagens sintéticas foram retidas, conforme evidência T04.
- Lighthouse, dispositivo físico, acessibilidade integral, testes finais de produção e vídeo pendentes.
- SmartCameraStudy/PedroOliDev continua com 404 nas consultas registradas, causa não comprovada. UI trata ausência sem inventar dados.
- Foto, contato público, habilidades e função individual nos projetos ainda têm pendências; ano/horário de 03/11 não confirmados.

## Checkout e evidências

- Única alteração preexistente: última frase de docs/handoffs/T02-design-tema.md com erro de digitação, preservada sem staging. Não declarar checkout limpo nem sobrescrever essa edição.
- T04 estava idle antes da integração; um escritor por checkout. T00 alterou somente documentação da revisão.
- Revisão atual: docs/handoffs/T00-revisao-T04.md; código testado 212749d, implementação e2338e1. Commit de fechamento contém o estado acima e mantém histórico original.
