// Rotas reservadas: implementar cada tela na tarefa responsável.
export const routes = {
  home: '/',
  project: '/projetos/:owner/:repo',
  login: '/login',
  dashboard: '/dashboard',
} as const;
