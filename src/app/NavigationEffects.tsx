import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/** Sincroniza navegação SPA com o foco e âncoras do documento. */
export function NavigationEffects() {
  const { pathname, hash, key } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          if (target.tabIndex < 0 && !target.hasAttribute('tabindex'))
            target.tabIndex = -1;
          target.scrollIntoView();
          target.focus({ preventScroll: true });
        }
      } else if (changedPage) {
        document.getElementById('conteudo')?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return null;
}
