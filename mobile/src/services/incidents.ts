import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';

export async function listIncidents() { return (await supabase.from('incidents').select('*').order('created_at', { ascending: false })).data ?? []; }
export async function uploadIncidentPhoto(userId: string, uri: string) {
  const res = await fetch(uri); const blob = await res.blob(); const path = `incidents/${userId}/${Date.now()}.jpg`;
  const arrayBuffer = await blob.arrayBuffer(); await supabase.storage.from('incident-photos').upload(path, decode(btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))));
  return path;
}
export async function createIncident(payload: Record<string, unknown>) { return supabase.from('incidents').insert(payload); }
