import type { Project } from '../../shared/contracts';
import styles from './ProjectCard.module.css';

type ProjectCardProps = {
  project: Pick<Project, 'owner' | 'name'>;
  title: string;
  summary: string;
  context: string;
  note: string;
  available: boolean;
};

/** Referência editorial; dados dinâmicos serão ligados pela T03. */
export function ProjectCard({
  project,
  title,
  summary,
  context,
  note,
  available,
}: ProjectCardProps) {
  const url = `https://github.com/${encodeURIComponent(project.owner)}/${encodeURIComponent(project.name)}`;
  return (
    <article className={styles.card}>
      <p className={styles.context}>{context}</p>
      <h3>{title}</h3>
      <p className={styles.summary}>{summary}</p>
      <p className={styles.note}>{note}</p>
      <div className={styles.source}>
        <span>{project.owner}</span>
        {available ? (
          <a href={url} aria-label={`Ver repositório ${title} no GitHub`}>
            Ver repositório
          </a>
        ) : (
          <span className={styles.pending}>Link a confirmar</span>
        )}
      </div>
    </article>
  );
}
