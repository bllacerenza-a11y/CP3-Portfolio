# T08 — Auditoria independente

## Identificação e estado

- **Chat:** CP3 · 08 — Auditoria independente, `01a1677e-aa5f-7003-9b53-933c27c74645`.
- **Data:** 24/10/2026, America/Sao_Paulo. Evidências próprias coletadas a partir de aproximadamente 19:40 BRT; timestamps técnicos em UTC nos JSONs.
- **Estado:** auditoria executada, pronta para revisão T00; entrega integral ainda não comprovada. Não é aprovação acadêmica nem nota.
- **Base local:** `main`, `65ba9ccfda3e31823ecd38f831cefa3a4845142a`.
- **Produto publicado:** `5cd7834c7a8a91e6cceb6b87d5423c7658988cb3`, https://cp3-portfolio-peach.vercel.app.
- **Checkout:** `C:\Users\bruno\Documents\Codex\CP3-Portfolio`.
- **Alteração preexistente:** `docs/handoffs/T02-design-tema.md`, SHA-256 `F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159`, preservada.
- **Alterações próprias:** somente este handoff e evidências T08. Sem alteração de código, contratos, índice, HEAD, branch, STATE ou THREADS; sem commit/push/merge/deploy.

## Objetivo, referências e limites

Auditar R01–R12 e G01–G03, priorizando contato/login na origem pública, integração PR/main e entrega documental/vídeo. Lidos AGENTS, HANDOFF, STATE, MODEL_POLICY, THREADS, seção T08 de TASKS, REQUIREMENTS, CONTRACTS, ARCHITECTURE, REVIEW_RUBRIC, TEST_PLAN, pesquisa de skills pertinente, README/HARNESS e os handoffs/evidências T06/T07/T00 relacionados, incluindo `T00-revisao-T07-correcao.md`.

O enunciado Notion não pôde ser reaberto pela ferramenta web nesta rodada. A referência normativa utilizada é a transcrição canônica em REQUIREMENTS e a rubrica local; uma eventual diferença com o original requer nova revisão. Não foram criadas exigências de biblioteca, quantidade de skills/MCPs/agentes, 3D, navegador físico ou nota além da performance mobile >=80.

Não houve novo envio válido, replay, criação de usuário, SQL, repair, seed, alteração de respondida ou gravação de destaques. O usuário fez pessoalmente o login na produção e avisou neste chat; não solicitamos/exportamos senha, token ou sessão. Logout foi exercitado depois da leitura. Nenhuma conta administrativa ou secret key substituiu esse fluxo. Sem novo subagente nesta execução.

## Natureza das evidências

- **P — própria:** comando executado, código/configuração inspecionados ou comportamento observado pela T08. Testes com mocks continuam sendo evidência própria de comportamento controlado, não de serviço hospedado.
- **E — existente:** artefato de outra tarefa inspecionado. Não equivale à repetição do procedimento; confirmação humana de recebimento pertence à T06/T04.
- **N — não verificado:** falta evidência suficiente no ambiente indicado. Não significa falha funcional reproduzida.

Consolidação segue REVIEW_RUBRIC: um requisito composto com subitem obrigatório pendente fica **NÃO_VERIFICADO**, mesmo com vários subitens aprovados. `VERIFICADO` abaixo delimita ambiente e amostra; não significa certificação irrestrita de segurança ou acessibilidade.

## Verificação executada

Ambiente próprio: Windows/PowerShell, Node `v24.20.0`, npm `11.19.0`, Playwright instalado conforme lockfile (`1.64.1`); Chromium desktop e perfil Pixel 7 da suíte. Navegador integrado na produção: viewport medido de `516×480` CSS px durante a inspeção, sem dispositivo físico. A suíte também verifica os tamanhos e temas definidos nos specs, incluindo 320/390/768/1440 nos cenários pertinentes.

