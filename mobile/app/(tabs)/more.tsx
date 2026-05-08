import { StyleSheet, Text } from 'react-native';
import { AppCard, Screen, SectionHeader } from '@/components';
import { emergencyContacts } from '@/constants/emergencyContacts';
import { preparednessGuides } from '@/constants/preparednessGuides';
import { theme } from '@/constants/theme';

export default function MoreScreen() { return <Screen><SectionHeader title="Operations Resources" subtitle="Contacts and preparedness references" />{emergencyContacts.map((c) => <AppCard key={c.name}><Text style={styles.cardTitle}>{c.name}</Text><Text style={styles.cardSub}>{c.phone}</Text></AppCard>)}<SectionHeader title="Preparedness Guides" />{preparednessGuides.map((g) => <AppCard key={g.title} variant="outline"><Text style={styles.cardTitle}>{g.title}</Text><Text style={styles.cardSub}>{g.summary}</Text></AppCard>)}</Screen>; }
const styles = StyleSheet.create({ cardTitle: { fontWeight: '700', color: theme.colors.text, marginBottom: 4 }, cardSub: { color: theme.colors.muted } });
