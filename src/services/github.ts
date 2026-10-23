import type { Project } from '../../shared/contracts';

export class GitHubError extends Error {
  constructor(
    message: string,
    public readonly kind:
      'not-found' | 'rate-limit' | 'unavailable' | 'invalid',
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

export function safeWebUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function invalid(): never {
  throw new GitHubError(
    'O GitHub retornou dados inesperados. Tente novamente.',
    'invalid',
  );
}

function normalizeProject(value: unknown): Project {
  if (!value || typeof value !== 'object') return invalid();
  const item = value as Record<string, unknown>;
  const owner = item.owner as Record<string, unknown> | null;
  if (
    !Number.isSafeInteger(item.id) ||
    Number(item.id) <= 0 ||
    typeof item.name !== 'string' ||
    !item.name ||
    !owner ||
    typeof owner.login !== 'string' ||
    !owner.login ||
    typeof item.updated_at !== 'string' ||
    !Number.isFinite(Date.parse(item.updated_at)) ||
    !(item.description === null || typeof item.description === 'string') ||
    !(item.language === null || typeof item.language === 'string') ||
    !(item.homepage === null || typeof item.homepage === 'string')
  )
    return invalid();
  return {
    id: Number(item.id),
    owner: owner.login,
    name: item.name,
    description: item.description,
    language: item.language,
    htmlUrl: `https://github.com/${encodeURIComponent(owner.login)}/${encodeURIComponent(item.name)}`,
    homepage: safeWebUrl(item.homepage),
    updatedAt: item.updated_at,
  };
}

async function request(path: string, signal?: AbortSignal): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`https://api.github.com${path}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new GitHubError(
      'Não foi possível conectar ao GitHub. Confira sua conexão e tente novamente.',
      'unavailable',
    );
  }
  if (response.status === 404)
    throw new GitHubError(
      'O endereço não está disponível na API pública do GitHub. A causa não foi confirmada.',
      'not-found',
    );
  if (response.status === 403 || response.status === 429)
    throw new GitHubError(
      'O GitHub limitou ou recusou esta consulta pública. Aguarde antes de tentar novamente.',
      'rate-limit',
    );
  if (!response.ok)
    throw new GitHubError(
      'O GitHub está indisponível para esta consulta. Tente novamente.',
      'unavailable',
    );
  return response;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return invalid();
  }
}

export async function fetchProjects(
  owner: string,
  signal?: AbortSignal,
): Promise<Project[]> {
  const projects = new Map<number, Project>();
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const response = await request(
      `/users/${encodeURIComponent(owner)}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=${page}`,
      signal,
    );
    const items = await readJson(response);
    if (!Array.isArray(items)) return invalid();
    for (const item of items) {
      const project = normalizeProject(item);
      projects.set(project.id, project);
    }
    // Construir localmente a próxima URL, sem seguir hosts do cabeçalho Link.
    hasNext = /rel="next"/.test(response.headers.get('link') ?? '');
    if (hasNext && items.length === 0) return invalid();
    page += 1;
  }
  return [...projects.values()];
}

export async function fetchProject(
  owner: string,
  repo: string,
  signal?: AbortSignal,
): Promise<Project> {
  return normalizeProject(
    await readJson(
      await request(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
        signal,
      ),
    ),
  );
}
