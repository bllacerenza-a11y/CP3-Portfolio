# Handoff — T02.1 — Evolução visual em React

## Identificação e estado

- Tarefa/chat: T02.1, CP3 · 02 — Design, conteúdo e tema, 01a1677e-92a1-7890-8b51-8df9627b7f53.
- Atualizado: 24/10/2026, 02:51, America/Sao_Paulo.
- Responsável: executor T02.1; revisão e integração pela T00.
- Estado: candidato implementado e verificado localmente, pronto para revisão; ainda não integrado à main.
- Resumo: proposta aprovada convertida para React/CSS Modules existentes, com home autoral, mídia diferenciada, catálogo compacto e narrativa nos detalhes. Tema, APIs/cache/URLs e contratos T04 preservados. Câmera apresentada como colaboração privada confirmada.

## Objetivo, requisitos e limites

Escopo autorizado: executar a evolução aprovada em docs/handoffs/T00-revisao-T02-1-proposta.md e INTEGRACAO.md do pacote, a partir da main com T04, preservando edição local preexistente. Atende à meta visual adicional T02.1 e desenvolve R07, preservando R01/R02/R03/R06 e padrões R11/R12 no escopo local.

Não implementa T05: nenhum formulário, login, guard, dashboard, gestão de destaques persistidos ou consumo de dados privados foi acrescentado. Não transforma feedback do protótipo em submissão real. Não foi feito deploy, envio de e-mail, migração, login em serviço ou alteração de conta.

Dependências lidas: AGENTS, HANDOFF geral, STATE, T02.1 de TASKS, revisão T00 da proposta, INTEGRACAO, ARCHITECTURE, CONTRACTS, conteúdo/design T02 e código/testes pertinentes T03/T04. A orientação frontend-design é a mesma revisão textual avaliada e aplicada na proposta, documentada em T02_DESIGN e PROPOSTA do pacote; nenhuma instalação ou nova dependência.

## Estado do código e integração

- Checkout: C:/Users/bruno/Documents/Codex/CP3-Portfolio.
- Entrada: main af15723, contendo T04 e aprovação T00.
- Branch criada: codex/t021-visual-evolution.
- Candidato de implementação: fbf34da21a6b27a7588e348c2b6591f8fe1b231a.
- Commit deste handoff: documental posterior; consultar git log -1.
- Integração pela T00: pendente. STATE e THREADS não editados.
- Alteração local preservada, sem staging/commit: docs/handoffs/T02-design-tema.md. SHA-256 na entrada e após os checks: F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159. Não declarar checkout limpo nem incluir essa edição por conveniência.
- Escopo do diff para revisão: af15723..fbf34da; este handoff vem em commit seguinte.

Arquivos alterados: shell/home e CSS; ProjectCard/ProjectMedia; conteúdo editorial público/privado; ProjectsSection/ProjectDetails e estilos; acabamento AsyncState; tokens; testes E2E; README, CONTRACTS, nota histórica T02_DESIGN, T021_VISUAL e evidências.

Conferência de diff sem saída para áreas protegidas: api, server, shared, src/services, src/features/auth, projectQueries.ts, src/theme, src/hooks, package/lock e routes.ts. Isso confirma ausência de mudança nesses arquivos, não prova sozinho todas as integrações externas. Nenhum remoto ou serviço foi configurado nesta execução.

## Decisões e contratos

| Alteração | Motivo/evidência | Efeito nos próximos consumidores |
| --- | --- | --- |
| Abertura nominal, papel quente, grafite, verde e escala editorial | Direção aprovada pela T00; referência no pacote PROPOSTA | Tokens semânticos existentes preservados, novo --color-soft |
| ProjectCard featured/compact | Diferenciar seleção visual do catálogo secundário | Props anteriores continuam aceitas; variant é opcional, padrão compact |
| ProjectMedia com dimensões, alt/caption e fallback | Mídia verdadeira e estado de falha testável | Media opcional; eager no detalhe, lazy nas pranchas abaixo da dobra; fallback não cria screenshot falso |
| Narrativa de problema/proposta/fluxo | Base factual dos READMEs públicos | Só aparece se houver editorial; descrição/linguagem/data continuam vindo de Project real |
| privateCollaborations separada de selectedRepositories | Confirmação do usuário de privacidade/colaboração | Home não consulta repo privado; URL interna já existente mostra contexto, sem Project, credencial ou link privado |
| Sem seção pública de papel individual pendente | Ajuste explícito da revisão T00 | Crédito de equipe, detalhes de função aguardam confirmação em docs |
| AsyncState mantém props/roles | Estados reais pertencem às consultas | Acabamento aplicado sem laboratório, faixa conceitual ou novo fluxo de envio |
| Remoção do aviso provisório de contato | Evitar expor planejamento interno no produto | Contato público aponta ao GitHub; formulário continua T05 |

