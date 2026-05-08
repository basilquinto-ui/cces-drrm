import { Tabs } from 'expo-router';
import {
  AlertTriangle,
  Bell,
  LayoutDashboard,
  ListChecks,
  type LucideIcon,
  UserCheck,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';

const tabIcon =
  (Icon: LucideIcon) =>
  ({ color, size }: { color: string; size: number }) =>
    <Icon color={color} size={size} strokeWidth={2.25} />;

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
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: tabIcon(LayoutDashboard) }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: tabIcon(Bell) }} />
      <Tabs.Screen name="incidents" options={{ title: 'Incidents', tabBarIcon: tabIcon(AlertTriangle) }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check-In', tabBarIcon: tabIcon(UserCheck) }} />
      <Tabs.Screen name="more" options={{ title: 'Operations', tabBarIcon: tabIcon(ListChecks) }} />
    </Tabs>
  );
}
