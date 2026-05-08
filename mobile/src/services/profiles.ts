import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/domain';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,full_name,role,staff_id,active')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as Profile;
}
