import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { routes } from './routes';
import styles from './App.module.css';

export function App() {
  return (
    <BrowserRouter>
      <main className={styles.page}>
        <p className={styles.eyebrow}>CP3 · Base de desenvolvimento</p>
        <Routes>
          <Route
            path={routes.home}
            element={
              <>
                <h1>Portfólio em construção</h1>
                <p>
                  A fundação está pronta para receber o conteúdo e os projetos.
                </p>
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <h1>Página não encontrada</h1>
                <p>Este endereço não está disponível.</p>
                <Link to={routes.home}>Voltar ao início</Link>
              </>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
