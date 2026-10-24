# T00 — Revisão local T05

Data: 24/10/2026, America/Sao_Paulo. Responsável: coordenação T00.

## Identificação e escopo

Base edbd683; código 5628e24d56e2ccfc43f537854538b60613363ffb; handoff f85d22e. Revisão de ContactForm/Field, AuthArea/LoginForm/ownerAuth/useOwnerSession, painel/mensagens/destaques, serviços, build/configuração e testes pertinentes. T00 não alterou código nesta revisão.

Aprovada para integração local, sem achado impeditivo no escopo inspecionado. Integração local não equivale a aceite hospedado completo. R09 possui testes comportamentais de validação e bloqueio sem login; R04/R05 ainda dependem de comprovação conjunta UI/JWT/serviços reais, além das evidências backend T04.

## Análise

- Formulário usa schema T04, erros por campo/foco, bloqueio durante envio, UUID mantido em transporte/429 e campos preservados em falha. Parcial/pending não reenviam e-mail; nova mensagem é ação explícita. Aceitação não promete entrega na caixa.
- AuthArea aguarda identidade/permissão e somente owner monta Dashboard lazy. Visitante é redirecionado com replace, forbidden/erro permanecem fechados. Logout bloqueia imediatamente e limpa queries/mutations privadas; erro mantém bloqueio na navegação SPA.
- MessagesPanel descarta resultado privado de mutation, usa chave por usuário/página e gcTime 0. Marca somente responded_at; sem envio de e-mail administrativo. RLS/migrations/API não foram alterados.
- Destaques persistidos são separados da vitrine editorial. [] permanece vazio real; indisponibilidade permanece erro. Seleção usa Project real, ID conferido na home, ordem/remoção e invalidation compartilhados. Referências inacessíveis continuam removíveis. Rascunho não mescla alterações concorrentes, conforme limite documentado de proprietário único.
- SDK/PostgREST sem retry automático e timeout 8s, assinatura de serviços preservada. Modo test usa configuração pública sintética; produção exige npm run build, nunca publicar o dist gerado por check. Imports de Auth/SDK/painel sob demanda verificados pela suíte; isso não mede Lighthouse.
- Capturas fixture-dashboard-1440-light e fixture-contact-invalid-390-dark abertas e inspecionadas. Dados sintéticos identificados; sem corte/sobreposição impeditiva observada. Não são imagens de sessão real do proprietário.

## Verificação própria T00

- npm run check sobre f85d22e: lint/formato/tipos/build:test e 25 backend aprovados (4,7 s); E2E 103 passaram/1 falhou. Falha foi page.goto com Chromium ERR_NO_BUFFER_SPACE, antes das assertions do segundo caso do cenário 409/erro por campo; não foi falha de assertion da aplicação.
- Repetição da suíte completa com npm run test:e2e -- --workers=4: exit 0, 104 aprovados (42,5 s). Sem mudança de código entre rodadas. Resultado compatível com falha pontual de recursos do navegador, sem atribuir causa definitiva.
- npm run build depois dos E2E: exit 0, tipos/produção aprovados; Dashboard 11,70 kB, SDK 214,62 kB e entrada 243,47 kB brutos em chunks separados. dist final restaurado para produção/configuração local, sem configuração sintética de teste.
- Navegador integrado em 4178 após rebuild produção: /dashboard redirecionou para /login anônimo; Contato vazio exibiu três erros e focou Nome; catálogo GitHub real e leitura pública de destaques com vazio real observados. Nenhum login/envio/escrita administrativa. Captura própria em outputs/CP3-T05-Revisao-T00.png na pasta da coordenação, fora do checkout.
- Serviços reais/Auth do dono e envios não foram acionados pelos testes locais. Banco WASM/mocks e HTTP sintético não comprovam JWT hospedado.
- Edição preexistente docs/handoffs/T02-design-tema.md: SHA-256 F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159, preservada fora do staging.

## Pendências e passagem

T06 pode iniciar QA sobre a base integrada e deve priorizar aceite autenticado hospedado: usuário entra no fluxo apropriado, verificar sessão/reload/logout, mensagens/responded_at e destaques/home com JWT real, registrando/restaurando o estado acordado. Não usar secret key no frontend nem registrar credenciais. Validação integrada de contato exige adaptador Node ou Vercel; Vite preview não executa Function. Planejar uma submissão autorizada com prova de persistência/aceitação/recebimento, sem repetir envios por rotina. Distinguir evidência anterior T04 da nova UI.

T06 também verifica responsividade/teclado/foco/contraste e falhas funcionais; pode avaliar a concorrência do runner diante do ERR_NO_BUFFER_SPACE observado, sem assumir defeito do produto. CI remoto/deploy/Lighthouse/runtime/origens/IP/quotas/remetente produção ficam nas tarefas responsáveis. Licenças/mídia e conteúdo pessoal mantêm pendências anteriores.

Nenhum outro chat acionado pela T00. Um escritor por checkout, preservando edição local T02. Resultado final e integração serão registrados no commit de fechamento e em STATE.
