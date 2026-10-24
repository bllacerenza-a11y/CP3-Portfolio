import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { AsyncState } from '../../components/AsyncState';
import { ProjectMedia } from '../../components/ProjectMedia';
import {
  privateCollaborations,
  selectedRepositories,
} from '../../content/portfolio';
import { projectOptions } from './projectQueries';
import { ProjectMetadata } from './ProjectMetadata';
import { ProjectQueryState } from './ProjectQueryState';
import styles from './Projects.module.css';

function PublicProjectDetails({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
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
      <Link className={styles.backLink} to="/#projetos">
        Voltar aos projetos
      </Link>
      <div className={styles.detailIntro}>
        <div>
          <p className={styles.owner}>
            {editorial?.context ?? owner + ' / ' + repo}
          </p>
          <h1 id="project-title">
            {project ? (editorial?.title ?? project.name) : repo}
            <span aria-hidden="true">.</span>
          </h1>
        </div>
        {project && editorial && <p>{editorial.summary}</p>}
      </div>
      {query.isPending && (
        <AsyncState status="loading" title="Carregando repositório" />
      )}
      {query.isError && (
        <>
          <ProjectQueryState
            error={query.error}
            onRetry={() => void query.refetch()}
          />
          {project && (
            <p>
              Os dados anteriores foram mantidos enquanto a atualização não está
              disponível.
            </p>
          )}
        </>
      )}
      {query.isFetching && project && (
        <p role="status">Atualizando repositório…</p>
      )}
      {project && (
        <>
          <ProjectMedia
            key={project.id}
            project={project}
            media={editorial?.media}
            eager
          />
          <div className={styles.detailMetadata}>
            <ProjectMetadata project={project} />
            <div className={styles.links}>
              <a href={project.htmlUrl}>Ver repositório no GitHub</a>
              {project.homepage && (
                <a href={project.homepage}>Visitar site do projeto</a>
              )}
            </div>
          </div>
          {editorial?.narrative && (
            <>
              <section className={styles.narrative}>
                <h2>O problema</h2>
                <div>
                  <p>{editorial.narrative.problem}</p>
                </div>
              </section>
              <section className={styles.narrative}>
                <h2>A proposta</h2>
                <div>
                  <p>{editorial.narrative.approach}</p>
                  {editorial.narrative.flow && (
                    <details className={styles.flow}>
                      <summary>Explorar o caminho dos dados</summary>
                      <ol>
                        {editorial.narrative.flow.map((step) => (
                          <li key={step.title}>
                            <strong>{step.title}</strong>
                            <span>{step.text}</span>
                          </li>
                        ))}
                      </ol>
                      <p>
                        Esquema simplificado da arquitetura descrita no README.
                      </p>
                    </details>
                  )}
                </div>
              </section>
            </>
          )}
          <section className={styles.narrative}>
            <h2>Do repositório</h2>
            <div>
              <p>
                {project.description || 'Descrição não informada no GitHub.'}
              </p>
              {editorial && (
                <p className={styles.teamNote}>
                  {editorial.note} Contexto editorial baseado no README público.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
export function ProjectDetails() {
  const { owner = '', repo = '' } = useParams();
  const collaboration = privateCollaborations.find(
    (reference) =>
      reference.owner.toLowerCase() === owner.toLowerCase() &&
      reference.name.toLowerCase() === repo.toLowerCase(),
  );
  if (collaboration)
    return (
      <section className={styles.details} aria-labelledby="project-title">
        <Link className={styles.backLink} to="/#projetos">
          Voltar aos projetos
        </Link>
        <div className={`${styles.detailIntro} ${styles.privateIntro}`}>
          <div>
            <p className={styles.owner}>Colaboração em repositório privado</p>
            <h1 id="project-title" className={styles.privateTitle}>
              {collaboration.title}
            </h1>
          </div>
          <p>{collaboration.summary}</p>
        </div>
        <div className={styles.privateContext}>
          <h2>Um trabalho em colaboração</h2>
          <p>
            Bruno Bastos participou deste projeto. A apresentação respeita a
            privacidade do repositório e não divulga código ou materiais
            privados.
          </p>
        </div>
      </section>
    );
  return <PublicProjectDetails owner={owner} repo={repo} />;
}
