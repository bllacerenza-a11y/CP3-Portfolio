import { Link } from 'react-router';
import type { Project } from '../../shared/contracts';
import type { ProjectEditorial } from '../content/portfolio';
import { projectPath } from '../app/routes';
import { ProjectMetadata } from '../features/projects/ProjectMetadata';
import { ProjectMedia } from './ProjectMedia';
import styles from './ProjectCard.module.css';

export function ProjectCard({
  project,
  editorial,
  variant = 'compact',
}: {
  project: Project;
  editorial?: ProjectEditorial;
  variant?: 'featured' | 'compact';
}) {
  const title = editorial?.title ?? project.name;
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      {variant === 'featured' && (
        <ProjectMedia
          key={project.id}
          project={project}
          media={editorial?.media}
        />
      )}
      <div className={styles.story}>
        {editorial && <p className={styles.context}>{editorial.context}</p>}
        <h3>
          <Link to={projectPath(project.owner, project.name)}>{title}</Link>
        </h3>
        <p className={styles.summary}>
          {variant === 'featured' && editorial
            ? editorial.summary
            : project.description || 'Descrição não informada no GitHub.'}
        </p>
        {editorial && <p className={styles.note}>{editorial.note}</p>}
        <ProjectMetadata project={project} />
        <div className={styles.source}>
          <Link
            to={projectPath(project.owner, project.name)}
            aria-label={`Ver detalhes de ${title}`}
          >
            {variant === 'featured' ? 'Conhecer o projeto' : 'Ver detalhes'}{' '}
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </Link>
          <a
            href={project.htmlUrl}
            aria-label={`Ver repositório ${title} no GitHub`}
          >
            Ver repositório
          </a>
        </div>
      </div>
    </article>
  );
}
