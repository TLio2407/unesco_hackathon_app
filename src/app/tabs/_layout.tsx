import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#0066CC',
      tabBarInactiveTintColor: '#888',
      tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, // Larger font for NCT
      tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10 }, // Taller bar for easy tapping
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