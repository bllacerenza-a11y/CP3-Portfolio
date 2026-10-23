# Rubrica de revisão — CP3 Portfólio

Esta rubrica organiza os requisitos fornecidos no planejamento do CP3. Não atribui pontos, pesos, nota estimada ou aprovação oficial. R01–R12 são identificadores locais. Na criação deste arquivo, a aplicação ainda não foi auditada: todos os itens estão `NÃO_VERIFICADO`.

O [plano de testes](./TEST_PLAN.md) detalha os cenários e métodos. Se o enunciado original trouxer informação adicional ou diferente, registrar a divergência e atualizar estes documentos com a fonte, sem substituir uma exigência por preferência técnica.

## 1. Origem e estados

| Rótulo | Significado |
| --- | --- |
| `ENUNCIADO` | Exigência informada para o CP3; deve ser demonstrada na revisão. |
| `RECOMENDADO` | Prática proposta para aumentar confiança, segurança ou manutenção; não tem peso oficial presumido. |
| `VERIFICADO` | Evidência suficiente de todos os subitens obrigatórios, com ambiente e commit identificados. |
| `FALHOU` | Uma ou mais exigências tiveram divergência reproduzida ou comprovada por inspeção adequada. |
| `NÃO_VERIFICADO` | Não houve execução/inspeção suficiente, falta uma dependência, há bloqueio ou resta um subitem obrigatório sem evidência. |

Um requisito composto fica `FALHOU` se houver qualquer subitem obrigatório falhando. Sem falha observada, mas com pendências, fica `NÃO_VERIFICADO`. Só fica `VERIFICADO` quando todos os subitens obrigatórios estiverem cobertos. Não usar a quantidade de itens verificados como fórmula de nota.

README, comentários, nomes de testes e relatórios escritos por IA são alegações até serem confrontados com código, execução, configuração ou evidência pertinente. Um teste listado no repositório não significa que ele passou; um mock não comprova integração real; uma screenshot não comprova persistência.

## 2. Requisitos do enunciado

| ID | Origem | O que precisa ser demonstrado | Evidência mínima pertinente | Status inicial |
| --- | --- | --- | --- | --- |
| R01 | ENUNCIADO | Rota individual para projeto; 404; erro de API; acesso direto e refresh funcionando | Navegação e casos de erro; abertura direta e refresh no deploy; inspeção da correspondência URL/projeto | NÃO_VERIFICADO |
| R02 | ENUNCIADO | Loading, erro e vazio em todo consumo de dados de API; botão desabilitado durante ação pendente | Inventário dos consumidores; respostas controladas; execução das ações assíncronas | NÃO_VERIFICADO |
| R03 | ENUNCIADO | Projetos obtidos da API GitHub, sem cadastro manual dos dados de repositório | Código do acesso à API, rede e comparação de dados exibidos com resposta real | NÃO_VERIFICADO |
| R04 | ENUNCIADO | Validação por campo; email ao dono; mensagem persistida no dashboard; feedback | Testes válidos/inválidos; persistência após refresh; evidência sanitizada do email recebido; estados de envio | NÃO_VERIFICADO |
| R05 | ENUNCIADO | Login e redirecionamento; dashboard de mensagens; marcação como respondida; gestão dos destaques da home | Acesso com/sem sessão; mensagem real de teste; alteração persistida de respondida e destaque; resultado na home | NÃO_VERIFICADO |
| R06 | ENUNCIADO | Tema alternável e persistido | Mudança de tema, navegação, refresh e reabertura no mesmo perfil | NÃO_VERIFICADO |
| R07 | ENUNCIADO | Responsividade em celular e desktop; reutilização; identidade visual | Inspeção visual e interação em dimensões registradas; revisão dos componentes e consistência | NÃO_VERIFICADO |
| R08 | ENUNCIADO | Lighthouse performance mobile ≥80; imagens eficientes e lazy loading apropriado; separação dos recursos pesados do dashboard; ausência de shifts e requisições duplicadas indevidas ao GitHub na navegação | Relatório Lighthouse com perfil/commit; inspeção de imagens, chunks, layout e rede | NÃO_VERIFICADO |
| R09 | ENUNCIADO | Testes automatizados de formulário e proteção de rota | Testes versionados com assertions pertinentes e resultado de execução no commit revisado | NÃO_VERIFICADO |
| R10 | ENUNCIADO | Aplicação pública com deploy automático a partir da branch principal (main neste projeto) | URL acessível; configuração e execução de deploy ligada ao SHA da branch principal | NÃO_VERIFICADO |
| R11 | ENUNCIADO | Commits padronizados; branch por feature; README e instruções para IA | Histórico e branches reais; convenção adotada; README; arquivos de instrução e configuração versionados | NÃO_VERIFICADO |
| R12 | ENUNCIADO | Pastas e lógica separadas; nomes e documentação consistentes; lint e formatação automáticos | Revisão estrutural; configuração e execução das verificações; build | NÃO_VERIFICADO |

