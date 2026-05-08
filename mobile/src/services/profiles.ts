import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/domain';
export async function getProfile(userId: string): Promise<Profile | null> { const { data } = await supabase.from('profiles').select('*').eq('id', userId).single(); return data; }
