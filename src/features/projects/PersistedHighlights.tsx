import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Highlight } from '../../../shared/contracts';
import { highlightsOptions } from '../dashboard/dashboardQueries';
import { projectOptions } from './projectQueries';
import { selectedRepositories } from '../../content/portfolio';
import { ProjectCard } from '../../components/ProjectCard';
import { AsyncState } from '../../components/AsyncState';
import { ProjectQueryState } from './ProjectQueryState';
import styles from './Projects.module.css';

function HighlightProject({ highlight }: { highlight: Highlight }) {
  const cache = useQueryClient();
  const query = useQuery(
    projectOptions(cache, highlight.owner, highlight.repo),
  );
  const reference = selectedRepositories.find(
    (item) =>
      item.owner.toLowerCase() === highlight.owner.toLowerCase() &&
      item.name.toLowerCase() === highlight.repo.toLowerCase(),
  );
  if (query.isPending)
    return (
      <AsyncState
        status="loading"
        title={`Carregando destaque ${highlight.repo}`}
      />
    );
  if (query.isError && !query.data)
    return (
      <ProjectQueryState
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    );
  if (!query.data || query.data.id !== highlight.projectId)
    return (
      <AsyncState
        status="error"
        title={`O destaque ${highlight.repo} não corresponde ao projeto salvo`}
      />
    );
  return (
    <div>
      {query.isError && (
        <ProjectQueryState
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      )}
      <ProjectCard project={query.data} editorial={reference} />
    </div>
  );
}
export default function PersistedHighlights() {
  const query = useQuery(highlightsOptions());
  return (
    <>
      {query.isPending && (
        <AsyncState status="loading" title="Carregando destaques salvos" />
      )}
      {query.isError && (
        <AsyncState
          status="error"
          title="Não foi possível carregar os destaques salvos"
          onRetry={() => void query.refetch()}
        />
      )}
      {query.data?.length === 0 && (
        <AsyncState
          status="empty"
          title="Nenhum destaque selecionado no momento"
        />
      )}
      {query.data && (
        <div className={styles.catalog}>
          {query.data.map((highlight) => (
            <HighlightProject key={highlight.projectId} highlight={highlight} />
          ))}
        </div>
      )}
    </>
  );
}
