import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Accessibility } from '@/theme/tokens';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Accessibility.colors.primaryAction,
      tabBarInactiveTintColor: Accessibility.colors.calmTextSecondary,
      tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
      tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10 },
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Trợ lý AI', 
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={28} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="learning" 
        options={{ 
          title: 'Học tập', 
          tabBarIcon: ({ color }) => <Ionicons name="book" size={28} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="trusted_circle" 
        options={{ 
          title: 'Người thân', 
          tabBarIcon: ({ color }) => <Ionicons name="people" size={28} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="community" 
        options={{ 
          title: 'Cộng đồng', 
          tabBarIcon: ({ color }) => <Ionicons name="megaphone" size={28} color={color} /> 
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Cá nhân', 
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={28} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
