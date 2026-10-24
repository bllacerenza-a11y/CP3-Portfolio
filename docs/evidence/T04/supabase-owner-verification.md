# Supabase real — proprietário e autorização

23/10/2026, aproximadamente 21:34–21:43, America/Sao_Paulo. Continuação da configuração do projeto CP3-Portfolio (`fkaqywmnsknqoqniohfz`), PostgreSQL 17.11. Base de código e2338e1/5991ed7, registro inicial de serviço 2f58b38. Não registrar UUID pessoal, email do dono, tokens ou valores de chaves nesta evidência.

## Provisionamento observado

- Usuário criou a conta Auth pessoalmente e confirmou explicitamente nesta conversa a concessão de proprietário único (leitura das mensagens, marcação de respondida e administração de destaques).
- Linha de Auth conferida na UI. SQL administrativo executado em BEGIN/COMMIT, com INSERT do UUID existente em private.portfolio_owner, sem UPDATE/ON CONFLICT para não substituir proprietário inesperado. Resultado **Success. No rows returned.** Nenhuma credencial criada ou redefinida pelo agente.
- O probe seguinte confirmou exatamente um proprietário com email confirmado, usando join a auth.users, sem exibir email/UUID.

## Comportamento de autorização no Postgres real

Executado `supabase/tests/authorizationRollback.sql` no SQL Editor como administrador. Cópia de 3732 caracteres normalizados LF/FNV-1a 1568509316; conteúdo copiado de volta do editor conferido igual ao preparado. Script não contém UUID pessoal: obtém o dono da configuração do banco; o UUID do outro usuário é sintético e identificado como claim simulado.

O script semeia mensagens sintéticas somente dentro da transação; usa roles anon/authenticated/service_role e claims de requisição simulados. Exige 11 resultados verdadeiros ou lança exceção. Finaliza com ROLLBACK antes de retornar a mensagem de aprovação. Nenhum email/notificador é acionado e nenhuma fixture/alteração de dados fica persistida.

| Verificação comportamental | Resultado |
| --- | --- |
| Exatamente um proprietário confirmado | Aprovado |
| Visitante lê destaques | Aprovado |
| Visitante recebe permission denied nas mensagens | Aprovado |
| Identidade autenticada diferente não é proprietária | Aprovado |
| Outra identidade lê zero mensagens via RLS | Aprovado |
| Outra identidade atualiza zero mensagens via RLS | Aprovado |
| Identidade configurada é reconhecida como dona | Aprovado |
| Dona lê a mensagem sintética privada | Aprovado |
| Dona consegue marcar responded_at | Aprovado |
| Dona recebe permission denied ao editar corpo | Aprovado |
| Serviço consegue persistir pela RPC save_contact | Aprovado |

Resultado final na UI: **11 authorization checks passed; all fixtures and changes rolled back**. Captura: `supabase-authorization-rollback.jpg`. Isto comprova roles/policies/funções de auth.uid no Postgres hospedado sob claims controlados pelo administrador, não valida a emissão/verificação criptográfica de JWT nem login com senha.

O mesmo script ganhou teste reproduzível `tests/server/authorizationRollback.spec.ts`: executa em Postgres WASM e confirma que mensagens/quotas continuam vazias e dono continua cadastrado após rollback. Primeira execução local falhou porque GRANT ON SCHEMA pg_temp não resolve o alias de namespace; essa linha desnecessária foi removida antes de executar na nuvem. Teste direcionado passou, seguido do check completo.

## Configuração local e Data API real

Chaves publishable e secret **já existentes** copiadas da UI diretamente para `.env` local, sem revelar/copiar valores ao chat, screenshots, comandos ou Git. Arquivo criado com flag exclusiva para não sobrescrever configuração preexistente. Nomes: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, SUPABASE_SECRET_KEY, CONTACT_RATE_LIMIT_SECRET (aleatório), CONTACT_ALLOWED_ORIGINS (somente localhost de desenvolvimento). Resend não configurado. `git check-ignore .env work/t04AuthProbe.html` confirmou os dois caminhos ignorados.

Executada verificação Node/SDK contra a Data API real, carregando `.env` com `node --env-file=.env --input-type=module -e`. Usa createClient com persistSession/autoRefreshToken/detectSessionInUrl false; consulta destaques com publishable, tenta select id de messages e RPC save_contact como visitante; consulta messages head/count como serviço. Somente flags booleanas foram impressas:

```text
publicHighlightsReadable: true
anonymousMessagesDenied: true
anonymousContactRpcDenied: true
serverKeyWorks: true
```

Read de mensagens/RPC como visitante retornaram código 42501; nenhuma mensagem foi criada nessa tentativa recusada. O serviço foi usado somente para leitura head/count. Diferentemente do probe SQL, essas chamadas atravessaram gateway/PostgREST reais com as chaves configuradas. Ainda não houve token de sessão real do dono/outro usuário nesse fluxo.

Busca local dos valores conhecidos de SUPABASE_SECRET_KEY/CONTACT_RATE_LIMIT_SECRET no JS de dist e no módulo público de desenvolvimento de supabase.ts não encontrou ocorrências (flag true, sem imprimir valores). Não é auditoria de toda configuração ou infraestrutura.

## Diagnóstico opt-in e verificação local

`npm run dev:auth-check` gera `work/t04AuthProbe.html` (ignorado) e inicia Vite só em 127.0.0.1:4176. Código gerador versionado em scripts/createAuthProbe.mjs. Página importa os serviços reais T04, sem duplicar a lógica de autenticação; pede a senha **existente** diretamente ao usuário, limpa campos após submissão e não exibe token/email/UUID nas respostas. Permite verificar login, recuperação de sessão e logout/cache. Não é tela do produto, não é entrada de build, não pertence à T05 nem deve ser publicada. Rotas do portfólio preservadas.

Página aberta em `http://127.0.0.1:4176/work/t04AuthProbe.html`, navegador integrado, viewport padrão. Estado inicial observado: **Sessão ausente. Pronto para testar o login.** Nenhuma credencial preenchida pelo agente; aguardando login manual do usuário para confirmar caminho real Auth/JWT. Processo local deve permanecer aberto enquanto esse teste estiver pendente e ser encerrado ao finalizar.

`npm run check` após incluir probe, gerador e comando: **exit 0**, lint/formato/tipos/build, **24 testes backend (5,0s)** e **48 execuções E2E (12,1s)**. Log completo `check-supabase.log`. Build mantém 158 módulos e o pacote inicial 306,15kB (gzip96,57), pois ferramentas de diagnóstico não são importadas na UI de produção. Testes E2E continuam usando fixtures; consultas reais acima são evidência separada.

## Pendências

- Usuário faz login no diagnóstico; conferir owner, leitura privada, restauração após reload, logout e limpeza de cache sem inspecionar a senha/token.
- Login real de outra conta controlada ainda não testado; RLS para outra identidade foi verificada com claims simulados no serviço real.
- Resend/remetente/destinatário e recebimento real de email; runtime Vercel/produção e UI da T05.
- Migração manual exige reconciliar histórico da CLI antes de db push. Nenhuma main/STATE/THREADS alterada pelo executor.
