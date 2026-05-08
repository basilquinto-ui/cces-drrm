import { useCallback, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getProfile } from '@/services/profiles';
import { Profile, UserRole } from '@/types/domain';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (userId: string) => {
    const p = await getProfile(userId);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user.id) await refreshProfile(data.session.user.id);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.id) await refreshProfile(nextSession.user.id);
      if (!nextSession) setProfile(null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [refreshProfile]);

  const user: User | null = session?.user ?? null;
  const role: UserRole = profile?.role ?? 'viewer';

  return { session, user, profile, role, loading, refreshProfile };
}
