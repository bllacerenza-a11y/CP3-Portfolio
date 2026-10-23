import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { projectPath } from '../../app/routes';
import type { Project } from '../../../shared/contracts';
import { AsyncState } from '../../components/AsyncState';
import { ProjectCard } from '../../components/ProjectCard';
import { githubOwner, selectedRepositories } from '../../content/portfolio';
import { projectOptions, projectsOptions } from './projectQueries';
import { ProjectQueryState } from './ProjectQueryState';
import styles from './Projects.module.css';

type Reference = (typeof selectedRepositories)[number];

function ReferenceProject({ reference }: { reference: Reference }) {
  const client = useQueryClient();
  const query = useQuery(
    projectOptions(client, reference.owner, reference.name),
  );
  return (
    <div className={query.data ? undefined : styles.reference}>
      {!query.data ? (
        <h3 className={styles.referenceTitle}>{reference.title}</h3>
      ) : null}
      {query.data && query.isError ? (
        <>
          <ProjectQueryState
            error={query.error}
            onRetry={() => void query.refetch()}
          />
          <p>
            Os dados anteriores foram mantidos enquanto a atualização não está
            disponível.
          </p>
        </>
      ) : null}
      {query.data && query.isFetching ? (
        <p role="status">Atualizando repositório…</p>
      ) : null}
      {query.data ? (
        <ProjectCard project={query.data} editorial={reference} />
      ) : query.isError ? (
        <ProjectQueryState
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <AsyncState status="loading" title={`Carregando ${reference.title}`} />
      )}
      {!query.data ? (
        <Link to={projectPath(reference.owner, reference.name)}>
          Consultar detalhes de {reference.title}
        </Link>
      ) : null}
    </div>
  );
}

function OwnedReference({
  reference,
  projects,
}: {
  reference: Reference;
  projects: Project[];
}) {
  const project = projects.find(
    (item) => item.name.toLowerCase() === reference.name.toLowerCase(),
  );
  return project ? (
    <ProjectCard project={project} editorial={reference} />
  ) : (
    <ReferenceProject reference={reference} />
  );
}

export function ProjectsSection() {
  const query = useQuery(projectsOptions(githubOwner));
  const ownReferences = selectedRepositories.filter(
    (reference) => reference.owner.toLowerCase() === githubOwner.toLowerCase(),
  );
  const otherReferences = selectedRepositories.filter(
    (reference) => reference.owner.toLowerCase() !== githubOwner.toLowerCase(),
  );
  return (
    <section
      id="projetos"
      className={styles.section}
      aria-labelledby="projects-title"
    >
      <div className={styles.sectionHeading}>
        <h2 id="projects-title">Projetos selecionados</h2>
        <p>Uma seleção inicial, aberta a novos caminhos.</p>
      </div>
      {query.isFetching && query.data ? (
        <p role="status">Atualizando projetos…</p>
      ) : null}
      {query.isError ? (
        <>
          <ProjectQueryState
            error={query.error}
            onRetry={() => void query.refetch()}
          />
          {query.data ? (
            <p>
              Os dados anteriores foram mantidos enquanto a atualização não está
              disponível.
            </p>
          ) : null}
        </>
      ) : null}
      <div className={styles.projects}>
        {query.data ? (
          ownReferences.map((reference) => (
            <OwnedReference
              key={reference.name}
              reference={reference}
              projects={query.data}
            />
          ))
        ) : query.isPending ? (
          <AsyncState status="loading" title="Carregando projetos do GitHub" />
        ) : null}
        {otherReferences.map((reference) => (
          <ReferenceProject
            key={`${reference.owner}/${reference.name}`}
            reference={reference}
          />
        ))}
      </div>
      <div className={styles.sectionHeading}>
        <h2 className={styles.listHeading}>Repositórios públicos</h2>
        <p>Dados consultados no GitHub, incluindo forks e arquivados.</p>
      </div>
      {query.data?.length === 0 ? (
        <AsyncState
          status="empty"
          title="Nenhum repositório público encontrado"
        />
      ) : null}
      {query.data ? (
        <div className={styles.projects}>
          {query.data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
