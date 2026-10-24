import { useState } from 'react';
import type { Project } from '../../shared/contracts';
import type { EditorialMedia } from '../content/portfolio';
import styles from './ProjectMedia.module.css';

export function ProjectMedia({
  project,
  media,
  eager = false,
}: {
  project: Pick<Project, 'name' | 'owner'>;
  media?: EditorialMedia;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!media || failed) {
    return (
      <figure className={styles.fallback}>
        <div>
          <span>Repositório público</span>
          <strong>{project.name}</strong>
          <span>{project.owner}</span>
        </div>
        <figcaption>Conheça o código e a documentação no GitHub.</figcaption>
      </figure>
    );
  }
  return (
    <figure className={`${styles.media} ${styles[media.kind]}`}>
      <img
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
      />
      <figcaption>{media.caption}</figcaption>
    </figure>
  );
}
