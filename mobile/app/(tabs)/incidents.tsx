import { useState } from 'react';
import { Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppCard, AppTextInput, Screen, SectionHeader } from '@/components';
import { createIncident, uploadIncidentPhoto } from '@/services/incidents';
import { useSession } from '@/hooks/useSession';
import { hazards } from '@/constants/hazards';

const severities = ['minor', 'moderate', 'severe'] as const;

export default function IncidentsScreen() {
  const { session, profile } = useSession();
  const [location, setLocation] = useState('');
  const [hazardType, setHazardType] = useState<(typeof hazards)[number]>('general');
  const [severity, setSeverity] = useState<(typeof severities)[number]>('minor');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const pickPhoto = async () => {
    const img = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!img.canceled) setPhotoUri(img.assets[0].uri);
  };

  const submit = async () => {
    if (!session?.user) return;
    const photo_path = photoUri ? await uploadIncidentPhoto(session.user.id, photoUri) : null;
    const payload = { location, hazard_type: hazardType, description, severity, photo_url: photo_path, reported_by: profile?.full_name || session.user.email, status: 'reported' };
    await createIncident(payload);
    setMessage('Incident report submitted.');
  };

  return <Screen><SectionHeader title="Incidents" /><AppTextInput value={location} onChangeText={setLocation} placeholder="Location" /><SectionHeader title="Hazard Type" />{hazards.map((item) => <AppCard key={item}><AppButton title={item === hazardType ? `${item} selected` : item} onPress={() => setHazardType(item)} /></AppCard>)}<SectionHeader title="Severity" />{severities.map((item) => <AppCard key={item}><AppButton title={item === severity ? `${item} selected` : item} onPress={() => setSeverity(item)} /></AppCard>)}<AppTextInput value={description} onChangeText={setDescription} placeholder="Description" multiline /><AppButton title="Attach Optional Photo" onPress={pickPhoto} /><AppButton title="Submit Incident" onPress={submit} /><Text>{message}</Text></Screen>;
}
