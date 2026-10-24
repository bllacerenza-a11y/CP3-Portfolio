import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { projectPath } from '../../app/routes';
import type { Project } from '../../../shared/contracts';
import { AsyncState } from '../../components/AsyncState';
import { ProjectCard } from '../../components/ProjectCard';
import {
  githubOwner,
  selectedRepositories,
  privateCollaborations,
  type ProjectReference,
} from '../../content/portfolio';
import { projectOptions, projectsOptions } from './projectQueries';
import { ProjectQueryState } from './ProjectQueryState';
import styles from './Projects.module.css';

function ReferenceProject({ reference }: { reference: ProjectReference }) {
  const client = useQueryClient();
  const query = useQuery(
    projectOptions(client, reference.owner, reference.name),
  );
  return (
    <div className={query.data ? undefined : styles.reference}>
      {!query.data && (
        <h3 className={styles.referenceTitle}>{reference.title}</h3>
      )}
      {query.isError && (
        <ProjectQueryState
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      )}
      {query.data && query.isError && (
        <p>
          Os dados anteriores foram mantidos enquanto a atualização não está
          disponível.
        </p>
      )}
      {query.data && query.isFetching && (
        <p role="status">Atualizando repositório…</p>
      )}
      {query.data ? (
        <ProjectCard
          project={query.data}
          editorial={reference}
          variant="featured"
        />
      ) : query.isPending ? (
        <AsyncState status="loading" title={`Carregando ${reference.title}`} />
      ) : null}
      {!query.data && (
        <Link to={projectPath(reference.owner, reference.name)}>
          Consultar detalhes de {reference.title}
        </Link>
      )}
    </div>
  );
}
function OwnedReference({
  reference,
  projects,
}: {
  reference: ProjectReference;
  projects: Project[];
}) {
  const project = projects.find(
    (item) => item.name.toLowerCase() === reference.name.toLowerCase(),
  );
  return project ? (
    <ProjectCard project={project} editorial={reference} variant="featured" />
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
        <p>Da inteligência climática à experiência na web.</p>
      </div>
      {query.isFetching && query.data && (
        <p role="status">Atualizando projetos…</p>
      )}
      {query.isError && (
        <>
          <ProjectQueryState
            error={query.error}
            onRetry={() => void query.refetch()}
          />
          {query.data && (
            <p>
              Os dados anteriores foram mantidos enquanto a atualização não está
              disponível.
            </p>
          )}
        </>
      )}
      <div className={styles.featuredProjects}>
        {query.data ? (
          ownReferences.map((reference) => (
            <OwnedReference
              key={reference.name}
              reference={reference}
              projects={query.data!}
            />
          ))
        ) : query.isPending ? (
          <AsyncState status="loading" title="Carregando projetos do GitHub" />
        ) : null}
        {otherReferences.map((reference) => (
          <ReferenceProject
            key={reference.owner + '/' + reference.name}
            reference={reference}
          />
        ))}
      </div>
      <div className={styles.sectionHeading}>
        <h2 className={styles.listHeading}>Repositórios públicos</h2>
        <p>Dados do GitHub, incluindo forks e arquivados.</p>
      </div>
      {query.data?.length === 0 && (
        <AsyncState
          status="empty"
          title="Nenhum repositório público encontrado"
        />
      )}
      {query.data && (
        <div className={styles.catalog}>
          {query.data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      <aside
        className={styles.privateReference}
        aria-labelledby="private-title"
      >
        <h2 id="private-title">Colaboração em projeto privado</h2>
        {privateCollaborations.map((reference) => (
          <div key={reference.owner + '/' + reference.name}>
            <h3>{reference.title}</h3>
            <p>{reference.summary}</p>
            <Link
              to={projectPath(reference.owner, reference.name)}
              aria-label={`Sobre a colaboração em ${reference.title}`}
            >
              Sobre a colaboração <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ))}
      </aside>
    </section>
  );
}