| Procedimento | Resultado próprio | Evidência |
| --- | --- | --- |
| `git status --short`, `git log -1`, hash T02 | Base 65ba9cc; somente T02 alterada antes do relatório; índice sem staging | Estado de entrada registrado acima; preservação final abaixo |
| `npm run check` | Exit 0: ESLint, Prettier, TypeScript/build:test, **25 backend** (5,2s), **110 E2E** (39,7s) | `../evidence/t08/check.log` |
| Teste runtime contido no check | JavaScript ESM emitido: GET 405 e POST inválido 400; sem escrita externa | Mesmo log, `test:runtime` |
| `npm run build` após o check | Exit 0; dist de produção restaurado, substituindo build sintético | `../evidence/t08/build-production.log` |
| `npm run test:hosting -- https://cp3-portfolio-peach.vercel.app 5cd7834c7a8a91e6cceb6b87d5423c7658988cb3 work/t08-hosted-routes.json` | Exit 0, **19/19**, SHA correto; GET somente | `../evidence/t08/hosted-routes.json` |
| Quatro POSTs deliberadamente inválidos, payload `{}` | Origem canônica/JSON 400; origem externa 403; sem origem 403; text/plain 415. Todos no-store | `../evidence/t08/contact-negative.json`; reprodução no README do pacote |
| `git ls-remote origin refs/heads/main refs/heads/codex/t07-performance-deploy` e API GitHub sem autenticação | Main 59702f8; branch T07 f6bec99; repo público; PR #1 open/draft; CI push/PR success para 5cd7834 | `../evidence/t08/remote.json` |
| `git cat-file -e 59702f8:vercel.json` | Recusa esperada: arquivo ausente da main remota | A01 |
| `git diff --exit-code 1263d47 65ba9cc -- src` | Exit 0, frontend sem diferença em relação à medição Lighthouse existente | Limite R08 |
| `git ls-files .env .env.example .env.local`, `git check-ignore .env .env.local work .vercel` | Somente `.env.example` versionado entre os três; arquivos/diretórios privados indicados são ignorados | Inspeção própria G01; não é scan integral do histórico |

Os POSTs `{}` são inválidos antes de `deps.save` (`server/contact.ts:61` e `:69`), portanto não exercitam persistência, e-mail ou quotas SQL. Não se atribui a eles aceite positivo de R04. Não foram executados os comandos opt-in `test:contact-live` ou `test:supabase`.

### Navegação própria na produção

1. Home: catálogo e projetos Aether/Melodia com dados GitHub reais, links corretos e contexto explícito de colaboração privada. Dados editoriais permanecem separados dos metadados da API no código.
2. Contato vazio: mensagens específicas de nome/e-mail/mensagem, alerta geral e foco no Nome. Nenhum conteúdo válido foi submetido.
3. Antes do login, acesso direto a `/dashboard` terminou em `/login`, sem painel privado.
4. `/projetos/vercel/next.js`: loading, depois JavaScript, descrição “The React Framework” e GitHub `vercel/next.js`. Reload conservou o detalhe correto. Correção R01 confirmada independentemente.
5. `/projetos/vercel/cp3-t08-missing.repo`: loading seguido de “Repositório não encontrado”, causa não presumida e botão “Consultar novamente”. Não foi necessário fabricar falha na API pública; indisponibilidade/limite e lista vazia foram exercitados na suíte controlada.
6. `/rota-inexistente`: 404 amigável com retorno à home. O host entrega shell React (HTTP 200); isso está de acordo com a SPA e não foi convertido em exigência de HTTP 404 para a página amigável.
7. Tema inicialmente “Usar sistema”/escuro: alternar para claro, reload e sincronização na outra aba observados. A configuração original “Usar sistema” foi restaurada; persistência entre novas visitas também passou na suíte.
8. Após login pessoal do usuário na origem canônica, `/dashboard` exibiu três mensagens de teste, duas notificações aceitas e uma falha, todas não respondidas, e seleção de destaques `0/24`. Reload restaurou sessão/painel/dados. Apenas leitura: nenhuma marcação ou salvamento.
9. Sair → `/login`; novo acesso direto a `/dashboard` voltou para `/login`, sem mensagens privadas. Não se afirma revogação instantânea de JWTs em todos os dispositivos.
10. Home após o fluxo: “Nenhum destaque selecionado no momento”. Nenhuma escrita realizada; estado observado compatível com três mensagens e highlights `[]` do registro anterior.

Extratos públicos e resumo sanitizado das observações estão em `../evidence/t08/`. Não se inclui a árvore privada integral do painel, e-mails de contato, credenciais, cookies ou storageState. Capturas brutas que não documentaram adequadamente o estado pretendido não são usadas como prova.

## Matriz requisito → evidência → resultado

