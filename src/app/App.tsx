import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { AsyncState } from '../components/AsyncState';
import { ProjectCard } from '../components/ProjectCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { portfolio, selectedRepositories } from '../content/portfolio';
import { routes } from './routes';
import styles from './App.module.css';

function Home() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="intro-title">
        <div>
          <p className={styles.introduction}>{portfolio.introduction}</p>
          <h1 id="intro-title">
            Software se aprende
            <br />
            construindo.
          </h1>
          <a className={styles.cta} href="#projetos">
            Conheça os projetos
          </a>
        </div>
        <div className={styles.heroAside}>
          <p>Um portfólio em formação.</p>
          <p>
            Projetos, estudos e os primeiros passos de uma trajetória em
            tecnologia.
          </p>
          <a href={portfolio.github}>Acompanhe no GitHub</a>
        </div>
      </section>
      <section
        id="projetos"
        className={styles.section}
        aria-labelledby="projects-title"
      >
        <div className={styles.sectionHeading}>
          <h2 id="projects-title">Projetos selecionados</h2>
          <p>Uma seleção inicial, aberta a novos caminhos.</p>
        </div>
        <div className={styles.projects}>
          {selectedRepositories.map((reference) => (
            <ProjectCard
              key={`${reference.owner}/${reference.name}`}
              project={reference}
              {...reference}
            />
          ))}
        </div>
      </section>
      <div className={styles.aboutContact}>
        <section
          id="sobre"
          className={styles.section}
          aria-labelledby="about-title"
        >
          <h2 id="about-title">Sobre mim</h2>
          <p className={styles.aboutText}>{portfolio.about}</p>
          <dl className={styles.education}>
            <div>
              <dt>Formação</dt>
              <dd>Engenharia de Software</dd>
            </div>
            <div>
              <dt>Instituição</dt>
              <dd>FIAP</dd>
            </div>
            <div>
              <dt>Momento</dt>
              <dd>Primeiro ano</dd>
            </div>
          </dl>
        </section>
        <section
          id="contato"
          className={styles.section}
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title">Vamos conversar</h2>
          <p>
            Por enquanto, você pode acompanhar os projetos pelo meu perfil
            público.
          </p>
          <a className={styles.profileLink} href={portfolio.github}>
            Visitar o perfil no GitHub
          </a>
          <AsyncState status="empty" title="Contato direto em preparação">
            O formulário de mensagens estará disponível em uma próxima etapa.
          </AsyncState>
        </section>
      </div>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
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
              <small>Portfólio</small>
            </span>
          </Link>
          <nav aria-label="Navegação principal">
            <a href="/#projetos">Projetos</a>
            <a href="/#sobre">Sobre</a>
            <a href="/#contato">Contato</a>
          </nav>
          <ThemeToggle />
        </header>
        <main id="conteudo" tabIndex={-1}>
          <Routes>
            <Route path={routes.home} element={<Home />} />
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
          <p>
            {portfolio.name}
            <span>Engenharia de Software · FIAP</span>
          </p>
          <a href={portfolio.github}>GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}
