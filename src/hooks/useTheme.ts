import { useSyncExternalStore } from 'react';
import {
  getThemeSnapshot,
  setThemePreference,
  subscribeTheme,
} from '../theme/themeStore';

export function useTheme() {
  const snapshot = useSyncExternalStore(subscribeTheme, getThemeSnapshot);
  return { ...snapshot, setPreference: setThemePreference };
}
