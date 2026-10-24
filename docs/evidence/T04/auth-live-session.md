# T04 — Auth real: sessão do dono e usuário sem permissão

23/10/2026, aproximadamente 21:47–21:53, America/Sao_Paulo. Projeto Supabase CP3-Portfolio. Esta rodada atualiza as pendências de login real registradas anteriormente; Resend/recebimento de email e Vercel continuam pendentes.

## Proprietário — navegador com Auth/Data API reais

Página local `http://127.0.0.1:4176/work/t04AuthProbe.html`, gerada por `npm run dev:auth-check`, usando serviços T04 versionados, Vite local e Supabase hospedado. Credencial inserida pelo usuário; nenhum acesso do agente à senha/token. Viewport padrão do navegador integrado, sem dispositivo físico.

| Procedimento | Resultado observado |
| --- | --- |
| Login manual do usuário | Screenshot fornecido pelo usuário mostrou Login real confirmado / Proprietário autorizado pelo servidor / leitura privada permitida (0 mensagens) / 0 destaques |
| Reload feito pelo agente | Sessão restaurada após carregar a página; proprietário autorizado pelo servidor; consultas reais a mensagens/destaques retornaram 0. Captura `auth-owner-restored.jpg` |
| Clique Verificar logout real | Logout real confirmado / Sessão ausente / Cache privado removido. O gerador só mostra essa mensagem após signOutOwner, resolução de sessão anonymous e contagem zero de queries messages. Captura `auth-owner-logout.jpg` |
| Reload após logout | Sessão ausente. Pronto para testar o login. Botão de logout desabilitado |

Nenhuma mensagem real existia nesta verificação; comprovação positiva de leitura/alteração com uma mensagem é o probe SQL transacional anterior. Não se apresenta lista vazia como teste de conteúdo privado positivo. O logout comprovado é local; não comprova revogação instantânea de todo JWT emitido/outros dispositivos. Nenhuma tela de produto/guard de rota da T05 foi implementada aqui.

## Outra conta — sessão/JWT reais, fora da UI

Acrescentado `scripts/verifySupabase.mjs`, comando **opt-in** `npm run test:supabase`, carregando o `.env` local. Não integra npm run check nem CI. Cria um único usuário Auth descartável com email sintético `@example.invalid`, senha aleatória só em memória, email confirmado administrativamente (sem convite/email), faz login real, verifica autorização e remove exatamente esse usuário no finally. Antes da remoção confere email sintético exato e marcador de finalidade; não remove o proprietário nem dados do portfólio. Não imprime/grava senha, token, UUID ou email.

O script usa payloads deliberadamente inválidos em RPCs mutantes, para que uma eventual regressão de autorização não cause substituição de destaques/persistência. Atualização proibida de conteúdo é limitada a UUID aleatório inexistente. As consultas permitidas não alteram dados.

Executado `npm run test:supabase 2>&1 | Tee-Object -FilePath docs/evidence/T04/supabase-non-owner.log`: **exit 0**, 12 verificações true:

1. Visitante lê destaques.
2. Visitante não lê mensagens (42501).
3. Usuário Auth descartável criado.
4. Login do não proprietário emitiu sessão real.
5. Identidade do não proprietário validada pelo Auth.
6. RPC is_portfolio_owner retornou false.
7. Mensagens retornaram zero linhas pela RLS.
8. Edição de conteúdo foi negada (42501).
9. RPC de destaques foi negada (42501).
10. RPC de serviço de contato foi negada (42501).
11. Logout do usuário de teste limpou sua sessão.
12. Usuário descartável removido com sucesso.

Log contém apenas nomes de checks e booleanos. A partir desta rodada, a matriz inclui dono e outro usuário autenticados realmente no Auth, além de visitante via Data API e probes de roles/fixtures no Postgres hospedado. Interface do dashboard ainda pertence à T05.

## Verificação local e continuidade

Código da aplicação T04 inalterado. Novo script e comando opt-in conferidos com lint/formatação/tipos; check completo mais recente (antes deste script) já aprovava 24 backend +48 execuções E2E. Não atribuir execução remota de CI a esses comandos locais. Edição T02 e STATE/THREADS preservados.

Primeiro lint do script acusou no-unsafe-finally por throw no tratamento de limpeza. Corrigido para flags/exitCode sem lançar nesse bloco; `npm run lint`, `npm run format:check`, `npm run typecheck` e `npm run test:supabase` repetidos com exit 0. O log versionado corresponde à versão corrigida (12 checks true). Consulta administrativa posterior encontrou **zero** usuários com o marcador de teste descartável; nenhum email/UUID foi impresso.

Diagnóstico encerrou com logout; prévia T04 encerrada por Ctrl+C (saída 1 por interrupção deliberada). Próxima ação indispensável: usuário criar conta Resend e concluir pessoalmente credencial/termos. Cadastro aberto em https://resend.com/signup, sem formulário preenchido pelo agente. Envio com remetente de teste resend.dev é limitado ao email da própria conta e serve à primeira verificação; para outros destinatários/remetente de produção, conferir domínio autorizado. Fonte primária consultada: [Resend — restrições do domínio de teste](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).
