import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppCard, AppTextInput, ErrorState, Screen, SectionHeader, StatusBadge } from '@/components';
import { hazards } from '@/constants/hazards';
import { useSession } from '@/hooks/useSession';
import { createIncident, uploadIncidentPhoto } from '@/services/incidents';
import { formatLabel } from '@/utils/formatters';

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
    if (!session?.user || !location.trim() || !description.trim() || !hazardType || !severity) return setError('Please provide location, hazard type, severity, description, and an authenticated session before submitting.');

    setSubmitting(true);
    const photoUrlOrPath = photoUri ? await uploadIncidentPhoto(session.user.id, photoUri) : null;
    // photo_url currently stores either a legacy public URL or a storage path.
    // Use resolveIncidentPhotoUrl() when displaying images.
    const { error: createError } = await createIncident({
      location: location.trim(), hazard_type: hazardType, description: description.trim(), severity,
      photo_url: photoUrlOrPath, reported_by: profile?.full_name || session.user.email, status: 'reported',
    });
    setSubmitting(false);
    if (createError) return setError(createError.message);
    setNotice('Incident report submitted.');
  };

  return (
    <Screen>
      <SectionHeader title="Incidents" subtitle="Submit hazard reports from the field" />
      {blocked ? <ErrorState message="Account inactive" /> : null}
      {!blocked ? (
        <>
          {error ? <ErrorState message={error} /> : null}
          {notice ? <StatusBadge label={notice} tone="success" /> : null}

          <SectionHeader title="Report Details" subtitle="Share where and what happened" />
          <AppTextInput value={location} onChangeText={setLocation} placeholder="Location" />
          <AppTextInput value={description} onChangeText={setDescription} placeholder="Description" multiline />

          <SectionHeader title="Hazard Type" subtitle="Select one" />
          {hazards.map((item) => (
            <AppCard key={item}><AppButton title={item === hazardType ? `✓ ${formatLabel(item)}` : formatLabel(item)} onPress={() => setHazardType(item)} /></AppCard>
          ))}

          <SectionHeader title="Severity" subtitle="Select one" />
          {severities.map((item) => (
            <AppCard key={item}><AppButton title={item === severity ? `✓ ${formatLabel(item)}` : formatLabel(item)} onPress={() => setSeverity(item)} /></AppCard>
          ))}

          <SectionHeader title="Photo" subtitle="Optional" />
          {photoUri ? <StatusBadge label="Photo attached" tone="success" /> : <StatusBadge label="No photo selected" tone="info" />}
          <AppButton title="Attach Optional Photo" onPress={pickPhoto} />
          <AppButton title={submitting ? 'Submitting...' : 'Submit Incident'} onPress={submitting ? () => undefined : submit} />
        </>
      ) : null}
    </Screen>
  );
}
