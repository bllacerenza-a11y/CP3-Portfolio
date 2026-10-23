import type { Project } from '../../../shared/contracts';
import styles from './Projects.module.css';

export function ProjectMetadata({ project }: { project: Project }) {
  return (
    <dl className={styles.metadata}>
      <div>
        <dt>Linguagem principal</dt>
        <dd>{project.language ?? 'Não informada'}</dd>
      </div>
      <div>
        <dt>Atualizado no GitHub</dt>
        <dd>
          <time dateTime={project.updatedAt}>
            {new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(
              new Date(project.updatedAt),
            )}
          </time>
        </dd>
      </div>
    </dl>
  );
}
