import { QueryClient, queryOptions } from '@tanstack/react-query';
import type { Project } from '../../../shared/contracts';
import { fetchProject, fetchProjects } from '../../services/github';

export const projectCachePolicy = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: false,
} as const;

export const queryClient = new QueryClient();
export const projectsKey = (owner: string) =>
  ['projects', owner.toLowerCase()] as const;
export const projectKey = (owner: string, repo: string) =>
  ['project', owner.toLowerCase(), repo.toLowerCase()] as const;

export function projectsOptions(owner: string) {
  return queryOptions({
    queryKey: projectsKey(owner),
    queryFn: ({ signal }) => fetchProjects(owner, signal),
    ...projectCachePolicy,
  });
}

export function projectOptions(
  client: QueryClient,
  owner: string,
  repo: string,
) {
  const findInList = () =>
    client
      .getQueryData<Project[]>(projectsKey(owner))
      ?.find((project) => project.name.toLowerCase() === repo.toLowerCase());
  return queryOptions({
    queryKey: projectKey(owner, repo),
    queryFn: ({ signal }) => fetchProject(owner, repo, signal),
    initialData: findInList,
    initialDataUpdatedAt: () =>
      findInList()
        ? client.getQueryState(projectsKey(owner))?.dataUpdatedAt
        : undefined,
    ...projectCachePolicy,
    retryOnMount: false,
  });
}