| ID | Resultado nesta revisão | P — evidência própria | E — evidência existente / N — limites |
| --- | --- | --- | --- |
| R01 | **VERIFICADO** na amostra local/produção | 19/19 hosting; detalhe next.js direto/refresh; 404 amigável e repositório ausente; suíte projects/foundation | Falhas GitHub 403/429/transporte exercitadas com HTTP controlado, sem provocar falha deliberada no GitHub real |
| R02 | **VERIFICADO** nos consumidores auditados | Specs projects/contact/dashboard: loading, erro, vazio, transporte, envio lento/bloqueado, falha parcial e leituras/escritas recusadas; UI pública com loading/erro e destaques vazios | Mocks/PGlite não reproduzem todas as falhas de rede/serviço na produção. Inventário: lista/detalhe/projetos de destaque, highlights, autorização, mensagens e mutações |
| R03 | **VERIFICADO** | `src/services/github.ts`, queries lista/detalhe e UI pública real; normalização/nullable/paginação/cache testados. Curadoria guarda IDs, não substitui GitHub | Conteúdo privado SmartCameraStudy não foi acessado; não é necessário para demonstrar os projetos públicos |
| R04 | **NÃO_VERIFICADO integralmente na produção** | Validação/foco/feedback próprios; quatro negativas reais; 25 backend e casos de formulário controlados; mensagens anteriores lidas no painel hospedado | **E:** T06 UI→Node local→Supabase/Resend, recibo 1 POST/201/1 chamada/1 registro; capturas de contato e respondida e JSON final inspecionados. Recebimento é confirmação humana registrada por T06. **N:** novo contato UI→Function Vercel→persistência/e-mail/recebimento; A02 |
| R05 | **NÃO_VERIFICADO integralmente na produção** | Anônimo→login; login pessoal do dono, leitura de três mensagens, reload e logout/guard na origem pública; highlights vazio. Código Auth/RLS e suíte positiva/negativa revisados | **E:** T06 marcou/desfez respondida, salvou/reordenou destaques e restaurou []; UI/JWT locais com serviços reais. **N:** mutações pela origem pública e outro JWT real nesta rodada. O antigo limite de login do dono na produção está resolvido; não confundir com mutações |
| R06 | **VERIFICADO** | Alternância/reload/sincronização pública; suite theme cobre nova visita, sistema, storage bloqueado e valor inválido | Configuração inicial restaurada; sem aparelho físico |
| R07 | **VERIFICADO** na amostra emulada | Suíte de apresentação/evolução/qualidade e painel nos tamanhos/temas declarados; componentes Button/Field/AsyncState/ProjectCard/ProjectMedia reutilizados, CSS Modules e conteúdo próprios inspecionados | **E:** capturas e layout real T06. Sem certificação WCAG integral, Safari/Firefox ou dispositivo físico; esses itens adicionais não viraram exigências novas |
| R08 | **VERIFICADO** no conjunto de evidências delimitado | Check e build próprios; testes de contagem de requests/cache e lazy Auth/SDK/Dashboard; dimensões/loading das imagens; sem diff frontend desde 1263d47 | **E:** JSON Lighthouse 13.5.0 de **1263d47**, mobile/throttling simulado, 24/10 13:52 BRT: **98**, LCP 2276,719 ms, CLS 0. T08 inspecionou o relatório, não mediu novamente. Não atribuir 98 a uma execução em 5cd7834/65ba9cc. Sem contagem própria de requests GitHub reais durante navegação |
| R09 | **VERIFICADO** | `contact.spec.ts` valida campos/foco e zero POST inválido; `dashboard.spec.ts:9` cobre redirecionamento com replace e ausência de consulta privada; executados no check | Controle HTTP sintético explicitado; 110 é número de execuções E2E, não de integrações reais |
| R10 | **NÃO_VERIFICADO para promoção do produto atual pela main remota** | URL atual acessível/SHA correto; GitHub repo/PR/main consultados; divergência atual comprovada | **E:** `main-auto-build.log` registra clone automático de main/59702f8; gatilho Git já comprovado. **N:** produto auditado integrado/remotamente publicado por esse fluxo; A01. Não se conclui que o gatilho está quebrado |
| R11 | **VERIFICADO**, com documentação a consolidar | Histórico incremental real em 23–24/10, branches por tarefa, Conventional Commits de implementação/documentação; README e AGENTS/CLAUDE inspecionados | A03: trechos de estado desatualizados; não fabricar datas/commits nem inferir autoria individual de projetos em equipe |
| R12 | **VERIFICADO** | App compõe; features/hooks controlam estados; services acessam APIs; shared valida contratos; server/api protegem integração; migrations versionadas. TS estrito, ESLint hooks/refresh, Prettier e CI executados | Nomenclatura de arquivos revisada manualmente; não alegar que ESLint automatiza todos os nomes de arquivo |
| G01 | **VERIFICADO** nos itens inspecionados | API GitHub anônima `private:false`; histórico real; `.env.example` sem valores secretos, `.env` ignorado; README possui projeto/tecnologias/comandos; instruções IA versionadas | A01: branch padrão ainda não é o produto publicado. A03: README contradiz estado do remoto. Não foi feito clone limpo/npm ci nesta rodada nem nova varredura integral de segredos; scans históricos T07 são E |
| G02 | **NÃO_VERIFICADO** | Busca em documentação Markdown não encontrou link final YouTube; arquitetura/comparações/harness escritos existem | Sem vídeo fornecido/inspecionado: duração <=8 min, rosto+tela contínuos, não listado, demonstração técnica/harness e explicação do aluno não comprovados; A04. Não se afirma inexistência de vídeo fora dos artefatos recebidos |
| G03 | **NÃO_VERIFICADO integralmente** | React e GitHub/Vercel conferidos; contexto de trabalho individual documentado | Sem comprovante Teams/três links, vídeo ou confirmação oficial de ano/horário do prazo 03/11; domínio explicativo do aluno requer demonstração humana. A04 |