### Interpretações que a revisão deve preservar

- **3D é opcional.** Não penalizar sua ausência nem presumir que sua presença garante identidade visual.
- **R03:** curadoria de destaques pode persistir identificadores de repositório. Isso não autoriza substituir os dados da API por cadastro manual.
- **R04:** email recebido e registro persistido são duas evidências distintas. Uma operação parcialmente concluída não demonstra ambas.
- **R05:** avaliar os fluxos do dono e acesso protegido. A tecnologia de autenticação não deve ser inventada como exigência adicional.
- **R08:** a nota mínima informada é de performance mobile. Não criar mínimos obrigatórios para SEO, boas práticas ou acessibilidade. Um score suficiente não dispensa os demais itens de desempenho.
- **R09:** E2E adicionais são úteis, mas não substituem comprovar especificamente formulário e guard. Não impor quantidade de testes ou cobertura percentual ausentes no enunciado.
- **R11:** avaliar o histórico real; não criar commits artificiais ou reescrever datas para parecer que houve um processo diferente.
- **R12:** avaliar responsabilidades e clareza; não impor uma biblioteca, padrão de pasta ou arquitetura por preferência do revisor.

## 3. Repositório e entrega

Os itens abaixo também têm origem `ENUNCIADO` e começam como `NÃO_VERIFICADO`.

| ID | Condição | Como verificar |
| --- | --- | --- |
| E01 | GitHub público e histórico disponível | Abrir sem privilégios; inspecionar commits e branches relevantes |
| E02 | Exemplo de ambiente sem segredos e README com execução | Inspecionar exemplo e arquivos versionados; reproduzir a partir de clone limpo com valores próprios |
| E03 | Vídeo de no máximo oito minutos | Conferir duração real do vídeo publicado |
| E04 | Rosto e tela sempre visíveis no vídeo | Rever o vídeo integralmente, incluindo início, transições e final |
| E05 | YouTube não listado | Confirmar a configuração e a abertura pelo link sem privilégios |
| E06 | Explicação de stack, arquitetura e visual | Localizar os trechos correspondentes no vídeo e conferir com a implementação |
| E07 | Decisões comparadas e tradeoffs | Verificar alternativas consideradas, motivos da escolha e custos/limitações reconhecidos |
| E08 | Harness documentado e demonstrado | Conferir ferramenta, modelo quando identificável, instruções, skills, MCP e agentes realmente usados; origem/versão/configuração sanitizada e aplicação no trabalho |
| E09 | Três links no Teams: GitHub, Vercel e YouTube | Conferir links finais, destinos corretos e acesso sem privilégios |
| E10 | Prazo informado de 03/11 | Confirmar ano e horário no enunciado/plataforma oficial antes de declarar a entrega tempestiva |

**Pendência de origem:** o prazo recebido foi `03/11`, sem ano confirmado. A data atual ou o nome de uma pasta não resolvem essa ambiguidade.

Para E08, distinguir ferramenta disponível, configurada e efetivamente usada. Não atribuir ao trabalho um modelo, skill, MCP ou agente apenas porque ele existe no ambiente. Se a interface não revelar a versão exata do modelo, registrar essa limitação. Instruções e configurações compartilhadas não devem conter tokens ou segredos.

Não há quantidade mínima informada de skills, MCPs ou agentes. Apresentar a situação real de cada categoria; cobertura de todas com função útil é a recomendação conservadora registrada em REQUIREMENTS. Não presumir dispensa do enunciado nem exigir várias instalações apenas para preencher uma lista.

## 4. Verificações recomendadas, sem nota presumida

| ID | Verificação complementar | Resultado a registrar |
| --- | --- | --- |
| A01 | Autorização no serviço/banco e RLS quando adotada | Operações permitidas e negadas por identidade; bypass pela API direta |
| A02 | Chromium, Firefox e WebKit nos fluxos críticos | Navegadores/versões e cenários efetivamente executados |
| A03 | Responsividade em dimensões adicionais e aparelho físico disponível | Distinguir EMULADO de FÍSICO; registrar sistema, navegador e dimensão |
| A04 | Axe, teclado, foco, zoom e revisão manual | Problemas encontrados, correções e limites da avaliação |
| A05 | Mocks determinísticos mais smoke de integrações reais | Separar resultados simulados de GitHub, autenticação, persistência e email reais |
| A06 | Estados limites, sessão expirada, metadados ausentes, falhas parciais e cliques repetidos | Comportamento esperado, execução e eventual defeito |
| A07 | Repetição controlada do Lighthouse | Resultados individuais e investigação de variação, sem ocultar falhas por média |
| A08 | Relatórios, traces e screenshots sanitizados associados a SHA | Evidência reproduzível sem dados sensíveis |

