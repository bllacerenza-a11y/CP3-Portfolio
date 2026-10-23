# T02 — Direção visual e conteúdo

Decisão do usuário em 23/10/2026: editorial sóbrio, fundo claro quente, grafite, verde discreto e tipografia marcante. Execução na branch `codex/t02-design-theme`, base `56fefe5`, único escritor autorizado neste checkout.

## Plano adotado

- Paleta clara: papel `#f5f3ec`, superfície `#ffffff`, grafite `#252b27`, secundário `#566159`, verde `#315c48`, borda `#c7cec3`. Escura: fundo `#19231e`, superfície `#233129`, texto `#edf0e8`, secundário `#b6c4b7`, verde `#a9cbb1`, borda `#536358`.
- Tipografia: Georgia para títulos, pela expressão editorial e disponibilidade local; Segoe UI/system-ui para navegação, textos e controles. Sem download de fontes nem dependência extra.
- Composição: conteúdo alinhado à esquerda; abertura com título amplo e bloco de contexto lateral, seleção de repositórios abaixo, apresentação e contato ao final. No celular, uma coluna e navegação sempre visível.
- Hierarquia: o título é o elemento expressivo; cartões de repositório usam estrutura consistente, sem estatísticas, conquistas ou imagens inventadas. Sem animação de entrada; respeitar movimento reduzido.
- Tema: sistema por padrão, escolha explícita persistida em `cp3.theme`, raiz `data-theme`. Oferecer retorno ao sistema. Falha de storage não impede alternância durante a sessão.

```text
Portfólio                 Projetos Sobre Contato [Tema]
Título editorial         Contexto da seleção
[Ver projetos]
Projetos selecionados
[Repositório] [Repositório] [Referência pendente]
Sobre                    Contato
Rodapé
```

Revisão do plano: o fundo quente e a tipografia editorial atendem à escolha explícita do usuário. Evitar moldura de jornal, números decorativos, métricas fictícias e repetição de etiquetas; as diferenças vêm do conteúdo e da hierarquia, sem ornamentação adicional. Foto não fornecida, portanto a marca é tipográfica.

## Conteúdo e origem

O usuário indicou os três links abaixo como prioridades ajustáveis. São referências selecionadas, não uma lista da API nem comprovação de autoria individual. O conteúdo local guarda identificadores e resumos editoriais baseados nos READMEs; não há mocks de `Project`, datas, linguagens ou estatísticas copiadas da API. T03 obterá os metadados de `Project` pela API e integrará a listagem dinâmica.

| Referência fornecida | Consulta pública em 23/10/2026 | Participação pessoal |
| --- | --- | --- |
| https://github.com/PedroOliDev/SmartCameraStudy | Página e API retornaram 404; não distinguir privado/removido/URL incorreta sem evidência | Pendente |
| https://github.com/bllacerenza-a11y/GS_AETHER_EDGE | API pública acessível, ID 1257628042 | README lista Bruno Bastos na equipe; função específica pendente |
| https://github.com/bllacerenza-a11y/Melodia-Site-CP5-FRONTEND | API pública acessível, ID 1378917614 | README lista Bruno Bastos na equipe; função específica pendente |

O usuário confirmou ser estudante de Engenharia de Software na FIAP, primeiro ano, e autorizou criar a identificação a partir de seu GitHub. O perfil público `bllacerenza-a11y` informa `Bruno_bastos@dev`; os dois READMEs acessíveis identificam Bruno Bastos. Nome adotado: Bruno Bastos. Texto de apresentação redigido com esses fatos; sem afirmar especialização, experiência profissional ou métricas. Não publicar RMs encontrados nos READMEs. Fontes: https://github.com/bllacerenza-a11y, README.md de cada repositório acessível (consulta pública pela API em 23/10/2026).

Habilidades, contato direto, foto, função individual e detalhes do SmartCameraStudy seguem pendentes. Nenhuma imagem externa incorporada. A consulta acima foi de preparação, não é integração da aplicação. R03 continua pendente da T03. Ela deve contemplar repositórios de donos diferentes, incluindo uma referência que hoje não está publicamente disponível. A ordem visual põe os dois projetos verificáveis primeiro; SmartCameraStudy permanece na seleção, sem link ativo para o endereço que retornou 404.

## Avaliação e aplicação da frontend-design

- Origem: Anthropic, `anthropics/skills`, revisão `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f`.
- Instruções lidas integralmente: https://github.com/anthropics/skills/blob/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design/SKILL.md
- Licença lida: Apache-2.0, `LICENSE.txt` na mesma pasta/revisão.
- Inventário conferido pela API: somente SKILL.md e LICENSE.txt; sem scripts, manifests, hooks ou dependências executáveis. Sem versão semântica declarada; SHA identifica o conteúdo.
- Adequação: orientação de tipografia, paleta, hierarquia, texto e crítica visual compatível com React/Vite/CSS Modules. Não exige framework nem instalação.
- Aplicação: orientação textual nesta T02, sem instalação global, cópia do pacote ou nova biblioteca. Plano e inspeção visual da home são a aplicação delimitada. Não atribuir melhora causal à skill sem comparação.
- Adaptações: o usuário prevalece sobre preferências estéticas; nenhuma sugestão de criar conteúdo fictício será aplicada. Requisitos acadêmicos e contratos seguem soberanos. A preferência editorial explícita prevalece sobre a crítica da skill a padrões comuns.
- Estado: avaliada e aplicada como orientação; validação do resultado depende dos checks e inspeção registrados no handoff.
