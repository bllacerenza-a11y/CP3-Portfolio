# T00 — Revisão da proposta T02.1

Data: 24/10/2026, America/Sao_Paulo. Base da aplicação: main 6e4f8df com T04 integrada; única alteração local preexistente no handoff T02.

## Resultado

Proposta editorial tecnológica aprovada para implementação pelo chat T02, em branch própria a partir da main atualizada. Aprovação da direção não equivale a integração ou publicação. Nenhum arquivo de aplicação/serviço ou protótipo foi modificado pela T00 nesta revisão.

Pacote analisado: C:\Users\bruno\Documents\Codex\2026-10-22\https-cherry-client-b8f-notion-site\outputs\T02.1. Sem commit próprio; identidade por MANIFEST.sha256. Plano executável em INTEGRACAO.md; conteúdo/mídias em PROPOSTA.md, MIDIAS.md e HANDOFF.md.

## Evidências próprias da T00

- Documentos lidos e comparados com briefing, contratos e estado integrado T04.
- Capturas abertas: home-desktop-light, home-mobile-dark, aether-desktop-light. Hierarquia e presença das mídias evoluíram em relação aos cartões predominantemente textuais da primeira entrega; Aether/Melodia têm tratamentos distintos e o catálogo é secundário.
- Navegador em http://127.0.0.1:4181: home, navegação ao Aether, expansão do percurso dos dados, alternância de tema e retorno à home preservando o tema. Identificação conceitual e ausência de API real são explícitas.
- Screenshot próprio em outputs/CP3-T02.1-Revisao-T00.png, fora do pacote original.
- Get-FileHash dos 53 arquivos do manifesto: nenhum divergente/ausente.
- node --check prototype.js e serve.mjs: exit 0. Servidor respondeu HTTP 200.
- Relatórios conferidos: verification.json registra 42 checks e zero pageerrors; delivery-checks registra 34 capturas servidas. A suíte completa não foi repetida pela T00 e seus relatórios/capturas originais não foram sobrescritos.

Ambiente da revisão: Windows/PowerShell, navegador integrado. Inspeção não comprova API, runtime Vercel, desempenho Lighthouse ou acessibilidade integral da aplicação futura. Nenhum novo teste de backend ou serviço externo foi acionado.

## Ajustes para implementação

1. Converter composição para React/CSS Modules existentes, seguindo INTEGRACAO. Não copiar prototype.js, roteador hash, segunda store de tema, dados demonstrativos ou serve.mjs para o produto.
2. Preservar Project real/API, cache T03, URLs /projetos/:owner/:repo, tratamento de erro/404 e todos os contratos de sessão/contato/administração T04. Não antecipar formulário/guard/dashboard da T05.
3. Faixa de protótipo, laboratório de estados e notas como “metadados entram na integração” ficam na proposta/docs/testes. O produto usa estados reais. Manter captions de origem úteis (diagrama explicativo/captura real), sem transformar a UI pública em relatório do desenvolvimento.
4. Papel individual ainda não confirmado: usar crédito de equipe e texto factual, sem seção pública vazia “a detalhar” ou atribuição inventada. Guardar pendências editoriais em docs.
5. Mídias: SVG autoral pode integrar com caption. Captura Melodia tem origem real e uso local autorizado; conferir créditos/condições dos assets antes de publicação. A pendência não impede implementar layout/fallbacks localmente. Não presumir licença integral a partir da captura.
6. Preservar mensagens reais de notificação parcial/pendente; notified continua aceitação pelo provedor. T05 conectará os fluxos; exemplos do protótipo não viram submissões funcionais.
7. Executar checks existentes e novos casos visuais pertinentes sobre o código React real; inspecionar desktop/mobile e ambos os temas; manter regressões de backend/API/autorização. Não repetir testes de serviços reais com efeitos apenas por rotina.

## Atualização da câmera

Usuário informou que SmartCameraStudy/PedroOliDev é privado e que contribuiu. Não houve login/inspeção autenticada nesta revisão. A condição é compatível com o [404 de recurso privado sem autenticação](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api#404-not-found-for-an-existing-resource). Estar em outra conta não impede consultar um repo público.

Integração atual usa API pública sem token. Login no navegador pode permitir inspeção autorizada da conta, mas não autentica visitantes da aplicação nem configura Git/API automaticamente. Não embutir token no frontend nem expor dados privados para remover um 404. Fork privado continua privado, conforme [GitHub](https://docs.github.com/en/pull-requests/reference/forks#visibility-of-forks).

Enquanto acesso e materiais publicáveis são resolvidos, manter a câmera como referência editorial secundária de colaboração em repo privado, sem metadados fabricados ou diagnóstico público de link quebrado. Aether/Melodia e catálogo público permitem avançar. Conteúdo técnico, imagens e código privados só serão incorporados conforme autorização de divulgação; papel específico do usuário ainda deve ser descrito com sua confirmação.

## Passagem

Checkout liberado para T02.1 quando o usuário iniciar a execução; T02 estava idle. Preservar edição preexistente no handoff T02. Branch sugerida no plano: codex/t021-visual-evolution. T00 não iniciou a implementação nem enviou mensagem a outro chat. Depois da entrega React, revisar/integrar antes da T05.