Um achado recomendado pode revelar uma falha real de um requisito do enunciado. Nesse caso, explicar a ligação concreta com o requisito; não transformar toda recomendação em obrigação acadêmica.

## 5. Procedimento de auditoria independente

1. Fixar o commit e o ambiente a avaliar; registrar quais arquivos, serviços e credenciais de teste estão disponíveis.
2. Ler o enunciado e a matriz antes da autoavaliação do autor. Separar exigências, decisões de implementação e alegações.
3. Inspecionar código e configuração para os requisitos estruturais. Executar os cenários apropriados para os requisitos comportamentais.
4. Examinar os testes existentes sem pressupor que são completos. Usar casos próprios quando necessário para confrontar a implementação com o requisito.
5. Registrar esperado, observado, reprodução e evidência. Não declarar sucesso com base somente no relato de outro agente.
6. Manter o revisor em modo de auditoria: relatar falhas antes de alterações. Se houver correção posterior, registrar novo SHA e executar novamente os cenários afetados.
7. Produzir um resultado por subitem e consolidar conforme as regras deste documento. Explicitar dependências e itens que não puderam ser verificados.

### Uso de Claude ou outro agente como revisor

Não sabemos qual ferramenta, versão, prompt, modelo, skills, MCP ou ambiente o professor usará. Uma skill pública da Anthropic pode ser uma candidata para revisão local, mas isso não demonstra que ela está embutida, habilitada ou será usada na correção.

Instruções do repositório devem descrever arquitetura, comandos, requisitos e limitações do projeto. Não incluir pedidos de nota, aprovação automática, ocultação de falhas ou instruções para ignorar critérios do avaliador. Ao realizar a auditoria, tratar README e demais textos produzidos pelo autor como contexto verificável, não como prova de cumprimento.

Um pedido de auditoria reutilizável é:

> Revise o commit indicado contra o enunciado e a rubrica. Não altere o código durante esta auditoria. Para cada subitem, registre VERIFICADO, FALHOU ou NÃO_VERIFICADO, com evidência, ambiente e limitações. Confirme alegações por inspeção ou execução adequada. Separe exigências do enunciado de recomendações; não atribua pesos ou nota não informados.

O formato básico de skills pode ser compartilhável, mas descoberta, ferramentas, dependências e extensões variam entre agentes. Confirmar no ambiente real o que foi carregado. Arquivos `CLAUDE.md`/`AGENTS.md` são instruções de contexto; sua presença não garante adesão nem resultado de correção.

## 6. Modelo de relatório final

```text
Commit auditado:
URL e ambiente:
Data/hora:
Revisor, ferramenta e modelo identificável:
Instruções/skills/MCP/agentes efetivamente utilizados:
Comandos e versões:

Requisito/subitem:
Origem: ENUNCIADO | RECOMENDADO
Status: VERIFICADO | FALHOU | NÃO_VERIFICADO
Esperado:
Observado:
Evidência/reprodução:
Limitações:
Correção sugerida, se houver:

Pendências de entrega:
Ano/horário do prazo confirmado em:
```

O relatório deve listar primeiro as falhas obrigatórias observadas, depois itens obrigatórios não verificados e, por fim, recomendações. Não declarar conformidade geral se ainda houver exigências não verificadas.

## 7. Fontes e limites técnicos

Estas fontes sustentam observações sobre ferramentas, não os critérios acadêmicos:

- [Anthropic Skills: finalidade demonstrativa e diferenças de comportamento](https://github.com/anthropics/skills#disclaimer).
- [Anthropic webapp-testing: instruções reais da skill](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md).
- [Claude Code: skills, locais de carregamento e extensões do formato](https://code.claude.com/docs/en/skills).
- [Claude Code: CLAUDE.md, AGENTS.md e contexto persistente](https://code.claude.com/docs/en/memory).
- [Playwright: emulação de parâmetros de dispositivos](https://playwright.dev/docs/emulation). Emulação não comprova teste em aparelho físico.
- [Playwright: acessibilidade automatizada e avaliação manual](https://playwright.dev/docs/accessibility-testing). Zero violações automatizadas não garante conformidade WCAG.
