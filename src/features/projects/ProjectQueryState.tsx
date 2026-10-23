import { AsyncState } from '../../components/AsyncState';
import { Button } from '../../components/Button';
import { GitHubError } from '../../services/github';

export function ProjectQueryState({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  const notFound = error instanceof GitHubError && error.kind === 'not-found';
  return (
    <AsyncState
      status={notFound ? 'empty' : 'error'}
      title={
        notFound
          ? 'Repositório não encontrado'
          : 'Não foi possível carregar os projetos'
      }
      onRetry={notFound ? undefined : onRetry}
    >
      <p>{error.message}</p>
      {notFound ? (
        <Button variant="quiet" onClick={onRetry}>
          Consultar novamente
        </Button>
      ) : null}
    </AsyncState>
  );
}
