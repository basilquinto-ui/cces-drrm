import { supabase } from '@/lib/supabase';
export async function upsertCheckin(staff_id: string, status: string, date: string) {
  return supabase.from('checkins').upsert({ staff_id, status, date, checked_in_at: new Date().toISOString() }, { onConflict: 'staff_id,date' });
}
