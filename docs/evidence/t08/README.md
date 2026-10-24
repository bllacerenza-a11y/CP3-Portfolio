# Evidências próprias T08

24/10/2026, America/Sao_Paulo. Base local `65ba9cc`, produção `5cd7834`. Ver [handoff](../../handoffs/T08-auditoria-independente.md) para a matriz, achados, escopo e limitações.

| Arquivo | O que demonstra |
| --- | --- |
| `check.log` | Check executado pela T08: lint/formato/tipos/build:test, 25 backend, ESM emitido, 110 E2E. Mocks/PGlite; sem integração positiva de contato real |
| `build-production.log` | Build de produção depois do check, restaurando dist normal |
| `hosted-routes.json` | 19 verificações GET e SHA real do deployment |
| `contact-negative.json` | Quatro POSTs `{}` deliberadamente inválidos; sem persistência ou notificação |
| `remote.json` | Consultas anônimas à API GitHub: repositório público, main/PR e CI do produto |
| `browser-observations.json` | Registro manual sanitizado das observações próprias; não é um runner automatizado nem captura de JWT/Network |
| `anonymous-login.txt`, `post-logout-login.txt` | Registro de URL/foco antes da sessão (captura incremental sem repetir a árvore) e árvore pública completa após logout; sem mensagens privadas |
| `nextjs-direct.txt`, `nextjs-refresh.txt` | UI real de next.js com metadados reais e link GitHub, acesso direto e refresh |
| `missing-repo.txt`, `not-found.txt`, `theme-persisted.txt` | Erro de repositório, página amigável e preferência após reload |

Os `.txt` são árvores de acessibilidade observadas no navegador integrado. Nenhum dump autenticado integral do painel, e-mail privado, cookie, senha ou sessão é incluído. Login foi feito pessoalmente pelo usuário e conferido por leitura da UI, seguido de reload/logout. Não salvar/editar mensagens ou destaques para reproduzir esta leitura.

Reprodução do probe de rotas:

```powershell
npm run test:hosting -- https://cp3-portfolio-peach.vercel.app 5cd7834c7a8a91e6cceb6b87d5423c7658988cb3 work/t08-hosted-routes.json
```

Reprodução dos negativos sem dados válidos (Node 24; mesmo JSON `{}` em todos):

```js
const endpoint = 'https://cp3-portfolio-peach.vercel.app/api/contact';
const canonical = 'https://cp3-portfolio-peach.vercel.app';
for (const [origin, type, expected] of [
  [canonical, 'application/json', 400],
  ['https://example.com', 'application/json', 403],
  [undefined, 'application/json', 403],
  [canonical, 'text/plain', 415],
]) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': type, ...(origin ? { Origin: origin } : {}) },
    body: '{}',
  });
  console.log(response.status, expected, await response.json());
}
```

Não substituir `{}` por contato válido para repetir estes negativos. Os resultados não demonstram persistência/email e não justificam reenvios/quotas/seed. A evidência positiva anterior continua em `../t06`, ambiente Node local com serviços reais; Lighthouse 98 continua em `../t07` e corresponde a 1263d47. Nenhum desses procedimentos foi repetido pela T08.
