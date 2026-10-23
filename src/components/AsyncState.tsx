import type { ReactNode } from 'react';
import { Button } from './Button';
import styles from './AsyncState.module.css';

type AsyncStateProps = {
  status: 'loading' | 'error' | 'empty' | 'success';
  title: string;
  children?: ReactNode;
  onRetry?: () => void;
};

export function AsyncState({
  status,
  title,
  children,
  onRetry,
}: AsyncStateProps) {
  return (
    <div
      className={styles.state}
      data-status={status}
      role={status === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
    >
      <p className={styles.title}>
        {status === 'loading' && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {title}
      </p>
      {children && <div className={styles.detail}>{children}</div>}
      {status === 'error' && onRetry && (
        <Button variant="quiet" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