## Achados e lacunas com reprodução e impacto

### A01 — P1: produto publicado diverge da branch principal remota

- **Tipo:** divergência de integração/entrega comprovada, não falha funcional da URL atual.
- **Localização:** [PR #1](https://github.com/bllacerenza-a11y/CP3-Portfolio/pull/1), [main remota](https://github.com/bllacerenza-a11y/CP3-Portfolio/tree/main), `https://cp3-portfolio-peach.vercel.app/deployment.json`, `docs/T07_DEPLOY.md:7`.
- **Reprodução sem escrita:** consultar `git ls-remote origin refs/heads/main refs/heads/codex/t07-performance-deploy`; GET público `/repos/bllacerenza-a11y/CP3-Portfolio/pulls/1`; GET `/deployment.json`.
- **Observado:** main remota `59702f8`; PR open/draft, head `f6bec99`, merged=false; produção `5cd7834`; main local `65ba9cc` 12 commits à frente da referência remota conferida. `git cat-file -e 59702f8:vercel.json` comprova que a configuração corrigida não está no SHA da branch padrão.
- **Esperado para fechar a promoção:** produto revisado na principal remota e deployment Git resultante conferido. A implementação do gatilho automático possui prova anterior; não está sendo dada como quebrada.
- **Impacto:** avaliador que clona a principal recebe produto diferente; novo push não integrado pode substituir a produção corrigida por versão anterior. R10 atual e reprodutibilidade da entrega ficam pendentes.
- **Responsável/próxima ação:** T00 definir integração consciente de PR/main, preservando histórico/T02, conferir CI do SHA integrado e metadata/rotas após deploy. T08 não faz merge nem push. Retestar A01 depois da promoção; manter aberto até isso acontecer.

### A02 — P1: aceite positivo do contato na origem pública permanece sem evidência

- **Tipo:** lacuna de verificação, **não defeito reproduzido**.
- **Localização:** `https://cp3-portfolio-peach.vercel.app/#contato`, `/api/contact`; `server/contact.ts:69`/`:93`; `docs/handoffs/T00-revisao-T07-correcao.md`, seção Pendências.
- **Como constatar a lacuna:** confrontar negativos T08/hosting T07 com `docs/evidence/t06/real-state-final.json`: o único fluxo positivo integrado T06 foi servido por Node local; ler as mensagens existentes na produção não prova que a Function Vercel criou uma delas.
- **Impacto:** R04 não pode receber aceite integral na produção; 400/403/415 não garantem sucesso de persistência ou envio válido, assim como `accepted` não comprova recebimento.
- **Próxima verificação, se deliberadamente autorizada pelo responsável:** um único contato sintético pela origem canônica, registrar feedback, uma nova linha via UI do dono após reload, aceitação e confirmação de recebimento pelo dono. Não usar o script local de dois contatos como prova de Vercel, não repetir replay nem exaurir quota por rotina. Nenhum envio foi feito nesta auditoria.
- **Limite de remetente:** teste atual envia ao dono da própria conta Resend. Isso é compatível com o destinatário previsto do contato; domínio próprio ou envio a outros destinatários não são novas exigências acadêmicas.
- **Responsável:** T00/T07/T05 e usuário para decidir/realizar aceite único. Se não executado, manter N explicitamente.

### A03 — P2: documentação de apresentação mistura estado histórico e situação atual

- **Tipo:** inconsistência documental comprovada.
- **Localização/reprodução:** ler `README.md:97` (“repositório remoto público e integração com Vercel ainda precisam ser configurados”) e confrontar com API pública, produção e `docs/T07_DEPLOY.md`. `docs/HARNESS.md:10` mantém inventário da T01 e termina a evolução na T04; não há síntese final T05–T08.
- **Impacto:** quem prepara vídeo ou executa o projeto pode inferir que serviços ainda não existem, ou chamar acesso via CLI/navegador de MCP de serviço sem evidência. Prejudica clareza de R11/G01 e demonstração G02, sem invalidar os padrões/comandos que já estão presentes.
- **Próxima ação/responsável:** T09 consolidar resumo vigente e rotular claramente histórico, distinguindo serviço configurado, ferramenta usada, skill textual e conector/MCP efetivamente usado. Não instalar ferramentas só para preencher categorias nem inventar modelo/configuração. T00 mantém os arquivos canônicos; T08 não corrigiu os textos.

### A04 — P1 para fechamento acadêmico: vídeo, submissão e prazo não comprovados

- **Tipo:** lacuna de entrega, **não comprovação de vídeo inexistente**.
- **Localização/reprodução:** `docs/REQUIREMENTS.md:26`/`:30`, `README.md:109` em diante; busca `youtube.com|youtu.be` nos Markdown não encontrou link final. Nenhum vídeo/recibo Teams foi fornecido à auditoria.
- **Impacto:** G02 e conclusão integral G03 permanecem N mesmo com aplicação funcional; domínio explicativo não se deduz de código gerado/testes aprovados.
- **Próxima ação/responsável:** T09/usuário fornecer vídeo final não listado; revisar duração real, rosto+tela durante todo o vídeo, stack/fluxo/comparações/harness demonstrados; validar os três links e comprovante de submissão Teams. Confirmar ano/horário oficiais de 03/11. T08 não acessou Teams/YouTube nem enviou nada.

### Limites adicionais, sem novo bloqueio acadêmico inventado

- R05: mutações de respondida/destaques na origem pública não repetidas por esta auditoria de leitura. Cobertura própria local e aceite real T06 existentes; login público antes pendente foi agora observado. Outro JWT real, expiração real e todas as ações fora da UI não foram reexecutados.
- Supabase: histórico de migrations manual ainda requer conferência/repair antes de futura CLI, conforme T07_DEPLOY. Não é motivo para reaplicar CREATE/reset nem falha funcional nova constatada. Nenhuma nova inspeção administrativa foi feita.
- Lighthouse: relatório histórico 98 inspecionado, frontend inalterado; medir novamente só se contexto de entrega ou mudança justificar. Não anunciar nota nova.
- Segurança, acessibilidade, browser físico/múltiplos engines, quota esgotada e entrega futura de e-mail não foram certificados integralmente. Não são utilizados para inventar requisitos adicionais.

## Veredito e passagem

Nenhum novo defeito funcional de código foi reproduzido no escopo executado. Isso não encerra os achados de integração/entrega nem transforma lacunas em aprovação. Correção anterior de R01 e login do dono na origem pública foram verificados pela T08. R04/R05 integralmente em produção, promoção atual R10 e G02/G03 conservam os limites acima.

1. T00 revisar este relatório e decidir a integração remota A01; depois conferir CI/SHA/deployment/rotas. Não houve comunicação automática com outro chat.
2. Deliberar A02; qualquer envio válido é um aceite único planejado, não repetição de rotina. Preservar dados existentes, respondida e seleção vazia.
3. Encaminhar A03/A04 à T09/usuário para documentação/vídeo/Teams. Não há correção de produto implementada nesta T08.
4. Se qualquer revisão mudar, repetir somente os cenários afetados e identificar novo SHA. Não marcar achados fechados apenas pelo relato do executor.
5. Arquivos T08 ficam sem commit para integração consciente da T00; T02 continua fora de staging. STATE/THREADS são responsabilidade da coordenação.

Conferência final própria: `git diff --check` exit 0; HEAD permaneceu `65ba9cc`; índice sem alterações; status contém somente a edição preexistente T02 e os arquivos novos T08. Hash T02 conferido novamente e idêntico ao da entrada. Nenhum arquivo canônico da coordenação foi alterado. Não se declara checkout limpo.

> os, A04 vídeo/Teams/prazo sem comprovação. Lighthouse 98 é histórico inspecionado de 1263d47. Handoff T08 e pacote docs/evidence/t0T08: auditoria de 65ba9cc/produção 5cd7834 executada. Próprios: check 25 backend/110 E2E + ESM, build produção, hosting 19/19, negativas HTTP 4/4, rotas/API/tema e login público com usuário/reload/logout. Sem envio válido ou alteração de dados/código. A01 main remota/PR pendentes, A02 contato positivo público não verificado, A03 documentos desatualizad8; T00 decide integração e fechamento, T09 consolida entrega.
