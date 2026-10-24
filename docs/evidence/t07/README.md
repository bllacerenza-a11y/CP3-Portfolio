# Evidências T07

24/10/2026, America/Sao_Paulo. Windows, Node 24.20.0, npm 11.19.0. Candidato de produto: `1263d47`; handoff e revisão em `../../handoffs/T07-performance-deploy.md`.

Resultado final: **Lighthouse mobile 98**, LCP 2,3s, TBT 30ms, CLS 0; **16/16 HTTP** e **CI 1263d47 success**. Dados resumidos em `final-summary.json`. Execução final Lighthouse às 13:52 BRT; valores sujeitos a variação.

## Arquivos

| Evidência | Significado e limite |
| --- | --- |
| `check.log` | `npm run check` local final: lint/formato/tipos, 25 backend, verificação ESM emitido e 110 E2E em Chromium desktop/mobile. Mocks/PGlite; não envia e-mail real |
| `backend-parser-fix.log` | 25 backend com regressão de ApiError(400) do parser Vercel |
| `build-production.log` | Build comum posterior ao build:test; não publicar o build sintético |
| `main-auto-build.log` | Build automático Git: branch main, commit documental 59702f8; não foi deployment CLI |
| `hosted-http.json` | Verificações reais da URL canônica: rotas, fallback, arquivos ausentes, GET da Function e POSTs deliberadamente inválidos. Não prova persistência/envio válido em produção |
| `lighthouse-mobile.report.html` / `.json` | Relatório completo de performance mobile em produção; condições e versão dentro do JSON |
| `lighthouse-baseline-summary.json` | Medição anterior às correções de runtime, sobre 44f0ffc; relatório completo de referência permanece em work/t07 local. Não é comparação causal de otimização frontend |
| `environment-audit.json` | Nomes/escopos/tipos das variáveis configuradas, sem valores. Preview tem somente configuração pública; produção tem segredos separados |
| `history-secret-audit.json` | 340 blobs anteriores ao primeiro push: sem correspondência com os três segredos locais nem padrões de tokens completos pesquisados. Inspeção limitada, não certificação completa |
| `runtime-licenses.json` | Licenças declaradas nas seis dependências diretas de produção instaladas (MIT). Mídias e limites em ../../MEDIA_LICENSES.md |
| `migrations-readonly.sql` | Consultas reais e resultados transcritos: histórico CLI ausente, dados preservados, grants/RPC inspecionados e corpos das três funções iguais aos arquivos. Não executa repair nem reaplica schema |
| `preview.png` | Preview com aviso explícito e revisão; dados GitHub reais, não fixture |
| `production-*.png` | Inspeções da URL canônica em navegador integrado, sem sessão do proprietário nem submissão válida |

## Reprodução

Local: `npm ci`, `npx playwright install chromium`, `npm run check`, depois `npm run build`. A suíte inclui `npm run test:runtime`; compila com NodeNext e executa JavaScript sem loader TS. Não rodar testes opt-in de serviços por rotina.

Lighthouse usado (PowerShell):

```powershell
$env:CHROME_PATH = node --input-type=module -e "import{chromium}from'@playwright/test';console.log(chromium.executablePath())"
npx --yes lighthouse@13.5.0 https://cp3-portfolio-peach.vercel.app --output=json --output=html --output-path=docs/evidence/t07/lighthouse-mobile --only-categories=performance --chrome-flags="--headless=new" --quiet
```

Configuração padrão mobile, throttling simulado, armazenamento limpo pelo Lighthouse; Chrome headless 156 no Windows. Região da execução: computador do usuário no Brasil, hospedagem Vercel; não dispositivo físico. O número é uma execução medida, sujeito a variação. Não foram impostas metas adicionais.

HTTP sem efeitos: GET `/api/contact` → 405/Allow POST/JSON/no-store; POST `{}` na origem canônica → 400; origem ausente/externa → 403; text/plain → 415; JSON malformado → 400; payload >32 KiB → 413. Não mandar payload válido para reproduzir estas evidências. Script exato desta rodada: `work/t07/verifyHosted.mjs`, ignorado, disponível no checkout local para T00; resultados canônicos no JSON versionado.

## Limites

Nenhuma nova mensagem, envio Resend, login do proprietário, esgotamento de quotas ou mudança de destaques foi solicitado. Estado final conferido: três mensagens, seleção pública vazia. IP confiável foi exercitado pelo POST inválido aceito até a validação (400 em vez de 503), pelo teste unitário do header e pela documentação da plataforma; não se expôs IP no produto. Quotas persistidas são verificadas por PGlite, sem exaustão deliberada do banco real.

A suíte verifica ausência de chamadas GitHub repetidas com respostas controladas e separação lazy de Auth/SDK/Dashboard. Produção teve navegação e refresh reais, chunks inspecionados e Lighthouse; o navegador integrado não expôs Resource Timing, portanto não se afirma contagem própria de chamadas reais. Site URL/redirecionamentos do Supabase não foram alterados nesta rodada; login implementado é email/senha, sem callback OAuth/magic link. Histórico CLI ainda requer repair antes de futuro fluxo CLI Supabase; nenhuma CLI Supabase foi usada.
