# Modelos e economia de contexto

Decisão do usuário em 23/10/2026: concluir as bases, avisar para trocar o modelo antes da implementação e permitir escolhas mais econômicas quando suficientes. Essa autorização persiste; não pedir novamente a cada subtarefa.

## Aplicação prática

| Tipo de trabalho | Ponto de partida recomendado |
| --- | --- |
| Atualização de documentos, alterações pequenas, inspeção delimitada, execução de checks conhecidos | GPT-6 Luna, esforço baixo/Light |
| Componente ou teste com contrato claro, integração pequena | GPT-6 Luna, esforço médio; conferir o resultado |
| Decisões da fundação T01, autenticação/RLS, contratos entre serviços, falha difícil de reproduzir | GPT-6.1 Sol, esforço baixo ou médio conforme dificuldade |
| Problema que resiste a investigação ou auditoria especialmente complexa | Elevar capacidade/esforço pontualmente; registrar o motivo |

A tabela é uma recomendação para este projeto, não garantia de desempenho ou preço. Modelos disponíveis e consumo dependem da conta, cliente, configuração e tarefa. Não converter preços de API em estimativas do plano do usuário nem prometer economia percentual sem medição.

Fonte oficial consultada: [Models — ChatGPT Learn](https://learn.chatgpt.com/docs/models). A documentação recomenda Luna para trabalho focado/repetível e Sol para programação complexa; esforço de raciocínio maior usa mais tokens. No aplicativo, a escolha fica no controle de modelo/raciocínio abaixo da caixa de mensagem.

## Contexto mínimo e execução

- Uma tarefa ativa por vez é o padrão preferido. Pesquisa e revisão paralelas precisam ter escopos independentes e benefício concreto.
- Não confundir número de chats com produtividade: duplicar pesquisa e leitura em vários agentes aumenta consumo.
- Ler AGENTS, handoff, STATE, própria tarefa e apenas os requisitos/contratos relacionados.
- Não copiar históricos completos nem carregar todas as skills. Reutilizar pesquisa já registrada, verificando versões quando houver adoção real.
- Passar resultados por arquivos e Git: resumo curto, decisão, arquivos afetados, evidência e próximo passo.
- Executar verificações pertinentes; não repetir uma suíte aprovada sem mudança ou dúvida concreta.
- Preferir respostas curtas de execução. Explicações longas continuam apropriadas quando o usuário pedir compreensão detalhada.
- Para limites de uso, registrar o erro real e aguardar retomada; não reiniciar vários chats automaticamente.

## O que foi efetivamente aplicado

Na finalização das bases, uma auditoria documental delimitada foi delegada a GPT-6 Luna com esforço baixo. A coordenação conferiu os achados e ajustou os documentos. Isso demonstra essa escolha para a subtarefa, não uma troca do modelo da conversa principal.

As ferramentas desta sessão não expõem uma operação para trocar o modelo da própria conversa em andamento. O usuário fará essa troca no seletor ao receber o aviso. Em delegações futuras, usar a autorização para selecionar um modelo econômico quando a ferramenta permitir, respeitando o escopo autorizado. Nenhuma configuração global de modelo foi alterada.

## Próxima retomada

No chat T01, escolher GPT-6.1 Sol com esforço baixo/médio para fechar as decisões da fundação. Após os contratos ficarem claros, usar Luna para etapas pequenas e verificáveis. Não é necessário manter o modelo de maior capacidade durante toda a implementação.
