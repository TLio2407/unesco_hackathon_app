import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.primaryAction,
      tabBarInactiveTintColor: theme.textSecondary,
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 2 },
      tabBarItemStyle: { paddingHorizontal: 0 },
      tabBarStyle: {
        height: 62,
        paddingBottom: 6,
        paddingTop: 6,
        backgroundColor: theme.surfaceCard,
        borderTopColor: theme.cardBorder,
      },
      headerStyle: {
        backgroundColor: theme.surfaceCard,
        borderBottomColor: theme.cardBorder,
        borderBottomWidth: 1,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        color: theme.text,
        fontSize: 17,
        fontWeight: '700',
      },
      headerTintColor: theme.text,
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Trợ lý AI', 
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={22} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Cảnh báo',
          tabBarIcon: ({ color }) => <Ionicons name="warning" size={22} color={color} />
        }}
      />
      <Tabs.Screen 
        name="learning" 
        options={{ 
          title: 'Học tập', 
          tabBarIcon: ({ color }) => <Ionicons name="book" size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="trusted_circle" 
        options={{ 
          title: 'Người thân', 
          tabBarIcon: ({ color }) => <Ionicons name="people" size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="community" 
        options={{ 
          title: 'Cộng đồng', 
          tabBarIcon: ({ color }) => <Ionicons name="megaphone" size={22} color={color} /> 
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Cá nhân', 
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={22} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
