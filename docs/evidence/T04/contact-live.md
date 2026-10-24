# T04 — contato com serviços reais

Verificado em 24/10/2026, aproximadamente 02:04–02:06 BRT, Windows/PowerShell, Node 24.20.0, npm 11.19.0, Playwright 1.64.1. Estado: branch `codex/t04-auth-contact`, base `e6cdc95` com teste opt-in/configuração/README locais desta rodada. Código de produto sem alteração nesta rodada.

## Acesso e configuração

Usuário autorizou criar a chave `CP3-Portfolio-T04`, com Sending access, salvá-la somente no `.env` local e enviar teste ao email da própria conta Resend. Nenhum domínio configurado: seletor All domains era a única opção. Capturas `resend-key-permission.jpg` e `resend-key-created.jpg` registram a permissão/listagem, sem chave completa.

A janela de chave única era protegida contra leitura pelas ferramentas. O usuário copiou pessoalmente o valor para `RESEND_API_KEY` no `.env` ignorado e confirmou que salvou. Remetente `onboarding@resend.dev`; destinatário da própria conta, não registrado aqui. Não houve exposição da chave em logs, código ou Git. A restrição do remetente de teste está documentada em [Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

## Resultado observado

`npm run test:contact-live` terminou com exit 0: **1 teste aprovado, 3,0 s**. Log: `contact-live.log`. Um servidor HTTP Node local efêmero executou o mesmo `createContactHandler` da Function e dependências reais; Supabase hospedado e HTTP Resend reais. Isso não verifica o runtime Vercel.

- Payload inválido: HTTP 400.
- Contato sintético válido: HTTP 201/notified e exatamente uma linha com `notification_status=accepted` no banco real.
- Repetição da mesma submissão: mesma resposta/ID, sem segunda chamada Resend.
- Mesmo ID com conteúdo diferente: HTTP 409, sem novo envio.
- Falha parcial controlada: chave omitida apenas da instância em memória do teste, HTTP 202/saved_notification_failed e mensagem preservada com status failed. Não representa indisponibilidade observada no Resend.
- Usuário confirmou no chat: **“Recebi o e-mail”**. Aceitação pelo provedor e recebimento pelo destinatário são evidências distintas, ambas obtidas nesta rodada; não foi feita leitura da caixa de entrada pelo agente.

Permaneceram duas mensagens explicitamente sintéticas no banco: uma notificada e uma de falha controlada. IDs/recibo de repetição ficam somente em `work/t04ContactReceipt.json`, ignorado. O teste é opt-in, fora da suíte padrão/CI, e não deve ser repetido sem intenção de usar serviços reais; replay conserva IDs, mas ainda conta na quota. Não há reenvio público automático da mensagem failed.

## Limites restantes

Checagem local final: `npm run check`, exit 0; lint/formato/tipos/build, 24 testes backend (6,5 s) e 48 execuções E2E Chromium desktop/mobile (13,5 s). Log `check-contact-live.log`. `git diff --check` passou. `git check-ignore .env work/t04ContactReceipt.json` confirmou ambos ignorados. Comparação em memória de SUPABASE_SECRET_KEY, RESEND_API_KEY e CONTACT_RATE_LIMIT_SECRET contra todos os JS em dist/assets retornou `serverSecretsAbsentFromClientBundle: true`; nenhum valor foi impresso.

UI/formulário/login/guard/dashboard pertencem à T05. Deploy, origens públicas, IP confiável/quotas e execução da Function no runtime Vercel pertencem à T07. Para outros destinatários, configurar e verificar domínio/remetente Resend e segredos por ambiente. Nenhum domínio foi comprado e nenhum deploy foi realizado. Main, STATE/THREADS e edição preexistente T02 preservados.
