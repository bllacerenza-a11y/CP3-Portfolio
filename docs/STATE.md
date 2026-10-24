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
| T00 | Coordenação ativa; proposta T02.1 revisada |
| T01 | Base local integrada; EM REVISÃO para CI remoto |
| T02 | Escopo original UI/tema concluído; evolução visual solicitada como T02.1 |
| T03 | CONCLUÍDA no escopo local API/rotas/cache |
| T04 | CONCLUÍDA no escopo backend revisado; UI e runtime Vercel nas tarefas responsáveis |
| T02.1 | EM ANDAMENTO; proposta aprovada pela T00, implementação React liberada a partir da main com T04 |
| T05 | PLANEJADA após T02.1 e contratos T04 integrados |
| T06–T09 | PLANEJADAS conforme dependências; checks/documentação incrementais já existem |

Não iniciar T05 enquanto a evolução visual combinada estiver em avaliação. T02.1 reutiliza o chat T02; nenhuma conversa foi acionada pela T00 nesta revisão.

## Próxima ação

Usuário retoma T02 para implementar T02.1 em branch própria da main com T04 integrada, seguindo INTEGRACAO.md da proposta e os ajustes da revisão T00. Preservar contratos reais de auth/contato/dados, API/rotas/cache e tema; retirar rótulos internos do protótipo na aplicação. Depois revisar/integrar T02.1 antes da T05. Nenhuma implementação visual foi realizada pela T00 nesta revisão.

Briefing da proposta: CP3-T02.1-Briefing-Visual.md nos outputs da conversa coordenadora; protótipo isolado previsto em outputs/T02.1. Regras e referências essenciais também constam em TASKS, seção T02.1. O usuário autorizou elevar o nível visual usando templates React, Bruno Simon e Awwwards como referências; isso é meta adicional do projeto, sem criar exigência acadêmica de 3D.

Proposta entregue em outputs/T02.1, fora do checkout, com PROPOSTA, INTEGRACAO, MIDIAS e HANDOFF. T00 leu documentos, inspecionou capturas home desktop claro/mobile escuro e detalhe Aether, navegou home→Aether/disclosure/tema/retorno, conferiu 53 hashes sem divergência e sintaxe JS. Relatório do executor registra 42 verificações/34 capturas; essa suíte inteira não foi repetida pela T00. Revisão em docs/handoffs/T00-revisao-T02-1-proposta.md.

## Pendências e limites

- UI de formulário/login/guard/dashboard e gestão de destaques persistidos ainda pertencem à T05. Não declarar R04/R05 ou R09 integralmente concluídos.
- Remoto GitHub/CI remoto, Vercel/deploy/rewrites, origens/segredos públicos por ambiente e IP/quotas no runtime hospedado pendentes. Vite preview não executa Functions.
- Resend usa remetente de teste onboarding@resend.dev e destinatário da própria conta. Produção/outros destinatários exigem configuração de remetente/domínio autorizada; não presumir que o teste comprova esse ambiente.
- Migration foi aplicada via SQL Editor; reconciliar histórico antes de usar fluxo CLI. Não reaplicar CREATE em banco já migrado.
- Recebimento deste teste não garante entrega futura. notified significa aceitação pelo provedor; failed/pending não são reenviados automaticamente. Duas mensagens sintéticas foram retidas, conforme evidência T04.
- Lighthouse, dispositivo físico, acessibilidade integral, testes finais de produção e vídeo pendentes.
- Usuário informou em 24/10 que SmartCameraStudy/PedroOliDev é privado e que contribuiu nele. Isso é compatível com o 404 anônimo, documentado pelo GitHub; T00 não realizou acesso autenticado ao repo. Contribuição detalhada e mídia pública autorizada continuam pendentes. Ser de outro dono não impede consultas públicas; privacidade requer acesso autorizado. Login web não autentica automaticamente API pública/Git nem torna dados privados publicáveis.
- Ao integrar a evolução visual, tratar a câmera conforme o contexto privado informado, sem simular metadados da API. Pode ficar como referência editorial secundária; os projetos públicos continuam atendendo à integração GitHub. Não colocar token GitHub no frontend; eventual apresentação pública mais completa depende de materiais autorizados pelo responsável.
- Foto, contato público, habilidades e função individual nos projetos ainda têm pendências; ano/horário de 03/11 não confirmados.

## Checkout e evidências

- Única alteração preexistente: última frase de docs/handoffs/T02-design-tema.md com erro de digitação, preservada sem staging. Não declarar checkout limpo nem sobrescrever essa edição.
- T04 estava idle antes da integração; um escritor por checkout. T00 alterou somente documentação da revisão.
- Revisão atual: docs/handoffs/T00-revisao-T04.md; código testado 212749d, implementação e2338e1. Commit de fechamento contém o estado acima e mantém histórico original.
- Revisão da proposta visual: docs/handoffs/T00-revisao-T02-1-proposta.md. O commit dessa revisão altera apenas coordenação, sem copiar o protótipo para o código da aplicação.
