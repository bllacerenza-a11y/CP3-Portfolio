# Evidências T06 — 24/10/2026

Contexto, sequência, achados e limites em [handoff T06](../../handoffs/T06-qa.md). Checkout Windows canônico, base `e512bde`, branch `codex/t06-qa`.

| Arquivo | Natureza e interpretação |
| --- | --- |
| `check.log` | Check final automatizado; servidor/PGlite e HTTP sintético dos E2E. Não envia e-mail nem autentica conta real |
| `focused.log` | 22 execuções direcionadas de evolução visual, apresentação e qualidade após ajustes de foco |
| `backend-migrations.log` | 25 testes com todas as migrations locais aplicadas em ordem; PGlite não reproduz pg_safeupdate |
| `build-production.log`, `build-runtime.log` | Builds reais de produção em dist e work/t06-production; sem configuração sintética |
| `fixture-dashboard-*.png` | Capturas **sintéticas**, geradas pela suíte. Nomes/dados não são mensagens do serviço hospedado |
| `real-home-1440-light.png`, `real-home-320-dark.png` | Home observada no navegador integrado com API GitHub real |
| `real-aether-390-dark.png` | Detalhe real com disclosure aberto por teclado; refresh também exercitado no fluxo |
| `real-contact-390-dark.png` | Feedback da única submissão T06, com campos limpos e aceitação da notificação; recebimento confirmado pelo usuário no chat |
| `real-message-responded.png` | Apenas o cartão sintético T06 lido da UI autenticada real, após marcação/reload; não contém dados das mensagens T04 |
| `real-message-restored-390.png` | Cartão T06 real novamente não respondido, em viewport de 390 px |
| `real-highlights-home.png` | Seleção temporária real Melodia → Aether na home após reload; **não representa a seleção final** |
| `real-highlights-restored.png` | Seleção vazia restaurada e observada publicamente após os testes |
| `supabase-migration-grants.png` | Resultado SQL real: invoker, predicado explícito e grants preservados, cinco flags true; corte exclui identificação da conta |
| `layout-real.json` | Geometria do dashboard autenticado real em quatro larguras e dois temas; sem texto privado, campos ou sessões |
| `real-state-final.json` | Conferência final **somente leitura**, por servidor/anon, separada do aceite JWT/UI: 3 mensagens, 1 T06 accepted/não respondida, highlights []; recibo de 1 POST/1 chamada Resend/201 |

As capturas reais foram abertas/inspecionadas pelo executor. A matriz de geometria não certifica todos os controles/estados nem substitui leitor de tela, dispositivo físico ou auditoria integral. Há imagens de estados intermediários intencionais; o estado final é o JSON e a captura `real-highlights-restored.png`.

A captura integral de Aether mostra o atalho fixo “Pular para o conteúdo” na composição da página rolada. A inspeção do viewport retornou foco no SUMMARY e borda inferior do atalho em -21,76 px, fora da tela, e não reproduziu essa sobreposição ao usar o disclosure. A aparência é compatível com um artefato da captura fullPage; não foi classificada como defeito visual reproduzido. A imagem é preservada sem retoque, com essa limitação explícita.

O processo de envio foi encerrado após a conferência. A prévia local foi reiniciada com contato bloqueado. Contagens do recibo são por processo; não reenviar para reproduzir evidência. Não há credenciais, tokens ou storageState neste pacote.
