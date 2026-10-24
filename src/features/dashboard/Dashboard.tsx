import { Button } from '../../components/Button';
import { MessagesPanel } from './MessagesPanel';
import { HighlightsPanel } from './HighlightsPanel';
import styles from './Dashboard.module.css';

export default function Dashboard({
  userId,
  onLogout,
}: {
  userId: string;
  onLogout: () => void;
}) {
  return (
    <section className={styles.panel} aria-labelledby="dashboard-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Área do proprietário</p>
          <h1 id="dashboard-title">Painel do portfólio</h1>
        </div>
        <Button variant="quiet" onClick={onLogout}>
          Sair
        </Button>
      </div>
      <div className={styles.columns}>
        <MessagesPanel userId={userId} />
        <HighlightsPanel />
      </div>
    </section>
  );
}
