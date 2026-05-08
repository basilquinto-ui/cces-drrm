import { useState } from 'react';
import { Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppCard, AppTextInput, ErrorState, Screen, SectionHeader } from '@/components';
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

  const pickPhoto = async () => {
    const img = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (img.canceled) return;
    const asset = img.assets[0];
    if (!asset?.uri) {
      setError('No photo was selected.');
      return;
    }
    setPhotoUri(asset.uri);
  };

  const submit = async () => {
    setError('');
    setNotice('');
    if (!session?.user || !location.trim() || !description.trim() || !hazardType || !severity) {
      setError('Please provide location, hazard type, severity, description, and an authenticated session before submitting.');
      return;
    }
    setSubmitting(true);
    const photoUrl = photoUri ? await uploadIncidentPhoto(session.user.id, photoUri) : null;
    const payload = { location: location.trim(), hazard_type: hazardType, description: description.trim(), severity, photo_url: photoUrl, reported_by: profile?.full_name || session.user.email, status: 'reported' };
    const { error: createError } = await createIncident(payload);
    setSubmitting(false);
    if (createError) {
      setError(createError.message);
      return;
    }
    setNotice('Incident report submitted.');
  };

  return <Screen><SectionHeader title="Incidents" />{error ? <ErrorState message={error} /> : null}{notice ? <Text>{notice}</Text> : null}<AppTextInput value={location} onChangeText={setLocation} placeholder="Location" /><SectionHeader title="Hazard Type" />{hazards.map((item) => <AppCard key={item}><AppButton title={item === hazardType ? `${item} selected` : item} onPress={() => setHazardType(item)} /></AppCard>)}<SectionHeader title="Severity" />{severities.map((item) => <AppCard key={item}><AppButton title={item === severity ? `${item} selected` : item} onPress={() => setSeverity(item)} /></AppCard>)}<AppTextInput value={description} onChangeText={setDescription} placeholder="Description" multiline /><AppButton title="Attach Optional Photo" onPress={pickPhoto} /><AppButton title={submitting ? 'Submitting...' : 'Submit Incident'} onPress={submitting ? () => undefined : submit} /></Screen>;
}
