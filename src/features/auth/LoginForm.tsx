import { useState } from 'react';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { signInOwner } from './ownerAuth';
import styles from '../dashboard/Dashboard.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <section className={styles.login} aria-labelledby="login-title">
      <p className={styles.eyebrow}>Área do proprietário</p>
      <h1 id="login-title">Entrar</h1>
      <p>Acesso reservado à gestão de mensagens e destaques.</p>
      <form
        className={styles.stack}
        aria-busy={busy}
        onSubmit={(event) => {
          event.preventDefault();
          if (busy) return;
          setBusy(true);
          setError('');
          void signInOwner(email, password)
            .then((session) => {
              if (session.status === 'error')
                setError(
                  'Não foi possível verificar sua permissão. Tente novamente.',
                );
            })
            .catch(() =>
              setError(
                'Não foi possível entrar. Confira as credenciais e tente novamente.',
              ),
            )
            .finally(() => {
              setBusy(false);
              setPassword('');
            });
        }}
      >
        <Field
          id="login-email"
          label="E-mail"
          type="email"
          autoComplete="username"
          required
          value={email}
          disabled={busy}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          id="login-password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          disabled={busy}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p role="alert">{error}</p>}
        {busy && <p role="status">Verificando acesso…</p>}
        <Button type="submit" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </section>
  );
}
