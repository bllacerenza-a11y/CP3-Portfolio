import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { AsyncState } from '../components/AsyncState';
import { ContactForm } from '../features/contact/ContactForm';
import { HighlightsSection } from '../features/projects/HighlightsSection';
import { ProjectsSection } from '../features/projects/ProjectsSection';
import { ProjectDetails } from '../features/projects/ProjectDetails';
import { ThemeToggle } from '../components/ThemeToggle';
import { portfolio, selectedRepositories } from '../content/portfolio';
import { projectPath, routes } from './routes';
import styles from './App.module.css';
import { NavigationEffects } from './NavigationEffects';

const AuthArea = lazy(() => import('../features/auth/AuthArea'));

function Home() {
  const first = selectedRepositories[0];
  return (
    <>
      <section className={styles.hero} aria-labelledby="intro-title">
        <div>
          <p className={styles.introduction}>
            Estudos, projetos e primeiras conexões.
          </p>
          <h1 id="intro-title">
            Bruno
            <br />
            Bastos<span aria-hidden="true">.</span>
          </h1>
        </div>
        <div className={styles.heroAside}>
          {first?.media && (
            <Link
              className={styles.heroMedia}
              to={projectPath(first.owner, first.name)}
              aria-label="Explorar o diagrama explicativo do Aether"
            >
              <img
                src={first.media.src}
                alt=""
                width={first.media.width}
                height={first.media.height}
              />
              <span>
                Aether / esquema explicativo <span aria-hidden="true">↗</span>
              </span>
            </Link>
          )}
          <p>{portfolio.introduction}</p>
          <p className={styles.muted}>
            Um registro do que venho construindo e aprendendo em equipe.
          </p>
          <Link className={styles.textLink} to="/#projetos">
            Explorar os projetos <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </section>
      <ProjectsSection />
      <HighlightsSection />
      <div className={styles.aboutContact}>
        <section
          id="sobre"
          className={styles.section}
          aria-labelledby="about-title"
        >
          <h2 id="about-title">Sobre mim</h2>
          <p className={styles.aboutHeadline}>
            Primeiro ano.
            <br />
            Primeiras conexões.
          </p>
          <p className={styles.aboutText}>{portfolio.about}</p>
        </section>
        <section
          id="contato"
          className={styles.section}
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title">Vamos conversar</h2>
          <ContactForm />
        </section>
      </div>
    </>
  );
}
export function App() {
  return (
    <BrowserRouter>
      <NavigationEffects />
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className={styles.page}>
        <header className={styles.header}>
          <Link
            className={styles.brand}
            to={routes.home}
            aria-label={`${portfolio.name}, início`}
          >
            <span className={styles.mark} aria-hidden="true">
              b.
            </span>
            <span>
              {portfolio.name}
              <small>Portfólio em formação</small>
            </span>
          </Link>
          <nav aria-label="Navegação principal">
            <Link to="/#projetos">Projetos</Link>
            <Link to="/#sobre">Sobre</Link>
            <Link to="/#contato">Contato</Link>
          </nav>
          <ThemeToggle />
        </header>
        <main id="conteudo" tabIndex={-1}>
          {import.meta.env.VITE_DEPLOY_ENV === 'preview' && (
            <p role="status">
              Ambiente de prévia · revisão{' '}
              {import.meta.env.VITE_DEPLOY_REVISION}
            </p>
          )}
          <Routes>
            <Route path={routes.home} element={<Home />} />
            <Route path={routes.project} element={<ProjectDetails />} />
            {[routes.login, routes.dashboard].map((path) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense
                    fallback={
                      <AsyncState
                        status="loading"
                        title="Carregando área do proprietário"
                      />
                    }
                  >
                    <AuthArea />
                  </Suspense>
                }
              />
            ))}
            <Route
              path="*"
              element={
                <section className={styles.notFound}>
                  <p>404</p>
                  <h1>Página não encontrada</h1>
                  <p>
                    Este endereço não está disponível. Os projetos e a
                    apresentação estão na página inicial.
                  </p>
                  <Link className={styles.cta} to={routes.home}>
                    Voltar ao início
                  </Link>
                </section>
              }
            />
          </Routes>
        </main>
        <footer className={styles.footer}>
          <Link className={styles.footerName} to={routes.home}>
            {portfolio.name}.
          </Link>
          <p>
            Engenharia de Software · FIAP
            <span>Primeiro ano, trajetória em construção.</span>
          </p>
          <a href={portfolio.github}>GitHub</a>
          <Link to={routes.dashboard}>Área do proprietário</Link>
        </footer>
      </div>
    </BrowserRouter>
  );
}
