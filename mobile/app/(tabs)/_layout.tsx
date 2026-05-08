import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const tabIcon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) => (
  <Ionicons name={name} color={color} size={size} />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { height: 64, paddingTop: 8, borderTopColor: theme.colors.border },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: tabIcon('grid') }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: tabIcon('notifications') }} />
      <Tabs.Screen name="incidents" options={{ title: 'Incidents', tabBarIcon: tabIcon('warning') }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check-In', tabBarIcon: tabIcon('shield-checkmark') }} />
      <Tabs.Screen name="more" options={{ title: 'Operations', tabBarIcon: tabIcon('list') }} />
    </Tabs>
  );
}
