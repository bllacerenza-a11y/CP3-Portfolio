import { useState } from 'react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { HighlightInput, Project } from '../../../shared/contracts';
import { githubOwner, selectedRepositories } from '../../content/portfolio';
import { projectOptions, projectsOptions } from '../projects/projectQueries';
import { highlightsOptions } from './dashboardQueries';
import { replaceHighlights } from '../../services/dashboard';
import { AsyncState } from '../../components/AsyncState';
import { Button } from '../../components/Button';
import styles from './Dashboard.module.css';

function HighlightsEditor({
  initial,
  projects,
}: {
  initial: HighlightInput[];
  projects: Project[];
}) {
  const [items, setItems] = useState(initial);
  const cache = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => replaceHighlights(items),
    onSuccess: () => cache.invalidateQueries({ queryKey: ['highlights'] }),
  });
  function move(index: number, step: number) {
    const next = [...items];
    [next[index], next[index + step]] = [next[index + step]!, next[index]!];
    setItems(next);
    mutation.reset();
  }
  return (
    <form
      className={styles.stack}
      onSubmit={(event) => {
        event.preventDefault();
        if (!mutation.isPending) mutation.mutate();
      }}
    >
      <p>
        Selecione até 24 projetos públicos. A ordem abaixo será usada na home;
        salvar uma seleção vazia remove todos os destaques.
      </p>
      <fieldset disabled={mutation.isPending} className={styles.card}>
        <legend>Projetos disponíveis no GitHub</legend>
        <ul className={styles.choices}>
          {projects.map((project) => {
            const checked = items.some((item) => item.projectId === project.id);
            return (
              <li key={project.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!checked && items.length >= 24}
                    onChange={() => {
                      setItems(
                        checked
                          ? items.filter(
                              (item) => item.projectId !== project.id,
                            )
                          : [
                              ...items,
                              {
                                projectId: project.id,
                                owner: project.owner,
                                repo: project.name,
                              },
                            ],
                      );
                      mutation.reset();
                    }}
                  />
                  {project.owner}/{project.name}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      <div aria-label="Ordem dos destaques">
        <h3>Seleção e ordem ({items.length}/24)</h3>
        {items.length === 0 && <p>Nenhum destaque selecionado.</p>}
        <ol className={styles.ordered}>
          {items.map((item, index) => (
            <li key={item.projectId}>
              <p>
                {item.owner}/{item.repo}
              </p>
              <div className={styles.actions}>
                <Button
                  variant="quiet"
                  disabled={mutation.isPending || index === 0}
                  aria-label={`Subir ${item.repo}`}
                  onClick={() => move(index, -1)}
                >
                  Subir
                </Button>
                <Button
                  variant="quiet"
                  disabled={mutation.isPending || index === items.length - 1}
                  aria-label={`Descer ${item.repo}`}
                  onClick={() => move(index, 1)}
                >
                  Descer
                </Button>
                <Button
                  variant="quiet"
                  disabled={mutation.isPending}
                  aria-label={`Remover ${item.repo}`}
                  onClick={() => {
                    setItems(
                      items.filter(
                        (entry) => entry.projectId !== item.projectId,
                      ),
                    );
                    mutation.reset();
                  }}
                >
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {mutation.isError && (
        <p role="alert" className={styles.error}>
          Não foi possível salvar os destaques. Sua seleção foi mantida.
        </p>
      )}
      {mutation.isSuccess && <p role="status">Destaques salvos.</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Salvando destaques…' : 'Salvar destaques'}
      </Button>
    </form>
  );
}

export function HighlightsPanel() {
  const cache = useQueryClient();
  const highlights = useQuery(highlightsOptions());
  const projects = useQuery(projectsOptions(githubOwner));
  const external = useQueries({
    queries: selectedRepositories
      .filter(
        (reference) =>
          reference.owner.toLowerCase() !== githubOwner.toLowerCase(),
      )
      .map((reference) =>
        projectOptions(cache, reference.owner, reference.name),
      ),
  });
  const available = [
    ...new Map(
      [
        ...(projects.data ?? []),
        ...external.flatMap((query) => (query.data ? [query.data] : [])),
      ].map((project) => [project.id, project]),
    ).values(),
  ];
  return (
    <section className={styles.stack} aria-labelledby="highlights-title">
      <h2 id="highlights-title">Destaques da home</h2>
      {highlights.isPending && (
        <AsyncState status="loading" title="Carregando destaques" />
      )}
      {highlights.isError && (
        <AsyncState
          status="error"
          title="Não foi possível ler os destaques salvos"
          onRetry={() => void highlights.refetch()}
        />
      )}
      {projects.isPending && (
        <AsyncState status="loading" title="Carregando projetos para seleção" />
      )}
      {(projects.isError || external.some((query) => query.isError)) && (
        <AsyncState
          status="error"
          title="Alguns projetos não puderam ser carregados"
          onRetry={() => {
            void projects.refetch();
            external.forEach((query) => void query.refetch());
          }}
        />
      )}
      {highlights.data && (
        <HighlightsEditor initial={highlights.data} projects={available} />
      )}
    </section>
  );
}
