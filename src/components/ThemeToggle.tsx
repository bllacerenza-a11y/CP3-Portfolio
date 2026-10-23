import { useTheme } from '../hooks/useTheme';
import { Button } from './Button';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, preference, setPreference } = useTheme();
  return (
    <div className={styles.controls} role="group" aria-label="Aparência">
      <Button
        variant="quiet"
        aria-label={`Ativar tema ${theme === 'light' ? 'escuro' : 'claro'}`}
        onClick={() => setPreference(theme === 'light' ? 'dark' : 'light')}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
        </svg>
        Tema {theme === 'light' ? 'claro' : 'escuro'}
      </Button>
      <Button
        variant="quiet"
        className={styles.system}
        aria-pressed={preference === 'system'}
        onClick={() => setPreference('system')}
      >
        Usar sistema
      </Button>
    </div>
  );
}
