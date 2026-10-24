# T02.1 — Implementação da evolução visual

Direção aprovada pela T00 em docs/handoffs/T00-revisao-T02-1-proposta.md. Base main af15723; branch codex/t021-visual-evolution. Revisão textual frontend-design já avaliada na T02 e reaplicada na proposta; nenhuma skill/dependência adicional instalada.

## Decisões de integração

- Converter composição aprovada em componentes React/CSS Modules, mantendo BrowserRouter, NavigationEffects, URLs, queryClient/projectOptions e cp3.theme. Não importar roteador, laboratório, dados demonstrativos ou store da proposta.
- Seleção editorial pública Aether/Melodia enriquece somente Project real. Catálogo compacto usa a lista paginada existente. Falha/empty não viram dados editoriais fingindo API.
- Câmera é colaboração privada confirmada pelo usuário. Referência editorial secundária e URL interna existente preservadas; não consultar a API pública para tentar obter metadados privados, não expor links privados/segredos nem atribuir função individual. Consultas públicas genéricas de outros donos continuam suportadas/testadas.
- Publicar apenas participação em equipe, sem seção pública vazia de contribuição a detalhar. Nenhuma habilidade/experiência/métrica inferida do README.
- ProjectMedia renderiza mídia editorial com dimensões/alt/caption ou fallback tipográfico honesto em ausência/erro. Diagrama Aether autoral; captura Melodia real, com crédito e pendência de licenças antes de deploy. Nada é publicado externamente nesta entrega.
- APIs/auth/contato/dashboard e schemas T04 não serão alterados. Sem consumo de highlights nesta etapa; integração de destaques persistidos é T05. A seleção atual é identificada como seleção editorial, sem alegar dados do banco.
- AsyncState mantém suas props e semântica, recebendo acabamento visual. Estados aparecem exclusivamente conforme consultas reais; sem telas de laboratório no produto.

## Mídias e pendências

Origem do pacote: C:/Users/bruno/Documents/Codex/2026-10-22/https-cherry-client-b8f-notion-site/outputs/T02.1.

| Asset | Origem e uso | Pendência |
| --- | --- | --- |
| src/assets/aether-diagram.svg | Arte autoral do pacote aprovado; esquema Campo/Borda/Nuvem, caption explícita | Não é captura nem evidência de execução. Captura Wokwi/vídeo reais continuam pendentes. |
| src/assets/melodia-real-desktop.png | Captura pública feita no navegador em 24/10/2026, da demo do projeto fornecido pelo usuário | Uso local autorizado; conferir condições específicas da fotografia e demais assets antes de publicação. README credita estúdio a Los Muertos Crew/Pexels. Não presumir licença integral. |
| Foto, habilidades, contribuição individual e câmera privada | Não fornecidos para publicação detalhada | Manter documentação pendente; não preencher com ficção. |

Não adicionar áudio/telemetria ou fotografias de templates. Ver também MIDIAS.md e INTEGRACAO.md do pacote. Fontes de identidade e conteúdo em T02_DESIGN.md; atualização da condição privada na revisão T00 acima.

## Evidências

Comandos, revisão efetivamente verificada, inspeção de browser e limitações serão registrados em docs/handoffs/T021-evolucao-visual.md. STATE/THREADS permanecem sob responsabilidade da T00.
