import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesOptions } from './dashboardQueries';
import { markMessageResponded } from '../../services/dashboard';
import { AsyncState } from '../../components/AsyncState';
import { Button } from '../../components/Button';
import styles from './Dashboard.module.css';

const notificationLabels = {
  accepted: 'Notificação aceita pelo serviço de e-mail',
  pending: 'Notificação pendente de confirmação',
  failed: 'Falha na notificação por e-mail',
};
export function MessagesPanel({ userId }: { userId: string }) {
  const [offset, setOffset] = useState(0);
  const cache = useQueryClient();
  const query = useQuery(messagesOptions(userId, offset));
  const mutation = useMutation({
    mutationKey: ['messages', userId],
    // Do not retain the returned private message in the mutation result cache.
    mutationFn: async ({
      id,
      responded,
    }: {
      id: string;
      responded: boolean;
    }) => {
      await markMessageResponded(id, responded);
    },
    onSuccess: () =>
      cache.invalidateQueries({ queryKey: ['messages', userId] }),
  });
  return (
    <section aria-labelledby="messages-title" className={styles.stack}>
      <h2 id="messages-title">Mensagens</h2>
      <p className={styles.meta}>
        Marcar como respondida é um registro administrativo. Não envia e-mail.
      </p>
      {query.isPending && (
        <AsyncState status="loading" title="Carregando mensagens" />
      )}
      {query.isError && (
        <AsyncState
          status="error"
          title="Não foi possível carregar as mensagens"
          onRetry={() => void query.refetch()}
        />
      )}
      {query.data?.length === 0 && (
        <AsyncState status="empty" title="Nenhuma mensagem nesta página" />
      )}
      {mutation.isError && (
        <p role="alert" className={styles.error}>
          Não foi possível alterar a mensagem. Tente novamente.
        </p>
      )}
      {mutation.isSuccess && <p role="status">Marcação salva.</p>}
      {query.data?.map((message) => (
        <article
          className={styles.card}
          key={message.id}
          aria-label={`Mensagem de ${message.name}`}
        >
          <h3>{message.name}</h3>
          <a href={`mailto:${encodeURIComponent(message.email)}`}>
            {message.email}
          </a>
          <p className={styles.meta}>
            <time dateTime={message.createdAt}>
              {new Date(message.createdAt).toLocaleString('pt-BR')}
            </time>{' '}
            · {notificationLabels[message.notificationStatus]}
          </p>
          <p className={styles.message}>{message.message}</p>
          <p>{message.respondedAt ? 'Respondida' : 'Não respondida'}</p>
          <Button
            variant="quiet"
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                id: message.id,
                responded: !message.respondedAt,
              })
            }
          >
            {mutation.isPending && mutation.variables.id === message.id
              ? 'Salvando…'
              : message.respondedAt
                ? 'Marcar como não respondida'
                : 'Marcar como respondida'}
          </Button>
        </article>
      ))}
      <nav className={styles.actions} aria-label="Páginas de mensagens">
        <Button
          variant="quiet"
          disabled={offset === 0 || query.isFetching || mutation.isPending}
          onClick={() => {
            setOffset(offset - 50);
            mutation.reset();
          }}
        >
          Anteriores
        </Button>
        <span>Página {offset / 50 + 1}</span>
        <Button
          variant="quiet"
          disabled={
            !query.data ||
            query.data.length < 50 ||
            query.isFetching ||
            mutation.isPending
          }
          onClick={() => {
            setOffset(offset + 50);
            mutation.reset();
          }}
        >
          Próximas
        </Button>
      </nav>
    </section>
  );
}
