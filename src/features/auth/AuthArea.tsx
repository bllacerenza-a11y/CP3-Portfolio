import { lazy, Suspense, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { AsyncState } from '../../components/AsyncState';
import { Button } from '../../components/Button';
import { routes } from '../../app/routes';
import { useOwnerSession } from './useOwnerSession';
import { signOutOwner } from './ownerAuth';
import { LoginForm } from './LoginForm';
import styles from '../dashboard/Dashboard.module.css';

const Dashboard = lazy(() => import('../dashboard/Dashboard'));
// A failed logout must remain blocked even when navigating away and back.
let logoutBlocked = false;

export default function AuthArea() {
  const session = useOwnerSession();
  const cache = useQueryClient();
  const { pathname } = useLocation();
  const [exiting, setExiting] = useState(logoutBlocked);
  const [logoutError, setLogoutError] = useState(logoutBlocked);
  async function logout() {
    logoutBlocked = true;
    setExiting(true);
    setLogoutError(false);
    try {
      await signOutOwner(cache);
      logoutBlocked = false;
      setExiting(false);
    } catch {
      setLogoutError(true);
    }
  }
  if (exiting)
    return (
      <section className={styles.panel}>
        {logoutError ? (
          <AsyncState
            status="error"
            title="Não foi possível encerrar a sessão. O painel permanece bloqueado."
            onRetry={() => void logout()}
          />
        ) : (
          <AsyncState
            status="loading"
            title="Encerrando sessão e removendo dados privados"
          />
        )}
      </section>
    );
  if (session.status === 'loading')
    return (
      <AsyncState status="loading" title="Verificando sessão e permissão" />
    );
  if (session.status === 'error')
    return (
      <AsyncState
        status="error"
        title="Não foi possível verificar o acesso"
        onRetry={() => window.location.reload()}
      />
    );
  if (session.status === 'anonymous')
    return pathname === routes.dashboard ? (
      <Navigate to={routes.login} replace />
    ) : (
      <LoginForm />
    );
  if (session.status === 'forbidden')
    return (
      <section className={styles.panel}>
        <h1>Acesso negado</h1>
        <p>Esta conta não tem permissão para administrar o portfólio.</p>
        <Button onClick={() => void logout()}>Sair desta conta</Button>
      </section>
    );
  if (pathname === routes.login)
    return <Navigate to={routes.dashboard} replace />;
  return (
    <Suspense
      fallback={<AsyncState status="loading" title="Carregando painel" />}
    >
      <Dashboard userId={session.userId} onLogout={() => void logout()} />
    </Suspense>
  );
}
