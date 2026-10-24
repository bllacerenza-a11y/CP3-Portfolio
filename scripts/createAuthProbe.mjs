import { mkdir, writeFile } from 'node:fs/promises';

// Local-only diagnostic, excluded from Git and from the production Vite entry.
// No credentials are embedded. The user types the existing password in the browser.
await mkdir('work', { recursive: true });
await writeFile(
  'work/t04AuthProbe.html',
  `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T04 — Verificação local de autenticação</title>
<style>body{font:18px/1.5 system-ui;max-width:42rem;margin:3rem auto;padding:1rem;background:#f7f7f4;color:#202020}label{display:block;margin-top:1rem}input{display:block;font:inherit;padding:.5rem;max-width:100%;box-sizing:border-box;width:26rem}button{font:inherit;padding:.6rem 1rem;margin-top:1rem;cursor:pointer}#result{white-space:pre-wrap;padding:1rem;background:white;border:1px solid #999}small{display:block;margin-bottom:1rem}</style></head>
<body><h1>Verificação local da T04</h1><p>Diagnóstico temporário do login no Supabase. Esta página não faz parte do portfólio publicado.</p><small>A senha existente é enviada diretamente ao Auth do projeto configurado. Não é gravada neste arquivo nem exibida no resultado.</small>
<form id="login"><label>E-mail<input id="email" type="email" autocomplete="username" required></label><label>Senha<input id="password" type="password" autocomplete="current-password" required></label><button id="enter" type="submit">Verificar login real</button></form>
<button id="logout" type="button" disabled>Verificar logout real</button><p id="result" role="status">Conferindo sessão…</p>
<script type="module">
import { signInOwner, resolveOwnerSession, signOutOwner } from '/src/features/auth/ownerAuth.ts';
import { queryClient } from '/src/features/projects/projectQueries.ts';
import { fetchMessages, fetchHighlights } from '/src/services/dashboard.ts';
const form = document.getElementById('login');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const enter = document.getElementById('enter');
const logout = document.getElementById('logout');
const result = document.getElementById('result');
async function describe(session, prefix) {
  logout.disabled = session.status === 'anonymous' || session.status === 'error';
  if (session.status === 'owner') {
    const messages = await fetchMessages();
    queryClient.setQueryData(['messages', session.userId], messages);
    const highlights = await fetchHighlights();
    result.textContent = prefix + '\\nProprietário autorizado pelo servidor.\\nLeitura privada permitida: ' + messages.length + ' mensagem(ns).\\nDestaques públicos: ' + highlights.length + '.';
  } else if (session.status === 'anonymous') result.textContent = 'Sessão ausente. Pronto para testar o login.';
  else if (session.status === 'forbidden') result.textContent = 'Login autenticado, mas sem permissão de proprietário.';
  else result.textContent = 'Não foi possível verificar a sessão. Acesso não concedido.';
}
form.addEventListener('submit', async (event) => {
  event.preventDefault(); enter.disabled = true; logout.disabled = true;
  result.textContent = 'Verificando no Supabase…';
  const email = emailInput.value;
  let password = passwordInput.value;
  passwordInput.value = ''; emailInput.value = '';
  try { const session = await signInOwner(email, password); password = ''; await describe(session, 'Login real confirmado.'); }
  catch { result.textContent = 'Verificação falhou. Confira as credenciais, configuração e conexão.'; }
  finally { password = ''; enter.disabled = false; }
});
logout.addEventListener('click', async () => {
  logout.disabled = true; enter.disabled = true;
  try {
    await signOutOwner(queryClient);
    const session = await resolveOwnerSession();
    const privateCount = queryClient.getQueryCache().findAll({ queryKey: ['messages'] }).length;
    result.textContent = session.status === 'anonymous' && privateCount === 0
      ? 'Logout real confirmado.\\nSessão ausente. Cache privado removido.'
      : 'Logout não confirmado. Acesso deve permanecer bloqueado.';
  } catch { result.textContent = 'Falha no logout. Acesso deve permanecer bloqueado.'; logout.disabled = false; }
  finally { enter.disabled = false; }
});
describe(await resolveOwnerSession(), 'Sessão restaurada após carregar a página.').catch(() => { result.textContent = 'Serviço indisponível ou não configurado.'; });
</script></body></html>`,
  'utf8',
);
console.log(
  'Diagnóstico gerado em /work/t04AuthProbe.html. Use somente em localhost.',
);