CONTRACTS.md descreve as props concretas e a condição privada. A lista pública permanece paginada com deduplicação, tratamento de forks/arquivados e cache original; detalhes continuam em /projetos/:owner/:repo. Nenhum roteador hash/store extra ou servidor do protótipo foi copiado.

Dados sintéticos existem exclusivamente nas fixtures versionadas de teste. As capturas fixture-* mostram esses dados de forma explícita. A home em uso real obtém os repositórios pela API pública. Não houve fabricação de metadados para a câmera.

## Mídias e pendências

- SVG Aether: autoral do pacote aprovado, incorporado com caption de diagrama explicativo. Não é UI real, telemetria nem evidência de execução; captura Wokwi/vídeo seguem pendentes.
- PNG Melodia: captura real da demonstração pública, 102.98 kB no build; uso local autorizado para esta proposta/implementação. Caption registra crédito da foto conforme README. Conferir as condições dos assets originais e avisos antes de publicar; a captura não comprova licença integral.
- Não foram incorporados áudio, fotos de templates, fontes remotas, foto pessoal ou dados privados.
- Função individual, habilidades específicas e materiais publicáveis do projeto privado ainda dependem do usuário/equipe. Nada disso foi preenchido por inferência.
- Detalhes em docs/T021_VISUAL.md e MIDIAS.md do pacote aprovado.

## Verificação executada

Ambiente: Windows/PowerShell, Node v24.20.0, npm 11.19.0, Playwright 1.64.1/Chromium desktop e Pixel 7 emulado. Comandos no checkout canônico em 24/10/2026. Código/configuração/testes verificados registrados em fbf34da; somente documentação deste handoff foi acrescentada depois.

| Comando/procedimento | Resultado real | Limite |
| --- | --- | --- |
| git status --short --branch; git log -5 --oneline | main af15723, única edição preexistente identificada | Conferido antes de criar a branch |
| git switch -c codex/t021-visual-evolution | Exit 0 | Branch solicitada pelo usuário |
| npm run format; npm run lint; npm run typecheck | Aprovados | Formatação de código/config; documentos canônicos não reformatados em lote |
| Primeira npm run check | Backend 24 aprovado; E2E 42 passou/8 falhou | Ponto decorativo em CSS entrava no nome acessível; descrição duplicada em detalhes sem editorial |
| Correções e npm run build; npm run test:e2e -- --grep 'lista, detalhes\|acesso direto\|outro dono\|externo preserva' | Exit 0; 8 execuções dirigidas passaram | Ponto agora aria-hidden; texto sem editorial apresentado uma única vez |
| Rodada interrompida em format:check do novo evolution.spec.ts | Falhou antes dos testes | Resolvida com Prettier no arquivo; check de formato posterior aprovado |
| npm run check com novos cenários | Exit 0; 24 backend +60 execuções E2E; runner 20.3 s | Suite local de banco/Auth/email usa WASM e mocks, sem envio real |
| Ajuste final do título privado e npm run check | Exit 0; lint/formato/tipos/build, 24 backend (4.7 s), 60 E2E (22.0 s) | Acrescentada verificação de 320/390/1440px também no contexto privado |
| git diff --check; git diff --cached --check | Aprovados ao fechar candidato | Uma linha vazia extra no fim de T021_VISUAL foi retirada antes do aceite final |
| Get-FileHash do handoff T02 | Mesmo SHA de entrada | Edição preexistente mantida fora do candidato |
| git diff --name-only nas áreas protegidas acima | Sem saída | Nenhum contrato executável de T04/serviço/tema/cache alterado |
| npm run preview -- --port 4175 | Servidor local próprio iniciado | Não executa Vercel Functions |
| Navegador integrado com API pública | Home e Aether carregados, dados públicos presentes, tema e retorno preservados; contexto privado sem metadados | Sem mocks, sem acesso autenticado ao repo privado |
| Logs error/warn do navegador no momento consultado | Lista vazia | Não é garantia para todos os fluxos/ambientes |

