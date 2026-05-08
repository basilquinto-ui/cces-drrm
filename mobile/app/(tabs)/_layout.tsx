import { Tabs } from 'expo-router';
import { Bell, ClipboardList, Gauge, Shield, UserCheck } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Gauge color={color} size={18} /> }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: ({ color }) => <Bell color={color} size={18} /> }} />
      <Tabs.Screen name="incidents" options={{ title: 'Incidents', tabBarIcon: ({ color }) => <ClipboardList color={color} size={18} /> }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check-in', tabBarIcon: ({ color }) => <UserCheck color={color} size={18} /> }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color }) => <Shield color={color} size={18} /> }} />
    </Tabs>
  );
}
