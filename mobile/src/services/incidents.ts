import { supabase } from '@/lib/supabase';

export async function uploadIncidentPhoto(userId: string, uri: string): Promise<string | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const path = `incidents/${userId}/${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('incident-photos').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    if (error) return null;
    const { data } = supabase.storage.from('incident-photos').getPublicUrl(path);
    return data.publicUrl ?? null;
  } catch {
    return null;
  }
}

export async function createIncident(payload: Record<string, unknown>) {
  return supabase.from('incidents').insert(payload);
}

export async function listIncidents() {
  return (await supabase.from('incidents').select('*').order('created_at', { ascending: false })).data ?? [];
}