Testes novos/atualizados preservam verificação de URL/refresh/404, paginação, nulos/URL insegura, erros HTTP/rede/JSON, cache/stale/retorno, tema, teclado, storage restrito e regressões backend. Os casos que antes usavam a câmera como referência pública foram atualizados para a informação privada confirmada; a capacidade de consultar/cachear outro dono público é testada com fixture de outro-dono/publico, sem embarcar esse dado no produto. Um 404 público separado mantém cobertura de ausência recuperável.

### Matriz e critérios

| Critério | Estado | Evidência |
| --- | --- | --- |
| Home e detalhes Aether/Melodia, desktop/mobile e claro/escuro | Verificado localmente | evolution.spec.ts: 320/390/768/1440px, ambos temas, sem overflow, mídia decodificada |
| Fallback por ausência/falha de mídia | Verificado | Projeto sem editorial e abort da PNG; dados/links/narrativa preservados |
| Narrativa e disclosure por teclado | Verificado | Enter no summary; três passos e metadados da consulta |
| Loading/erro/vazio/404 | Verificado com respostas controladas | Matriz de capturas 390/1440px nos dois temas; retry e recovery nas regressões existentes |
| Preferência do tema e cache/URLs | Verificado | Tema existente sem alterações; casos de retorno/refresh/nova visita e stale |
| Câmera privada | Verificado no escopo editorial | Home/detalhe não consultam repo anônimo, sem dl/links privados/role inventada; layout 320/390/1440 |
| T04/backend | Regressão local aprovada | 24 testes existentes; nenhum serviço externo novamente acionado |
| T05, deploy, Lighthouse, aparelho físico, acessibilidade integral | Não verificado/não implementado nesta tarefa | Permanecem nas tarefas responsáveis |

### Evidências visuais

docs/evidence/T021 contém 14 capturas fixture-* da suíte React e cinco *-real-* do navegador com a API pública/contexto privado. README local diferencia as origens. Capturas em desktop 1440px e mobile 390px; o teste também exercita 320/768px.

Inspecionadas pelo agente: home desktop claro/escuro e mobile claro/escuro, Aether desktop claro/escuro e mobile escuro, Melodia mobile escuro, erro mobile escuro e câmera privada mobile após ajuste. No navegador: alternância, home→Aether, expansão da arquitetura, retorno e contexto privado. Não foi necessário mudar a direção aprovada; diferenças da proposta são dados/estados reais, remoção de notas internas e crédito de equipe.

Nenhum corte ou sobreposição impeditivo observado nessas condições. Nome privado teve a escala reduzida após a primeira inspeção para evitar quebra no meio da palavra. O script de tema de primeira pintura permaneceu intacto; não houve medição instrumental de flash/Lighthouse.

## Ambiente e revisão

- Prévia do candidato: http://127.0.0.1:4175/.
- Processo desta sessão: 35784, npm run preview -- --port 4175. Aba deixada disponível. Não parar processos desconhecidos; esta porta é diferente de 4173, usada pelo runner.
- Fonte da proposta aprovada: outputs/T02.1 da coordenação; não alterada nesta implementação.
- Remoto/PR/deploy: nenhum criado; integração local da branch pela T00 pendente.

## Pacote para revisão e próxima ação

1. T00 confere af15723..fbf34da e este handoff, verifica o estado local antes de integrar e preserva literalmente a edição do handoff T02.
2. Revisar principalmente separação editorial/API, fallback de mídia, condição privada e distinção de dados de teste nas evidências.
3. Reproduzir com npm run check e preview da revisão real; não é necessário repetir testes externos de e-mail/Auth por rotina.
4. Após revisão/integração pela T00, liberar T05 para formulário/guard/dashboard e destaques persistidos. Esta tarefa não os iniciou.
5. Antes de publicação: revisar direitos/créditos dos assets Melodia e resolver demais pendências de produção nos marcos correspondentes. Registrar contribuição individual apenas com confirmação.

### Mensagem curta para T00

> T02.1 pronta para revisão na codex/t021-visual-evolution, candidato fbf34da. Conversão React da direção aprovada, mídia/narrativa e catálogo, contexto privado para câmera. npm run check aprovado: 24 backend +60 E2E; API pública e telas inspecionadas, evidências diferenciadas. Serviços/cache/URLs/tema/T04 preservados; T05 não iniciada. Edição preexistente do handoff T02 preservada pelo SHA. Handoff: docs/handoffs/T021-evolucao-visual.md. Próxima ação: revisar e integrar antes da T05.
