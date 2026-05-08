import { supabase } from '@/lib/supabase';

const INCIDENT_PHOTO_BUCKET = 'incident-photos';
const INCIDENT_PHOTO_SIGNED_URL_TTL_SECONDS = 60 * 60;

/**
 * Upload an incident photo and return its storage object path.
 *
 * Path format must stay compatible with the current storage policy:
 * incidents/{userId}/{timestamp}.jpg
 */
export async function uploadIncidentPhoto(userId: string, uri: string): Promise<string | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const path = `incidents/${userId}/${Date.now()}.jpg`;

    const { error } = await supabase.storage.from(INCIDENT_PHOTO_BUCKET).upload(path, blob, {
      contentType: 'image/jpeg',
      upsert: false,
    });

    if (error) return null;

    // Return the storage path (not a public URL) so the app can work with a private bucket.
    return path;
  } catch {
    return null;
  }
}

/**
 * Create a time-limited signed URL to view an incident photo in a private bucket.
 */
export async function createIncidentPhotoSignedUrl(path: string, expiresInSeconds = INCIDENT_PHOTO_SIGNED_URL_TTL_SECONDS): Promise<string | null> {
  const normalizedPath = path.trim();
  if (!normalizedPath) return null;

  const { data, error } = await supabase.storage
    .from(INCIDENT_PHOTO_BUCKET)
    .createSignedUrl(normalizedPath, expiresInSeconds);

  if (error) return null;
  return data?.signedUrl ?? null;
}

/**
 * Legacy incident records may still contain public `photo_url` values.
 * - If the value looks like a URL, return it as-is.
 * - Otherwise treat it as a storage object path and generate a signed URL.
 */
export async function resolveIncidentPhotoUrl(photoUrlOrPath: string | null | undefined): Promise<string | null> {
  if (!photoUrlOrPath) return null;
  const normalizedValue = photoUrlOrPath.trim();
  if (!normalizedValue) return null;

  if (/^https?:\/\//i.test(normalizedValue)) return normalizedValue;

  return createIncidentPhotoSignedUrl(normalizedValue);
}

export async function createIncident(payload: Record<string, unknown>) {
  return supabase.from('incidents').insert(payload);
}

export async function listIncidents() {
  return (await supabase.from('incidents').select('*').order('created_at', { ascending: false })).data ?? [];
}
