import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/** Sincroniza navegação SPA com o foco e âncoras do documento. */
export function NavigationEffects() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;
    const frame = requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      } else if (changedPage) {
        document.getElementById('conteudo')?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
