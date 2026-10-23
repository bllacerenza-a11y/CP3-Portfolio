# Instruções do projeto CP3

## Contexto e escopo

- Trabalho individual iniciado do zero; responda em português brasileiro.
- Leia HANDOFF_CP3_CODEX.md e docs/STATE.md ao iniciar. Depois leia sua tarefa e os requisitos relacionados.
- O enunciado e as instruções explícitas do usuário prevalecem sobre recomendações de skills.
- Diferencie exigência, decisão adotada, proposta e melhoria opcional. Não transforme exemplo do professor em obrigação.
- Não invente dados pessoais, projetos, experiência, resultados de testes, deploys ou avaliações.

## Trabalho entre chats

- Cada chat tem um resultado e uma tarefa Txx. Consulte docs/THREADS.md.
- Não presuma acesso ao histórico de outras conversas: use os arquivos canônicos e o Git.
- Registre contratos e decisões relevantes antes de tarefas dependentes começarem.
- Um escritor de código por checkout. Trabalho simultâneo de escrita deve ser isolado e integrado conscientemente; não trocar branches sob outro escritor.
- Consulte alterações existentes antes de editar. Não sobrescreva trabalho alheio.
- O chat coordenador mantém docs/STATE.md e docs/THREADS.md; cada executor mantém seu handoff.
- Limite a leitura ao contexto necessário. Não carregue todas as skills, todo o repositório ou chats inteiros por rotina.

## Economia de contexto e modelos

- O usuário autorizou escolher modelos mais econômicos quando suficientes para a tarefa. Consulte docs/MODEL_POLICY.md.
- Prefira uma tarefa ativa por vez; paralelize somente subtarefas independentes com benefício concreto. Não reinicie todos os chats para repetir contextualização.
- Para tarefas delimitadas, use modelo econômico disponível e esforço proporcional; eleve capacidade quando a complexidade, falhas ou revisão de segurança justificarem.
- Ao finalizar a organização inicial, avise o usuário para trocar o modelo antes da implementação. Não alegue ter mudado o modelo de uma conversa sem confirmação da ferramenta.

## Código e processo

- Contratos iniciais em docs/CONTRACTS.md; decisões e limites em docs/ARCHITECTURE.md. Conferir antes de alterar interfaces ou rotas.
- Comandos locais: npm ci, npm run dev, npm run check. npm test gera o build e testa Chromium desktop/mobile; npm run test:e2e requer build atualizado.
- Padrões automáticos: TypeScript estrito, ESLint (incluindo hooks/refresh) e Prettier. Componentes .tsx em PascalCase, hooks useNome.ts, testes *.spec.ts; demais módulos camelCase. Detalhes no README.
- Convenção inicial: branch por funcionalidade e Conventional Commits (feat, fix, test, docs, refactor, chore, ci).
- Separe apresentação, regras e acesso a dados; reutilize componentes com responsabilidade clara.
- Componentes em PascalCase e hooks começando com use. Regras adicionais devem ser documentadas no README.
- Stack em docs/ARCHITECTURE.md é proposta até validada durante T01; não adicionar bibliotecas só por constarem em uma skill.
- Para Vite, não copiar recursos exclusivos de Next.js. Respeite a versão realmente instalada.
- Nunca embuta segredo em variável pública VITE_ ou em código enviado ao navegador.
- Configurações versionadas não devem conter tokens, senhas, sessões autenticadas ou dados privados.

## Skills e ferramentas

- Consulte docs/SKILLS_RESEARCH.md. Pesquisada não significa instalada ou validada.
- Antes de adotar skill externa, leia instruções e scripts, confira dependências, licença, versão e adequação.
- Use a ferramenta de navegador disponível para inspeções e testes do próprio projeto; registre o que realmente foi observado.
- Testes exploratórios por agente complementam a suíte versionada e reproduzível.

## Verificação e conclusão

- Execute verificações pertinentes que existam no projeto. Não invente comandos nem resultados.
- Testes devem verificar comportamento e critérios de aceite, sem simplesmente espelhar implementação.
- Registre comando, resultado, ambiente e commit/estado verificado; diferencie aprovado, falhou e não verificado.
- Ao concluir, informe o que mudou, requisito atendido, evidências, limitações e próxima ação.
- Use docs/templates/TASK_HANDOFF.md para manter continuidade. Não declare tarefa concluída só porque outro agente relatou sucesso.
