import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { AsyncState } from '../../components/AsyncState';
import { selectedRepositories } from '../../content/portfolio';
import { projectOptions } from './projectQueries';
import { ProjectMetadata } from './ProjectMetadata';
import { ProjectQueryState } from './ProjectQueryState';
import styles from './Projects.module.css';

export function ProjectDetails() {
  const { owner = '', repo = '' } = useParams();
  const client = useQueryClient();
  const query = useQuery(projectOptions(client, owner, repo));
  const project = query.data;
  const editorial = selectedRepositories.find(
    (reference) =>
      reference.owner.toLowerCase() === owner.toLowerCase() &&
      reference.name.toLowerCase() === repo.toLowerCase(),
  );
  return (
    <section className={styles.details} aria-labelledby="project-title">
      <Link to="/#projetos">Voltar aos projetos</Link>
      <p className={styles.owner}>
        {owner} / {repo}
      </p>
      <h1 id="project-title">
        {project ? (editorial?.title ?? project.name) : repo}
      </h1>
      {query.isPending ? (
        <AsyncState status="loading" title="Carregando repositório" />
      ) : null}
      {query.isError ? (
        <>
          <ProjectQueryState
            error={query.error}
            onRetry={() => void query.refetch()}
          />
          {project ? (
            <p>
              Os dados anteriores foram mantidos enquanto a atualização não está
              disponível.
            </p>
          ) : null}
        </>
      ) : null}
      {query.isFetching && project ? (
        <p role="status">Atualizando repositório…</p>
      ) : null}
      {project ? (
        <>
          <p>{project.description || 'Descrição não informada no GitHub.'}</p>
          <ProjectMetadata project={project} />
          {editorial ? (
            <aside className={styles.editorial}>
              <h2>Contexto da seleção</h2>
              <p>{editorial.summary}</p>
              <p>{editorial.note}</p>
            </aside>
          ) : null}
          <div className={styles.links}>
            <a href={project.htmlUrl}>Ver repositório no GitHub</a>
            {project.homepage ? (
              <a href={project.homepage}>Visitar site do projeto</a>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
