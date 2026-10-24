import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { OwnerSession } from '../../../shared/contracts';
import { getSupabase } from '../../services/supabase';
import { clearPrivateQueries, resolveOwnerSession } from './ownerAuth';

export function useOwnerSession(): OwnerSession {
  const [state, setState] = useState<OwnerSession>({ status: 'loading' });
  const [client] = useState(() => {
    try {
      return getSupabase();
    } catch {
      return null;
    }
  });
  const cache = useQueryClient();
  useEffect(() => {
    let active = true;
    let generation = 0;
    if (client) {
      const refresh = () => {
        if (!active) return;
        const current = ++generation;
        setState({ status: 'loading' });
        void (async () => {
          await clearPrivateQueries(cache);
          const next = await resolveOwnerSession(client);
          if (active && current === generation) setState(next);
        })().catch(() => {
          if (active && current === generation) setState({ status: 'error' });
        });
      };
      // Keep callbacks synchronous: invoking Auth inside its callback can deadlock.
      const { data } = client.auth.onAuthStateChange(() => {
        queueMicrotask(refresh);
      });
      queueMicrotask(refresh);
      return () => {
        active = false;
        data.subscription.unsubscribe();
      };
    }
  }, [cache, client]);
  return client ? state : { status: 'error' };
}
