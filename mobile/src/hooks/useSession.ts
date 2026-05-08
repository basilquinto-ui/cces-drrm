import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getProfile } from '@/services/profiles';
import { Profile } from '@/types/domain';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setSession(data.session)); const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s)); return () => sub.subscription.unsubscribe(); }, []);
  useEffect(() => { if (!session?.user.id) return; getProfile(session.user.id).then(setProfile); }, [session?.user.id]);
  return { session, profile };
}
