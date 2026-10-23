export type ThemePreference = 'system' | 'light' | 'dark';
type Theme = Exclude<ThemePreference, 'system'>;
const storageKey = 'cp3.theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    return 'system';
  }
}

function resolveTheme(preference: ThemePreference): Theme {
  return preference === 'system'
    ? systemTheme.matches
      ? 'dark'
      : 'light'
    : preference;
}

const initialPreference = readPreference();
let snapshot = {
  preference: initialPreference,
  theme: resolveTheme(initialPreference),
};

function update(preference: ThemePreference) {
  const theme = resolveTheme(preference);
  document.documentElement.dataset.theme = theme;
  if (snapshot.preference === preference && snapshot.theme === theme) return;
  snapshot = { preference, theme };
  listeners.forEach((notify) => notify());
}

export function initializeTheme() {
  document.documentElement.dataset.theme = snapshot.theme;
}

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === 'system') window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, preference);
  } catch {
    /* Storage bloqueado: manter escolha nesta sessão. */
  }
  update(preference);
}

export function getThemeSnapshot() {
  return snapshot;
}

export function subscribeTheme(notify: () => void) {
  listeners.add(notify);
  const onSystemChange = () => update(snapshot.preference);
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null)
      update(readPreference());
  };
  systemTheme.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);
  update(snapshot.preference);
  return () => {
    listeners.delete(notify);
    systemTheme.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorage);
  };
}
