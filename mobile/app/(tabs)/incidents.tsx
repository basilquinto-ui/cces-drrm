import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppCard, AppTextInput, EmptyState, ErrorState, Screen, SectionHeader, StatusBadge } from '@/components';
import { createIncident, uploadIncidentPhoto } from '@/services/incidents';
import { useSession } from '@/hooks/useSession';
import { hazards } from '@/constants/hazards';

const severities = ['minor', 'moderate', 'severe'] as const;

export default function IncidentsScreen() {
  const { session, profile } = useSession();
  const [location, setLocation] = useState('');
  const [hazardType, setHazardType] = useState<(typeof hazards)[number] | ''>('');
  const [severity, setSeverity] = useState<(typeof severities)[number] | ''>('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const blocked = profile?.active === false;

  const pickPhoto = async () => {
    const img = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (img.canceled) return;
    const asset = img.assets[0];
    if (!asset?.uri) return setError('No photo was selected.');
    setPhotoUri(asset.uri);
  };

  const submit = async () => {
    setError('');
    setNotice('');
    if (blocked) return setError('Account inactive');
    if (!session?.user || !location.trim() || !description.trim() || !hazardType || !severity) {
      return setError('Please provide location, hazard type, severity, description, and an authenticated session before submitting.');
    }
    setSubmitting(true);
    const photoUrlOrPath = photoUri ? await uploadIncidentPhoto(session.user.id, photoUri) : null;
    // photo_url currently stores either a legacy public URL or a storage path.
    // Use resolveIncidentPhotoUrl() when displaying images.
    const payload = { location: location.trim(), hazard_type: hazardType, description: description.trim(), severity, photo_url: photoUrlOrPath, reported_by: profile?.full_name || session.user.email, status: 'reported' };
    const { error: createError } = await createIncident(payload);
    setSubmitting(false);
    if (createError) return setError(createError.message);
    setNotice('Incident report submitted.');
  };

  return <Screen><SectionHeader title="Incidents" subtitle="Submit hazard reports from the field" />{error ? <ErrorState message={error} /> : null}{notice ? <StatusBadge label={notice} tone="success" /> : <EmptyState message="No new report submitted in this session." />}{blocked ? <ErrorState message="Account inactive" /> : <><AppTextInput value={location} onChangeText={setLocation} placeholder="Location" /><SectionHeader title="Hazard Type" />{hazards.map((item) => <AppCard key={item}><AppButton title={item === hazardType ? `${item} selected` : item} onPress={() => setHazardType(item)} /></AppCard>)}<SectionHeader title="Severity" />{severities.map((item) => <AppCard key={item}><AppButton title={item === severity ? `${item} selected` : item} onPress={() => setSeverity(item)} /></AppCard>)}<AppTextInput value={description} onChangeText={setDescription} placeholder="Description" multiline /><AppButton title="Attach Optional Photo" onPress={pickPhoto} /><AppButton title={submitting ? 'Submitting...' : 'Submit Incident'} onPress={submitting ? () => undefined : submit} /></>}</Screen>;
}
