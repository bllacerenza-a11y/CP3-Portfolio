# Handoff — <ID da tarefa> — <título>

> Copiar este modelo para `docs/handoffs/<ID>-<nome-curto>.md`. Um chat mantém seu próprio registro. Não editar o status canônico de `docs/STATE.md` nem o registro `docs/THREADS.md`: enviar o resultado à coordenação T00. Preencher com fatos; usar `não executado`, `não disponível` ou `não se aplica` quando adequado.

> Na entrada inicial do chat, ler `HANDOFF_CP3_CODEX.md`, `AGENTS.md`, `docs/STATE.md`, a tarefa em `docs/TASKS.md` e os requisitos relacionados de `docs/REQUIREMENTS.md`. Confirmar escopo e pré-requisitos; não iniciar implementação só porque o chat foi criado. A execução começa quando o usuário lançar a tarefa.

## Identificação e estado

- **Tarefa:** <T01–T09 ou T00, conforme atribuição>
- **Chat executor:** <título e ID/link, se disponíveis>
- **Responsável:** <executor/responsável pela próxima ação>
- **Atualizado em:** <data, hora e fuso>
- **Estado reportado:** <planejada/contexto lido | em andamento | bloqueada | pronta para revisão | correções pendentes>
- **Resumo:** <o que mudou, por que mudou e o que efetivamente está pronto>

## Objetivo, requisitos e limites

- **Objetivo da tarefa:** <resultado esperado>
- **Requisitos relacionados:** <IDs R01–R12/G01–G03 de docs/REQUIREMENTS.md; distinguir previstos de já atendidos>
- **Critérios de aceite:** <critérios aplicáveis e como serão comprovados>
- **Escopo autorizado:** <o que esta tarefa pode alterar>
- **Restrições relevantes:** <stack, dependências, conteúdo, prazo e condições do enunciado>
- **Fora do escopo:** <itens que não devem ser implementados neste chat>
- **Dependências recebidas:** <tarefas, handoffs, contratos e revisões utilizados>

## Estado do código e integração

- **Repositório:** <URL e/ou caminho local>
- **Checkout/worktree:** <caminho absoluto>
- **Branch:** <nome real; indicar detached HEAD se for o caso>
- **Commit de base:** <SHA real; não inventar se ainda não houver commit>
- **Commit final ou candidato:** <SHA real ou pendente>
- **Revisão integrada por T00:** <SHA após integração ou ainda não integrada>
- **Alterações não commitadas:** <arquivos/estado real ou nenhuma>
- **Arquivos modificados:** <caminhos e finalidade resumida>
- **Arquivos compartilhados afetados:** <package.json, lockfile, roteador, configuração ou contratos; acordo de responsabilidade>
- **Mudanças de contrato:** <interfaces, nomes, tipos, comportamento e consumidores afetados>
- **Ordem/requisitos de integração:** <migrações, configuração e dependências necessárias>

Não copiar credenciais, tokens ou conteúdo de arquivos de segredo. Se o resultado ainda depende de trabalho não commitado, declarar que o commit sozinho não representa a entrega.

## Decisões e implementação

| Decisão ou alteração | Motivo/evidência | Efeito nos próximos chats |
| --- | --- | --- |
| <decisão> | <restrição, requisito ou observação> | <contrato/ação necessária> |

- **Dados reais versus simulados:** <origem; quais fixtures/mocks existem apenas para desenvolvimento/teste>
- **Configuração necessária:** <somente nomes de variáveis, ambientes e onde configurar>
- **Limitações conhecidas:** <o que falta ou não foi verificado>

## Verificação executada

Registrar os comandos exatos realmente executados, o diretório, a revisão/estado testado e o resultado. Não escrever apenas “testes passaram”. Se houve mudança posterior, indicar quais verificações ficaram desatualizadas.

