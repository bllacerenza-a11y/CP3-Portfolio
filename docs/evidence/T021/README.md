# Evidências T02.1 — React

- Arquivos fixture-*.png: capturas da suíte Playwright do build React, com respostas sintéticas de tests/fixtures/github.ts. Não são consultas ao GitHub real; datas, linguagem e descrições de teste são intencionais.
- Arquivos *-real-*.png: navegador integrado em http://127.0.0.1:4175, com API GitHub pública e sem mocks. Contexto privado da câmera usa somente a confirmação do usuário; não foi feita consulta autenticada.
- Desktop: viewport solicitado 1440×1000 ou 1440×900 na matriz; celular 390×900. PNGs do perfil emulado podem ter DPR diferente; arquivos aqui copiados da configuração desktop usam pixels CSS.
- Inspeção do agente: home desktop claro e mobile escuro; Aether desktop claro/escuro e mobile escuro; Melodia mobile escuro; erro mobile escuro. Os testes também conferem 320/768px e ambos temas. Não é certificação de acessibilidade nem medição Lighthouse.

Origem e pendências de mídia em ../../T021_VISUAL.md. Captura Melodia é do trabalho real, enquanto a prancha Aether é um diagrama identificado. Nenhuma captura é evidência de backend, envio, login ou deploy.
