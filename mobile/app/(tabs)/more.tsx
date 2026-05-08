import { Text } from 'react-native';
import { AppCard, Screen, SectionHeader } from '@/components';
import { emergencyContacts } from '@/constants/emergencyContacts';
import { preparednessGuides } from '@/constants/preparednessGuides';
export default function MoreScreen() { return <Screen><SectionHeader title="Operations" />{emergencyContacts.map((c) => <AppCard key={c.name}><Text>{c.name}: {c.phone}</Text></AppCard>)}{preparednessGuides.map((g) => <AppCard key={g.title}><Text>{g.title}</Text><Text>{g.summary}</Text></AppCard>)}</Screen>; }
