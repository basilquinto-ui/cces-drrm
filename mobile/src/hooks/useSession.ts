import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AppRole } from '@/types/domain';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole>('viewer');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await hydrateRole(data.session?.user?.id);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      await hydrateRole(nextSession?.user?.id);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function hydrateRole(userId?: string) {
    if (!userId) return setRole('viewer');
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    // TODO: Enforce role via Supabase RLS and secure server-side checks.
    setRole((data?.role as AppRole) || 'viewer');
  }

  return { session, loading, role };
}
