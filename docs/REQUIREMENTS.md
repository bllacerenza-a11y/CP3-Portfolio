# Requisitos do CP3

Fonte lida: [CP3 — Portfolio — Stack e Harness Engineering](https://cherry-client-b8f.notion.site/CP3-Portfolio-Stack-e-Harness-Engineering-3fe911d84e0d80f7bb6dec712e6d904a).

Este documento organiza fatos funcionais do enunciado, sem criar pesos de avaliação. Possibilidades de implementação são sugestões; os 12 resultados são obrigatórios.

| ID | Resultado exigido | Verificação planejada |
|---|---|---|
| R01 | URL própria por projeto, 404 amigável, falha de API tratada, acesso direto e refresh | Navegar, colar URL, atualizar, simular erro e rota inexistente no deploy |
| R02 | Loading, erro e vazio para dados de API; indicador visual; botão bloqueado durante envio | Respostas controladas lenta/vazia/falha e clique repetido |
| R03 | Projetos obtidos pela API GitHub, com informações do repositório | Comparar resposta real e apresentação; não usar cadastro manual como origem |
| R04 | Validação específica por campo, mensagem enviada por e-mail e persistida, feedback | Testes e submissão real com registro e recebimento pelo dono |
| R05 | Dashboard protegido, redirecionamento sem login, mensagens com marcação de respondida, destaques | Sessão ausente/presente, persistência e alteração da home |
| R06 | Preferência claro/escuro mantida entre visitas | Alterar, navegar, atualizar e retornar |
| R07 | Celular/desktop, componentes reutilizados e identidade própria | Revisão visual/interação e inspeção de componentes |
| R08 | Lighthouse performance mobile >=80; imagens eficientes e sob demanda; dashboard/pesados fora pacote inicial; estabilidade visual; evitar chamadas GitHub repetidas na navegação | Relatório de produção, Network, chunks e inspeção de layout |
| R09 | Automação cobrindo ao menos validação do formulário e acesso sem login | Rodar testes com assertions de comportamento |
| R10 | URL pública e publicação automática em push na principal | Deploy vinculado a alteração real |
| R11 | Commits padronizados, branch por funcionalidade, padrões em README/instruções IA | Histórico e documentação coerentes |
| R12 | Responsabilidades de pastas/componentes, lógica separada, nomenclatura documentada e padrão verificado automaticamente | Inspeção de código e checks automáticos |

## G01 — Repositório

GitHub público; histórico distribuído ao longo do desenvolvimento; .env fora do Git e .env.example; README com projeto, tecnologias e execução. Não fabricar histórico. Documentar padrões de arquitetura, nomenclatura e Git também nas instruções para IA.

## G02 — Vídeo

Até 8 minutos; rosto e tela durante toda a gravação; YouTube não listado. Cobrir stack/arquitetura com visuais de pastas e fluxo, critério de componentes e caminho branch→deploy; comparar escolhas relevantes com alternativas, critério e concessões; demonstrar ferramenta/modelo e harness com instruções, skills, conectores/MCPs e agentes configurados, arquivos versionados e aplicação dos padrões.

## G03 — Formato e envio

Individual, React, IA permitida e esperada, domínio explicativo do código. Entrega via Teams: GitHub, Vercel, YouTube. Prazo textual 03/11; ano e horário não confirmados.

## Ambiguidades e limites

- Usar Vercel é a interpretação conservadora: entrega a nomeia, embora possibilidades citem outros hosts.
- 3D é opcional. TypeScript e bibliotecas específicas são escolhas.
- 20 caracteres é exemplo de validação, não presumir regra literal fixa.
- Não há quantidade mínima informada de skills, agentes ou MCPs. Cobrir as categorias com função real é a recomendação conservadora.
- Descrição, linguagem e atualização são exemplos úteis de dados de card.
- Pré-commit é exemplo de automação; garantir execução automática adequada dos padrões.
- Não há pesos/nota por item publicados na página lida.
- Autorização dos dados no servidor/banco é recomendação de engenharia essencial à implementação segura do dashboard, embora o enunciado não prescreva RLS.
