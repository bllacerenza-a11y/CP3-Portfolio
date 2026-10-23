import { Link } from 'react-router';
import type { Project } from '../../shared/contracts';
import { projectPath } from '../app/routes';
import { ProjectMetadata } from '../features/projects/ProjectMetadata';
import styles from './ProjectCard.module.css';

type ProjectCardProps = {
  project: Project;
  editorial?: { title: string; summary: string; context: string; note: string };
};

export function ProjectCard({ project, editorial }: ProjectCardProps) {
  const title = editorial?.title ?? project.name;
  return (
    <article className={styles.card}>
      <p className={styles.context}>{editorial?.context ?? project.owner}</p>
      <h3>
        <Link to={projectPath(project.owner, project.name)}>{title}</Link>
      </h3>
      <p className={styles.summary}>
        {project.description || 'Descrição não informada no GitHub.'}
      </p>
      {editorial ? (
        <>
          <p className={styles.summary}>{editorial.summary}</p>
          <p className={styles.note}>{editorial.note}</p>
        </>
      ) : null}
      <ProjectMetadata project={project} />
      <div className={styles.source}>
        <Link
          to={projectPath(project.owner, project.name)}
          aria-label={`Ver detalhes de ${title}`}
        >
          Ver detalhes
        </Link>
        <a
          href={project.htmlUrl}
          aria-label={`Ver repositório ${title} no GitHub`}
        >
          Ver repositório
        </a>
      </div>
    </article>
  );
}
