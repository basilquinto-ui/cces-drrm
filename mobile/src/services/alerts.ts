import { supabase } from '@/lib/supabase';
export const listAlerts = async () => (await supabase.from('alerts').select('*').order('created_at', { ascending: false })).data ?? [];
export const createAlert = async (payload: Record<string, unknown>) => supabase.from('alerts').insert(payload);