| Data/hora | Checkout e revisão/estado | Comando ou procedimento | Resultado real | Evidência |
| --- | --- | --- | --- | --- |
| <data/fuso> | <caminho e SHA; indicar mudanças locais> | <comando exato> | <exit code, contagem, falhas ou limitação> | <log/arquivo/link/trecho suficiente> |

### Critérios de aceite

| Requisito/critério | Estado | Evidência ou pendência |
| --- | --- | --- |
| <ID e critério> | <verificado / falhou / não verificado / não se aplica> | <teste, arquivo/linha, captura, URL ou razão concreta> |

### Verificação visual e de fluxos

- **URL/ambiente e revisão:** <local, preview ou produção; SHA correspondente>
- **Navegador/dispositivo/resolução:** <condições realmente usadas>
- **Fluxos executados:** <passos e resultado observado>
- **Estados exercitados:** <carregando, vazio, erro, sucesso, autorização; somente os testados>
- **Evidências:** <arquivos/links com descrição; sem segredos ou dados pessoais desnecessários>
- **Não verificado:** <condições que ficaram de fora e motivo>

Para bugs corrigidos, registrar reprodução original, causa identificada, alteração e verificação de que o sintoma deixou de ocorrer. Distinguir teste automatizado, observação manual e inferência.

## Ambientes e serviços

| Ambiente/serviço | URL ou identificação pública | Revisão/configuração relevante | Situação |
| --- | --- | --- | --- |
| <local/preview/produção/banco/email> | <URL sem token; ou não disponível> | <SHA e nomes de configurações, sem valores secretos> | <verificado/pendente/bloqueado> |

- **Contas/permissões pendentes:** <serviço, ação necessária e responsável; nunca a senha>
- **Impacto do acesso pendente:** <exatamente qual teste/integração não pode ser concluído>
- **Trabalho independente possível:** <o que pode continuar enquanto isso>

## Achados, riscos e pendências

| Item | Impacto e reprodução/evidência | Responsável | Próxima ação | Bloqueia o quê? |
| --- | --- | --- | --- | --- |
| <defeito/pendência/decisão> | <condição e consequência concreta> | <tarefa ou pessoa> | <ação executável> | <critério/integração ou não bloqueia> |

Sugestões opcionais devem aparecer identificadas como opcionais. Não tratá-las como requisito obrigatório nem iniciar sua implementação sem relação com o escopo.

## Pacote para revisão independente

- **Escopo do diff:** <BASE_SHA..HEAD_SHA, ou descrição exata dos arquivos não commitados>
- **Requisitos de referência:** <IDs e caminhos>
- **Pontos que merecem atenção:** <riscos observados, autorização, dados, casos de erro ou integração>
- **Evidências fornecidas:** <logs, resultados, URLs e capturas>
- **Condições para reproduzir:** <configuração e conta de teste por acesso apropriado>
- **Limites da revisão:** <o que não está disponível ou não foi implementado>

O revisor deve ler os artefatos e verificar as alegações. Cada achado precisa de localização, condição, consequência e evidência. Revisar é somente leitura; correções retornam ao executor responsável.

## Próxima ação e passagem de contexto

1. **Primeiro passo do próximo chat:** <ação concreta com caminho/comando quando conhecido>
2. **O que ler antes de editar:** <documentos, contratos e arquivos relevantes, em ordem>
3. **O que preservar:** <decisões aprovadas, conteúdo do usuário e alterações de outros chats>
4. **Integração a solicitar a T00:** <revisão, branch/worktree e dependências>
5. **Ação humana indispensável, se houver:** <ação específica ainda não autorizada/disponível e motivo; ou nenhuma>

### Mensagem curta para T00

> <ID>: <resultado e estado real>. Revisão: <SHA/estado>. Verificações: <comandos e resultados essenciais>. Pendências: <itens concretos ou nenhuma>. Handoff: <caminho>. Próxima ação: <ação/responsável>.

O handoff registra o estado; somente T00 confirma integração e atualiza o quadro canônico.
