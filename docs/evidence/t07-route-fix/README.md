# T07 — Correção da rota com ponto após revisão T00

24/10/2026, America/Sao_Paulo. Produto **5cd7834c7a8a91e6cceb6b87d5423c7658988cb3**, branch `codex/t07-performance-deploy`. Documentos da coordenação `ec372a9` incorporados por merge `6b029e1`. Nenhum push da main.

## Reprodução e resultado

O probe versionado `scripts/checkHostedRoutes.mjs` testa a hospedagem real, com **GET somente**, valida o SHA e o corpo da SPA/tipos de resposta; não usa Vite preview como prova de rewrite. Comando:

```powershell
npm run test:hosting -- https://cp3-portfolio-peach.vercel.app 5cd7834c7a8a91e6cceb6b87d5423c7658988cb3 work/hosted-routes.json
```

- `before.json`: executado sobre 1263d47, **17/19**, falhou nas duas rotas de projeto com ponto, ambas HTTP 404 do host. Falha esperada, não apresentada como aprovação.
- `after.json`: executado sobre 5cd7834, **19/19**, SHA correto. Next.js e projeto ausente com ponto recebem shell React/HTTP 200; o navegador confere separadamente os resultados da API.
- Exclusões preservadas: `/api`, `/api/inexistente`, `/api/contact.js`, `/assets`, asset ausente, `/.env`, `/work/t04AuthProbe.html`, arquivo `.txt` ausente, JSON ausente e caminho adicional após o detalhe → 404 sem shell HTML. `/api/contact` → 405 JSON/Allow POST/no-store. Recurso JS existente → 200, sem HTML.
- `browser.json`: navegador integrado, viewport 1265×720, origem canônica. Next.js real por acesso direto e refresh, link `https://github.com/vercel/next.js`; projeto ausente com ponto mostra “Repositório não encontrado” e “Consultar novamente” nas duas entradas; Aether sem ponto também carregou por acesso direto/refresh.
- `nextjs-refresh.png` e `missing-dot-refresh.png`: capturas reais após refresh, sem fixtures e sem sessão do proprietário.
- A primeira espera de UI procurou o texto de erro como heading e não encontrou: ele é um parágrafo em status. Após inspecionar o DOM, a verificação usa texto exato e botão; não houve falha funcional nesse estado.

## Checks e publicação

- `check.log`: `npm run check`, exit 0; lint/formato/tipos, 25 backend (4,7s), teste ESM emitido e 110 E2E (43,1s). Windows/Node 24.20.0/npm 11.19.0, mocks/PGlite; sem acesso real aos serviços na suíte.
- `build-production.log`: `npm run build` posterior, exit 0, substitui dist sintético.
- `ci-product.json`: push/PR 5cd7834, ambos completed/success no GitHub Actions. URLs dos runs 40138514973 e 40138517675.
- Produção: https://cp3-portfolio-peach.vercel.app, imutável https://cp3-portfolio-peem2adix-neox5.vercel.app; Vercel Ready, build 21s. Preview do mesmo produto: https://cp3-portfolio-by1vnlkuo-neox5.vercel.app.
- A main local continua ec372a9 e a remota 59702f8. Apenas a branch T07 foi enviada. Edição T02 preservada com SHA256 F7513381BEA8E9E64372EF79FA97154FAF8A32899B8C255DA31FEAFC82C03159.

Lighthouse não foi repetido: esta correção altera apenas o rewrite e acrescenta o probe operacional, sem alterar o frontend ou as configurações da Function. O relatório 98 da pasta `../t07` permanece histórico de 1263d47, não uma medição nova de 5cd7834. Não houve POST de contato, login, migration, repair, mudança de segredo, mensagem ou destaque nesta rodada. Permanecem os limites de aceite válido de contato/UI do dono no host e de futuro repair CLI Supabase.
