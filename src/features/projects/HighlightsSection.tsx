import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AsyncState } from '../../components/AsyncState';
import styles from './Projects.module.css';

const PersistedHighlights = lazy(() => import('./PersistedHighlights'));
export function HighlightsSection() {
  const element = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' },
    );
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={element}
      className={styles.section}
      aria-labelledby="saved-highlights-title"
      style={{ minHeight: '12rem' }}
    >
      <div className={styles.sectionHeading}>
        <h2 id="saved-highlights-title">Em destaque agora</h2>
        <p>Seleção atual do portfólio.</p>
      </div>
      {visible ? (
        <Suspense
          fallback={
            <AsyncState status="loading" title="Carregando destaques salvos" />
          }
        >
          <PersistedHighlights />
        </Suspense>
      ) : (
        <p>Os destaques serão carregados ao chegar nesta seção.</p>
      )}
    </section>
  );
}
